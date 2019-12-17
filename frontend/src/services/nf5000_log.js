import request from '@/utils/request';
// eslint-disable-next-line import/no-extraneous-dependencies
import { async } from 'q';

// eslint-disable-next-line spaced-comment
/****************Common Config*************** */

// 获取操作日志数据
export async function getSysLog(params) {
  return request(`/api/log/getSysLog?${params}`);
}

// 获取告警日志数据
export async function getWaringLog(params) {
  return request(`/api/log/getWaringLog`);
}

// 获取告警日志数据
export async function getHomeWaringLog(params) {
  return request(`/api/log/getWaringLog`);
}
