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
                    <el-input placeholder="aaaaaaa1" maxlength="20" v-model="formLogin.password" :type="passwordEyeType.passwordEye?'text':'password'">
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
                    <a @click="showPanel(3)">忘记密码？</a>
                    <a @click="showPanel(0)">注册账号</a>
                </div>
                <div class="login-btn">
                    <el-button type="primary" style="width: 100%;" @click=login>确定</el-button>
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
        
        <!-- 忘记密码/重置密码 跟注册窗口类似 -->
        <Dialog :show=showResetPwddialog 
            :title=title
            @close="showResetPwddialog=false"
            :showfooter="false"
            >
            <el-form
                :label-position="labelPosition"
                label-width="78px"
                :model="formResetPwd"
                style="max-width: 400px"
                ref="formResetPwdRef"
                :rules="rules"
            >
                <el-form-item maxlength="30" label="邮箱" prop="email">
                    <el-input v-model="formResetPwd.email">
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="checkcode-panel">
                    <el-form-item label="验证码" prop="emailCode">
                        <el-input maxlength="5" v-model="formResetPwd.emailCode">
                            <template #prefix>
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                        <p>未收到邮箱验证码？</p>
                    </el-form-item>
                    <el-button type="primary" class="checkcode" @click="showPanel(2,1)">获取验证码</el-button>
                
                </div>

                <el-form-item label="密码" prop="registerPassword">
                    <el-input maxlength="20" v-model="formResetPwd.registerPassword" :type="passwordEyeType.registerPasswordEye?'text':'password'">
                        <template #prefix>
                            <span class="iconfont icon-password"></span>
                        </template>
                        <template #suffix>
                            <span @click="eyeChange('registerPasswordEye')" :class="['iconfont',passwordEyeType.registerPasswordEye?'icon-eye':'icon-close-eye']" ></span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="repeatPassword2">
                    <el-input maxlength="20" v-model="formResetPwd.repeatPassword2" :type="passwordEyeType.repeatPasswordEye?'text':'password'">
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
                        <el-input maxlength="5" v-model="formResetPwd.checkCode">
                            <template #prefix>
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <img :src="checkCodeUrl" class="checkcode" @click="changeCheckCode(0)"/>
                </div>

                <div class="no-account">
                    <a @click="showPanel(1)">去登录？</a>
                </div>
                <div class="login-btn">
                    <el-button type="primary" style="width: 100%;" @click="resetPwd">重置密码</el-button>
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
                    <span>{{ formRegister.email != ''?formRegister.email:formResetPwd.email }}</span>
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
import md5 from 'js-md5'
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
    nickName:'',
    registerPassword: '',
    repeatPassword:'',
    checkCode: '',
})
const formSendEmailRef = ref()
const formSendEmail = reactive({  
    email:'',
    checkCode:'',
})
const formResetPwdRef = ref()
const formResetPwd = reactive({
    email:'',
    emailCode:'',
    registerPassword: '',
    repeatPassword2:'',
    checkCode: '',
})
// 
// 定义dialog的一些配置项
const showLogindialog = ref(false)
const showRegisterdialog = ref(false)
const showSendEmaildialog = ref(false)
const showResetPwddialog = ref(false)
const title = ref()
const labelPosition = ref('left')

