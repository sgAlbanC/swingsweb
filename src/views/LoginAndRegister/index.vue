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
                :rules="rules"
                :hide-required-asterisk="true"
            >
                <el-form-item label="邮箱" prop="email">
                    <el-input maxlength="30" v-model="formLogin.email">
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input maxlength="20" v-model="formLogin.password" :type="passwordEyeType.passwordEye?'text':'password'">
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
                        <el-input maxlength="5" v-model="formLogin.checkCode">
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

        <!-- 注册窗口 -->
        <Dialog :show=showRegisterdialog 
            :title=title
            @close="showRegisterdialog=false"
            :showfooter="false"
            >
            <el-form
                :label-position="labelPosition"
                label-width="78px"
                :model="formRegister"
                style="max-width: 400px"
                ref="formRegisterRef"
                :rules="rules"
            >
                <el-form-item maxlength="30" label="邮箱" prop="email">
                    <el-input v-model="formRegister.email" placeholder="390200763@qq.com">
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="checkcode-panel">
                    <el-form-item label="验证码" prop="emailCode">
                        <el-input maxlength="5" v-model="formRegister.emailCode">
                            <template #prefix>
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                        <p>未收到邮箱验证码？</p>
                    </el-form-item>
                    <el-button type="primary" class="checkcode" @click="showPanel(2)">获取验证码</el-button>
                
                </div>
                <el-form-item label="昵称" prop="nickName">
                    <el-input maxlength="20" v-model="formRegister.nickName">
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item label="密码" prop="registerPassword">
                    <el-input maxlength="20" v-model="formRegister.registerPassword" :type="passwordEyeType.registerPasswordEye?'text':'password'">
                        <template #prefix>
                            <span class="iconfont icon-password"></span>
                        </template>
                        <template #suffix>
                            <span @click="eyeChange('registerPasswordEye')" :class="['iconfont',passwordEyeType.registerPasswordEye?'icon-eye':'icon-close-eye']" ></span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="repeatPassword">
                    <el-input maxlength="20" v-model="formRegister.repeatPassword" :type="passwordEyeType.repeatPasswordEye?'text':'password'">
                        <template #prefix>
                            <span class="iconfont icon-password"></span>
                        </template>
                        <template #suffix>
                            <span @click="eyeChange('repeatPasswordEye')" :class="['iconfont',passwordEyeType.repeatPasswordEye?'icon-eye':'icon-close-eye']" ></span>
                        </template>
                    </el-input>
                </el-form-item>

                <div class="checkcode-panel">
                    <el-form-item label="验证码" prop="checkCode">
                        <el-input maxlength="5" v-model="formRegister.checkCode">
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
                    <el-button type="primary" style="width: 100%;" @click="regist">注册</el-button>
                </div>
            </el-form>
        </Dialog>

        <!-- 发送邮件dialog窗口 -->
        <Dialog :show="showSendEmaildialog"
            :title=title
            @close="showSendEmaildialog=false"
            :showfooter="false"
            >
            <el-form
                :label-position="labelPosition"
                label-width="70px"
                :model="formSendEmail"
                style="max-width: 400px"
                ref="formSendEmailRef"
                :rules="rules"
                >
                <!-- 这里的prop="email" 貌似没有什么用，就为了拿到一个校验前面的星号样式 -->
                <el-form-item maxlength="30" label="邮箱" prop="email">
                    <span>{{ formRegister.email }}</span>
                </el-form-item>
                <div class="checkcode-panel">
                    <el-form-item label="验证码" prop="checkCode">
                        <el-input maxlength="5" v-model="formSendEmail.checkCode">
                            <template #prefix>
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <img :src="checkCodeUrl4SendMailCode" class="checkcode" @click="changeCheckCode(1)"/>
                </div>
                <div class="login-btn">
                    <el-button type="primary" style="width: 100%;" @click="sendEmailCode">发送验证码</el-button>
                </div>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import {ref,reactive,getCurrentInstance,nextTick } from 'vue'
const {proxy} = getCurrentInstance();

const api = {
    checkCode:"/api/checkCode",
    sendEmailCode:'/sendEmailCode',
    register:'/register',
    login:'/login',
    resetPwd:'/resetPwd'
}

