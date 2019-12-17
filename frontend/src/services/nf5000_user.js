import request from '@/utils/request';
import { async } from 'q';
/****************Users****************/
export async function query() {
  return request('/api/UserList');
}
export async function queryPermiss() {
  return request('/api/PermissGet');
}
export async function queryNotices() {
  return request('/api/notices');
}
export async function createUser(params) {
  return request('/api/UserInsert', {
    method: "POST",
    body: JSON.stringify(params)
  });
}
export async function editUser(params) {
  return request('/api/UserUpdate', {
    method: "POST",
    body: JSON.stringify(params)
  });
}
export async function deleteUser(params) {
  return request('/api/UserDelete', {
    method: "POST",
    body: JSON.stringify(params)
  });
}
/****************Roles****************/
export async function queryRoles() {
  return request('/api/RoleList');
}
export async function createRole(params) {
  return request('/api/PermissInsert', {
    method: "POST",
    body: JSON.stringify(params)
  });
}
export async function editRole(params) {
  return request('/api/PermissUpdate', {
    method: "POST",
    body: JSON.stringify(params)
  })
}
export async function deleteRole(params) {
  return request('/api/PermissDelete', {
    method: "POST",
    body: JSON.stringify(params)
  })
}
export async function queryPermissions(params) {
  return request('/api/PermissList?rolename='+encodeURIComponent(params.rolename))
}