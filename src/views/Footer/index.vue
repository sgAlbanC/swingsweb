<template>
   <div class="footer-panel" style="width:1280px">
        <div class="left">
            Our lives are not our own. 
            We are bound to others, past and present,
            and by each crime and every kindness, we birth our future.
        </div>
        <div class="right">
            <!-- 我们的生命不是我们自己的，从子宫到坟墓，我们和其他人紧紧相连。无论前世还是今生，每一桩恶行
            每一项善举，都在未来轮回。 -->
            <span class="thx">感谢B站up主<a href="https://space.bilibili.com/499388891">@程序员老罗</a>的视频讲解</span>
        </div>
   </div>
</template>

<script setup>

</script>

<style scoped lang="less">
.footer-panel{
    height: 40px;
    margin: 0 auto;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .left {
        line-height: 20px;
        padding: 0 10px;
        text-align: center;
    }
    .right{
        line-height: 20px;
        padding: 0 10px;
        text-align: center;
        .thx{
            color: #888888;
            a{
                color: #1295DA;
            }
        }
    }
}
</style>
