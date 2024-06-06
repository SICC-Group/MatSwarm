const $ = require('jquery');
import Cookie from 'js-cookie';

function TestPolyfill(): void {
  console.log(fetch);
}

export function GlobalInit(): void {
  TestPolyfill();
  const csrfToken = Cookie.get('csrftoken');
  $.ajaxSetup({
    beforeSend(xhr: any, settings: any) {
      if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) && !this.crossDomain) {
        xhr.setRequestHeader('X-CSRFtoken', csrfToken);
      }
    },
  });
}
