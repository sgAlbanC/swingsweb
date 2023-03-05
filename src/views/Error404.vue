<template>
   <div class="error">
    <div>页面不存在</div>
    <div class="info">404</div>
    <div><router-link to="/" class="a-link">返回首页</router-link></div>
   </div>
</template>

<script setup>

</script>

<style scoped lang="less">
.error{
    text-align: center;
    color: rgb(18, 149, 218);
    margin-top: 150px;
    font-size: 20px;
    .info{
        font-size: 100px;
        margin: 20px 0;
    }
    .a-link{
        
    }
}
</style>
