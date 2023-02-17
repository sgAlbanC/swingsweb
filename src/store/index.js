import { createStore } from "vuex";



export default createStore({
    state:{
        // 用户信息
        loginUserInfo : null,
        // 是否展示登录，这里是当我们未登录在浏览页面，但又点赞或评论时，我们弹出登录框
        showLogin:false
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
        },
        showLogin(state,value){
            state.showLogin = value
        }
    },

    actions:{},
    modules:{}

})