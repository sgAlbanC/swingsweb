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

const app = createApp(App)

app.component("Dialog",Dialog)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.globalInfo = {
    bodywidth:1280
}

app.mount('#app')
