<template>
   <el-dialog
     :model-value="show"
     :title="title"
     :width="width"
     :top="top"
     :close-on-click-modal="false"
     draggable
     lock-scroll
     :before-close="handleClose"
   >
     <div class="dialog-body">
      <slot></slot>
    </div>
     <template #footer v-if="showfooter">
       <span class="dialog-footer">
         <el-button v-if="showcancel" @click="cancel">取消</el-button>
         <el-button type="primary">
           确定
         </el-button>
       </span>
     </template>
   </el-dialog>
 </template>
 
 <script lang="ts" setup>
 import { ref } from 'vue'

 const props = defineProps({
   show:{
      type:Boolean,
      default:false
   },
   title:{
      type:String,
      default:""
   },
   width:{
      type:String,
      default:"400px"
   },
   top:{
      type:String,
      default:"120px"
   },
   showfooter:{
      type:Boolean,
      default:true
   },
   showcancel:{
      type:Boolean,
      default:true
   }
 })
 const emit = defineEmits(['close'])

 const cancel = () => {
   emit('close')
 }

 const handleClose = (done: () => void) => {
   cancel()
   done()
}
 
 </script>
 <style scoped lang="less">
.dialog-body{
   min-height: 20px;
   // overflow: scroll;
   // &::-webkit-scrollbar {display:none}
}
// .dialog-footer{
//  }
 </style>
 