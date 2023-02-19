import { createApp } from 'vue'
import '@/assets/reset.css'
import App from './App.vue'
import router from './router'
import VueCookies  from 'vue-cookies'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/assets/icon/iconfont.css'
import store from './store'


// 全局组件
import Dialog from "@/components/Dialog.vue"
import Avatar from "@/components/Avatar.vue"
import Cover from "@/components/Cover.vue"
import DataList from "@/components/DataList.vue"
// 全局方法
import Verify from './utils/Verify'
import Message from './utils/Message'
import Request from './utils/Request'
const app = createApp(App)

app.component("Dialog",Dialog)
app.component("Avatar",Avatar)
app.component("Cover",Cover)
app.component("DataList",DataList)


app.use(store)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.globalInfo = {
    bodywidth:1280,
    avatarUrl:'/api/file/getAvatar/',
    imageUrl:'/api/file/getImage/'
}
app.config.globalProperties.Verify = Verify
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request

app.mount('#app')
