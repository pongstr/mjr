'use strict'

const moment = require('moment')

// @TODO: Create product processor here
//  - calculate loan instalments
//  - calculate loan dates
//  - calculate loan interests
//  - apply daily and/or monthly calculations
//    for products with daily payment option

module.exports = class Products {
  /**
   * @param   {Object} context
   * @param   {String} id
   * @return  {Array}  returns processed product data
   */
  constructor (context, id) {
    this.ctx = context
    this._id = id

    return Object.assign(context, {
      _id: productId, instalments: this.getInstallments()
    })
  }

  /**
   * @method GetStartDate
   * @desc   method that returns the current date as a date object.
   * @return {Object} returns a Date object
   */
  getStartDate () {
    return new Date()
  }

  /**
   * @method GetEndDate
   * @desc   method that returns a date X ahead of day from now
   * @param   {Number} value
   * @param   {String} label
   * @return  {Object} returns a Moment() object.
   */
  getEndDate (value, label) {
    return (value && label) &&
      moment(this.getStartDate()).add(value, label)
  }

  /**
   * @method  GetDaysOfYear
   * @desc    standardize days of year
   * @param   {Number} year
   * @returns {Number} year
   */
  getDaysOfYear (year = this.getStartDate().getFullYear()) {
    return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
      ? 366 : 365
  }

  /**
   * @method GetInterest
   * @desc a static value of loan interest
   * @return {Number} Prodcut's Interest Rate
   */
  getInterest () {
    // 0.8 is a static value given
    // for this problem set.
    return (0.8 / 100) / 12 * 365
  }

  /**
   * @method GetInstallments
   * @desc  The proper spelling is `instalment`, but I find it very hard to
   *    get use to it, I know it's wrong but for the sake of not thinking
   *    about it, I'll leave this incorrect spelling here.
   *
   *    This method returns an array of calculated interest rates and
   *    modes of payments and all that shizzzz..
   * @return {Array}
   *    returns an array of product installments and computations of the
   *    current product.
   */
  getInstallments () {
    const that = this
    const ctx  = that.ctx

    const start_date   = moment(this.getStartDate())
    const end_date     = moment(this.getStartDate()).add(ctx.productId, 'months')
    const date_between = end_date.diff(start_date, 'months')
    const days_in_year = that.getDaysOfYear()

    // Output:
    let amount_due;
    let amount_total;
    let amount_interest;

    // Set:
    // Term, determines whether to use daily or monthly calculation
    const term = (ctx.productId === 1)
      ? {label: 'days',   length: end_date.diff(start_date, 'days')}
      : {label: 'months', length: ctx.productId}

    // Principal Amount
    let principal = parseFloat(ctx.amount)
    // Interest Rate  (Monthly/Daily)

    let interest = this.getInterest()
    // Payment Modes  (Monthly/Daily)
    let payments = (term && term.label === 'days')
      ? parseFloat(term.length * days_in_year / 12)// parseFloat(date_between * days_in_year / 12)
      : parseFloat(date_between / 12) * 12

    const _interest = (interest / term.length)
    const _payments = term.length

    that.ctx.interest = (term && term.label === 'days')
      ? _interest : interest.toFixed(2)
    this.ctx.max_duration = end_date.subtract(1, 'months').toISOString()

    if (term && term.label === 'months') {
      const kapow = Math.pow(1 + interest, payments)
      const monthly = (principal * kapow * interest) / (kapow- 1)

      amount_due      = monthly.toFixed(2)
      amount_total    = (monthly * payments).toFixed(2)
      amount_interest = ((monthly * payments) - principal).toFixed(2)
    }

    if (term && term.label === 'days') {
      // @notes: Thanks to my wife for doing some math and dumbing it down
      // so I can understand it and save me some frustration.
      // http://i.imgur.com/9BHEghd.jpg
      const s = (1 + _interest)
      const f = (1 / Math.pow(s, _payments))
      const c = (_interest * principal) / (1 - f)

      amount_due      = (c).toFixed(2)
      amount_total    = (c * _payments).toFixed(2)
      amount_interest = ((c * _payments) - principal).toFixed(2)
    }

    // Return the processed data here as a new array with appropriate
    // content and all that jazz....
    return [
      ...new Array(term.length).fill().map((obj, idx, arr) => {
        return {
          date_str: moment(start_date).add(idx, term.label).format('dddd, MMMM DD, YYYY'),
          date_iso: moment(start_date).add(idx, term.label).toISOString(),
          amount_display: ctx.currency.SYM + ' ' + amount_due,
          amount_due, amount_total, amount_interest
        }
      })
    ]
  }
}
