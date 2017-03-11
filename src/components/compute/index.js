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

    $scope.$watch('cm.ngModel', (data) => {
      if (!data) return
      // Watch Selected Models Here
    }, true)
  }

  // Bootstrap Controller
  $onInit () {
    const that = this
    // Get Product Resources
    this.$service.query({limit: 10}).$promise
      .catch((err) => that.collection = err)
      .then((data) => {
        that.collection = data
        that.ngModel = data[0]
      })
  }

  // Destroy Model
  $onDestroy () {
    this.model = null
    this.$service = null
  }

  // Select Product
  selectProduct (product) {
    return
  }
}

export const LoanCompute = {
  require: true,
  template: template,
  controller: ComputeController,
  controllerAs: 'cm'
}
