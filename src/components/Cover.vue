<template>
   <div class="cover" :style="{width:width+'px',height:width+'px'}">

    <el-image :style="{width:width+'px',height:width+'px'}" fit="cover" loading="lazy"
        :src="cover ?proxy.globalInfo.imageUrl + cover :'/src/assets/menpiano.jpeg'">
    </el-image>
   </div>
</template>

<script setup> 
import { getCurrentInstance } from 'vue';
const {proxy} = getCurrentInstance()

const props = defineProps({
    cover:{
        type:String,
    },
    width:{
        type:Number,
        default:60
    }
})

</script>

<style scoped lang="less">
.cover{
    border-radius: 5px;
    overflow: hidden;
}
</style>
