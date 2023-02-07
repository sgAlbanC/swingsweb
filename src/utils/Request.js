import axios  from "axios";
import Message from "./Message";
import { ElLoading } from "element-plus";

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
        })
    }
},(error)=>{
    if(config.showLoading && loading){
        loading.close();
    }
    Message.error("请求发送失败")
    return Promise.reject("请求发送失败")
});

// 请求后过滤器
instance.interceptors.response.use();

const request = (config) => {

}

export default request;