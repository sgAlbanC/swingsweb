<template>
  <el-image
    class="comment-img"
    :src="src"
    :zoom-rate="1.2"
    :preview-src-list="imgList ? imgList : [src]"
    :initial-index="0"
    fit="scale-down"
    loading="lazy"
    hide-on-click-modal
  >

  </el-image>
</template>

<script setup>

const props = defineProps({
    src:{
        type:String,
    },
    imgList:{
        type:Array,
    }
})

</script>

<style lang="less" scoped>
.comment-img{
    height: 80px;
    width: 80px;
    background-color: #eee;
}
</style>
