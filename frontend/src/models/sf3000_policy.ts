import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryIPolicies, queryEPolicies, createIGroups, createEGroups, editIGroups, editEGroups, deleteIGroups, deleteEGroups, addPort, deletePort,
    queryDefaultRuleInterface, queryRuleConnect, createRuleGroups, deleteRuleGroups, createRules, deleteRules, getRuleGroupRules,
    queryCopyConnect, setCopy, deleteCopy, deleteAllPolicy, portConfigure, queryPort } from '@/services/sf3000_policy';


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
    currentCopyConnects?: any;
    currentPort?: any;
    defaultRuleInterface?: any;
};
export interface PolicyModelType {
    namespace: 'sf3000_policy';
    state: GroupModelState;
    effects: {
        queryDefaultRuleInterface:Effect;
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
        queryCopyConnect: Effect;
        setCopy: Effect;
        deleteCopy: Effect;
        deleteAllPolicy: Effect;
        ConfigPort: Effect;
        queryPort: Effect;
    };
    reducers: {
        query_ipolicies: Reducer<GroupModelState>;
        query_epolicies: Reducer<GroupModelState>;
        query_ruleConnect: Reducer<GroupModelState>;
        query_certainruleGroup: Reducer<GroupModelState>;
        query_copiyConnect: Reducer<GroupModelState>;
        query_port: Reducer<GroupModelState>;
        query_defaultRuleInterface: Reducer<GroupModelState>;
    };
}

const PolicyModel: PolicyModelType = {
    namespace: 'sf3000_policy',
    state: {
        currentIPolicy: [],
        currentEPolicy: [],
        currentRuleConnects: [],///policy页关系
        currentCertainRuleGroup: {}, //用于获取某个规则组的规则信息
        currentCopyConnects: [],
        defaultRuleInterface: {}
    },
    effects: {
        *queryIPolicies(_,{ call, put }){
            const response = yield call(queryIPolicies)
            console.log(response)
            yield put({
                type: 'query_ipolicies',
                payload: response
            })
        },
        *queryEPolicies(_,{ call, put }){
            const response = yield call(queryEPolicies)
            console.log(response)
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
        *queryDefaultRuleInterface(_,{ call, put }){
            const response =  yield call(queryDefaultRuleInterface)
            yield put({
                type: 'query_defaultRuleInterface',
                payload: response
            })
        },
        *queryRuleConnect(_, { call, put }){
            const response = yield call(queryRuleConnect)
            yield put({
                type: 'query_ruleConnect',
                payload: response,
            })
        },
        *createRuleGroup({ payload },{ call }){
            console.log("qqqqqq")
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
            console.log("我是models ---------------------------------->")
            const response = yield call(getRuleGroupRules, payload)
            yield put({
                type: 'query_certainruleGroup',
                payload: response,
            })
        },
        //复制组
        *queryCopyConnect(_, { call, put }){
            const response = yield call(queryCopyConnect)
            yield put({
                type: 'query_copiyConnect',
                payload: response,
            })
        },
        *setCopy({payload}, { call, put }){
            return yield call(setCopy, payload)
        },
        *deleteCopy({payload}, { call, put }){
            return yield call(deleteCopy, payload)
        },
        //导入导出清空
        *deleteAllPolicy(_, {call, put}){
            return yield call(deleteAllPolicy)
        },
        //配置端口信息
        *ConfigPort({payload}, {call, put}){
            return yield call(portConfigure, payload)
        },
        //获取端口信息
        *queryPort({payload}, { call, put}){
            const response = yield call(queryPort, payload)
            yield put({
                type: 'query_port',
                payload: response,
            })
        },
    },
    reducers: {
        query_ipolicies(state, action) {
            console.log(action.payload)
            return {
                ...state,
                currentIPolicy: action.payload || []
            }
        },
        query_epolicies(state, action) {
            console.log(action.payload)
            return {
                ...state,
                currentEPolicy: action.payload || []
            }
        },
        query_ruleConnect(state, action) {
            console.log(action.payload)
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
        query_copiyConnect(state, action) {
            console.log(action.payload)
            return {
                ...state,
                currentCopyConnects: action.payload || []
            }
        },
        query_port(state, action) {
            return {
                ...state,
                currentPort: action.payload || []
            }
        },
        query_defaultRuleInterface(state, action) {
            console.log(action.payload.data)
            return {
                ...state,
                defaultRuleInterface: action.payload.data || {}
            }
        }
    },
}
export default PolicyModel;