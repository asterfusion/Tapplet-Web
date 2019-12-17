/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { formatMessage } from 'umi/locale';

interface ResponseError<D = any> extends Error {
  name: string;
  data: D;
  response: Response;
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',//
  401: '用户没有权限（令牌、用户名、密码错误）。',//没有权限
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。', //用户名存在
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
// const errorHandler = (error: ResponseError) => {
//   const { response = {} as Response } = error;
//   const errortext = codeMessage[response.status] || response.statusText;
//   const { status, url } = response;
//   notification.error({
//     message: `请求错误 ${status}: ${url}`,
//     description: errortext,
//   });

// };
const errorHandler = (error: ResponseError) => {
  const { response = {} as Response } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;
  if (status == 500) {
      notification.error({
          message:formatMessage({'id': 'user-login.request.error'}) ` ${status}: ${url}`,
          description: errortext,
      });
  }
  if (status == 401) {
      notification.error({
          message: formatMessage({'id': 'user-login.no.rights'})` ${status}: ${url}`,
          description: errortext,
      });
  }
  if (status == 4011) {
      notification.error({
          message: formatMessage({'id': 'user-login.login.valid'}) ` ${status}: ${url}`,
          description: errortext,
      });
  }

};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});


// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {

  let lang = localStorage.getItem("lang");
  if (lang) {
    const headers = {
      'lang': lang
    };
    return (
      {
        url: url,
        options: { ...options, headers: headers },
      }
    );
  } else {
    return (
      {
        url: url,
        options: { ...options },
      }
    );
  }

})

// response拦截器, 处理response
// request.interceptors.response.use((response, options) => {
//   let token = response.headers.get("x-auth-token");
//   if (token) {
//     localStorage.setItem("x-auth-token", token);
//   }
//   return response;
// });
//response拦截器, 处理response
request.interceptors.response.use(async (response, options) => {
  let token = response.headers.get("x-auth-token");
  let data = await response.clone().json()
  if (data && data.status_code == 401) {
      notification.error({
          message: formatMessage({ 'id': 'app.system.msg.no.right' }),
          description: response.url,
      });
  }
  if (data && data.status_code == 4011) {
      window.location.href = '#/auth/login';
  }
  if (data && (data.status_code == 500 || data.status_code === 502)) {
      notification.error({
          message: formatMessage({ 'id': 'app.system.msg.no.right' }),
          description: response.url,
      });
  }
  if (token) {
      localStorage.setItem("x-auth-token", token);
  }
  return response;
});

export default request;
