'use strict'

const firebase = require('./app.firebase').database()
const products = firebase.ref('products')
const created = new Date().toISOString()

// Base Products Model
const productsModel = [
  {
    productId: 1,
    name: '1 Month',
    description: 'Borrow up to £{{ max_amount }}',
    created_at: created,
    updated_at: created,
    amount: 500,
    min_amount: 100,
    max_amount: 925,
    currency: { ISO: 'GBP', SYM: '£'},
    payment_cycle: 'daily'
  }, {
    productId: 2,
    name: '2 Months',
    description: 'Borrow up to £{{ max_amount }}',
    created_at: created,
    updated_at: created,
    amount: 500,
    min_amount: 100,
    max_amount: 925,
    currency: { ISO: 'GBP', SYM: '£'},
    payment_cycle: 'monthly'
  }, {
    productId: 3,
    name: '3 Months',
    description: 'Borrow up to £{{ max_amount }}',
    created_at: created,
    updated_at: created,
    amount: 500,
    min_amount: 100,
    max_amount: 925,
    currency: { ISO: 'GBP', SYM: '£'},
    payment_cycle: 'monthly'
  }
]

// Write Products to Database
productsModel.forEach(product => {
  console.info('\t--> Creating Product:', product.name)
  products.push(product)
})

// Verify if models have been created, then exit init.
products.on('value', (snapshot) => {
  if (Object.keys(snapshot.val()).length >= productsModel.length) {
    console.info('\n\tDone! Product Models have been successfully created.\n')
    process.exit(0)
  }
})
