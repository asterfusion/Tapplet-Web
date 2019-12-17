import request from '@/utils/request';
import { async } from 'q';

export async function queryIPolicies() {
    return request('/api/policy/ListIngroup');
}
export async function queryEPolicies() {
    return request('/api/policy/ListOutgroup');
}
export async function createIGroups(params) {
    return request('/api/policy/InsertIngroup', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}
export async function createEGroups(params) {
    return request('/api/policy/InsertOutgroup', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}
export async function editIGroups(params) {
    return request('/api/policy/UpdateIngroup', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}
export async function editEGroups(params) {
    return request('/api/policy/UpdateOutgroup', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}
export async function deleteIGroups(params) {
    return request('/api/policy/DeleteIngroup', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}
export async function deleteEGroups(params) {
    return request('/api/policy/DeleteOutgroup', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}
export async function addPort(params) {
    return request('/api/policy/UpdatePort', {
        method: 'POST',
        body: JSON.stringify(params)
    })
}
export async function deletePort(params) {
    return request('/api/policy/DeletePort', {
        method: 'POST',
        body: JSON.stringify(params)
    })
}
//规则组
export async function queryDefaultRuleInterface() {
    return request('/api/policy/getDefaultRuleInterface')
}
export async function queryRuleConnect() {
    return request('/api/policy/ListRuleGroup');
}
export async function createRuleGroups(params) {
    console.log("zzzz",params)
    return request('/api/policy/InsertRuleGroup', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}
export async function deleteRuleGroups(params) {
    return request('/api/policy/DeleteRuleGroup', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}

export async function createRules(params) {
    return request('/api/policy/InsertRule',{
        method: 'POST',
        body: JSON.stringify(params)
    });
}

export async function deleteRules(params) {
    return request('/api/policy/DeleteRule'),{
        method: 'POST',
        body: JSON.stringify(params)
    };
}

//用于获取具体规则组名中的规则
export async function getRuleGroupRules(params) {
    return request('/api/policy/ListRuleGroup', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}

//复制组
export async function queryCopyConnect() {
    return request('/api/policy/ListCopygroup')
}
export async function setCopy(params){
    return request('/api/policy/SetCopygroup', {
        method: 'POST',
        body: JSON.stringify(params)
    })
}
export async function deleteCopy(params) {
    return request('/api/policy/DeleteCopygroup',{
        method: 'POST',
        body: JSON.stringify(params)
    })
}
//清空
export async function deleteAllPolicy() {
    return request('/api/policy/ResetPolicy')
}

//端口配置
export async function portConfigure(params) {
    return request('/api/port/ListPort', {
        method: 'POST',
        body: JSON.stringify(params)
    })
}

export async function queryPort(params){
    return request('/api/port/ListPort?name=X' + encodeURIComponent(params))
}