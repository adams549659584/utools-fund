import axios, { AxiosRequestConfig } from 'axios';
import { IncomingMessage } from 'electron';
// import { convert } from 'encoding';

// 超时时间
axios.defaults.timeout = 1000 * 10;
// 添加请求拦截器
axios.interceptors.request.use(request => {
  // // 默认请求头
  // request.headers['X-Requested-With'] = 'XMLHttpRequest';
  // // 类似 jquery cache false
  // if ((request.method || '').toLowerCase() === 'get') {
  //   Object.assign(request.params, { _t: Date.now() });
  // }
  return request;
});
// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
axios.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  async err => {
    return Promise.reject(err);
  }
);

/**
 * get 请求
 * @param url 请求链接
 * @param params 参数
 * @param config 配置
 */
const get = async <T = string>(url: string, params?: { [key: string]: any }, config?: AxiosRequestConfig): Promise<T> => {
  const res = await axios.get(url, { params, ...config });
  return res.data as T;
};

/**
 * post 请求
 * @param url 请求链接
 * @param data 参数
 * @param config 配置
 */
const post = async <T = string>(url: string, data?: { [key: string]: any }, config?: AxiosRequestConfig): Promise<T> => {
  const res = await axios.post(url, data, config);
  return res.data as T;
};

export { get, post };

export default class HttpHelper {
  /**
   * get 请求
   * @param url 请求链接
   * @param params 参数
   * @param config 配置
   */
  static async get<T = string>(url: string, params?: { [key: string]: any }, config?: AxiosRequestConfig) {
    return get<T>(url, params, config);
  }

  /**
   * post 请求
   * @param url 请求链接
   * @param data 参数
   * @param config 配置
   */
  static async post<T = string>(url: string, data?: { [key: string]: any }, config?: AxiosRequestConfig) {
    return post<T>(url, data, config);
  }
}
