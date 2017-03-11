'use strict'

// @TODO: Create product processor here
//  - calculate loan instalments
//  - calculate loan dates
//  - calculate loan interests
//  - apply daily and/or monthly calculations
//    for products with daily payment option

module.exports = class Products {
  constructor (context, id) {
    this.ctx = context
    this._id = id
    return this
  }
}
