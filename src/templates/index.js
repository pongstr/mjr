import template   from '!./index.html'
import login      from '!./common/login.html'

/* @ngInject */
export default function templates ($templateCache) {
  const $tmp = $templateCache

  $tmp.put('template.html', template)
  $tmp.put('common/login.html', login)
}
