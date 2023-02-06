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
            <el-button-group>
                <el-button type="info" plain @click="loginAndRegister(1)">登陆</el-button>
                <el-button type="info" plain @click="loginAndRegister(0)">注册</el-button>
            </el-button-group>
        </div>

        <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
    </div>

</template>
  
<script setup>

import LoginAndRegister from '@/views/LoginAndRegister/index.vue'
import { ref,getCurrentInstance } from 'vue'

const {proxy} = getCurrentInstance();

const loginRegisterRef = ref()
const loginAndRegister = (type)=>{
    loginRegisterRef.value.showPanel(type)
}
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
        .el-button:nth-child(2){
            margin-left: 5px;        
            span{
                margin-left: 3px;
            }
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