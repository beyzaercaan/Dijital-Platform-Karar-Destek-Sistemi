const router = require('express').Router();

const {
  behaviorKpis,
  contentTypeComparison,
  contentGenreComparison,
  varietyEffect,
  releaseYearEffect
} = require('../controllers/behaviorController');

router.get('/kpis', behaviorKpis);
router.get('/type-comparison', contentTypeComparison);
router.get('/genre-comparison', contentGenreComparison);
router.get('/variety-effect', varietyEffect);
router.get('/release-year-effect', releaseYearEffect);

module.exports = router;
