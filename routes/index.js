
var express = require('express');
var router = express.Router();

/* Main page. */
router.get('/', (req, res, next) => res.render('visualization'));

router.get('/test', (req, res, next) => res.render('renew_vis'));

module.exports = router;
