'use strict'

/* @ngInject */
export function moment ($window) {
  return function (date, type) {
    const m = $window.moment(date)
    const f = {
      fromNow : () => m.fromNow(),
      calendar: () => m.calendar(),
      toDate  : () => m.toDate(),
      format  : () => m.format('dddd, DD/MM/YYYY')
    }
    return f[type] && f[type]()
  }
}
