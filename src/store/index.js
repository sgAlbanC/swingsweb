import { createStore } from "vuex";



export default createStore({
    state:{
        loginUserInfo : null,
    },
        
    getters:{
        getLoginUserInfo:(state)=>{
            return state.loginUserInfo
        }
    },
    // 向外暴露的方法 updateLoginUserInfo
    mutations:{
        updateLoginUserInfo(state,value){
            state.loginUserInfo = value
        }
    },

    actions:{},
    modules:{}

})