import request from '@/utils/request';
import { async } from 'q';

// eslint-disable-next-line spaced-comment
/****************Common Config*************** */
//设置common config 参数
export async function setCommonConfig(params) {
  return request('/api/common/CommonConfig', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
//获取common config参数
export async function getCommonConfig(params) {
  return request('/api/common/CommonConfig?name=' + encodeURIComponent(params));
}
