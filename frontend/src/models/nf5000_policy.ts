import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryIPolicies, queryEPolicies, createIGroups, createEGroups, editIGroups, editEGroups, deleteIGroups, deleteEGroups, addPort, deletePort,
    queryRuleConnect, createRuleGroups, deleteRuleGroups, createRules, deleteRules, getRuleGroupRules,
    deleteAllPolicy, getDefaultRuleInterface } from '@/services/nf5000_policy';


export interface CurrentPolicy {
    groupname?: string | undefined;
    ports?: string[];
    type?: string;
    description?: string;
    id?:number; 
}
export interface GroupModelState{
    currentIPolicy?: CurrentPolicy[];
    currentEPolicy?: CurrentPolicy[];
    currentRuleConnects?: any;
    currentCertainRuleGroup?: any;
    currentPort?: any;
    defaultRuleInterface?: [];
};
export interface PolicyModelType {
    namespace: 'nf5000_policy';
    state: GroupModelState;
    effects: {
        queryIPolicies: Effect;
        queryEPolicies: Effect;
        createIGroup: Effect;
        createEGroup: Effect;
        editIGroup: Effect;
        editEGroup: Effect;
        deleteIGroup: Effect;
        deleteEGroup: Effect;
        addPort: Effect;
        deletePort: Effect;
        queryRuleConnect: Effect;
        createRuleGroup: Effect;
        deleteRuleGroup: Effect;
        getGroupRules: Effect; //获取某个groupname的规则
        createRule: Effect;
        deleteRule: Effect;
        deleteAllPolicy: Effect;
        defaultRuleInterface: Effect;
    };
    reducers: {
        query_ipolicies: Reducer<GroupModelState>;
        query_epolicies: Reducer<GroupModelState>;
        query_ruleConnect: Reducer<GroupModelState>;
        query_certainruleGroup: Reducer<GroupModelState>;
        query_default_rule_interface: Reducer<GroupModelState>;
    };
}

const PolicyModel: PolicyModelType = {
    namespace: 'nf5000_policy',
    state: {
        currentIPolicy: [],
        currentEPolicy: [],
        currentRuleConnects: [], ///policy页关系
        currentCertainRuleGroup: {}, //用于获取某个规则组的规则信息
        defaultRuleInterface: [], //获取默认规则配置信息
    },
    effects: {
        *queryIPolicies(_,{ call, put }){
            const response = yield call(queryIPolicies)
            yield put({
                type: 'query_ipolicies',
                payload: response
            })
        },
        *queryEPolicies(_,{ call, put }){
            const response = yield call(queryEPolicies)
            yield put({
                type: 'query_epolicies',
                payload: response
            })
        },
        *createIGroup({ payload }, { call }){
            return yield call(createIGroups, payload)
        },
        *createEGroup({ payload }, { call }){
            return yield call(createEGroups, payload)
        },
        *editIGroup({ payload }, { call }){
            return yield call(editIGroups, payload)
        },
        *editEGroup({ payload }, { call }){
            return yield call(editEGroups, payload)
        },
        *deleteIGroup({ payload }, { call }){
            return yield call(deleteIGroups, payload)
        },
        *deleteEGroup({ payload }, { call }){
            return yield call(deleteEGroups, payload)
        },
        *addPort({ payload }, { call }){
            return yield call(addPort, payload)
        },
        *deletePort({ payload }, { call }){
            return yield call(deletePort, payload)
        },
        //规则组
        *queryRuleConnect(_, { call, put }){
            const response = yield call(queryRuleConnect)
            yield put({
                type: 'query_ruleConnect',
                payload: response,
            })
        },
        *createRuleGroup({ payload },{ call }){
            return yield call(createRuleGroups, payload)
        },
        *deleteRuleGroup({ payload }, { call }){
            return yield call(deleteRuleGroups, payload)
        },
        *createRule({ payload }, { call }){
            return yield call(createRules, payload)
        },
        *deleteRule({ payload }, { call }){
            return yield call(deleteRules, payload)
        },
        *getGroupRules({payload},{call, put}){
            const response = yield call(getRuleGroupRules, payload)
            yield put({
                type: 'query_certainruleGroup',
                payload: response,
            })
        },
        //导入导出清空
        *deleteAllPolicy(_, {call, put}){
            return yield call(deleteAllPolicy)
        },
        *defaultRuleInterface({payload}, { call, put}){
            const response = yield call(getDefaultRuleInterface, payload)
            yield put({
                type: 'query_default_rule_interface',
                payload: response,
            })
        },
    },
    reducers: {
        query_ipolicies(state, action) {
            return {
                ...state,
                currentIPolicy: action.payload || []
            }
        },
        query_epolicies(state, action) {
            return {
                ...state,
                currentEPolicy: action.payload || []
            }
        },
        query_ruleConnect(state, action) {
            return {
                ...state,
                currentRuleConnects: action.payload || []
            }
        },
        query_certainruleGroup(state, action) {
            return {
                ...state,
                currentCertainRuleGroup: action.payload || []
            }
        },
        query_default_rule_interface(state, action) {
            return {
                ...state,
                defaultRuleInterface: action.payload.data || []
            }
        },
    },
}
export default PolicyModel;