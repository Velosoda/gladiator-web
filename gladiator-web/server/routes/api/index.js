var router = require('express').Router();

router.use('/practice', require('./practice'));
router.use('/moves', require('./moves'));
router.use('/fighter', require('./fighter'));
router.use('/arena', require('./arena'));
router.use('/tournament', require('./tournament'));
router.use('/fight', require('./fight'));

module.exports = router;