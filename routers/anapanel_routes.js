const router = require('express').Router();

const {
  aylikPaketBazliGelir,
  toplamGelirTrendi,
  paketDagilimi,
  segmentPerformansi,
  izlenmeTrendi,
  paketGecisSimulasyonu
} = require('../controllers/anapanelController');

// Grafik & analiz endpointleri
router.get('/aylik-paket-gelir', aylikPaketBazliGelir);
router.get('/toplam-gelir-trendi', toplamGelirTrendi);
router.get('/paket-dagilimi', paketDagilimi);
router.get('/segment-performansi', segmentPerformansi);
router.get('/izlenme-trendi', izlenmeTrendi);
router.get('/paket-gecis-simulasyon', paketGecisSimulasyonu);

module.exports = router;
