import request from '@/utils/request';
import { async } from 'q';

export async function setVppConfig(params){
    return request('/api/common/VppConfig', {
        method: 'POST',
        body: JSON.stringify(params)
    })
}

export async function getVppConfig(){
    return request('/api/common/VppConfig')
}
