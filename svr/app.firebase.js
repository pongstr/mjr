'use strict'

const firebase = require('firebase-admin')
const path = require('path')

module.exports = firebase.initializeApp({
  credential: firebase.credential.cert(path.resolve(__dirname, 'app.firebase.json')),
  databaseURL: 'https://<YOUR_FIREBASE_URL>.firebaseio.com'
})
