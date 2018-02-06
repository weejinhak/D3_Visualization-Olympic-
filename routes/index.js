
var express = require('express');
var router = express.Router();

/* Main page. */
router.get('/', (req, res, next) => res.render('visualization'));

module.exports = router;
