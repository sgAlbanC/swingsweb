<template>
   <div class="comment-post">
        <Avatar :width="avatarWidth" :userId="userId"></Avatar>
        <div class="form">
            <el-form :model="formData" :rules="rules" ref="formDataRef">
                <!--textarea输入-->
                <el-form-item prop="content">
                <el-input
                    clearable
                    :placeholder="placeholderInfo"
                    type="textarea"
                    :maxlength="800"
                    resize="none"
                    show-word-limit
                    v-model="formData.content"
                ></el-input>

                <div class="insert-img" v-if="userId">
                    <el-upload 
                        name="file" 
                        :show-file-list="false" 
                        accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
                        :multiple="false"
                        :http-request="selectImg"
                        >
                        <span class="iconfont icon-image"></span>
                    </el-upload>
                </div>
                </el-form-item>
            </el-form>
        </div>
        <el-button @click="postCommentDo">发表</el-button>
   </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  postComment: "/comment/postComment",
};

const props = defineProps({
  articleId: {
    type: String,
  },
  pCommentId: {
    type: Number,
  },
  replyUserId: {
    type: String,
  },
  avatarWidth: {
    type: Number,
  },
  userId: {
    type: String,
  },
  showInsertImg: {
    type: Boolean,
  },
  placeholderInfo: {
    type: String,
    default: "请文明发言",
  },
});

// 表单校验
const checkPostComment = (rule, value, callback) => {
  if (value == null && formData.value.image == null) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

// post 评论相关，数据，框实例，校验
const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [
    { required: true, message: "请输入评论内容", validator: checkPostComment },
    { min: 5, message: "评论至少5个字" },
  ],
};

const emit = defineEmits(["postCommentFinish"])

const postCommentDo = ()=>{
  formDataRef.value.validate(async (valid)=>{
    if(!valid){
      return;
    }
    let params = Object.assign({},formData.value)
    params.articleId = props.articleId
    params.pCommentId = props.pCommentId
    params.replyUserId = props.replyUserId 
    let result = await proxy.Request({
      url:api.postComment,
      params
    })
    if(!result){
      return;
    }
    proxy.Message.success("评论发表成功");
    formDataRef.value.resetFields(); // 发表完成过后清空输入框
    // 输入完成过后，需要在评论列表中 unshift一条评论，这个也需要父组件去做
    // 记住可以有多个父组件，父组件自己去调用这个方法，做相应的操作
    // 传一个参数过去，就是我们评论完成过后，会返回一个res.data，把这个data传过去
    console.log(result.data)
    emit("postCommentFinish",result.data);
  })
}


// 选择图片方法逻辑
const selectImg = ()=>{

}

</script>

<style scoped lang="less">
    .comment-post{
        display: flex;
        align-items: top;

        .form{
            flex: 1;
            margin: 0px 10px;

            .insert-img {
                line-height: normal;
                .iconfont {
                    margin-top: 3px;
                    font-size: 20px;
                    color: #3f3f3f;
                }
                .pre-img {
                    margin-top: 10px;
                    position: relative;
                    .iconfont {
                    cursor: pointer;
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    color: rgb(121, 121, 121);
                    }
                }
            }
        }
    }
</style>
