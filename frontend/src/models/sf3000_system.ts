import { Effect } from 'dva';
import { Reducer } from 'redux';
import {saveConfig, resetConfig, changeHostname} from '@/services/sf3000_system';


export interface SystemModelType {
    namespace: 'sf3000_system';
    state: {}
    effects: {
        saveConfig: Effect;
        resetConfig: Effect;
        hostnameChange: Effect;
    }
}

const SystemModel: SystemModelType = {
    namespace: 'sf3000_system', 

    state: {},
    
    effects:{
        *saveConfig(_, {call, put}){
            return yield call(saveConfig)
        },

        *resetConfig(_, {call, put}){
            return yield call(resetConfig)
        },

        *hostnameChange({payload}, {call}){
            return yield call(changeHostname, payload)
        }
    }
}

export default SystemModel;