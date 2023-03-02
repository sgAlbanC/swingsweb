<template>
   <div class="article-item">
      <div class="article-item-inner">
         <div class="article-body">
            <div class="user-info">
               <Avatar class="avatar" :userId="data.userId" :width="30"></Avatar>
               <router-link class="link-info" :to="'/user/'+ data.userId">{{ data.nickName }}</router-link>
               <el-divider direction="vertical"></el-divider>
               <div class="post-time">{{ data.postTime }}</div>
               <div class="address">&nbsp;·&nbsp;{{ data.userIpAddress }}</div>
               <el-divider direction="vertical"></el-divider>
               <router-link :to="`/forum/${data.pBoardId}`" class="link-info">{{ data.pBoardName }}</router-link>
               <template v-if="data.boardName">
                  <span>&nbsp;/&nbsp;</span>
                  <router-link :to="`/forum/${data.pBoardId}/${data.boardId}`" class="link-info">{{ data.boardName }}</router-link>
               </template>
            </div>
            <span class="topType" v-if="data.topType==1">置顶</span>
            <router-link :to="`/post/${data.articleId}`" class="article-title">
               {{ data.title }}
            </router-link>
            <div class="article-summary">{{ data.summary }}</div>
            <div class="article-info">
               <span class="iconfont icon-eye-solid">
                  {{ data.readCount==0?"阅读":data.readCount }}
               </span>
               <span class="iconfont icon-good">
                  {{ data.goodCount==0?"点赞":data.goodCount }}
               </span>
               <span class="iconfont icon-comment">
                  {{ data.commentCount==0?"评论":data.commentCount }}
               </span>
            </div>
         </div>
         <router-link :to="`/post/${data.articleId}`" >
            <div class="article-cover">
               <Cover :cover="data.cover" :width="80"></Cover>
            </div>
         </router-link>
      </div>
      
   </div>
</template>

<script setup>
import {ref,reactive,watch} from 'vue'


const props = defineProps({
   data:{
      type:Object
   }
})
</script>

<style scoped lang="less">
.article-item{
   .article-item-inner{
      margin: 15px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      .article-body{
         margin-right: 5px;
         .user-info{
            align-items: center;
            display: flex;
            font-size: 14px;
            .avatar{
               margin-right: 6px;
            }
            // .link-info{
            //    margin-left: 5px;
            // }
            .link-info:hover{
               color:rgb(18, 149, 218);
            }
            .post-time{
               color:#9a9a9a
            }
            .address{
               color:#4a4a4a
            }
         }
         .topType{
            font-size: 12px;
            font-weight: bold;
            color: #FF6699;
            border: 1px solid #FF6699;
            border-radius:5px;
            padding: 1px 4px;
            margin-right: 4px;
         }
         .article-title{
            font-weight: bold;
            color: #4a4a4a;
            margin: 10px 0 6px 0;
            display: inline-block;
         }
         .article-title:hover{
            color: rgb(18, 149, 218);
         }
         .article-summary{
            font-size: 14px;
            color: #86909c;
         }
         .article-info{
            margin: 12px 0 10px 0;
            display: flex;
            align-items: center;
            .iconfont{
               margin-right: 15px;     
               font-size: 14px;
               color: #86909c;          
            }
            .iconfont::before{
               padding-right: 3px;
            }
         }
      }
   }
}
</style>
