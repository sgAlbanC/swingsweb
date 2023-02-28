<template>
   <div class="comment-panel">
    <div class="comment-title">
        <div class="title">评论 <span class="count">{{ 10 }}</span></div>
        <div class="tab">
            <span>热榜</span>
            <el-divider direction="vertical"></el-divider>
            <span>最新</span>
        </div>
    </div>
    <div class="comment-post-panel">
        <CommentPost
        :articleId="articleId"
        :avatarWidth="50"
        :userId="currentUserInfo.userId"
        ></CommentPost>
    </div>
    <div>
        <!-- @loadData="loadComment" 分页 点击过后会重新load数据 -->
        <DataList :dataSource="commentListInfo" :loading="loading" @loadData="loadComment">
            <template #default="{data}">
                <CommentListItem 
                :commentData="data" 
                :articleUserId="articleUserId"
                :currentUserId="currentUserInfo.userId"
                @hiddenAllReplay="hiddenAllReplayHandler"
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
    postComment:'/comment/postComment',
    doLike:'/comment/doLike',
    changeTopType:'/comment/changeTopType'
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
        params:params
    })
    loading.value=false
    if(!result){
        return;
    }
    commentListInfo.value = result.data;
}
loadComment()

// 隐藏所有回复框
const hiddenAllReplayHandler =() =>{
    commentListInfo.value.list.forEach((element)=>{
        element.showReply = false
    })
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
        
    }
}
</style>
