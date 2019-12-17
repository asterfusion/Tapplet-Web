import { stringify } from 'qs';
import request from '@/utils/request';


export async function fetchCurrent() {
  return request('/api/UserLogin');
}
export async function login(params) {
    return request('/api/UserLogin', {
      method: 'POST',
      body: JSON.stringify(params),
    },);
}
export async function logout() {
  return request('/api/Logout');
}