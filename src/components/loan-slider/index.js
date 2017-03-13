// ComponentTemplate
import template from '!./index.html'

// Component Controller
class LoanSliderController {
  /* @ngInject */
  constructor ($scope, $timeout, products) {
    this.$scope   = $scope
    this.$timeout = $timeout
    this.$service = products
  }

  $onInit () {
    this.collection = this.$service.query({limit: 10})
  }

  $onDestroy () {
    this.model = null
    this.$service = null
  }
}

export const LoanSlider = {
  require: true,
  template: template,
  controller: LoanSliderController,
  controllerAs: 'slider'
}
