import request from '@/utils/request';
import { async } from 'q';

export async function queryUtilization(){
    return request('/api/home/SystemUsing');
}

export async function totalThroughout(){
    return request('/api/home/StatusTrend')
}

export async function systemInformation(){
    return request('/api/home/SystemInfo')
}

export async function systemStat(){
    return request('/api/home/StatList')
}

export async function portInformation(){
    return request('/api/home/AllStatus')
}

export async function sysTime(params){
    return request('/api/policy/SystemTime', {
        method: 'POST',
        body: JSON.stringify(params)
    })
}

export async function getsysTime(params){
    return request('/api/policy/SystemTime')
}

export async function getPortNumber(params){
    return request('/api/home/GetInterfacesNum')
}

// 获取操作日志数据
export async function getHomeWaringLog(params) {
    return request(`/api/log/getHomeWaringLog`);
  }
  