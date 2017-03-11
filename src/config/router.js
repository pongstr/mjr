
/* @ngInject */
export default function configRoute (
  $provide,
  $qProvider,
  $httpProvider,
  $locationProvider,
  $urlRouterProvider,
  $urlMatcherFactoryProvider,
) {
  // Location Setup
  $locationProvider.hashPrefix('!')
  $locationProvider.html5Mode(false)

  $urlMatcherFactoryProvider.strictMode(false)

  // Setup route rules and fallback for routes that don't exists
  $urlRouterProvider.otherwise('/')
  $urlRouterProvider.rule(function ($injector, $location) {
    const path = $location.url()

    // check to see if the path already has a slash where it should be
    if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
      return
    }

    if (path.indexOf('?') > -1) {
      return path.replace('?', '/?')
    }

    return path + '/'
  })
  $qProvider.errorOnUnhandledRejections(false);
}
