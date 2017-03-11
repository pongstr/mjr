// Application Configs
import authCheck      from './config/auth-check'
import configRoute    from './config/routes'
import configRouters  from './config/router'
import initTemplates  from './templates/index'
import createResource from './services/api'

import MainController from './app.controller'
import AuthService    from './services/auth'
import LoanSlider     from './components/loan-slider/index'

// #==
// See Firebase Documentation for Web Setup
// https://firebase.google.com/docs/web/setup

const fireconf = {
  apiKey:             null,
  authDomain:         null,
  databaseURL:        null,
  storageBucket:      null,
  messagingSenderId:  null
}

firebase && firebase.initializeApp(fireconf)

const modules = [
  'ngAnimate',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'firebase'
]

const app = angular
  .module('app.demo', modules)
  .value('mode', 'app.demo')
  .value('version', '0.1.0')
  .run(authCheck)
  .run(initTemplates)
  .config(configRoute)     // config : routes default behavior.
  .config(configRouters)   // config : init all available routes w/in the app.

app.controller('Ctrl.Main', MainController)
app.component('loanSlider', LoanSlider)
app.factory('products', createResource('products'))
app.service('AuthService', AuthService)
