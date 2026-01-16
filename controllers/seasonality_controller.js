const db = require("../db/mysql_connect");
const { APIError } = require("../utils/error");
const Response = require("../utils/response");

/* ======================================================
   1️⃣ KPI’LAR
   Pik Ay
   Pik–Dip Farkı
   Özel Dönem Katkısı
   En Güçlü Dönem Türü
====================================================== */
exports.getSeasonalityKpis = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MONTH(izlenme_tarihi) AS ay,
        SUM(izlenme_sayisi) AS toplam
      FROM izlenmeler
      GROUP BY ay
    `);

    if (!rows.length) {
      return next(new APIError("Sezonluk KPI verisi bulunamadı", 404));
    }

    const values = rows.map(r => r.toplam);
    const max = Math.max(...values);
    const min = Math.min(...values);

    const peakMonth = rows.find(r => r.toplam === max).ay;

    const specialMonths = [1, 2, 7, 8, 12];
    const specialTotal = rows
      .filter(r => specialMonths.includes(r.ay))
      .reduce((sum, r) => sum + r.toplam, 0);

    const total = values.reduce((a, b) => a + b, 0);

    const [topGenreRows] = await db.query(`
      SELECT t.tur_adi, SUM(i.izlenme_sayisi) AS toplam
      FROM izlenmeler i
      JOIN icerikler c ON i.icerik_id = c.id
      JOIN turler t ON c.tur_id = t.id
      GROUP BY t.tur_adi
      ORDER BY toplam DESC
      LIMIT 1
    `);

    new Response({
      peakMonth,
      peakDipDiff: (((max - min) / min) * 100).toFixed(0),
      specialShare: ((specialTotal / total) * 100).toFixed(0),
      topGenre: topGenreRows[0]?.tur_adi || null
    }).success(res);

  } catch (err) {
    next(err);
  }
};

/* ======================================================
   2️⃣ AYLIK İZLENME TRENDİ
====================================================== */
exports.getMonthlyViewTrend = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MONTH(izlenme_tarihi) AS ay,
        SUM(izlenme_sayisi) AS toplam
      FROM izlenmeler
      GROUP BY ay
      ORDER BY ay
    `);

    new Response(rows).success(res);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   3️⃣ PİK AYLARDA İÇERİK TİPİ
====================================================== */
exports.getPeakContentType = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        it.tip_adi,
        SUM(i.izlenme_sayisi) AS toplam
      FROM izlenmeler i
      JOIN icerikler c ON i.icerik_id = c.id
      JOIN icerik_tipleri it ON c.tip_id = it.id
      WHERE MONTH(i.izlenme_tarihi) IN (2,7,8,12)
      GROUP BY it.tip_adi
    `);

    new Response(rows).success(res);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   4️⃣ PİK AYLARDA İÇERİK TÜRÜ
====================================================== */
exports.getPeakGenre = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.tur_adi,
        SUM(i.izlenme_sayisi) AS toplam
      FROM izlenmeler i
      JOIN icerikler c ON i.icerik_id = c.id
      JOIN turler t ON c.tur_id = t.id
      WHERE MONTH(i.izlenme_tarihi) IN (2,7,8,12)
      GROUP BY t.tur_adi
      ORDER BY toplam DESC
    `);

    new Response(rows).success(res);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   5️⃣ ÖZEL DÖNEM TİP + TÜR DAĞILIMI
====================================================== */
exports.getSpecialPeriodDistribution = async (req, res, next) => {
  const { periodMonths } = req.query;

  try {
    const [rows] = await db.query(`
      SELECT 
        it.tip_adi,
        t.tur_adi,
        SUM(i.izlenme_sayisi) AS toplam
      FROM izlenmeler i
      JOIN icerikler c ON i.icerik_id = c.id
      JOIN icerik_tipleri it ON c.tip_id = it.id
      JOIN turler t ON c.tur_id = t.id
      WHERE MONTH(i.izlenme_tarihi) IN (${periodMonths})
      GROUP BY it.tip_adi, t.tur_adi
    `);

    new Response(rows).success(res);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   6️⃣ SİMÜLASYON
====================================================== */
exports.runSpecialPeriodSimulation = async (req, res, next) => {
  const { period, increase } = req.body;

  try {
    const [base] = await db.query(`
      SELECT SUM(izlenme_sayisi) AS toplam
      FROM izlenmeler
      WHERE MONTH(izlenme_tarihi) = ?
    `, [period]);

    const estimatedViews = Math.round(base[0].toplam * (increase / 100));

    new Response({
      estimatedPercent: increase,
      estimatedViews
    }).success(res);

  } catch (err) {
    next(err);
  }
};
