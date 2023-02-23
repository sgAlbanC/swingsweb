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
                    <div class="title">附件</div>
                    <div class="attachment-info">
                        <div class="iconfont icon-zip item"></div>
                        <div class="file-name item">{{ attachment.fileName }}</div>
                        <div class="size item">{{ proxy.Utils.sizeToStr(attachment.fileSize) }}</div>
                        <div class="item">需要 <span class="integral">{{ attachment.integral }}</span> 积分</div>
                        <div class="download-count item">已下载 {{ attachment.integral }}</div>
                        <div class="download-btn item">
                            <el-button type="primary" size="small">下载</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-comment" id="view-comment">
                评论
            </div>
        </div>
        <div class="quick-panel" :style="{left:quickPanelLeft + 'px'}">

            <!-- 点赞 -->
            <el-badge :value="articleInfo.goodCount"
                type="info"
                :hidden="!articleInfo.goodCount>0"
                class="quick-item"
                @click="doLikeHandler">
                <span class="iconfont icon-good" :class="[haveLike?'have-like':'']"></span>
            </el-badge>

            <!-- 评论 -->
            <el-badge :value="articleInfo.goodCount"
                type="info"
                :hidden="!articleInfo.goodCount>0"
                class="quick-item"
                @click="goToPosition('view-comment')">
                <span class="iconfont icon-comment"></span>
            </el-badge>
            <!-- 附件 -->
            <div class="quick-item" @click="goToPosition('view-attachment')">
                <span class="iconfont icon-attachment"></span>
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
import { useStore } from 'vuex'
const {proxy} = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()


const api = {
    getArticleDetatil : "/forum/getArticleDetail",
    doLike:"/forum/doLike"
}



// 文章详情
const articleInfo = ref({});
// 附件
const attachment = ref({});
// 是否已点赞
const haveLike = ref(false);


// 快捷操作的位置，有bug
const quickPanelLeft = (window.innerWidth - proxy.globalInfo.bodywidth) / 2 - 115

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
    haveLike.value = result.data.haveLike
}
onMounted(()=>{
    getArticleDetatil(route.params.articleId);
})

// 往下滚到指定位置
const goToPosition = (domId) =>{
    document.querySelector('#'+domId).scrollIntoView();
}

// 点赞
const doLikeHandler = async() =>{

    if(!store.getters.getLoginUserInfo){
        store.commit("showLogin",true)
        return;
    }
    let result = await proxy.Request({
        url:api.doLike,
        params:{
            articleId : articleInfo.value.articleId
        }
    })
    if(!result){
        return;
    }
    haveLike.value = !haveLike.value
    // 点赞就+1 取消赞就-1
    let goodCount = 1;
    if(!haveLike.value){
        goodCount = -1;
    }
    articleInfo.value.goodCount += goodCount

}


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
                // letter-spacing: 1px;
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
                .title{
                    margin-bottom: 10px;
                }
                .attachment-info{
                    display: flex;
                    align-items: center;
                    color: #4a4a4a;
                    .item{
                        margin-right: 10px;
                    }
                    .icon-zip,.file-name{
                        color: rgb(18, 149, 218);
                    }
                    .integral{
                        color: red;
                    }
                }
                
            }

        }
        .detail-comment{
            padding: 15px;
            background-color: #fff;
            
        }
    }

    .quick-panel{
        position: absolute;
        top: 200px;
        text-align: center;
        width: 50px;
        .el-badge__content{
            top: 5px;
            right: 15px;
        }
        .quick-item{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 25px;
            cursor: pointer;
            .iconfont{
                font-size: 22px;
                color: #61666d;
            }
            .have-like{
                color: #f56c6c !important;
            }
        }


    }

    .aside{
        position: fixed;
        top: 107px;
        right: 310px;
        background-color: #fff;
        padding: 15px;
    }
}
</style>
