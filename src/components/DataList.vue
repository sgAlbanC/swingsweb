<template>
  <div v-if="!loading&&dataSource.list!=null&&dataSource.list.length==0">
    <NoData :msg="noDataMsg"></NoData>
  </div>
  <div class="skeleton" v-if="loading">
    <el-skeleton :row="2" animated></el-skeleton>
  </div>
  
    <!-- 这些请求返回的数据都是由list 属性的 -->
   <div v-for="item in dataSource.list" class="" v-else :key="item">
    <!-- 为什么是插槽？这个插槽代表其他组件使用这个组件的时候，中间可以使用template去添加东西 -->
        <slot :data="item"></slot> 
   </div>
   <div class="pagination">
    <el-pagination
      v-if="dataSource.pageTotal > 1"
      background
      :total="dataSource.totalCount"
      :current-page="dataSource.pageNo"
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
    },
    loading:{
      type:Boolean,
      default:false  // 默认没有正在加载
    },
    noDataMsg:{
      type:String,
      default:"空空如也"
    }
})

const emit = defineEmits(["loadData"])

const handlePageNoChange = (pageNo)=>{
  // 点击分页 改变了页码过后，要传回去给dataSource，并且提交一个方法给父组件重新请求数据使用
    props.dataSource.pageNo = pageNo;
    emit("loadData")
}

</script>

<style lang="less" scoped >
.pagination{
  margin: 10px 0;
}
.skeleton{
  padding: 15px;
}
</style>
