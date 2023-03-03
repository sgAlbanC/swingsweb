<template>
    <div class="attachment-selector">

      <!-- 如果当前有东西，则显示文件的名字，和 删除icon；只有点击删除了过后(清空modelValue)，才显示下面 选择文件 按钮 -->
      <template v-if="modelValue">
        <div class="file-show">
          <div class="file-name" :title="modelValue.name">
            {{ modelValue.name }}
          </div>
          <div class="iconfont icon-del" @click="delFile"></div>
        </div>
      </template>
    
      <!-- 当前没有文件,则显示 按钮 选择文件 -->
      <el-upload
        v-else
        name="file"
        :show-file-list="false"
        accept=".zip,.rar"
        :multiple="false"
        :http-request="selectFile"
      >
        <el-button type="primary">选择文件</el-button>
      </el-upload>
    </div>
</template>
  
  <script setup>
  import { getCurrentInstance } from "vue";
  const { proxy } = getCurrentInstance();
  
  const props = defineProps({
    modelValue: {
      type: Object,
      default: null,
    },
  });
  
  const emit = defineEmits();
  const selectFile = async (file) => {
    emit("update:modelValue", file.file);
  };
  
  // update:modelValue,监视modelValue？
  const delFile = () => {
    emit("update:modelValue", null);
  };
  </script>
  
  <style lang="less" scoped>
  .attachment-selector {
    width: 100%;
    .file-show {
      display: flex;
      justify-content: space-around;
      .file-name {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        // color: var(--link);
      }
      .icon-del {
        width: 20px;
        color: rgb(18, 149, 218);
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
  </style>