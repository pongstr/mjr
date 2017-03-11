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
    for (const id in snapshot) {
      products.push(new Product(snapshot[id], id))
    }

    // Return processed products here.
    res.json(products)
  })
}, (req, res, next) => {
  res.send({response: 200, message: 'Products Table is Empty.'})
})

router.route('/products/:id').get((req, res, next) => {
  firebase.ref('products').child(req.params.id).once('value', (data) => {
    const product = data.val()
    if (!product) return next()
    res.send(new Product(product, product.id))
  })
}, (req, res, next) => {
  res.send({
    response: 204,
    message: 'This is not the product you are looking for.'
  })
})

module.exports = router
