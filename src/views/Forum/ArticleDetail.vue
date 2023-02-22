<template>
   <div class="article-detail" :style="{width:proxy.globalInfo.bodywidth + 'px'}"
   v-if="Object.keys(articleInfo).length>0">
        <div class="board-panel">
            <router-link :to="`/forum/${articleInfo.pBoardId}`">{{ articleInfo.pBoardName }}</router-link>
            <span class="iconfont icon-right"></span>
            <template v-if="articleInfo.boardId">
                <router-link :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`">
                    {{ articleInfo.boardName }}
                </router-link>
            <span class="iconfont icon-right"></span></template>
            
            <span class="">{{ articleInfo.title }}</span>
        </div>
        <div class="detail-panel" :style="{width:proxy.globalInfo.bodywidth - 300 + 'px'}">
            <div class="detail-container" >

                <!-- 作者信息渲染 -->
                <div class="detail-title">{{articleInfo.title}}</div>
                <div class="user-info">
                    <Avatar class="avatar" :width="50" :userId="articleInfo.userId"></Avatar>
                    <div class="user-info-right">
                        <div class="user-name">{{articleInfo.nickName}}</div>
                        <span class="post-time">{{ articleInfo.postTime }}</span> ·
                        <span class="address">{{ articleInfo.userIpAddress }}</span>
                        <span class="iconfont icon-eye-solid">&nbsp;{{ articleInfo.readCount }}</span>
                    </div>

                </div>
                <!-- 内容区域 使用v-html渲染 -->
                <div class="detail-content" v-html="articleInfo.content"></div>

                <!-- 是否有附件，附件渲染 -->
                <div class="attachment-panel" v-if="attachment" id="view-attachment">
                    <div class="attachment-info">
                        <div class="title item">附件</div>
                        <div class="iconfont icon-zip item"></div>
                        <div class="file-name item">{{ attachment.fileName }}</div>
                        <div class="size item">{{ attachment.fileSize }}</div>
                        <div class="item">需要 <span class="integral">{{ attachment.integral }}</span></div>
                        <div class="download-count item">已下载{{ attachment.integral }}</div>
                        <div class="download-btn item">
                            <el-button type="primary" size="small">下载</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-comment">
                评论
            </div>
        </div>
        <div class="aside">
            sasasas
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
// 附件
const attachment = ref({});
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

    attachment.value = result.data.attachment;
    articleInfo.value = result.data.forumArticle;

}
onMounted(()=>{
    getArticleDetatil(route.params.articleId);
})




</script>

<style lang="less">
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
        .detail-container{
            padding:15px;
            margin-bottom: 20px;
            background-color: #fff;
            .detail-title{
                margin-bottom: 10px;
                font-weight: bold;
            }
            .user-info{
                display: flex;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #ddd;
                .user-info-right{
                    margin-left: 10px;
                    font-size: 14px;
                    .user-name{
                        color: #4e5969;
                        font-size: 16px;
                        cursor: pointer;
                        margin-bottom: 10px;
                    }
                    .user-name:hover{
                        color:rgb(18, 149, 218); ;
                    }
                    .post-time{
                        color:#61666d;
                    }
                    .address{
                        color: #4a4a4a;
                    }
                    .iconfont{
                        padding-left: 20px;
                        color: #9f9f9f;
                    }
                }


            }
            .detail-content{
                margin-top: 10px;
                letter-spacing: 1px;
                line-height: 22px;
                a{
                    text-decoration: none;
                    color:#66ACD1
                }
                p{
                    margin-top: 10px;
                }
                img{
                    margin: 5px 0;
                    display: block;
                    height: 300px;
                    object-fit:contain ;
                    cursor: pointer;
                }

            }

            .attachment-panel{
                margin-top: 40px;
                .attachment-info{
                    display: flex;
                    align-items: center;
                    .item{
                        margin-right: 10px;
                    }
                }
                
            }

        }
        .detail-comment{
            padding: 15px;
            background-color: #fff;
            
        }
    }



    .aside{
        position: fixed;
        // border: 1px solid red;
        top: 107px;
        right: 310px;
        background-color: #fff;
        padding: 15px;
    }
}
</style>
