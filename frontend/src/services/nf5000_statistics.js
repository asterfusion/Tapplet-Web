import request from '@/utils/request';
import { async } from 'q';

export async function queryStatistics(params){
    return request('/api/statistics/queryStatistics', {
      method: "POST",
      body: JSON.stringify(params)
    })
}
export async function queryTrendData(params){
    return request('/api/statistics/queryTrend',{
      method: "POST",
      body: JSON.stringify(params)
    })
}
export async function queryGroupName(){
  return request('/api/statistics/queryGroupName')
}