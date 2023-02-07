import {ElMessage} from 'element-plus'


// 参数是个回调函数，这个函数的具体作用是啥
const shwoMessage = (msg,callback,type)=>{
    ElMessage({
        type:type,
        message:msg,
        duration:2000,
        onClose:()=>{
            if(callback){
                callback();
            }
        }
    })
}

const message = {
    error:(msg,callback) =>{
        shwoMessage(msg,callback,"error")
    },
    success:(msg,callback) =>{
        shwoMessage(msg,callback,"success")
    },
    info:(msg,callback) =>{
        shwoMessage(msg,callback,"info")
    },
    warning:(msg,callback)=>{
        shwoMessage(msg,callback,"warning")
    }
}

export default message;