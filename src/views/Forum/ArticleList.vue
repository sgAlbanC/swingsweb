<template>
   <div class="container" :style="{width:proxy.globalInfo.bodywidth + 'px'}">   
    <div class="top-tab">
        <div>热榜</div>
        <el-divider direction="vertical"></el-divider>
        <div>发布时间</div>
        <el-divider direction="vertical"></el-divider>
        <div>最新</div>
    </div>
    <div class="article-list">
        <DataList :dataSource="articleListInfo" @loadData="loadArticle">
            <template #default="{ data }">
                <ArticleListItem :data="data"></ArticleListItem>
            </template>
        </DataList>
    </div>
   </div>
</template>

<script setup>
import { getCurrentInstance,ref,watch,reactive, onMounted } from 'vue';
import ArticleListItem from './ArticleListItem.vue';
const {proxy} = getCurrentInstance()

const api = {
    loadArticle:'/forum/loadArticle'
}

onMounted(()=>{
    loadArticle()
})

const articleListInfo = ref({})
const loadArticle = async () =>{

    let params = {
        pageNo:articleListInfo.value.pageNo,   // 传一个页码过来，不同的页码所获取的信息不一样。
        boardId:0
    }

    let result = await proxy.Request({
        url:api.loadArticle,
        params:params
    })
    if(!result){
        return;
    }
    articleListInfo.value = result.data
}




</script>

<style scoped lang="less">
.container{
    margin: 0 auto;
    padding: 5px 0;
    background-color: #fff;
    .top-tab{
        margin-top:10px ;
        padding: 10px;
        display: flex;
        align-items: center;
        
        font-size: 15px;
        border-bottom: 1px solid #ddd;
    }
    .article-list{
        
    }
}
</style>
