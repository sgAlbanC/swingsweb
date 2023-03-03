<template>
   <div class="comment-panel">
    <div class="comment-title">
        <div class="title">评论 <span class="count">{{ commentListInfo.totalCount }}</span></div>
        <div class="tab">
            <span @click="orderChange(0)" :class="[orderType==0?'active':'']">热榜</span>
            <el-divider direction="vertical"></el-divider>
            <span @click="orderChange(1)" :class="[orderType==1?'active':'']">最新</span>
        </div>
    </div>
    <div class="comment-post-panel">
        <CommentPost
        :articleId="articleId"
        :pCommentId="0"
        :avatarWidth="50"
        :userId="currentUserInfo.userId"
        :showInsertImg="currentUserInfo.userId != null"
        @postCommentFinish="postCommentFinish"
        ></CommentPost>
    </div>
    <div>
        <!-- @loadData="loadComment" 分页 点击过后会重新load数据 -->
        <DataList 
            :dataSource="commentListInfo" 
            :loading="loading" 
            @loadData="loadComment"
            noDataMsg="暂无评论"
        >
            <!-- 这里的data是在DataList里面弄的 -->
            <template #default="{data}">
                <CommentListItem
                :articleId="articleId"
                :commentData="data" 
                :articleUserId="articleUserId"
                :currentUserId="currentUserInfo.userId"
                @hiddenAllReplay="hiddenAllReplayHandler"
                @reloadData="loadComment"
                ></CommentListItem>
            </template>      
        </DataList> 
    </div>
   </div>
</template>

<script setup>
import CommentPost from './CommentPost.vue';
import CommentListItem from './CommentListItem.vue';
import {ref,watch,getCurrentInstance} from 'vue'
import { useStore } from 'vuex';

const {proxy} = getCurrentInstance()

const api = {
    loadComment: "/comment/loadComment",
}

const store = useStore()

const props = defineProps({
    articleId:{
        type:String,
    },
    articleUserId:{
        type:String
    }
})

//form信息
const formData = ref({});
const formDataRef = ref({});
const rules = {
    title:[{required:true,message:"请输入内容"}]
}

// 当前用户信息
const currentUserInfo = ref({})
watch(()=>store.state.loginUserInfo,(newVal,oldVal)=>{
    currentUserInfo.value = newVal||{}
},
    {immediate:true,deep:true}
)

// 排序
const orderType = ref(0);
const orderChange = (type)=>{
    orderType.value = type;
    loadComment();
}


// 评论列表
const loading = ref(null)
const commentListInfo = ref({})
const loadComment = async ()=>{
    let params={
        pageNo:commentListInfo.value.pageNo,
        articleId:props.articleId ,  // 这里需要用props去拿吗？直接拿不到吗？
        orderType:orderType.value
    }
    loading.value =true
    let result = await proxy.Request({
        url:api.loadComment,
        showLoading:false,
        params:params
    })
    loading.value=false
    if(!result){
        return;
    }
    commentListInfo.value = result.data;        // commentListInfo是请求回来的评论数据
}
loadComment()

// 隐藏所有回复框
const hiddenAllReplayHandler =() =>{
    commentListInfo.value.list.forEach((element)=>{
        element.showReply = false
    })
}

// 评论完成

const emit = defineEmits(["updateCommentCount"])
const postCommentFinish=(resultData)=>{
    commentListInfo.value.list.unshift(resultData)
    // 更新评论数量
    const totalCount = commentListInfo.value.totalCount+1;
    commentListInfo.value.totalCount = totalCount
    emit("updateCommentCount",totalCount)
}


</script>

<style scoped lang="less">
.comment-panel{
    .comment-title{
        display: flex;
        font-size: 14px;
        align-items: center;
        margin-bottom: 20px;
        .title{
            font-size: 18px;
            font-weight: bold;
            margin-right: 20px;
        }
        .tab{
            cursor: pointer;
            .active{
                color:#409eff ;
            }
        }
    }
}
</style>
