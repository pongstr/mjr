'use strict'

const path      = require('path')
const express   = require('express')
const moment    = require('moment')
const firebase  = require('../app.firebase').database()
const router    = express.Router()

/**
 * @name Products `/api/products`
 * @desc products endpoint.
 * @param   {None} (endpoint is read-only)
 * @return  {Array}
 *  returns an array of processed products.
 *  please see `Products` class.
 */

const Product = require('./lib/products')

router.route('/products/').get((req, res, next) => {
  firebase.ref('products').once('value', (data) => {
    const snapshot = data.val()
    const products = []

    // Process base product information into a robust
    // useful initial data for display.
    if (snapshot) {
      for (let id in snapshot) {
        products.push(new Product(snapshot[id], id))
      }
    }

    // Return processed products here.
    res.json(products)
  })
})

module.exports = router
