'use strict'

/* @ngInject */
export function momentFilter ($window) {
  return function (date, type) {
    const m = $window.moment(date)
    const f = {
      fromNow : () => m.fromNow(),
      calendar: () => m.calendar(),
      toDate  : () => m.toDate(),
      format  : () => m.format('dddd, MMMM DD, YYYY'),
      short   : () => m.format('ddd, DD/MM/YYYY')
    }

    return f[type] ? f[type]() : f.format()
  }
}
