import { createApp } from 'vue'
import '@/assets/reset.css'
import App from './App.vue'
import router from './router'
import VueCookies  from 'vue-cookies'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/assets/icon/iconfont.css'
// 全局组件
import Dialog from "@/components/Dialog.vue"

// 全局方法
import Verify from './utils/Verify'
import Message from './utils/Message'
import Request from './utils/Request'
const app = createApp(App)

app.component("Dialog",Dialog)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.globalInfo = {
    bodywidth:1280
}
app.config.globalProperties.Verify = Verify
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request

app.mount('#app')
