const db = require('../db/mysql_connect');
const { APIError } = require('../utils/error');
const Response = require('../utils/response');

/* ================= BEHAVIOR KPI ================= */

const behaviorKpis = async (req, res, next) => {
  try {
    // En güçlü içerik tipi
    const [[bestType]] = await db.query(`
      SELECT 
        it.tip_ad,
        AVG(z.izlenme_suresi / isu.sure_dk) AS tamamlanma_orani,
        AVG(z.izlenme_suresi) AS ort_sure
      FROM izlenme z
      JOIN icerik i ON z.icerik_id = i.icerik_id
      JOIN icerik_tipleri it ON i.icerik_tip_id = it.icerik_tip_id
      JOIN icerik_sureleri isu ON i.icerik_id = isu.icerik_id
      GROUP BY it.tip_ad
      ORDER BY (AVG(z.izlenme_suresi) * AVG(z.izlenme_suresi / isu.sure_dk)) DESC
      LIMIT 1
    `);

    // En güçlü tür
    const [[bestGenre]] = await db.query(`
      SELECT 
        t.tur_ad,
        AVG(z.izlenme_suresi / isu.sure_dk) AS tamamlanma_orani,
        AVG(z.izlenme_suresi) AS ort_sure
      FROM izlenme z
      JOIN icerik i ON z.icerik_id = i.icerik_id
      JOIN turler t ON i.tur_id = t.tur_id
      JOIN icerik_sureleri isu ON i.icerik_id = isu.icerik_id
      GROUP BY t.tur_ad
      ORDER BY (AVG(z.izlenme_suresi) * AVG(z.izlenme_suresi / isu.sure_dk)) DESC
      LIMIT 1
    `);

    // Katalog yaş eğilimi
    const [[ageTrend]] = await db.query(`
      SELECT 
        AVG(YEAR(CURDATE()) - yayin_yili) AS ort_yas
      FROM icerik
    `);

    // Çeşitlilik etkisi
    const [[variety]] = await db.query(`
      SELECT 
        AVG(tur_sayisi) AS ort_tur_sayisi
      FROM (
        SELECT 
          z.kullanici_id,
          COUNT(DISTINCT i.tur_id) AS tur_sayisi
        FROM izlenme z
        JOIN icerik i ON z.icerik_id = i.icerik_id
        GROUP BY z.kullanici_id
      ) x
    `);

    if (!bestType || !bestGenre) {
      throw new APIError("Behavior KPI verileri bulunamadı", 404);
    }

    return new Response({
      bestType,
      bestGenre,
      catalogAgeTrend: ageTrend.ort_yas,
      varietyEffect: variety.ort_tur_sayisi
    }, "Behavior KPI verileri getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== İÇERİK TİPİ KARŞILAŞTIRMA ========== */

const contentTypeComparison = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        it.tip_ad,
        AVG(z.izlenme_suresi) AS ort_sure,
        AVG(z.izlenme_suresi / isu.sure_dk) * 100 AS tamamlanma
      FROM izlenme z
      JOIN icerik i ON z.icerik_id = i.icerik_id
      JOIN icerik_tipleri it ON i.icerik_tip_id = it.icerik_tip_id
      JOIN icerik_sureleri isu ON i.icerik_id = isu.icerik_id
      GROUP BY it.tip_ad
    `);

    if (!rows.length) {
      throw new APIError("İçerik tipi karşılaştırma verisi bulunamadı", 404);
    }

    return new Response(rows, "İçerik tipi karşılaştırması getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== TÜR KARŞILAŞTIRMA ========== */

const contentGenreComparison = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.tur_ad,
        AVG(z.izlenme_suresi) AS ort_sure,
        AVG(z.izlenme_suresi / isu.sure_dk) * 100 AS tamamlanma
      FROM izlenme z
      JOIN icerik i ON z.icerik_id = i.icerik_id
      JOIN turler t ON i.tur_id = t.tur_id
      JOIN icerik_sureleri isu ON i.icerik_id = isu.icerik_id
      GROUP BY t.tur_ad
      ORDER BY ort_sure DESC
      LIMIT 12
    `);

    if (!rows.length) {
      throw new APIError("Tür karşılaştırma verisi bulunamadı", 404);
    }

    return new Response(rows, "Tür karşılaştırması getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== ÇEŞİTLİLİK ETKİSİ ========== */

const varietyEffect = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(DISTINCT i.tur_id) AS tur_sayisi,
        AVG(z.izlenme_suresi) AS ort_sure
      FROM izlenme z
      JOIN icerik i ON z.icerik_id = i.icerik_id
      GROUP BY z.kullanici_id
    `);

    if (!rows.length) {
      throw new APIError("Çeşitlilik etkisi verisi bulunamadı", 404);
    }

    return new Response(rows, "Çeşitlilik etkisi getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== YAYIN YILI ETKİSİ ========== */

const releaseYearEffect = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.yayin_yili,
        it.tip_ad,
        COUNT(z.izlenme_id) AS izlenme_sayisi
      FROM izlenme z
      JOIN icerik i ON z.icerik_id = i.icerik_id
      JOIN icerik_tipleri it ON i.icerik_tip_id = it.icerik_tip_id
      GROUP BY i.yayin_yili, it.tip_ad
      ORDER BY i.yayin_yili
    `);

    if (!rows.length) {
      throw new APIError("Yayın yılı etkisi verisi bulunamadı", 404);
    }

    return new Response(rows, "Yayın yılı etkisi getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

module.exports = {
  behaviorKpis,
  contentTypeComparison,
  contentGenreComparison,
  varietyEffect,
  releaseYearEffect
};
