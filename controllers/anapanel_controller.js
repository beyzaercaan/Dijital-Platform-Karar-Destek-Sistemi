const db = require("../db/mysql_connect");
const { APIError } = require("../utils/error");
const Response = require("../utils/response");

/* ================= KPI ================= */

const getKpis = async (req, res, next) => {
  try {
    const [[ciro]] = await db.query(`
      SELECT SUM(at.ucret) AS toplam_ciro
      FROM abonelikler a
      JOIN abonelik_turleri at 
        ON a.abonelik_tur_id = at.abonelik_tur_id
      WHERE a.durum='aktif'
    `);

    const [[premium]] = await db.query(`
      SELECT ROUND(
        SUM(CASE WHEN at.abonelik_ad='Premium' THEN at.ucret ELSE 0 END) 
        / SUM(at.ucret) * 100, 2) AS premium_pay
      FROM abonelikler a
      JOIN abonelik_turleri at 
        ON a.abonelik_tur_id = at.abonelik_tur_id
      WHERE a.durum='aktif'
    `);

    const [[arpu]] = await db.query(`
      SELECT ROUND(
        SUM(at.ucret) / COUNT(DISTINCT a.kullanici_id), 2
      ) AS arpu
      FROM abonelikler a
      JOIN abonelik_turleri at 
        ON a.abonelik_tur_id = at.abonelik_tur_id
      WHERE a.durum='aktif'
    `);

    const [[churn]] = await db.query(`
      SELECT ROUND(
        COUNT(CASE WHEN durum='iptal' THEN 1 END) 
        / COUNT(*) * 100, 2
      ) AS churn_rate
      FROM abonelikler
    `);

    return new Response({
      toplam_ciro: ciro.toplam_ciro,
      premium_pay: premium.premium_pay,
      arpu: arpu.arpu,
      churn_rate: churn.churn_rate
    }, "KPI verileri getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== AYLIK PAKET BAZLI GELİR ========== */

const aylikPaketBazliGelir = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MONTH(a.baslangic_tarihi) AS ay,
        at.abonelik_ad,
        SUM(at.ucret) AS gelir
      FROM abonelikler a
      JOIN abonelik_turleri at 
        ON a.abonelik_tur_id = at.abonelik_tur_id
      GROUP BY ay, at.abonelik_ad
      ORDER BY ay
    `);

    if (!rows.length) {
      throw new APIError("Aylık paket bazlı gelir verisi bulunamadı", 404);
    }

    return new Response(rows, "Aylık paket bazlı gelir getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== TOPLAM GELİR TRENDİ ========== */

const toplamGelirTrendi = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MONTH(a.baslangic_tarihi) AS ay,
        SUM(at.ucret) AS toplam_gelir
      FROM abonelikler a
      JOIN abonelik_turleri at 
        ON a.abonelik_tur_id = at.abonelik_tur_id
      GROUP BY ay
      ORDER BY ay
    `);

    if (!rows.length) {
      throw new APIError("Toplam gelir trendi verisi bulunamadı", 404);
    }

    return new Response(rows, "Toplam gelir trendi getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== PAKET DAĞILIMI ========== */

const paketDagilimi = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        at.abonelik_ad,
        COUNT(*) AS kullanici_sayisi
      FROM abonelikler a
      JOIN abonelik_turleri at 
        ON a.abonelik_tur_id = at.abonelik_tur_id
      WHERE a.durum = 'aktif'
      GROUP BY at.abonelik_ad
    `);

    if (!rows.length) {
      throw new APIError("Paket dağılımı verisi bulunamadı", 404);
    }

    return new Response(rows, "Paket dağılımı getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== SEGMENT PERFORMANSI ========== */

const segmentPerformansi = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        it.tip_ad,
        COUNT(DISTINCT i.icerik_id) AS icerik_sayisi,
        COUNT(z.izlenme_id) AS izlenme_sayisi
      FROM icerik_tipleri it
      JOIN icerik i 
        ON it.icerik_tip_id = i.icerik_tip_id
      LEFT JOIN izlenme z 
        ON i.icerik_id = z.icerik_id
      GROUP BY it.tip_ad
    `);

    if (!rows.length) {
      throw new APIError("Segment performansı verisi bulunamadı", 404);
    }

    return new Response(rows, "Segment performansı getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== İZLENME TRENDİ ========== */

const izlenmeTrendi = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MONTH(izlenme_tarihi) AS ay,
        COUNT(*) AS izlenme_sayisi
      FROM izlenme
      GROUP BY ay
      ORDER BY ay
    `);

    if (!rows.length) {
      throw new APIError("İzlenme trendi verisi bulunamadı", 404);
    }

    return new Response(rows, "İzlenme trendi getirildi").success(res);

  } catch (err) {
    next(err);
  }
};

/* ========== PAKET GEÇİŞ SİMÜLASYONU ========== */

const paketGecisSimulasyonu = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        at.abonelik_ad,
        COUNT(*) AS kullanici_sayisi,
        COUNT(*) * at.ucret AS mevcut_gelir,
        COUNT(*) * (at.ucret + 50) AS tahmini_premium_gelir
      FROM abonelikler a
      JOIN abonelik_turleri at 
        ON a.abonelik_tur_id = at.abonelik_tur_id
      WHERE at.abonelik_ad = 'Basic'
      GROUP BY at.abonelik_ad
    `);

    if (!rows.length) {
      throw new APIError("Paket geçiş simülasyonu verisi bulunamadı", 404);
    }

    return new Response(rows[0], "Paket geçiş simülasyonu hesaplandı").success(res);

  } catch (err) {
    next(err);
  }
};

module.exports = {
  getKpis,
  aylikPaketBazliGelir,
  toplamGelirTrendi,
  paketDagilimi,
  segmentPerformansi,
  izlenmeTrendi,
  paketGecisSimulasyonu
};
