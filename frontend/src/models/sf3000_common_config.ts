import { Effect } from 'dva';
import { Reducer } from 'redux';
import { setCommonConfig, getCommonConfig } from '@/services/sf3000_common_config';


export interface CommonSettingModelState {
  returnDeduplicationData?: any,
  returnDedup?: any,
  returnKeyWordData?: any,
  returnIpReassemblyData?: any,
  returnTcpReassemblyData?: any,
}

export interface CommonSettingModelType {
  namespace: 'sf3000_common_config';
  state: CommonSettingModelState;
  effects: {
    getCommonConfig: Effect;
    setCommonConfig: Effect;
  };
  reducers: {
    //get_commonConfig: Reducer<CommonSettingModelState>;
    get_deduplicationConfig: Reducer<CommonSettingModelState>;
    get_keywordConfig: Reducer<CommonSettingModelState>;
    get_ipReassemblyConfig: Reducer<CommonSettingModelState>;
    get_tcpReassemblyConfig: Reducer<CommonSettingModelState>;
  }
}

const CommonSettingModel: CommonSettingModelType = {
  namespace: 'sf3000_common_config',
  state: {
    returnDeduplicationData: [],
    returnDedup: [],
    returnKeyWordData: [],
    returnIpReassemblyData: [],
    returnTcpReassemblyData: [],
  },

  effects: {
    *getCommonConfig({ payload }, { call, put }) {
      const typeString = payload == 'deduplication' ? 'get_deduplicationConfig' : (
        payload == 'keyword' ? 'get_keywordConfig' : (payload == 'ip_reassembly'
          ? 'get_ipReassemblyConfig' : 'get_tcpReassemblyConfig'))
      const response = yield call(getCommonConfig, payload);
      yield put({
        type: typeString,
        payload: response,
      });
    },
    *setCommonConfig({ payload }, { call, put }) {
      const response = yield call(setCommonConfig, payload);
      return response;
    },
  },
  reducers: {
    // get_commonConfig(state, action) {
    //   return {
    //     ...state,
    //     returnComData: action.payload || [],
    //   };
    // },
    get_deduplicationConfig(state, action) {
      return {
        ...state,
        returnDeduplicationData: action.payload || [],
      };
    },
    get_keywordConfig(state, action) {
      return {
        ...state,
        returnKeyWordData: action.payload || [],
      };
    },
    get_ipReassemblyConfig(state, action) {
      return {
        ...state,
        returnIpReassemblyData: action.payload || [],
      };
    },
    get_tcpReassemblyConfig(state, action) {
      return {
        ...state,
        returnTcpReassemblyData: action.payload.data || [],
      };
    },
  }
}

export default CommonSettingModel;