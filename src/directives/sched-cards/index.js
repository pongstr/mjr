import template from '!./index.html'

/* @ngInject */
export default function schedCards ($rootScope) {
  return {
    scope: {model: '=model', static: '@static'},
    restrict: 'E',
    replace: true,
    template: template,
    transclude: true,
    link: (scope, element, attrs) => {
      let _cleanup = $rootScope.$on('$stateChangeStart', function () {
        element.remove()
        element.parent().remove()
        scope.$destroy()
      })
      scope.$on('$destroy', _cleanup)
    }
  }
}
