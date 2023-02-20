<template>
   <div class="container" :style="{width:proxy.globalInfo.bodywidth + 'px'}">
    <!-- 二级板块展示信息    -->
    <div class="sub-board" v-if="pBoardId">
        <span v-for="item in subBoardList" :class="['board-item']">
            <router-link :to="`/forum/${item.pBoardId}/${item.boardId}`"> {{ item.boardName }}</router-link>
        </span>
    </div>
    <div class="article-panel">
        <div class="top-tab">
            <div :class="['tab',orderType == 0 ? 'active' : '']" @click="changeOrderType(0)">热榜</div>
            <el-divider direction="vertical"></el-divider>
            <div :class="['tab',orderType == 1 ? 'active' : '']" @click="changeOrderType(1)">发布时间</div>
            <el-divider direction="vertical"></el-divider>
            <div :class="['tab',orderType == 2 ? 'active' : '']" @click="changeOrderType(2)">最新</div>
        </div>
        <div class="article-list">
            <DataList :dataSource="articleListInfo" :loading="loading" @loadData="loadArticle">
                <template #default="{ data }">
                    <ArticleListItem :data="data"></ArticleListItem>
                </template>
            </DataList>
        </div>
    </div>
   </div>
</template>

<script setup>
import { getCurrentInstance,ref,watch,reactive, onMounted } from 'vue';
import ArticleListItem from './ArticleListItem.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore()
const route = useRoute()
const {proxy} = getCurrentInstance()
const api = {
    loadArticle:'/forum/loadArticle'
}

const changeOrderType = (type)=>{
    orderType.value = type;
    loadArticle()
}


onMounted(()=>{
    loadArticle()
})


// 文章列表
// 一级板块
const pBoardId = ref(0)
// 二级板块
const boardId = ref(0)
const orderType = ref(0)
const loading = ref(false)
const articleListInfo = ref({})
const loadArticle = async () =>{
    
    let params = {
        pageNo:articleListInfo.value.pageNo,   // 传一个页码过来，不同的页码所获取的信息不一样。
        orderType:orderType.value,
        pBoardId:pBoardId.value,
        boardId:boardId.value
    }

    let result = await proxy.Request({
        url:api.loadArticle,
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

// 二级板块
const subBoardList = ref([])
const setSubBoard = ()=>{
    // console.log(pBoardId.value)
    subBoardList.value = store.getters.getSubBoardList(pBoardId.value)
    // console.log(subBoardList.value)
} 

// 监听路由变化
watch(()=>route.params,
(newVal,oldVal)=>{
    if (
      Object.keys(newVal).length != 0 &&
      !newVal.pBoardId &&
      !newVal.boardId
    ) {
      return;
    }
    pBoardId.value = newVal.pBoardId;
    boardId.value = newVal.boardId||0;
    setSubBoard()
    loadArticle()
    store.commit("setActivePboardId", newVal.pBoardId);
    store.commit("setActiveBoardId", newVal.boardId);
},
{immediate:true,deep:true})

//监听 板块数据变化
watch(
  () => store.state.boardList,
  (newVal, oldVal) => {
    setSubBoard();
  },
  { immediate: true, deep: true }
);



</script>

<style scoped lang="less">
.container{
    margin: 0 auto;

    .sub-board{
        
        .board-item{
            display: inline-block;
            margin: 10px 10px 10px 0;
            cursor: pointer;
            font-size: 14px;
            padding: 5px 10px;
            background-color: #fff;
            border-radius: 15px;
            color: #909090;
        }
        .board-item:hover{
            background-color :rgb(18, 149, 218);
            a{
                color: #fff;
            }
        }
        .active{
            background-color :rgb(18, 149, 218);
            a{
                color: #fff;
            }
        }
    }
    .article-panel{
        
        padding: 5px 0;
        background-color: #fff;
    }
    .top-tab{
        margin-top:10px ;
        padding: 10px;
        display: flex;
        align-items: center;
        font-size: 15px;
        border-bottom: 1px solid #ddd;
        .tab{
            cursor: pointer;
        }
        .active{
            color: #66acd1;
        }
        .active:hover{
            color:  rgb(18, 149, 218);
        }
    }

}
</style>
