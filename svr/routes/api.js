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

    // Check to see if Products Table is empty
    if (!snapshot) return next()

    // Process Products and add current time to it context
    for (let id in snapshot) {
      ;(req.query && req.query.calc === 'true')
        ? products.push(new Product(snapshot[id], id, true))
        : products.push(new Product(snapshot[id], id, null))
    }

    // Return processed products here.
    res.json(products)
  })
}, (req, res, next) => {
  res.send({response: 200, message: 'Products Table is Empty.'})
})

module.exports = router