// 打开各个dialog部分
const showPanel = (type,anotherType)=>{
    if(type==1){
        title.value = "登录"
        showRegisterdialog.value = false
        showResetPwddialog.value = false
        showLogindialog.value = true

        // nextTick相当于 每一次打开这个dialog(执行这个地方)的时候，在其之前就会执行一次nextTick
        nextTick(()=>{
            // 打开登录窗口之前，会刷新验证码，会重置表单；这里是重置的表单，但变量应该还是有值;
            formLoginRef.value.resetFields()
            changeCheckCode(0)
            
            // 会检查cookies里面是否有我们存储的loginInfo对象，如果有，则将邮箱 密码复制到表单输入框中
            const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
            if(cookieLoginInfo){
                formLogin.email = cookieLoginInfo.email
                formLogin.password = cookieLoginInfo.password
            }
        })

    }else if(type==0){
        title.value = "注册"
        showLogindialog.value = false
        showRegisterdialog.value = true
        nextTick(()=>{
            formRegisterRef.value.resetFields()
            changeCheckCode(0)
        })
    }else if(type==2){
        if(anotherType==1){
            formResetPwdRef.value.validateField("email",(valid)=>{
                if(!valid){
                    return;
                }
                showSendEmaildialog.value = true
                formRegister.email = ''
                nextTick(()=>{
                    changeCheckCode(1)
                    formSendEmailRef.value.resetFields();
                    formSendEmail.email = formResetPwd.email
                })
            })
        }
        else{
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
    }else{
        showLogindialog.value = false
        showResetPwddialog.value = true
        title.value = "重置密码"
        nextTick(()=>{
            formResetPwdRef.value.resetFields()
            changeCheckCode(0)
        })
    }
}
// 这里暴露出这个方法给父组件。父组件的登录注册按钮，type 传0或者1
// btw anotherType是用来区分发送邮件框 是注册点出来的，还是重置密码点出来的。
defineExpose({showPanel})


// 发送邮件方法时,这里还得做一次校验
const sendEmailCode =()=>{
    formSendEmailRef.value.validate(async (valid) =>{
        if(!valid){
            return;
        }
        const params = Object.assign({},formSendEmail)

        // 0 是注册，1是找回密码
        params.type = formRegister.email != ''?0:1

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
// 重置密码逻辑
const resetPwd = () => {
    formResetPwdRef.value.validate(async (valid)=>{
        if(!valid){
            return;
        }
        const params = Object.assign({},formResetPwd)
        params.password = formResetPwd.registerPassword
        delete params.registerPassword
        delete params.repeatPassword2
        let result = await proxy.Request({
            url:api.resetPwd,
            params:params,
            // 如果发生错误，还是要刷新验证码
            errorCallback:()=>{
                changeCheckCode(0)
            }
        });
        if(!result){
            return;
        }      
        proxy.Message.success('重置密码成功，请登录')
        title.value = '登录'
        showResetPwddialog.value = false
        showLogindialog.value = true
    })
}

// 登录逻辑
const login = () => {
 
    formLoginRef.value.validate(async (valid)=>{
        // 如果表单的东西进行校验，返回的是false，那么就是验证失败，直接return
        if(!valid){
            return;
        }
        // 将表单中输入的值复制给params
        const params = Object.assign({},formLogin)
        // 如果有缓存的账号密码获取到
        let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
        let cookiePassword = cookieLoginInfo==null?null:cookieLoginInfo.password
        // 如果我们是自己手动输入的密码，那么就要进行md转换。cookie里面的password肯定是md5过后了的
        if(params.password !== cookiePassword){
            params.password = md5(params.password)
        }
        // 如果选择记住密码（一个电脑貌似只能缓存一个）
        if(params.remenberMe){
            // 创建一个对象，接收要缓存的三个东西
            const loginInfo = {
                email:params.email,
                password:params.password,
                remenberMe:params.remenberMe
            }
            // 保存到cookies里面，,待到下一次打开dialog时，会从这里面获取
            proxy.VueCookies.set("loginInfo",loginInfo,"7d")
        }else{
            // 如果没有记住密码，那么就删除这个对象
            proxy.VueCookies.remove("loginInfo")
        }
        // 发起登录请求，参数是 api地址+参数params
        let result = await proxy.Request({
            url:api.login,
            params:params,
            // 如果发生错误，刷新验证码，并报错提示
            errorCallback: () => {
                changeCheckCode(0);
            },
        });
        if (!result) {
            return;
        }
        // 登录成功过后，关闭登录dialog，并提示 登录成功。
        showLogindialog.value = false
        proxy.Message.success("登录成功")
    })
}
// 规则校验部分
// 重复密码 注册时
const checkRepeatPassword =(rule,value,callback)=> {
    if(value!=formRegister.registerPassword){
        callback(new Error(rule.message))
    }else{
        callback()
    }
}
// 重复密码 找回密码时
const checkRepeatPassword2 =(rule,value,callback)=> {
    if(value!=formResetPwd.registerPassword){
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
    repeatPassword2:[{required:true,message:"请输入密码"},
        {validator:checkRepeatPassword2,message:"两次输入密码不一致"},
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
      