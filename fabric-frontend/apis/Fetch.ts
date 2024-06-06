import { notification } from 'antd';
import Cookie from 'js-cookie';

export class MgeError extends Error {
  public detail: string[];
  constructor(msg: string, detail: string[] = []){
    super(msg);
    this.detail = detail;
  }
}

function GetHeader(json: boolean): HeadersInit {
  const csrfToken = Cookie.get('csrftoken');
  const headers: HeadersInit = { 'Accept': 'application/json', };
  if (json) { headers['Content-Type'] = 'application/json' }
  if (csrfToken != null) { headers['X-CSRFtoken'] = csrfToken};
  return headers;
}

// 用于上传文件_+_big
export async function RestApiFetch_mulFile<T = any>(url: string, method: string, data: any): Promise<T> {
  const headers = GetHeader(false);
  const response = await fetch(url, { method, headers, body: data, credentials: 'same-origin' });
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    return response.json();
  }
  else if (response.status === 500) {
    // Internal Server Error
    notification.error({ message: '系统繁忙，请联系技术支持' });
    throw new MgeError('系统繁忙，请联系技术支持', []);
  }
  else {
    const errorJson = await response.json();
    if (errorJson.extra != null) {
      notification.error({ message: errorJson.extra.err_detail });
      throw new MgeError(errorJson.msg, errorJson.extra.err_detail);
    }
    else {
      notification.error({ message: errorJson.msg });
      throw new MgeError(errorJson.msg, []);
    }
  }
}

// 用于上传文件
export async function UploadFetch<T = any>(url: string, method: string, data: FormData): Promise<T> {
  const headers = GetHeader(false);
  const response = await fetch(url, { method, headers, body: data, credentials: 'same-origin' });
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    const jsonData: { data: any} =  await response.json();
    return jsonData.data;
  }
  else if (response.status === 500) {
    // Internal Server Error
    notification.error({ message: '系统繁忙，请联系技术支持' });
    throw new MgeError('系统繁忙，请联系技术支持', []);
  }
  else {
    const errorJson = await response.json();
    if (errorJson.extra != null) {
      notification.error({ message: errorJson.extra.err_detail });
      throw new MgeError(errorJson.msg, errorJson.extra.err_detail);
    }
    else {
      notification.error({ message: errorJson.msg });
      throw new MgeError(errorJson.msg, []);
    }
  }
}

export async function RestApiFetch<T>(url: string, method: string = 'GET', data?: any): Promise<T> {
  const headers = GetHeader(true);
  let body: string | undefined = undefined;
  if (data != null) { body = JSON.stringify(data); }
  const response = await fetch(url, { method, headers, body, credentials: 'same-origin' });
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    return response.json();
  }
  else if (response.status === 500) {
    notification.error({
      message: '系统繁忙，请联系技术支持',
    })
    throw new MgeError('系统繁忙，请联系技术支持', []);
  }
  else if (response.status === 405) {
    notification.error({
      message: '方法不被允许',
    })
  }
  else {
    const errorJson = await response.json();
    if (errorJson.detail != null) {
      notification.error({ message: errorJson.detail });
      throw new MgeError(errorJson.detail);
    }
    else {
      notification.error({ message: '' });
      throw new MgeError('', []);
    }
  }
}
export async function RestApiFetchV2<T>(url: string, method: string = 'GET', data?: any): Promise<T> { //川大
  const headers = GetHeader(true);
  let body: string | undefined = undefined;
  if (data != null) { body = JSON.stringify(data); }
  const response = await fetch(url, { method, headers, body, credentials: 'same-origin' });
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    return response.json();
  }
  else if (response.status === 500) {
    notification.error({
      message: '系统繁忙，请联系技术支持',
    })
    throw new MgeError('系统繁忙，请联系技术支持', []);
  }
  else if (response.status === 405) {
    notification.error({
      message: '方法不被允许',
    })
  }
  else {
    const errorJson = await response.json();
    if (errorJson.extra != null) {
      notification.error({ message: errorJson.extra.err_detail });
      throw new MgeError(errorJson.msg, errorJson.extra.err_detail);
    }
    else {
      notification.error({ message: errorJson.msg });
      throw new MgeError(errorJson.msg, []);
    }
  }
}

export interface RestListResult<T> {
  count: number;
  page_size: number;
  next?: string;
  previous?: string;
  total?: number;
  results: T[];
}

