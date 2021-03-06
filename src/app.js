// Application Configs
import authCheck      from './config/auth-check'
import configRoute    from './config/routes'
import configRouters  from './config/router'
import initTemplates  from './templates/index'
import createResource from './services/api'

import MainController from './app.controller'
import AuthService    from './services/auth'

import rangeSlider    from './directives/range-slider/index'
import schedCards     from './directives/sched-cards/index'

import {LoanCompute}  from './components/compute/index'
import {momentFilter} from './app.utils'

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
app.component('loanCompute', LoanCompute)
app.directive('rangeSlider', rangeSlider)
app.directive('schedCards', schedCards)
app.factory('products', createResource('products'))
app.filter('moment', momentFilter)
app.service('AuthService', AuthService)
