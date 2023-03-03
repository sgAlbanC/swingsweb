<template>
    <div class="header-content" :style="{width:proxy.globalInfo.bodywidth + 'px' }">
        <router-link to="/" class="logo">
            <span v-for="item in logoInfo" :style="{color:item.color}" :key="item">{{ item.letter }}</span>
        </router-link>
        <div class="menu-panel">
            <router-link :class="['menu-item',activePboardId == undefined ? 'active':'']" to="/">首页</router-link>
            <template v-for="item in boardList" :key="item">
                <el-popover palcement="bottom-start"
                    :width=200
                    trigger="hover"
                    v-if="item.children.length>0"
                >
                    <template #reference>
                        <span :class="['menu-item',item.boardId == activePboardId ? 'active' : '']" @click="boardClickHandler(item)">{{ item.boardName }}</span>
                    </template>
                    <div class="sub-board-list" >
                        <span :class="['sub-board',subBoard.boardId==activeBoardId?'active':'']" v-for="subBoard in item.children" @click="subBoardClickHandler(subBoard)" :key="subBoard">
                        {{ subBoard.boardName }}</span>
                    </div>
                </el-popover>
                <span  :class="['menu-item',item.boardId == activePboardId ? 'active' : '']"  v-else @click="boardClickHandler(item)">{{ item.boardName }}</span>
            </template>

        </div>
        <div class="userinfo-panel">
            <el-button type="primary" @click="newPost">
                发帖 
                <span class="iconfont icon-add"></span>
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
                                <el-dropdown-item @click="logout">退出</el-dropdown-item>
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
import { useRouter,useRoute } from 'vue-router';
import {useStore} from 'vuex'

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance();
const store = useStore()
const api = {
    getUserInfo:'/getUserInfo/',
    loadBoard:'/board/loadBoard/',
    logout: "/logout",

}

// 登录注册，展示Dialog
const loginRegisterRef = ref()
const loginAndRegister = (type)=>{
    loginRegisterRef.value.showPanel(type)
};

onMounted(()=>{
    getUserInfo();
    loadBoard();
})

// 获取板块信息
const boardList = ref([]);
const loadBoard = async ()=>{
    let result = await proxy.Request({
        url:api.loadBoard
    })
    if(!result){
        return;
    }
    boardList.value = result.data
    store.commit('saveBoardList',result.data)
}


// 发布文章
const newPost = () =>{
    if(!store.getters.getLoginUserInfo){
        store.commit("showLogin",true)
        return;
    }
    router.push(`/newPost`)
}





//退出
const logout = async () => {
    let result = await proxy.Request({
      url: api.logout,
    });
    if (!result) {
      return;
    }
    store.commit("updateLoginUserInfo", null);
};



// 获取用户信息
// 这里获取的东西不需要穿参，是服务器保存在session的东西
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
    // 这里在状态管理器中定义的变量loginUserInfo的oldVal是为null的，session里面保存的有我们用户的信息
    // 前端看不到，后端保存得有，半个小时session会超时。这样比如说明天登录，界面会跳到登录注册按钮。
    // 返回901就是登录超时。
    (newVal,oldVal)=>{
        if(newVal !=undefined &&newVal != null){
            userInfo.value = newVal      
        }else{
            userInfo.value = {}
        }
    },
    {immediate:true,deep:true}
)
// 监听是否展示登录框
watch(
    // 这里是获取到showLogin，如果有值（请求超时返回901的时候会赋值），也会弹出登录框
    () => store.state.showLogin,
    (newVal,oldVal)=>{
        if(newVal){
            loginAndRegister(1);
        }
    }

)

//板块点击
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
};

//二级板块
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
};

// 当前选中的一级板块
const activePboardId = ref(0);
watch(()=>store.state.activePboardId,
    (newVal,oldVal)=>{
        if(newVal!=0){
             activePboardId.value = newVal
        } 
    },
    {immediate:true,deep:true}
)
// 当前选中的二级板块
const activeBoardId = ref(0);
watch(()=>store.state.activeBoardId,
    (newVal,oldVal)=>{
        activeBoardId.value = newVal

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
    .logo{
        margin-right: 10px;
    }
    .menu-panel{
        flex: 1;
        font-size: 16px;
        
        .menu-item{
            margin-left: 10px;
            color: #1b1b1b;
            cursor: pointer;
        }
        .menu-item:hover{
            color: rgb(18, 149, 218);
        }
        .active{
            color:rgb(18, 149, 218);
        }
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
.sub-board-list{
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    .sub-board{
        color: rgb(102, 172, 209);
        margin-right: 10px;
        margin-top: 10px;
        padding: 2px 12px;
        border-radius: 50px;
        background-color: aliceblue;
    }
    .active{
        background-color:rgb(18, 149, 218);
        color: #fff;
    }
    
}
</style>