export interface UrlParam {
  page?: number;
  page_size?: number;
  [name: string]: string | number | string[] | number[] | undefined | boolean;
}

function ParamToString(param?: UrlParam): string {
  if (param == null) return '';
  let result: string[] = [];
  for(let i in param) {
    let title = i;
    if (param[i] === undefined || param[i] === null) continue;
    let value = '';
    if (Array.isArray(param[i])) {
      title = `${i}[]`;
      value = (param[i] as any[]).join(',');
    }
    else {
      value = `${param[i]}`;
    }
    if (value.length === 0) continue;
    result.push(`${encodeURIComponent(title)}=${encodeURIComponent(value)}`)
  }
  return result.join('&');
}

export async function RestListFetch<T>(url: string, method: string = 'GET', param?: UrlParam, data?: any): Promise<RestListResult<T>> {
  // 准备Header
  const headers = GetHeader(true);
  // 准备Body
  let body: string | undefined = undefined;
  if (data != null) { body = JSON.stringify(data); }
  // 准备URL
  let parameters = ParamToString(param);
  if (parameters.length !== 0) { url = `${url}?${parameters}`; }
  // 发送请求
  const response = await fetch(url, { method, headers, body, credentials: 'same-origin' });
  // 错误处理 or 返回数据
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    return response.json();
  }
  else if (response.status === 500) { 
    notification.error({ message: '系统繁忙，请联系技术支持' });
    throw new MgeError('系统繁忙，请联系技术支持', []);
  }
  else {
    const errorJson = await response.json();
    if (errorJson.detail != null) {
      notification.error({ message: errorJson.detail });
      throw new MgeError(errorJson.detail);
    }
    else {
      notification.error({ message: '' });
      throw new MgeError('', []);
    }
  }
}

// 新的、带有code的请求
export async function RestListFetch2<T>(url: string, method: string = 'GET', param?: UrlParam, data?: any): Promise<RestListResult<T>> {
  // 准备Header
  const headers = GetHeader(true);
  // 准备Body
  let body: string | undefined = undefined;
  if (data != null) { body = JSON.stringify(data); }
  // 准备URL
  let parameters = ParamToString(param);
  if (parameters.length !== 0) { url = `${url}?${parameters}`; }
  // 发送请求
  const response = await fetch(url, { method, headers, body, credentials: 'same-origin' });
  // 错误处理 or 返回数据
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    const jsonData: { data: any } =  await response.json();
    return jsonData.data;
  }
  else if (response.status === 500) { 
    notification.error({ message: '系统繁忙，请联系技术支持' });
    throw new MgeError('系统繁忙，请联系技术支持', []);
  }
  else {
    const errorJson = await response.json();
    if (errorJson.detail != null) {
      notification.error({ message: errorJson.detail });
      throw new MgeError(errorJson.detail);
    }
    else {
      notification.error({ message: '' });
      throw new MgeError('', []);
    }
  }
}


// 用于大部分MGE的API
export async function JsonApiFetch<T = any>(url: string, method: string = 'GET', data?: any): Promise<T> {
  const headers = GetHeader(true);

  let body: string | undefined = undefined;
  if (data != null) { body = JSON.stringify(data); }
  const response = await fetch(url, { method, headers, body, credentials: 'same-origin' });
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    const jsonData: { data: any} =  await response.json();
    return jsonData.data;
  }
  else if (response.status === 500) {
    // Internal Server Error
    const errorJson = await response.json();
    if (errorJson.error_detail != null) {
      notification.error(({message:errorJson.error_detail}));
      throw new MgeError(errorJson.msg, errorJson.error_detail);
    }
    else {
      notification.error({message: '系统繁忙，请联系技术支持'});
      throw new MgeError('系统繁忙，请联系技术支持', []);
    }
  }
  else {
    const errorJson = await response.json();
    if (errorJson.extra != null) {
      // 提交模板时的api，错误信息层级过深优化
      if(errorJson.extra.err_detail !== null && errorJson.extra.err_detail.err_detail !== undefined){
        throw new MgeError(errorJson.msg, errorJson.extra.err_detail.err_detail.toString());
      }else{
        notification.error({ message: errorJson.extra.err_detail });
        throw new MgeError(errorJson.msg, errorJson.extra.err_detail);
      }
    }
    else {
      if (errorJson.error_detail != null){
      notification.error({ message: errorJson.error_detail});
      throw new MgeError(errorJson.msg, []);
      }
      else {
      notification.error({ message: errorJson.msg });
      throw new MgeError(errorJson.msg, []);
      }

    }
  }
}

