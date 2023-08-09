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
import NoData from "@/components/NoData.vue"
import ImageViewer from "@/components/ImageViewer.vue"
import EditorMarkdown from "@/components/EditorMarkdown.vue"
import EditorHtml from "@/components/EditorHtml.vue"
import CoverUpload from "@/components/CoverUpload.vue"
import AttachmentSelector from "@/components/AttachmentSelector.vue"

// 全局方法
import Verify from './utils/Verify'
import Message from './utils/Message'
import Request from './utils/Request'
import Utils from './utils/Utils'
import Confirm from './utils/Confirm'

const app = createApp(App) // 创建应用实例

// 注册全局组件（将组件挂载到全局）
app.component("Dialog",Dialog)
app.component("Avatar",Avatar)
app.component("Cover",Cover)
app.component("DataList",DataList)
app.component("NoData",NoData)
app.component("ImageViewer",ImageViewer)
app.component("EditorMarkdown",EditorMarkdown)
app.component("EditorHtml",EditorHtml)
app.component("CoverUpload",CoverUpload)
app.component("AttachmentSelector",AttachmentSelector)

app.use(store)
app.use(router)
app.use(ElementPlus)

// 应用实例会暴露一个.config对象允许我们配置一些应用级的选项
// 这里是将一些方法当作全局属性，将方法变成全局的
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.globalInfo = {
    bodywidth:1280,
    avatarUrl:'/api/file/getAvatar/',
    imageUrl:'/api/file/getImage/'
}
app.config.globalProperties.Verify = Verify
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request
app.config.globalProperties.Utils = Utils
app.config.globalProperties.Confirm = Confirm

app.mount('#app') // 挂载应用实例到 id='app'上
