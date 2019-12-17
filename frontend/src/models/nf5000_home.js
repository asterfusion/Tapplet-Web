import {getHomeWaringLog,queryUtilization, totalThrought, totalThroughout, systemInformation, systemStat, portInformation, 
        sysTime, getsysTime, getPortNumber} from '@/services/nf5000_home';

export default {
    namespace: 'nf5000_home',

    state:{
        currentUtilization:{},
        currentThrought: [],
        currentInformation: {},
        currentPortinformation: {},
        currentStatus: [],
        currentSystime: "",
        currentPortNumber: "",
        currentWaringData:[]
    },

    effects:{
        *fetchUtilization(_,{call,put}){
            const response = yield call(queryUtilization);
            yield put({
                type: 'saveUtilization',
                payload:response,
            });
        },

        *fetchTotalthrought(_,{call,put}){
            const response = yield call(totalThroughout);
            yield put({
                type: 'saveTotalthrought',
                payload: response,
            });
        },

        *fetchSysteminformation(_,{call,put}){
            const response = yield call(systemInformation);
            yield put({
                type: 'saveSysteminformation',
                payload: response,
            });
        },

        *fetchPortinformation(_,{call,put}){
            const response = yield call(portInformation);
            yield put({
                type: 'savePortinformation',
                payload: response,
            });
        },

        *fetchStatus(_,{call,put}){
            const response = yield call(systemStat);
            yield put({
                type: 'saveStatus',
                payload: response,
            });
        },

        *fetchTime(_, {call,put}){
            const response = yield call(getsysTime);
            yield put({
                type: 'saveTime',
                payload:response,
            });
        },

        *fetchPortNumber(_, {call,put}){
            const response = yield call(getPortNumber);
            yield put({
                type: 'savePortNumber',
                payload: response,
            });
        },

        *configureTime({payload},{call}){
            return yield call(sysTime, payload)
        },

        *getHomeWaringLog({ payload }, { call, put }) {
            const response = yield call(getHomeWaringLog);
            yield put({
                type: 'get_homeWaringLog',
                payload:response,
            });
          },
    },

    reducers:{
        saveUtilization(state, action){
            return {
                ...state,
                currentUtilization: action.payload.data || [],
            };
        },

        saveTotalthrought(state,action){
            return {
                ...state,
                currentThrought: action.payload || [],
            };
        },

        saveSysteminformation(state, action){
            return {
                ...state,
                currentInformation: action.payload.data || [],
            }; 
        },

        savePortinformation(state, action){
          
            return {
                ...state,
                currentPortinformation: action.payload.data || [],
            };
        },

        saveStatus(state, action){
            return {
                ...state,
                currentStatus: action.payload.data || [],
            };
        },

        saveTime(state, action){
            return {
                ...state,
                currentSystime: action.payload.data || 0,
            }
        },

        savePortNumber(state, action){
            return {
                ...state,
                currentPortNumber: action.payload.data || [],
            }
        },

        get_homeWaringLog(state, action){
            return {
                ...state,
                currentWaringData: action.payload.data||[],
            };
        },
    },
};