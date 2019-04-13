/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';

const codeMessage = {
  400: '参数有误',
  401: '授权失败',
  403: '禁止访问',
  404: '访问无效',
  406: '请求错误',
  500: '服务器错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {}, data = {} } = error;
  const errorMessage = codeMessage[response.status];
  const errorDetails = data.meta.details;
  const { status, url } = response;

  notification.error({
    message: errorMessage,
    description: `${errorDetails}->${url}`,
  });

  if (status === 401) {
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return;
  }
  // environment should not be used
  if (status === 403) {
    router.push('/exception/403');
    return;
  }
  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
    return;
  }
  if (status >= 404 && status < 422) {
    router.push('/exception/404');
  }
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

export default request;
