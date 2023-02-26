<template>
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
            <div class="iconfont icon-comment">
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
</template>

<script setup>

const props = defineProps({
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


</script>

<style scoped lang="less">
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
</style>
