<template>
   <div class="">
        <Dialog :show=showLogindialog 
            :title=title
            @close="showLogindialog=false"
            :showfooter="false"
            >
            <el-form
                :label-position="labelPosition"
                label-width="60px"
                :model="formLogin"
                style="max-width: 400px"
                ref="formLoginRef"
            >
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formLogin.email">
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formLogin.password" :type="passwordEyeType.passwordEye?'text':'password'">
                        <template #prefix>
                            <span class="iconfont icon-password"></span>
                        </template>
                        <template #suffix>
                            <span @click="eyeChange('passwordEye')" :class="['iconfont',passwordEyeType.passwordEye?'icon-eye':'icon-close-eye']" ></span>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="checkcode-panel">
                    <el-form-item label="验证码" prop="checkCode">
                        <el-input v-model="formLogin.checkCode">
                            <template #prefix>
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <img :src="checkCodeUrl" class="checkcode" @click="changeCheckCode(0)"/>
                </div>
                <div class="remember-panel">
                    <el-checkbox label="记住密码" name="type" v-model="formLogin.remenberMe"/>
                </div>
                <div class="no-account">
                    <a>忘记密码？</a>
                    <a @click="showPanel(0)">注册账号</a>
                </div>
                <div class="login-btn">
                    <el-button type="primary" style="width: 100%;">确定</el-button>
                </div>
            </el-form>
        </Dialog>
        <Dialog :show=showRegisterdialog 
            :title=title
            @close="showRegisterdialog=false"
            :showfooter="false"
            >
            <el-form
                :label-position="labelPosition"
                label-width="70px"
                :model="formRegister"
                style="max-width: 400px"
                ref="formRegisterRef"
            >
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formRegister.email">
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="checkcode-panel">
                    <el-form-item label="验证码" prop="emailCode">
                        <el-input v-model="formRegister.emailCode">
                            <template #prefix>
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                        <p>未收到邮箱验证码？</p>
                    </el-form-item>
                    <el-button type="primary" class="checkcode" @click="">获取验证码</el-button>
                
                </div>
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="formRegister.nickName">
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item label="密码" prop="registerPassword">
                    <el-input v-model="formRegister.registerPassword" :type="passwordEyeType.registerPasswordEye?'text':'password'">
                        <template #prefix>
                            <span class="iconfont icon-password"></span>
                        </template>
                        <template #suffix>
                            <span @click="eyeChange('registerPasswordEye')" :class="['iconfont',passwordEyeType.registerPasswordEye?'icon-eye':'icon-close-eye']" ></span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="重复密码">
                    <el-input v-model="formRegister.repeatPassword" :type="passwordEyeType.repeatPasswordEye?'text':'password'">
                        <template #prefix>
                            <span class="iconfont icon-password"></span>
                        </template>
                        <template #suffix>
                            <span @click="eyeChange('repeatPasswordEye')" :class="['iconfont',passwordEyeType.repeatPasswordEye?'icon-eye':'icon-close-eye']" ></span>
                        </template>
                    </el-input>
                </el-form-item>

                <div class="checkcode-panel">
                    <el-form-item label="验证码">
                        <el-input v-model="formRegister.checkCode">
                            <template #prefix>
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <img :src="checkCodeUrl" class="checkcode" @click="changeCheckCode(0)"/>
                </div>

                <div class="no-account">
                    <a @click="showPanel(1)">已有账号？</a>
                </div>
                <div class="login-btn">
                    <el-button type="primary" style="width: 100%;">注册</el-button>
                </div>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import {ref,reactive } from 'vue'

const api = {
    checkCode:"/api/checkCode"
}

const formLoginRef = ref()
const formLogin = reactive({
  email: '',
  password: '',
  checkCode: '',
  remenberMe: true
})
const formRegisterRef= ref()
const formRegister = reactive({
  email: '',
  emailCode:'',
  registerPassword: '',
  repeatPassword:'',
  checkCode: '',
})

const opType = ref()
const showLogindialog = ref(false)
const showRegisterdialog = ref(false)
const title = ref()
const labelPosition = ref('left')

const showPanel = (type)=>{
    opType.value=type
    if(type==1){
        title.value = "登录"
        showRegisterdialog.value = false
        showLogindialog.value = true
        // nextTick(()=>{
        //     formLoginRef.value.resetFields()
        // })
        
    }else{
        title.value = "注册"
        showLogindialog.value = false
        showRegisterdialog.value = true
    }
}
defineExpose({showPanel})


// 验证码
const checkCodeUrl  =ref(api.checkCode)
// api文档 登录注册的type为0，发邮件为1，两个验证码还不一样
const changeCheckCode = (type)=>{
    checkCodeUrl.value = api.checkCode+"?type="+type+"&time="+new Date().getTime()
}

// 密码显示隐藏操作
const passwordEyeType = reactive({
    passwordEye:false,
    registerPasswordEye:false,
    repeatPasswordEye:false
})
const eyeChange = (type)=>{
    passwordEyeType[type] = !passwordEyeType[type]
}

</script>

<style scoped lang="less">
.checkcode-panel{
    display: flex;
    p{
        font-size: 12px;
        color: #409EFF;
        cursor: pointer;
    }
    .checkcode{
        border-radius: 3px;
        height: 32px;
        flex: 1;
        margin: 0 0 0 20px;
    }
}
.no-account{
    padding: 10px 0;
    display: flex;
    justify-content:space-between;
    a{
        color: #409EFF;
        cursor: pointer;
    }
    a:hover{
        opacity:0.8
    }
}
.login-btn{
    padding: 20px 0 10px;
}
</style>
      