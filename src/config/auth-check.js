'use strict'

export default function authCheck ($rootScope, $state) {
  $rootScope.$on('$stateChangeError', (event, state, ...error) => {
    ;(error.indexOf('AUTH_REQUIRED')) && $state.go('login', {reload: true})
  })
}
