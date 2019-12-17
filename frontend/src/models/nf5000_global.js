import {setVppConfig, getVppConfig} from '@/services/nf5000_global';

export default {
    namespace: 'nf5000_global',

    state:{
        currentVppstatus: ''
    },

    effects:{
        *fetchVppstatus(_,{call,put}){
            const response = yield call(getVppConfig);
            yield put({
                type: 'saveVppstatus',
                payload:response,
            });
        },

        *setVppstatus({payload},{call}){
            return yield call(setVppConfig, payload)
        },
    },

    reducers:{
        saveVppstatus(state, action){
            return {
                ...state,
                currentVppstatus: action.payload.data || "",
            };
        },
    },
};