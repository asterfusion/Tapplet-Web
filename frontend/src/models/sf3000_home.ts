import { Effect } from 'dva';
import { Reducer } from 'redux';
import {getHomeWaringLog,queryUtilization, totalThroughout, systemInformation, systemStat, portInformation, sysTime, getsysTime} from '@/services/sf3000_home';

export interface HomeModelState {
    currentUtilization?: {},
    currentThrought?: [],
    currentInformation?: {},
    currentPortinformation?: {},
    currentStatus?: [],
    currentSystime?: string,
    currentWaringData?: []
}

export interface HomeModelType {
    namespace: 'sf3000_home';
    state: HomeModelState;
    effects: {
        fetchUtilization: Effect;
        fetchTotalthrought: Effect;
        fetchSysteminformation: Effect;
        fetchPortinformation: Effect;
        fetchStatus: Effect;
        fetchTime: Effect;
        configureTime: Effect;
        getHomeWaringLog: Effect;
    };
    reducers: {
        saveUtilization: Reducer<HomeModelState>;
        saveTotalthrought: Reducer<HomeModelState>;
        saveSysteminformation: Reducer<HomeModelState>;
        savePortinformation: Reducer<HomeModelState>;
        saveStatus: Reducer<HomeModelState>;
        saveTime: Reducer<HomeModelState>;
        get_homeWaringLog: Reducer<HomeModelState>;
    }
}

const HomeModel: HomeModelType = {
    namespace: 'sf3000_home',

    state:{
        currentUtilization:{},
        currentThrought: [],
        currentInformation: {},
        currentPortinformation: {},
        currentStatus: [],
        currentSystime: "",
        currentWaringData:[]
    },

    effects:{
        *fetchUtilization(_,{call,put}){
            console.log("model占用率------------------------>")
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
            console.log("reducers 占用率------------------>")
            return {
                ...state,
                currentUtilization: action.payload,
            };
        },

        saveTotalthrought(state,action){
            return {
                ...state,
                currentThrought: action.payload,
            };
        },

        saveSysteminformation(state, action){
            return {
                ...state,
                currentInformation: action.payload,
            };
        },

        savePortinformation(state, action){
            console.log("models--------------portinformation---------------->",action.payload)
            return {
                ...state,
                currentPortinformation: action.payload,
            };
        },

        saveStatus(state, action){
            return {
                ...state,
                currentStatus: action.payload,
            };
        },

        saveTime(state, action){
            return {
                ...state,
                currentSystime: action.payload.data || 0,
            }
        },
        get_homeWaringLog(state, action){
            return {
                ...state,
                currentWaringData: action.payload,
            };
        },
    },
};

export default HomeModel;