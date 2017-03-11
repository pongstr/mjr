import template   from '!./index.html'

/* @ngInject */
export default function templates ($templateCache) {
  const $tmp = $templateCache

  $tmp.put('template.html', template)
}
