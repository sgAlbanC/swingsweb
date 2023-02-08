const regs = {
    email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    number: /^([0]|[1-9][0-9]*)$/,
    password: /^(?![0-9]+$)[a-z0-9]{6,16}$/
}

const verify = (rule,value,reg,callback) =>{
    if(value){
        if(reg.test(value)){
            callback()
        }else{
            callback(new Error(rule,rule.message))
            // callback()
        }
    }else{
        callback()
    }
}

export default {
    email:(rule,value,callback)=>{
        return verify(rule,value,regs.email,callback)
    },
    number:(rule,value,callback)=>{
        return verify(rule,value,regs.number,callback)
    },
    password:(rule,value,callback)=>{
        return verify(rule,value,regs.password,callback)
    }
}