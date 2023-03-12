<template>
   <div class="header" v-show="showHeader">
        <Header></Header>
   </div>
   <div class="main">
        <router-view />
   </div>
   <div class="footer">
        <Footer></Footer>
   </div>

   <!-- 回到顶部 那个按钮 -->

   <el-backtop :right="100" :botton="100"></el-backtop>

</template>


<script setup>
import Header from '@/views/Header/index.vue'
import Footer from '@/views/Footer/index.vue'
import { onMounted, ref } from 'vue'

let showHeader =ref(true)

// 获取当前滚动条的Top数值
const getScrollTop = () =>{
    let scrollTop = document.documentElement.scrollTop||window.pageYOffset||document.body.scrollTop;
    return scrollTop;
}
const initScroll = ()=>{
    let initScrollTop = getScrollTop()
    // window.addEventListener("scroll",()=>{
    //     let currentScrollTop = getScrollTop()
    //     if(currentScrollTop>initScrollTop&&currentScrollTop>=120){
    //         showHeader.value = false
    //     }
    //     else{
    //         showHeader.value = true
    //     }
    //     initScrollTop = currentScrollTop
    // })
}
onMounted(
    ()=>{
        initScroll()
    }
)

</script>

<style lang="less">
.header{
    width: 100%;
    box-shadow: 0 2px 6px 0 #ddd;
    position: fixed;
    background-color: #fff;
    z-index:100;
}
.main{
    // position: relative;
    padding-top: 60px;
    min-height: calc(~"100vh - 180px");
    
}
.footer{
    width: 100%;
    background-color: #fff;
    margin-top:40px;
}

</style>
