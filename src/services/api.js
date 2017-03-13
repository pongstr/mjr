'use strict'

export default function resource (resource_name) {
  /* @ngInject */
  return function ($resource) {
    const ENDPOINT = `/api/${resource_name}/:id`

    // Check if object is numeric and isFinite
    const isNumeric    = (obj) => !isNaN(parseFloat(obj)) && isFinite(obj)
    // Transform Response from JSON
    const resTransform = (a, b, c) => angular.fromJson(a)
    // Transform Response to JSON
    const reqTransform = (content) => angular.toJson(content)

    // Setup Default Headers
    const headers = {
      'Content-Type': 'application/json, text/plain, */*',
      'Accept': 'application/json, text/plain, */*'
    }

    const DEFAULTS = {
      find: {
        method: 'GET',
        resTransform,
        reqTransform,
        isArray: true,
        headers
      },
      findById: {
        method: 'GET',
        resTransform,
        reqTransform,
        isArray: false,
        headers
      },
      create: {
        method: 'POST',
        reqTransform,
        isArray: false
      },
      update: {
        method: 'PATCH',
        reqTransform,
        isArray: false,
        headers
      },
      deleteById : {
        method: 'DELETE',
        reqTransform,
        isArray: false,
        headers
      }
    }

    let Resource = $resource(ENDPOINT, { id: '@id' }, DEFAULTS)
    Resource.prototype.$save = () => !this.id ? this.$create() : this.$update()
    return Resource
  }
}
