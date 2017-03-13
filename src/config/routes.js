'use strict'

/* @ngInject */
function authSignIn (AuthService) {
  return AuthService.$waitForSignIn()
}

/* @ngInject */
function authRequired (AuthService) {
  return AuthService.$requireSignIn()
}

/* @ngInject */
export default function routePaths ($stateProvider, $urlRouterProvider) {
  $stateProvider
    // Application Root Route
    // setup an abstract route:
    .state('app', {
      url: '/',
      abstract: true,
      resolve: {currentAuth: authRequired},
      templateUrl: 'template.html'
    })

    // Actual Application Root Route
    .state('app.default', {
      url: '',
      resolve: {currentAuth: authRequired},
      views: {
        'content@app': {component: 'loanSlider' }
      }
    })

    // Application Login Route
    .state('login', {
      url: '/login/',
      resolve: {currentAuth: authSignIn},
      templateUrl: 'common/login.html',
      controller: ($state, AuthService) => {
        ;(AuthService.$getAuth()) &&
          $state.go('app.default', {}, {reload: true})
      }
    })

  $urlRouterProvider.otherwise('/')
}
