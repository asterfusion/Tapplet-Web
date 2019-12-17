import request from '@/utils/request';
import { async } from 'q';

export async function saveConfig(){
    return request('/api/system/SaveConfig')
}

export async function resetConfig(){
    return request('/api/system/ResetConfig')
}

export async function changeHostname(params){
    return request('/api/common/HostnameConfig', {
        method: 'POST',
        body: JSON.stringify(params)
    })
}