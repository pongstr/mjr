import template from '!./index.html'

/* @ngInject */
export default function rangeSlider ($rootScope) {
  return {
    scope: {
      model: '=',
      type: '@type',
      step: '@step',
      min:  '@min',
      max:  '@max'
    },
    restrict: 'E',
    replace: true,
    template: template,
    transclude: true,
    bindToController: true,
    controllerAs: 'slider',
    /* @ngInject */
    controller: function ($scope) {
      this.decrease = () => {
        this.model = (this.model - parseInt(this.step))
      }

      this.increase = () => {
        this.model = (this.model + parseInt(this.step))
      }
    },
    link: (scope, element, attrs) => {
      let _element = angular.element(element)
      let _cleanup = $rootScope.$on('$stateChangeStart', function () {
        element.remove()
        element.parent().remove()
        scope.$destroy()
      })

      let $range = angular.element(document).find('.range-control')

      $range.on('change', (e) => {
        console.log(e.target)
      })


      scope.$on('$destroy', _cleanup)
    }
  }
}