//用于FL相关接口的api
export async function FLApiFetch<T = any>(url: string, method: string = 'GET', data?: any): Promise<T> {
  const headers = GetHeader(true);

  let body: string | undefined = undefined;
  if (data != null) { body = JSON.stringify(data); }
  const response = await fetch(url, { method, headers, body, credentials: 'same-origin' });
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    const jsonData =  await response.json();
    return jsonData;
  }
  else if (response.status === 500) {
    // Internal Server Error
    const errorJson = await response.json();
    if (errorJson.error_detail != null) {
      notification.error(({message:errorJson.error_detail}));
      throw new MgeError(errorJson.msg, errorJson.error_detail);
    }
    else {
      notification.error({message: '系统繁忙，请联系技术支持'});
      throw new MgeError('系统繁忙，请联系技术支持', []);
    }
  }
  else {
    const errorJson = await response.json();
    if (errorJson.extra != null) {
      // 提交模板时的api，错误信息层级过深优化
      if(errorJson.extra.err_detail !== null && errorJson.extra.err_detail.err_detail !== undefined){
        throw new MgeError(errorJson.msg, errorJson.extra.err_detail.err_detail.toString());
      }else{
        notification.error({ message: errorJson.extra.err_detail });
        throw new MgeError(errorJson.msg, errorJson.extra.err_detail);
      }
    }
    else {
      if (errorJson.error_detail != null){
      notification.error({ message: errorJson.error_detail});
      throw new MgeError(errorJson.msg, []);
      }
      else {
      notification.error({ message: errorJson.msg });
      throw new MgeError(errorJson.msg, []);
      }

    }
  }
}

//大科学装置api 返回jsondata
export async function JsondataApiFetch<T = any>(url: string, method: string = 'GET', data?: any): Promise<any> {
  const headers = GetHeader(true);

  let body: string | undefined = undefined;
  if (data != null) { body = JSON.stringify(data); }
  const response = await fetch(url, { method, headers, body, credentials: 'same-origin' });
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    const jsonData: { data: any} =  await response.json();
    return jsonData;
  }
  else if (response.status === 500) {
    // Internal Server Error
    notification.error({ message: '系统繁忙，请联系技术支持' });
    throw new MgeError('系统繁忙，请联系技术支持', []);
  }
  else {
    const errorJson = await response.json();
    if (errorJson.extra != null) {
      // 提交模板时的api，错误信息层级过深优化
      if(errorJson.extra.err_detail !== null && errorJson.extra.err_detail.err_detail !== undefined){
        throw new MgeError(errorJson.msg, errorJson.extra.err_detail.err_detail.toString());
      }else{
        notification.error({ message: errorJson.extra.err_detail });
        throw new MgeError(errorJson.msg, errorJson.extra.err_detail);
      }
    }
    else {
      notification.error({ message: errorJson.msg });
      throw new MgeError(errorJson.msg, []);
    }
  }
}
// 用于特定不反馈的api, 比如MgeLayout用的info(把401单独出来)
export async function NotFeedback_JsonApiFetch<T = any>(url: string, method: string = 'GET', data?: any): Promise<T> {
  const headers = GetHeader(true);

  let body: string | undefined = undefined;
  if (data != null) { body = JSON.stringify(data); }
  const response = await fetch(url, { method, headers, body, credentials: 'same-origin' });
  if (response.ok || response.status === (200 || 201 || 202 || 203 || 204 || 205 || 206)) {
    const jsonData: { data: any} =  await response.json();
    return jsonData.data;
  }
  else if (response.status === 401) {
    throw new MgeError('未认证', []);
  }
  else if (response.status === 500) {
    // Internal Server Error
    notification.error({ message: '系统繁忙，请联系技术支持' });
    throw new MgeError('系统繁忙，请联系技术支持', []);
  }
  else {
    const errorJson = await response.json();
    if (errorJson.extra != null) {
      notification.error({ message: errorJson.extra.err_detail });
      throw new MgeError(errorJson.msg, errorJson.extra.err_detail);
    }
    else {
      notification.error({ message: errorJson.msg });
      throw new MgeError(errorJson.msg, []);
    }
  }
}

export default JsonApiFetch;
