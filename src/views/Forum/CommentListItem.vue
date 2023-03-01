<template>
    <div class="comment-item-panel">
   <div class="comment-item">
    <Avatar :userId="commentData.userId" :widt="50"></Avatar>
    <div class="comment-info">
        <div class="nick-name">      
            <span> {{ commentData.nickName }}</span> 
            <span v-if="commentData.userId == articleUserId" class="tag-author">作者</span>
        </div>
        <div class="comment-content">
            <span v-html="commentData.content"></span>
        </div>
        <div class="op-panel">
            <div class="time">
                <span>{{ commentData.postTime }}</span>
            </div>
            ·
            <div class="address">{{ commentData.userIpAddress }}</div>

            <div class="iconfont icon-good">
                {{ commentData.goodCount>0?commentData.goodCount:" 点赞" }}
            </div>
            <div class="iconfont icon-comment" @click="showReplayPanel(commentData)">
                回复
            </div>
            
            <el-dropdown v-if="articleUserId == currentUserId"> 
                <div class="iconfont icon-more"></div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>
                            {{ commentData.topType ==0?'设为置顶':'取消置顶' }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
                
            </el-dropdown>
            
        </div>
    </div>
   </div>
   <div class="replay-info" v-if="commentData.showReply">
        <CommentPost 
            :articleId="articleId"
            :pCommentId="pCommentId"
            :replayUserId="replayUserId"
            :userId="currentUserId" 
            :avatarWidth="30" 
            :showInsertImg="false"
            @postCommentFinish="postCommentFinish"
            >
        </CommentPost>
    </div>
</div>
</template>

<script setup>
import CommentPost from './CommentPost.vue';
import { ref,watch,getCurrentInstance} from 'vue'
import { useStore } from 'vuex';

const store = useStore()
const {proxy} = getCurrentInstance()

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
const replayUserId = ref(null)  // 二级评论，对评论里面的评论再评论

const emit = defineEmits(["hiddenAllReplay"])   // 定义一个传送门
// 点击回复 显示评论
const showReplayPanel = (curData) =>{
    if(!store.getters.getLoginUserInfo){
        store.commit("showLogin",true)
        return;
    }
    const haveShow = curData.showReply == undefined?false:curData.showReply  // 将状态保存起来,不然下面那个方法将吧所有的变成false，一直都是false转true，就关不掉。
    emit("hiddenAllReplay")     // 在需要让父组件调用方法的地方 传送出去。（父组件将所有的评论的回复的showReply这个属性都置为false
    curData.showReply = !haveShow;
    
    pCommentId.value = curData.commentId  // curData是此条评论的返回值，他的commentId就是我们评论的父级
}

// 评论完成
const postCommentFinish=(resultData)=>{
    const children = props.commentData.children||[]
    children.unshift(resultData)
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
        .nick-name{
            font-size: 14px;
            color: #1b1b1b;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .tag-author{
                background-color:#ff6699;
                color: #fff;
                border-radius: 4px;
                padding: 2px;
                margin-left: 5px;
                font-size: 12px;
            }
        }
    }
    .op-panel{
        margin-top: 10px;
        display: flex;
        font-size: 13px;
        color:#929396 ;
        .address{
            margin-right: 10px;
        }
        .iconfont{
            cursor:pointer;
            font-size:13px;
            margin-right: 5px;
        }
    }
}

.replay-info{
    margin:10px 0 0 50px
}
</style>
