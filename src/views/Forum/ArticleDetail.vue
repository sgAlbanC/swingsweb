<template>
   <div class="article-detail" :style="{width:proxy.globalInfo.bodywidth + 'px'}"
   v-if="Object.keys(articleInfo).length>0">
        <div class="board-panel">
            <router-link :to="`/forum/${articleInfo.pBoardId}`">{{ articleInfo.pBoardName }}</router-link>
            <span class="iconfont icon-right"></span>
            <router-link :to="`/forum/${articleInfo.pBoardId}${articleInfo.boardId?'/'+articleInfo.boardId:''}`">
                {{ articleInfo.boardId?articleInfo.boardName :"全部" }}
            </router-link>
            <span class="iconfont icon-right"></span>
            <span class="">{{ articleInfo.title }}</span>
        </div>
        <div class="detail-panel">
            <div class="detail-content">
                <div class="detail-title">标题</div>
                <div class="user-info">
                    <Avatar class="avatar" :width="30"></Avatar>
                    <div class="user-name">用户名</div>
                    <div class="post-time"></div>
                    <div class="address"></div>
                </div>

                <div class="">内容</div>
            </div> 

            <div class="detail-comment">
                评论
            </div>
        </div>
   </div>
</template>

<script setup>
import { getCurrentInstance ,onMounted,ref ,watch} from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const {proxy} = getCurrentInstance()
const route = useRoute()
const router = useRouter()


const api = {
    getArticleDetatil : "/forum/getArticleDetail"
}



// 文章详情

const articleInfo = ref({});

const getArticleDetatil = async (articleId) =>{
    let result =  await proxy.Request({
        url:api.getArticleDetatil,
        params:{
            articleId:articleId
        }
    });
    if(!result){
        return;
    }

    articleInfo.value = result.data.forumArticle;

}
onMounted(()=>{
    getArticleDetatil(route.params.articleId);
})




</script>

<style scoped lang="less">
.article-detail{
    margin: 0 auto;
    .board-panel{
        margin: 20px 0 10px 0;
        .iconfont{
            margin: 0 10px;
        }
        a{
            color: rgb(18, 149, 218);
        }
    }
    .detail-panel{
        .detail-content{
            
            background-color: #fff;
            padding: 15px;
            margin-bottom: 20px;
            .user-info{
                display: flex;
            }

        }
        .detail-comment{
            background-color: #fff;
            padding: 15px;
        }
    }

}
</style>
