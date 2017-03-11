const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const uuid = require('uuid')

const index = require('./routes/index')
const api = require('./routes/api')
const app = express()
const njx = nunjucks.configure(path.join(__dirname, 'views'), {
  watch: true,
  express: app,
  autoescape: true
})

njx.addFilter('json', (str) => JSON.stringify(str, null, 2))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
app.set('cookieSecret', uuid.v4())

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser(app.get('cookieSecret')));
app.use(express.static(path.join(__dirname, '../app/assets')))
app.use(express.static(path.join(__dirname, '../app')))

app.use('/', index)
app.use('/api', api)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
