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
  }

  // Bootstrap Controller
  $onInit () {
    const that = this
    const date = this.date = new Date()

    // Get Product Resources
    this.$service.query({limit: 10}).$promise
      .catch((err) => that.collection = err)
      .then((data) => {
        that.collection = data
        that.$selected = 0
        that.ngModel  = that.selectProduct(data[0], that.$selected)
      })

    // Update Views
    that.$scope.$watch('cm.ngModel', (data) => {
      if (!data) return

      const now = new Date()
      const dur = that.$moment(now).add(data.payment_count, data.payment_cycle)

      data.max_duration = that.$moment(dur).toISOString().toString()

      that.$timeout(() => {
        if (data.payment_cycle === 'days') {
          Object.assign(data, {
            instalments: that.dailyPayments(
              data.principal,
              data.payment_count,
              data.payment_cycle
            )
          })
        }

        if (data.payment_cycle === 'months') {
          Object.assign(data, {
            instalments: that.mothlyPayments(
              data.principal,
              data.payment_count,
              data.payment_cycle
            )
          })
        }
      }, 100)

      // console.log(data.instalments[0])
    }, true)
  }

  // Destroy Model
  $onDestroy () {
    this.model = null
    this.$service = null
  }

  // Select Product
  selectProduct (item, $index) {
    const model = item
    const start = this.$moment(this.date)
    const last  = this.$moment(this.date).add(model.payment_count, model.payment_cycle)
    this.$selected = $index

    return angular.copy(model)
  }

  // Calculate Daily Payments
  dailyPayments (amount, length, frequency) {
    const that = this
    const start_date = this.$moment(this.date)
    const end_date   = this.$moment(start_date).add(length, frequency)
    const interest = ((parseFloat(0.8) / 100) * (365 / 12) / length)

    const s = (1 + interest)
    const f = (1 / Math.pow(s, length))
    const c = (interest * amount) / (1 - f)

    return [
      ...new Array(length).fill().map((obj, idx, arr) => {
        return {
          date: that.$moment(start_date).add(idx, frequency).toISOString().toString(),
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
    const interest = ((parseFloat(0.8) / 100) * (365 / 12) / length)

    const kapow   = Math.pow(1 + interest, length)
    const monthly = (amount * kapow * interest) / (kapow - 1)

    return [
      ...new Array(length).fill().map((obj, idx, arr) => {
        return {
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
