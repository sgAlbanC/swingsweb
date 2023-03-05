<template>
   <div class="ucenter" :style="{width:proxy.globalInfo.bodywidth + 'px'}">
      <div class="user-banner">
         <router-link to='/' class="a-link">首页</router-link>
         <span class="iconfont icon-right"></span>
         <span>个人中心</span>
      </div>
      <div class="ucenter-panel">
         <div class="user-side">
            <div class="changeInfo" v-if="userId==currentUserInfo.userId" @click="updateUserInfo">修改信息</div>
            <div class="avatar-panel">
               <div class="avatar-inner">
                  <Avatar :width="120" :userId="userId"></Avatar>
               </div>
               <div class="nick-name">
                  <span>{{ userInfo.nickName }}</span>
                  <span v-if="userInfo.sex==0" class="iconfont icon-woman"></span>
                  <span v-if="userInfo.sex==1" class="iconfont icon-man"></span>
               </div>
            </div>
            <div class="desc" v-if="userInfo.personDescription">
                  {{ userInfo.personDescription }}
            </div>
            <!-- <el-divider></el-divider> -->

            <div class="user-extend-panel">
               <div class="info-item">
                  <div class="label iconfont icon-integral">积分</div>
                  <div class="value checkable" v-if="userId==currentUserInfo.userId" @click="checkIntegral">
                     {{ userInfo.currentIntegral}}
                  </div>
                  <div class="value" v-else>{{ userInfo.currentIntegral }}</div>
               </div>
               <div class="info-item">
                  <div class="label iconfont icon-like">获赞</div>
                  <div class="value">{{ userInfo.likeCount }}</div>
               </div>
               <div class="info-item">
                  <div class="label iconfont icon-post">发帖</div>
                  <div class="value">{{ userInfo.postCount }}</div>
               </div>
               <div class="info-item">
                  <div class="label iconfont icon-register">加入</div>
                  <div class="value">{{ userInfo.joinTime }}</div>
               </div>
               <div class="info-item">
                  <div class="label iconfont icon-login">最后登录</div>
                  <div class="value">{{ userInfo.lastLoginTime }}</div>
               </div>
            </div>
            
         </div>
         <div class="article-side">
            <div class="article-panel">
            <el-tabs :model-value="activeTabName" @tab-change="changeTab">
               <el-tab-pane label="发帖" :name="0"></el-tab-pane>
               <el-tab-pane label="评论" :name="1"></el-tab-pane>
               <el-tab-pane label="点赞" :name="2"></el-tab-pane>
            </el-tabs>
            <div class="article-list">
               <DataList :dataSource="articleListInfo" :loading="loading" @loadData="loadUserArticle">
                  <template #default="{ data }">
                     <ArticleListItem :data="data"></ArticleListItem>
                  </template>
               </DataList>
            </div>
         </div>
         </div>
      </div>
   </div>
   <UcenterEditUserInfo 
      ref="ucenterEditUserInfoRef" 
      @resetUserInfo="resetUserInfoHandler">
   </UcenterEditUserInfo>
   <UserIntegralRecord
      ref="userIntegralRecordRef" 
   ></UserIntegralRecord>
</template>


<script setup>
import ArticleListItem from '@/views/forum/ArticleListItem.vue';
import UcenterEditUserInfo from './UcenterEditUserInfo.vue';
import UserIntegralRecord from './UserIntegralRecord.vue';
import { getCurrentInstance ,onMounted,ref ,watch,nextTick, onUnmounted} from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

const { proxy } = getCurrentInstance()
const store = useStore()
const route = useRoute()

const api = {
   getUserInfo:'/ucenter/getUserInfo',
   loadUserArticle:'/ucenter/loadUserArticle'
}
const userId = ref(null)
const userInfo = ref({})

const loadUserInfo = async ()=>{
   let result = await proxy.Request({
      url:api.getUserInfo,
      params:{
         userId:userId.value
      },
      errorCallback:()=>{
         setTimeout(()=>{
            router.push('/')
         },1500)
      }
   })
   if(!result){
      return;
   }
   userInfo.value=result.data
}


// 右侧文章
const loading = ref(false)
const articleListInfo = ref({})
const loadUserArticle = async () =>{
    
    let params = {
        pageNo:articleListInfo.value.pageNo,   // 传一个页码过来，不同的页码所获取的信息不一样。
        type:activeTabName.value,
        userId:userId.value
    }

    let result = await proxy.Request({
        url:api.loadUserArticle,
        params:params,
        showLoading:false,     // 我们在请求东西的时候，有骨架那种样式了，就不需要中间loading那种样式
    })
    loading.value = false
    if(!result){
        loading.value = true
        return;
    }
    articleListInfo.value = result.data
}

const activeTabName = ref(0);
const changeTab = (type)=>{
   activeTabName.value = type
   loadUserArticle()
}

// 修改用户信息
const ucenterEditUserInfoRef = ref(null)
const updateUserInfo = ()=>{
   ucenterEditUserInfoRef.value.showEditUserInfoDialog(userInfo.value)
}


//监听登录用户
const currentUserInfo = ref({})
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if(newVal==null){
      return;
    }
    currentUserInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

onMounted(()=>{
   userId.value = route.params.userId;
   loadUserInfo();
   loadUserArticle()
})

// 修改信息后 重置一下userInfo信息
const resetUserInfoHandler = (data) =>{
   userInfo.value = data
}

const userIntegralRecordRef = ref(null)
const checkIntegral=()=>{
   userIntegralRecordRef.value.showRecord()
}


</script>

<style scoped lang="less">
.ucenter{
   margin: 0 auto;
   .user-banner{
      margin: 20px 0 10px 0;
      color: #7e8c8d;
      .a-link{
         color: rgb(18, 149, 218);
      }
      .icon-right{
         margin: 0 5px;
      }
   }
   .ucenter-panel{
      display: flex;
      .user-side{
         width: 300px;
         margin-right: 15px;
         .el-divider{
            margin: 20px 0 10px 0;
         }
         .changeInfo{
            font-size: 14px;
            color: rgb(18, 149, 218);
            cursor: pointer;
            padding: 10px;
            background-color: #fff;
         }
         .avatar-panel{
            background-color: #fff;
            text-align: center;
            padding: 10px 0;
            .avatar-inner{
               text-align: center;
               display: flex;
               justify-content: center;
            }
            .nick-name{
               margin-top: 10px;
               .icon-woman{
                  margin-left: 2px;
                  color: #BA367A;
               }
               .icon-man{
                  margin-left: 2px;
                  color: #1295DA; 
               }
            }
         }
         .desc{
               padding:10px 10px 20px 10px;
               font-size: 15px;
               color: #474747;
               background-color: #fff;
               line-height: 20px;
         }
      }
      .user-extend-panel{
         border-top: 10px solid rgb(243,243,243);
         background-color: #fff;
         padding: 10px;
         .info-item{
            display: flex;
            justify-content: space-between;
            line-height: 30px;
            .label{
               font-size: 13px;
            }
            .label::before{
               font-size: 22px;
               color: #888888;
               padding-right: 5px;
            }
            .value{
               font-size: 13px;
            }
         }
         .checkable{
            color: rgb(18, 149, 218);
            cursor: pointer;
         }
      }
      .article-side{
         flex: 1;
         .article-panel{
            background-color: #fff;
            padding: 0 10px 10px 10px;
         }
      }
   }
}
</style>
