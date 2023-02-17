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
        <div v-for="item in articleInfo.list">{{ item.title }}</div>
    </div>
   </div>
</template>

<script setup>
import { getCurrentInstance,ref,watch,reactive, onMounted } from 'vue';
const {proxy} = getCurrentInstance()

const api = {
    loadArticle:'/forum/loadArticle'
}

onMounted(()=>{
    loadArticle()
})

const articleInfo = ref({})
const loadArticle = async () =>{
    let result = await proxy.Request({
        url:api.loadArticle,
    })
    if(!result){
        return;
    }
    articleInfo.value = result.data
}




</script>

<style scoped lang="less">
.container{
    margin: 0 auto;
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
        padding: 10px;
    }
}
</style>
