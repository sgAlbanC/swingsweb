<template>
    <div class="cover-upload">
      <el-upload
        name="file"
        :show-file-list="false"
        accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
        :multiple="false"
        :http-request="uploadImage"
      >
        <div class="cover-upload-btn">
          <!-- 这个是本地图片 -->
          <template v-if="localFile">
            <img :src="localFile" />
          </template>
          <!-- 这个是网上的图片 -->
          <template v-else>
            <img
              :src="
                (imageUlrPrefix ? imageUlrPrefix : proxy.globalInfo.imageUrl) +
                modelValue.imageUrl
              "
              v-if="modelValue && modelValue.imageUrl"
            />
            <!-- 这是图片没有东西的时候，显示那个 大图片 加号 -->
            <span class="iconfont icon-add" v-else></span>
          </template>
        </div>
      </el-upload>
    </div>
</template>
  
  <script setup>
  import { ref, reactive, getCurrentInstance } from "vue";
  import { useRouter, useRoute } from "vue-router";
  const { proxy } = getCurrentInstance();
  const router = useRouter();
  const route = useRoute();
  
  const props = defineProps({
    // 前缀?,区分上传头像和上传封面
    imageUlrPrefix: {
      type: String,
    },
    modelValue: {
      type: Object,
      default: null,
    },
  });
  
  const localFile = ref(null);
  const emit = defineEmits();
  const uploadImage = async (file) => {
    file = file.file;
    let img = new FileReader();
    img.readAsDataURL(file);
    img.onload = ({ target }) => {
      localFile.value = target.result;
    };
    emit("update:modelValue", file);
  };
  </script>
  
  <style lang="less" scoped>
  .cover-upload {
    .cover-upload-btn {
      background: rgb(245, 245, 245);
      width: 150px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      .iconfont {
        font-size: 50px;
        color: #ddd;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  </style>