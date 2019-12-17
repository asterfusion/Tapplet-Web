import {saveConfig, resetConfig, changeHostname} from '@/services/nf5000_system';

export default {
    namespace: 'nf5000_system', 

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