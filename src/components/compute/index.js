// ComponentTemplate
import template from '!./index.html'

// Component Controller
class ComputeController {
  /* @ngInject */
  constructor ($scope, $timeout, $window, products) {
    this.ngModel  = null
    this.$scope   = $scope
    this.$timeout = $timeout
    this.$service = products
    this.$moment  = $window.moment
    this.collection = null
  }

  // Bootstrap Controller
  $onInit () {
    const that = this
    const date = this.date = new Date()

    // Get Product Resources
    this.$service.query({limit: 3}).$promise
      .catch((err) => {
        that.$selected = null
        that.collectionError = err
      })
      .then((data) => {
        that.collection = data
        that.$selected  = 0
        that.selectProduct(that.$selected)
      })

    // Update Views
    that.$scope.$watch('cm.ngModel', (data) => {1
      if (!data) return
      // Re-calculate max_duration whenever model updates
      const dur = that.$moment(that.date).add(
        data.payment_count,
        data.payment_cycle
      )

      // Add Timeout gracefully update model
      that.$timeout(() => {
        // Calculate and Update Daily Payments
        ;(data.payment_cycle === 'days') && Object.assign(data, {
          instalments: that.dailyPayments(
            data.principal,
            data.payment_count,
            data.payment_cycle
          )
        })

        // Calculate and Update Monthly Payments
        ;(data.payment_cycle === 'months') && Object.assign(data, {
          instalments: that.mothlyPayments(
            data.principal,
            data.payment_count,
            data.payment_cycle
          )
        })
      })

      // Set Max Duration, Interest and Total
      data.max_duration = that.$moment(dur).toISOString().toString()
      data.interest = (data.instalments.length > 0)
        ? data.instalments[0].amount_interest
        : null
      data.amount_total = (data.instalments.length > 0)
        ? data.instalments[0].amount_total
        : null
    }, true)
  }

  // Destroy Model
  $onDestroy () {
    this.model = null
    this.$service = null
  }

  // Select Product
  selectProduct ($index) {
    const model = this.ngModel = this.collection[$index]
    const freq  = this.$moment(this.date).add(
      model.payment_count,
      model.payment_cycle
    )
    // Set Selected Tab to Active
    this.$selected = $index
    Object.assign(model, {frequency: freq.diff(this.date, model.payment_cycle)})
  }

  // Calculate Daily Payments
  dailyPayments (amount, length, frequency) {
    const that     = this
    const end_date = this.$moment(this.date).add(length, frequency)
    const interest = ((parseFloat(0.8) / 100) * (365 / 12) / length)

    // Calculate Interest and Daily Payments
    const s = (1 + interest)
    const f = (1 / Math.pow(s, length))
    const c = (interest * amount) / (1 - f)
    return [
      ...new Array(length).fill().map((obj, idx, arr) => {
        return {
          date: that.$moment(that.date)
            .add(idx, frequency).toISOString().toString(),
          amount_due: (c).toFixed(2),
          amount_total: (c * length).toFixed(2),
          amount_interest: ((c * length) - amount).toFixed(2)
        }
      })
    ]
  }

  mothlyPayments (amount, length, frequency) {
    const that     = this
    const end_date = this.$moment(this.date).add(length, frequency)
    const interest = (0.8 / 100) / 12 * 365

    // Calculate Interest and Monthly Payments
    const kapow    = Math.pow(1 + interest, length)
    const monthly  = (amount * kapow * interest) / (kapow - 1)

    // ReWrite Array
    return [
      ...new Array(length).fill().map((obj, idx, arr) => {
        return {
          date: that.$moment(that.date).add(idx, frequency).toISOString().toString(),
          amount_due:  monthly.toFixed(2),
          amount_total: (monthly * length).toFixed(2),
          amount_interest: ((monthly * length) - amount).toFixed(2)
        }
      })
    ]
  }
}

export const LoanCompute = {
  require: true,
  template: template,
  controller: ComputeController,
  controllerAs: 'cm'
}
