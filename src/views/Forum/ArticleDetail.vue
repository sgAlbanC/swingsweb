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
                <div class="detail-content" id="detail" v-html="articleInfo.content"></div>

                <!-- 是否有附件，附件渲染 -->
                <div class="attachment-panel" v-if="attachment" id="view-attachment">
                    <div class="title">附件</div>
                    <div class="attachment-info">
                        <div class="iconfont icon-zip item" ></div>
                        <div class="file-name item">{{ attachment.fileName }}</div>
                        <div class="size item">{{ proxy.Utils.sizeToStr(attachment.fileSize) }}</div>
                        <div class="item">需要 <span class="integral">{{ attachment.integral }}</span> 积分</div>
                        <div class="download-count item">已下载 {{ attachment.downloadCount }}</div>
                        <div class="download-btn item">
                            <el-button type="primary" size="small" @click="downloadAttachment(attachment.fileId)">下载</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 评论板块 -->
            <div class="detail-comment" id="view-comment">
               <CommentList 
                    :articleId="articleInfo.articleId" 
                    :articleUserId="articleInfo.userId" 
                    v-if="articleInfo.articleId"
                    @updateCommentCount="updateCommentCount"
               ></CommentList>
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
            <el-badge 
                :value="articleInfo.commentCount"
                type="info"
                :hidden="!articleInfo.commentCount>0"
                class="quick-item"
                @click="goToPosition('view-comment')">
                <span class="iconfont icon-comment"></span>
            </el-badge>
            <!-- 附件 -->
            <div class="quick-item" @click="goToPosition('view-attachment')">
                <span class="iconfont icon-attachment"></span>
            </div>
        </div>
        <!-- 图片预览 -->
        <div class="">
            <ImageViewer ref="imageViewerRef" :imageList="previewImgList"></ImageViewer>
        </div>

        <div class="aside">
            侧边栏
        </div>
   </div>
</template>

<script setup>
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css"; //样式
import { getCurrentInstance ,onMounted,ref ,watch,nextTick} from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

import CommentList from './CommentList.vue'

const {proxy} = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()


const api = {
    getArticleDetatil : "/forum/getArticleDetail",
    doLike:"/forum/doLike",
    getUserDownloadInfo: "/forum/getUserDownloadInfo",
    attachmentDownload:'/api/forum/attachmentDownload'
    
}
// 当前用户信息状态
const currentUserInfo = ref({});
// 文章详情
const articleInfo = ref({});
// 附件
const attachment = ref({});
// 是否已点赞
const haveLike = ref(false);


//监听登录用户
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

// 快捷操作的位置，有bug
const quickPanelLeft = -100

// 获取文章详情
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

    imagePreview();
    highlightCode();
    // 更新一下导航active情况，（如果从主页面直接点击文章进来，需要重新渲染导航）
    store.commit("setActivePboardId", result.data.forumArticle.pBoardId);
    store.commit("setActiveBoardId", result.data.forumArticle.boardId);
}
onMounted(()=>{
    getArticleDetatil(route.params.articleId);
})

// 往下滚到指定位置
const goToPosition = (domId) =>{
    document.querySelector('#' + domId).scrollIntoView();
}

// 点赞
const doLikeHandler = async() =>{
    // 点赞之前先判断是否有 用户信息；就是是否登录
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

// 评论数量增加
const updateCommentCount = (totalCount)=>{
    articleInfo.value.commentCount = totalCount
}

//下载附件
const downloadAttachment = async (fileId) => {
  if (!store.getters.getLoginUserInfo) {
    store.commit("showLogin",true)
    return;
  }
  // 0积分
  if (
    attachment.value.integral == 0 ||
    currentUserInfo.value.userId == articleInfo.value.userId
  ) {
    downloadDo(fileId);
    return;
  }

  //获取用户下载信息
  let result = await proxy.Request({
    url: api.getUserDownloadInfo,
    params: {
      fileId: fileId,
    },
  });
  if (!result) {
    return;
  }
  //判断用户是否已下载过
  if (result.data.haveDownload) {
    downloadDo(fileId);
    return;
  }

  //判断用户积分是否够
  if (result.data.userIntegral < attachment.value.integral) {
    proxy.Message.warning("你的积分不够，无法下载");
    return;
  }

  proxy.Confirm(
    `你还有${result.data.userIntegral}积分，当前下载会扣除${attachment.value.integral}积分，确定要下载吗？`,
    () => {
      downloadDo(fileId);
    }
  );
};

const downloadDo = (fileId) => {
  document.location.href = api.attachmentDownload + "?fileId=" + fileId;
  attachment.value.downloadCount = attachment.value.downloadCount + 1;
};

//文章图片预览
const imageViewerRef = ref(null);
const previewImgList = ref([]);
const imagePreview = () => {
  nextTick(() => {
    const imageNodeList = document
      .querySelector("#detail")
      .querySelectorAll("img");
    const imageList = [];
    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute("src");
      imageList.push(src);
      item.addEventListener("click", () => {
        imageViewerRef.value.show(index);
      });
    });
    previewImgList.value = imageList;
  });
};

// 代码高亮
const highlightCode=()=>{
    // 页面加载完成之后
    nextTick(()=>{
        let blocks = document.querySelectorAll('pre code')
        blocks.forEach((item) => {
            hljs.highlightBlock(item);
        });
    })
}


</script>

<style lang="less">
.article-detail{
    position: relative;
    margin: 0 auto;
    // height: 100vh;  // 加了这个，滚动条不能固定
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
        top: 150px;
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
        position: absolute;
        top: 27px;
        right: 200px;
        background-color: #fff;
        padding: 15px;
    }
}
</style>