// 表单数据部分
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
const formSendEmailRef = ref()
const formSendEmail = reactive({  
    email:'',
    checkCode:'',
})
// 
// 定义dialog的一些配置项
const opType = ref()
const showLogindialog = ref(false)
const showRegisterdialog = ref(false)
const showSendEmaildialog = ref(false)
const title = ref()
const labelPosition = ref('left')

// 打开dialog部分
const showPanel = (type)=>{
    opType.value=type
    if(type==1){
        title.value = "登录"
        showRegisterdialog.value = false
        showLogindialog.value = true
        nextTick(()=>{
            formLoginRef.value.resetFields()
        })

    }else if(type==0){
        title.value = "注册"
        showLogindialog.value = false
        showRegisterdialog.value = true
        nextTick(()=>{
            formRegisterRef.value.resetFields()
        })
    }else{
        formRegisterRef.value.validateField("email",(valid)=>{
            if(!valid){
                return;
            }
            showSendEmaildialog.value = true
            nextTick(()=>{
                changeCheckCode(1)
                formSendEmailRef.value.resetFields();
                formSendEmail.email = formRegister.email
            })
        })
    }
}
defineExpose({showPanel})


// 发送邮件方法时,这里还得做一次校验
const sendEmailCode =()=>{
    formSendEmailRef.value.validate(async (valid) =>{
        if(!valid){
            return;
        }
        const params = Object.assign({},formSendEmail)
        params.type = 0
        let result = await proxy.Request({
            url:api.sendEmailCode,
            params:params,
            errorCallback:()=>{
                changeCheckCode(1);
            }
        });
        if(!result){
            return;
        }        
        proxy.Message.success('验证码发送成功，请登录邮箱查看')
        showSendEmaildialog.value = false

    });

}

// 注册逻辑
const regist = () => {
    formRegisterRef.value.validate(async (valid)=>{
        if(!valid){
            return;
        }
        const params = Object.assign({},formRegister)
        params.password = formRegister.registerPassword
        delete params.registerPassword
        delete params.repeatPassword
        console.log(params)
        let result = await proxy.Request({
            url:api.register,
            params:params,
            // 如果发生错误，还是要刷新验证码
            errorCallback:()=>{
                changeCheckCode(0)
            }
        });
        if(!result){
            return;
        }      
        
        proxy.Message.success('注册成功')
        title.value = '登录'
        showRegisterdialog.value = false
        showLogindialog.value = true
    })
}

// 规则校验部分
// 重复密码
const checkRepeatPassword =(rule,value,callback)=> {
    if(value!=formRegister.registerPassword){
        callback(new Error(rule.message))
    }else{
        callback()
    }
}
// 其他规则
const rules = {
    email:[{required:true,message:"请输入邮箱"},
        {validator:proxy.Verify.email,message:"请输入正确的邮箱"},
    ],
    password:[{required:true,message:"请输入密码"},
        {validator:proxy.Verify.password,message:"密码只能有6-16位"},
    ],
    checkCode:[{required:true,message:'请输入验证码'}],
    emailCode:[{required:true,message:'请输入验证码'}],
    nickName:[{required:true,message:'昵称不能为空'}],
    registerPassword:[{required:true,message:"请输入密码"},
        {validator:proxy.Verify.password,message:"密码只能有6-16位,且必须包含数字和字母"},
    ],
    repeatPassword:[{required:true,message:"请输入密码"},
        {validator:checkRepeatPassword,message:"两次输入密码不一致"},
    ],
}

// 验证码部分
const checkCodeUrl  =ref(api.checkCode)
const checkCodeUrl4SendMailCode  =ref(api.checkCode)
// api文档 登录注册的type为0，发邮件为1，两个验证码还不一样
const changeCheckCode = (type)=>{
    if(type == 0){
        checkCodeUrl.value = api.checkCode+"?type="+type+"&time="+new Date().getTime()
    }else{
        checkCodeUrl4SendMailCode.value = api.checkCode+"?type="+type+"&time="+new Date().getTime()
    }
    
}

// 密码显示隐藏操作部分
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
      