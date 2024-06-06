import { Encode } from './Base64';

export function JoinParameters(url: string, para: { [x: string]: any }) {

  const filtered: string[] = [];
  
  for (let key in para) {
    let value = para[key];
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      if (typeof value[0] === 'string' || value[0] instanceof String) {
        let str = value.map(x => `"${x}"`).join(',');
        value = Encode(`[${str}]`).replace(/\//g, '.').replace(/\+/g, '-');
      }
      else {
        value = value.join(',');
      }
      filtered.push(`${key}[]=${value}`);
    }
    else {
      filtered.push(`${key}=${value}`);
    }
  }

  if (filtered.length !== 0) {
    return `${url}?${filtered.join('&')}`
  }
  else {
    return url;
  }
}

