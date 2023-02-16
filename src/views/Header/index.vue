<template>
    <div class="header-content" :style="{width:proxy.globalInfo.bodywidth + 'px' }">
        <router-link to="/" class="logo">
            <span v-for="item in logoInfo" :style="{color:item.color}">{{ item.letter }}</span>
        </router-link>
        <div class="menu-panel"></div>
        <div class="userinfo-panel">
            <el-button type="primary">
                发帖 
                <span class="iconfont icon-add "></span>
            </el-button>
            <el-button type="primary">
                搜索
                <span class="iconfont icon-search "></span>
            </el-button>
            <!-- 显示用户信息 -->
            <template v-if="userInfo.userId">
                <div class="message-info">
                    <el-dropdown>
                        <el-badge :value="99" class="item">
                            <div class="iconfont icon-message"></div>
                        </el-badge>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>回复我的</el-dropdown-item>
                                <el-dropdown-item>赞了我的文章</el-dropdown-item>
                                <el-dropdown-item>下载了我的附件</el-dropdown-item>
                                <el-dropdown-item>赞了我的评论</el-dropdown-item>
                                <el-dropdown-item>系统消息</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="user-info">
                    <el-dropdown>
                    <Avatar :userId="userInfo.userId"></Avatar>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>我的主页</el-dropdown-item>
                                <el-dropdown-item>退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    
                </div>
            </template>
            <!-- 显示登录注册按钮 -->
            <el-button-group v-else>
                <el-button type="info" plain @click="loginAndRegister(1)">登陆</el-button>
                <el-button type="info" plain @click="loginAndRegister(0)">注册</el-button>
            </el-button-group>
        </div>

        <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
    </div>

</template>
  
<script setup>

import LoginAndRegister from '@/views/LoginAndRegister/index.vue'
import { ref,getCurrentInstance, onMounted , watch} from 'vue'
import {useStore} from 'vuex'

const {proxy} = getCurrentInstance();
const store = useStore()
const api = {
    getUserInfo:'/getUserInfo/'
}

// 登录注册，展示Dialog
const loginRegisterRef = ref()
const loginAndRegister = (type)=>{
    loginRegisterRef.value.showPanel(type)
};

onMounted(()=>{
    getUserInfo();
})

// 获取用户信息
const getUserInfo = async () =>{
    let result = await proxy.Request({
        url:api.getUserInfo,
    })
    if(!result){
        return;
    }
    store.commit("updateLoginUserInfo",result.data)
}


// 监听 登录用户信息
const userInfo = ref({})
watch(
    () => store.state.loginUserInfo,
    (newVal,oldVal)=>{
        if(newVal !=undefined &&newVal != null){
            userInfo.value = newVal
        }else{
            userInfo.value = {}
        }
    },
    {immediate:true,deep:true}
)


// logo的设置
const logoInfo = ref([
    {
        letter:'S',
        color:'#1295DA'
    },
    {
        letter:'w',
        color:'#66ACD1'
    },
    {
        letter:'i',
        color:'#73A9CB'
    },
    {
        letter:'n',
        color:'#A7C6D6'
    },
    {
        letter:'g',
        color:'#B1CED8'
    },
    {
        letter:'s',
        color:'#B8D4DF'
    }
    
])

</script>

<style scoped lang="less">
.header-content{
    height: 60px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    font-size: 30px;
    .menu-panel{
        flex: 1;
    }
    .userinfo-panel{
        width: 300px;
        display: flex;
        align-items: center;
        .el-button:nth-child(2){
            margin-left: 5px;        
            span{
                margin-left: 3px;
            }
        }
        .message-info{
            margin-top: 5px;
            margin-left: 15px;
            margin-right: 25px;
            cursor: pointer;
            .icon-message {
                font-size: 22px;
                color: rgb(147, 147, 147);
            }
        }
        .user-info{
            cursor: pointer;
        }
        .el-button-group{
            margin-left: 10px;
            .el-button:nth-child(2){
                margin-left: 0px;  
            }
        }
    }
}
</style>