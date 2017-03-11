'use strict'

export default class MainController {
  /* @ngInject */
  constructor ($scope, $timeout, $state, $window, $firebaseObject, AuthService) {
    const main = this
    const ref  = $window.firebase.database().ref('site')

    // Fetch Site Info
    this.site = $firebaseObject(ref)
    this.$resolve = this.site.$loaded()

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
        auth.credentials = {
          error: err.message
        }
      })
    }
  }

  logout () {
    return this.$service.$signOut()
  }
}
