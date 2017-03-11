const express = require('express')
const path = require('path')
const firebase = require('../app.firebase').database()
const router = express.Router()

const viewsPath = path.join(__dirname, '../views')
const adminPath = path.join(__dirname, '../../app')

router.use((req, res, next) => {
  const site = firebase.ref('site/general_settings')
  site.once('value', (snapshot) => {
    req.locals = {site: snapshot.val()}
    next()
  })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('templates/empty-state.html', req.locals)
  res.redirect('/app/')
})

router.get('/robots.txt', function (req, res) {
  if (req.locals.site && req.locals.site.robots) {
    res.set('Content-Type', 'text/plain')
    res.send(req.locals.site.robots)
    res.end()
  }
}, (req, res) => res.sendFile('robots.txt', {root: viewsPath}))

router.get('/humans.txt', function (req, res) {
  if (req.locals.site && req.locals.site.robots) {
    res.set('Content-Type', 'text/plain')
    res.send(req.locals.site.humans)
    res.end()
  }
}, (req, res) => res.sendFile('humans.txt', {root: viewsPath}))

router.get('/app/*', function(req, res, next) {
  res.sendFile('app.html', { root: adminPath });
})

module.exports = router;
