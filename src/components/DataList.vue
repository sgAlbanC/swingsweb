<template>
   <div v-for="item in dataSource.list" class="">
    <!-- 为什么是插槽？这个插槽代表其他组件使用这个组件的时候，中间可以使用template去添加东西 -->
        <slot :data="item"></slot> 
   </div>
   <div class="pagination">
    <el-pagination
      v-if="dataSource.pageTotal > 1"
      background
      :total="dataSource.totalCount"
      :current-page.sync="dataSource.pageNo"
      layout="prev, pager, next"
      @current-change="handlePageNoChange"
      style="text-align: right"
      :page-size="15"
    ></el-pagination>
  </div>
</template>

<script setup>
const props = defineProps({
    dataSource:{
        type:Object
    }
})

const emit = defineEmits(["loadData"])

const handlePageNoChange = (pageNo)=>{
  // 点击分页 改变了页码过后，要传回去给dataSource，并且提交一个方法给父组件重新请求数据使用
    props.dataSource.pageNo = pageNo;
    emit("loadData")
}

</script>

<style scoped lang="less">
.pagination{
  margin-left: 15px;
  margin-bottom: 10px;
}
</style>
