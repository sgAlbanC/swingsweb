<template>
    <div class="comment-item-panel">
   <div class="comment-item">
    <Avatar :userId="commentData.userId" :widt="50"></Avatar>
    <div class="comment-info">
        <div class="nick-name">      
            <span @click="gotoUcenter(commentData.userId)"> {{ commentData.nickName }}</span> 
            <span v-if="commentData.userId == articleUserId" class="tag-author">作者</span>
        </div>
        <!-- 评论内容部分 -->
        <div class="comment-content">
            <span :class="['set-top',commentData.topType==0?'top-invisible':'']">置顶</span>
            <span v-html="commentData.content"></span>
            <br />
            <CommentImage 
                class="comment-image"
                v-if="commentData.imgPath" 
                :src="proxy.globalInfo.imageUrl + commentData.imgPath.replace('.','_.')"
                :imgList="[proxy.globalInfo.imageUrl + commentData.imgPath]"
            ></CommentImage>
        </div>
        <!-- 对评论的操作 -->
        <div class="op-panel">
            <div class="time">
                <span>{{ commentData.postTime }}</span>
            </div>
            ·
            <div class="address">{{ commentData.userIpAddress }}</div>

            <div :class="['iconfont icon-good',commentData.likeType==1?'active':'']" @click="doLike(commentData)">
                {{ commentData.goodCount>0?commentData.goodCount:" 点赞" }}
            </div>
            <div class="iconfont icon-comment" @click="showReplayPanel(commentData,0)">
                回复
            </div>
            
            <el-dropdown v-if="articleUserId == currentUserId"> 
                <div class="iconfont icon-more"></div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="opTop(commentData)">
                            {{ commentData.topType ==0?'设为置顶':'取消置顶' }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <!-- 二级评论 -->
        <div class="comment-sub-list" v-if="commentData.children">
            <div class="comment-sub-item" v-for="sub in commentData.children" :key="sub">
                <Avatar :userId="sub.userId" :width="30"></Avatar>
                <div class="comment-sub-info">
                    <div class="nick-name">      
                        <span class="own-name" @click="gotoUcenter(sub.userId)"> {{ sub.nickName }}</span> 
                        <span v-if="sub.userId == articleUserId" class="tag-author">作者</span>
                        <span class="reply">回复</span>
                        <span class="reply-nickname"  @click="gotoUcenter(sub.replyUserId)">@{{ sub.replyNickName }}: </span>
                        <span class="sub-content" v-html="sub.content"></span>
                    </div>
                    <div class="op-panel">
                        <div class="time">
                            <span>{{ sub.postTime }}</span>
                        </div>
                        ·
                        <div class="address">{{ sub.userIpAddress }}</div>

                        <div  :class="['iconfont icon-good',sub.likeType==1?'active':'']"  @click="doLike(sub)">
                            {{ sub.goodCount>0?sub.goodCount:" 点赞" }}
                        </div>
                        <div class="iconfont icon-comment" @click="showReplayPanel(sub,1)">
                            回复
                        </div>
                    </div>
                </div>                

            </div>
        </div>
    </div>
   </div>
   <div class="replay-info" v-if="commentData.showReply">
        <CommentPost 
            :articleId="articleId"
            :pCommentId="pCommentId"
            :replyUserId="replyUserId"
            :userId="currentUserId" 
            :placeholderInfo="placeholderInfo"
            :avatarWidth="30" 
            :showInsertImg="false"
            @postCommentFinish="postCommentFinish"
            >
        </CommentPost>
    </div>
</div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import CommentPost from './CommentPost.vue';
import { ref,watch,getCurrentInstance} from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useStore()
const {proxy} = getCurrentInstance()

const api = {
    doLike:'/comment/doLike',
    changeTopType:'/comment/changeTopType'
}

const props = defineProps({
    // 是CommentList里面请求回来的评论数据，然后传过来的。每一页不同；
    // 这些东西我在模板中就当做正常的数据来渲染，只是是从父级组件传来的

    articleId:{
        type:String
    },

    commentData:{
        type:Object
    },
    articleUserId:{
        type:String
    },
    currentUserId:{
        type:String
    }
})

const pCommentId = ref(0)  // 评论的父级Id
const replyUserId = ref(null)  // 二级评论，对评论里面的评论再评论
const placeholderInfo = ref(null)

const emit = defineEmits(["hiddenAllReplay","reloadData"])   // 定义一个传送门
// 点击回复 显示评论
const showReplayPanel = (curData,type) =>{
    if(!store.getters.getLoginUserInfo){
        store.commit("showLogin",true)
        return;
    }
    const haveShow = props.commentData.showReply == undefined?false:props.commentData.showReply  // 将状态保存起来,不然下面那个方法将吧所有的变成false，一直都是false转true，就关不掉。
    emit("hiddenAllReplay")     // 在需要让父组件调用方法的地方 传送出去。（父组件将所有的评论的回复的showReply这个属性都置为false
    if(type==0){
        props.commentData.showReply = !haveShow;
    }else{
        props.commentData.showReply = true
    }
    pCommentId.value = props.commentData.commentId 

    replyUserId.value = curData.userId
    placeholderInfo.value="回复 @"+curData.nickName
}

// 评论完成
const postCommentFinish=(resultData)=>{
    // 二级评论接口返回的就是所有的子评论
    props.commentData.children = resultData
}

// 点击名字跳转到个人中心
const gotoUcenter= (userId) =>{
    router.push(`/user/${userId}`)
}

// 点赞
const doLike =async (data) => {
    if(!store.getters.getLoginUserInfo){
        store.commit("showLogin",true)
        return;
    }
    let result = await proxy.Request({
       url:api.doLike,
       params:{
            commentId:data.commentId
        }
    })
    if(!result){
      return;
    }
    data.goodCount = result.data.goodCount;
    data.likeType = result.data.likeType;    // 是否点赞
}

// 置顶
const opTop = async (data) =>{
    console.log(data.commentId)
    console.log(data.topType)
    let result = await proxy.Request({
        url:api.changeTopType,
        params:{
            commentId:data.commentId,
            topType:data.topType==1?0:1     // 如果已经置顶，则传0取消；若没有置顶，则传1置顶
        }
    })
    if(!result){
        return;
    }
    emit("reloadData")
}


</script>

<style scoped lang="less">

.comment-item-panel{
        border-bottom: 1px solid #dcdfe6;   // border颜色 专门的
        margin-bottom: 10px;
        padding-bottom: 10px ;
}
.comment-item{
    display: flex;
    .comment-info{
        margin-left: 10px;
        color: #505050;
        .nick-name{
            font-size: 14px;
            color: #1b1b1b;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            cursor: pointer;
            .tag-author{
                background-color:#ff6699;
                color: #fff;
                border-radius: 4px;
                padding: 2px;
                margin-left: 5px;
                font-size: 12px;
            }
        }
        .comment-content{
            .top-invisible{
                display: none;
            }
            .set-top{
                background-color:#fff;
                border: 1px solid #ff6699;
                color: #ff6699;
                border-radius: 5px;
                padding: 1px 2px;
                margin-right: 5px;
                font-size: 12px;
            }
            .comment-image{
                margin-top: 10px;
            }
        }
    }
    .op-panel{
        margin-top: 10px;
        display: flex;
        font-size: 13px;
        color:#929396 ;
        letter-spacing: 0.2px;
        .address{
            margin-right: 15px;
        }
        .iconfont{
            cursor:pointer;
            font-size:13px;
            margin-right: 15px;
        }
        .active{
            color: #409eff;
        }
    }
    .comment-sub-list{
        margin-top: 10px;
        .comment-sub-item{
            display: flex;
            align-items: center;
            margin: 15px 0px;
            .comment-sub-info{
                margin-left: 10px;
                .nick-name{
                    .own-name{
                        cursor: pointer;
                    }
                    .own-name:hover{
                        opacity: 0.8;
                    }
                    color: #7c7c7c;
                    font-size: 14px;
                    .tag-author{
                        background-color:#ff6699;
                        color: #fff;
                        border-radius: 4px;
                        padding: 2px;
                        margin-left: 5px;
                    }
                    .reply{
                        margin: 0 5px;
                        color:#505050;
                        
                    }
                    .reply-nickname{
                        cursor: pointer;
                        color: #409eff;
                    }
                    .reply-nickname:hover{
                        opacity: 0.8;
                    }
                    .sub-content{
                        color: #505050;
                        font-size: 15px;
                    }
                }
            }
        }
    }
}

.replay-info{
    margin:10px 0 0 50px
}
</style>
