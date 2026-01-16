const router = require("express").Router();
const controller = require("../controllers/seasonality.controller");

// KPI
router.get("/kpi", controller.getSeasonalityKpis);

// Grafikler
router.get("/monthly-trend", controller.getMonthlyViewTrend);
router.get("/peak-type", controller.getPeakContentType);
router.get("/peak-genre", controller.getPeakGenre);
router.get("/special-period", controller.getSpecialPeriodDistribution);

// Simülasyon
router.post("/simulation", controller.runSpecialPeriodSimulation);

module.exports = router;
