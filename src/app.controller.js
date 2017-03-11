'use strict'

export default class MainController {
  /* @ngInject */
  constructor ($scope, $timeout, $state) {
    const main = this

    this.$state   = $state
    this.$service = AuthService
    this.currentUser = null
    this.credentials = null

    this.$service.$onAuthStateChanged((user) => {
      ;(!user) && main.$state.go('login', {reload: true})
    })
  }

  login (form) {
    const auth = this

    if (form.$valid) {
      this.$service.$signInWithEmailAndPassword(
        auth.credentials.email,
        auth.credentials.password
      )
      .then((user) => {
        form.$setPristine()
        form.$setUntouched()
        auth.$state.go('app.default')
      })
      .catch((err) => {
        auth.credentials = null
        auth.toggleNotify(err.message)
      })
    }
  }

  logout () {
    return this.$service.$signOut()
  }
}
