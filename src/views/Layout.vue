<template>
   <div class="header" v-show="showHeader">
        <Header></Header>
   </div>
   <div class="main">
        <router-view />
   </div>
   <div class="footer">
   </div>

</template>

<script setup>
import Header from '@/views/Header/index.vue'
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

<style scoped lang="less">
.header{
    width: 100%;
    box-shadow: 0 2px 6px 0 #ddd;
    position: fixed;
    background-color: #fff;
}
.main{
    // position: relative;
    padding-top: 60px;
}
</style>
