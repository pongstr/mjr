var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', {title: 'Material Design Template'})
});

router.get('/robots.txt', function (req, res) {
  res.sendFile('robots.txt', {root: path.join(__dirname, '../views')})
})

router.get('/app/*', function(req, res, next) {
  res.sendFile('app.html', { root: path.join(__dirname, '../../app') });
});

module.exports = router;
