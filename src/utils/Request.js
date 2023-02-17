import axios  from "axios";
import Message from "./Message";
import { ElLoading } from "element-plus";
import router from '@/router'
import store from "@/store";


const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'

const instance = axios.create({
    baseURL:'/api',
    timeout:10*1000
})

// 请求前过滤器
let loading = null;
instance.interceptors.request.use((config)=>{
    if(config.showLoading){
        loading = ElLoading.service({
            lock:true,
            text:"正在加载中...",
            background:"rgba(0,0,0,0.7)"
        });
    }
    return config;
},(error)=>{
    if(error.config.showLoading && loading){
        loading.close();
    }
    Message.error("请求发送失败")
    return Promise.reject("请求发送失败")
});

// 请求后过滤器
instance.interceptors.response.use(
    (response) => {
        const { showLoading, errorCallback, showError = true } = response.config;
        if (showLoading && loading) {
            loading.close()
        }
        const responseData = response.data;
        //正常请求
        if (responseData.code == 200) {
            return responseData;
        } else if (responseData.code == 901) {
            //登录超时
            //超时的时候，会更新状态，当我们发请求得到901的时候，才会去弹出登录框，设置用户信息为null
            store.commit("showLogin",true)
            store.commit("updateLoginUserInfo",null)
            return Promise.reject({ showError: true, msg: "登录超时" });
        } else {
            //其他错误
            if (errorCallback) {
                errorCallback(responseData.info);
            }
            return Promise.reject({ showError: showError, msg: responseData.info });
        }
    },
    (error) => {
        if (error.config.showLoading && loading) {
            loading.close();
        }
        return Promise.reject({ showError: true, msg: "网络异常" })
    }
);


const request = (config) => {
    const { url, params, dataType, showLoading = true } = config;
    let contentType = contentTypeForm;
    let formData = new FormData();// 创建form对象
    for (let key in params) {
        formData.append(key, params[key] == undefined ? "" : params[key]);
    }
    if (dataType != null && dataType == 'json') {
        contentType = contentTypeJson;
    }
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
    }
    return instance.post(url, formData, {
        headers: headers,
        showLoading: showLoading,
        errorCallback: config.errorCallback,
        showError: config.showError
    }).catch(error => {
        console.log(error);
        if (error.showError) {
            Message.error(error.msg);
        }
        return null;
    });
};
export default request;