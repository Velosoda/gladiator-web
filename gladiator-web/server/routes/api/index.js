var router = require('express').Router();

router.use('/practice', require('./practice'));
router.use('/moves', require('./moves'));

module.exports = router;