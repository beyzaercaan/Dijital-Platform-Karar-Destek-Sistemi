const router = require('express').Router();

const anapanelRoutes = require('./anapanelRoutes');
const behaviourRoutes = require('./behaviourRoutes');
const seasonalityRoutes = require('./seasonalityRoutes');

router.use('/anapanel', anapanelRoutes);
router.use('/behaviour', behaviourRoutes);
router.use('/seasonality', seasonalityRoutes);

module.exports = router;
