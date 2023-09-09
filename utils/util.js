const formatTime = date => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
    }
    // 格式化时分
const formatHM = date => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${[hour, minute].map(formatNumber).join(':')}`;
}
const formatNumber = n => {
        n = n.toString();
        return n[1] ? n : `0${n}`;
    }
    // 申请开票筛选时间条件
const formatFilterTime = (interval) => {
        let date = (new Date()).getTime() - interval * 30 * 1000 * 60 * 60 * 24;
        date = new Date(date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${[year, month, day].map(formatNumber).join('-')}`;
    }
    // 寄件时间时间条件
const formatFreightTime = (interval) => {
        let date = (new Date()).getTime() + interval * 1000 * 60 * 60 * 24;
        date = new Date(date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${[year, month, day].map(formatNumber).join('-')}`;
    }
    //验证手机号 
const checkPhone = function(val) { 
        return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val);
    }
    //手机号码脱敏
const toHide = function(array) {
        let mphone = array.substring(0, 3) + '****' + array.substring(7);
        return mphone;
    }
    // 数值≥0，保留三位小数
const decimalPoint = function(val) {
        val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //只能输入两个小数
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //控制第一个不能输入小数点"."
        return val
    }
    // 校验非零开头的正整数
const checkNonZeroHead = function(val) {
        val = val.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
        return val;
    }
    // 校验是否包含空格
const checkIsHasSpace = function(val) {
        return /^ +| +$/g.test(val);
    }
    // 校验只能输入英文及数字
const checkNumberEn = function(val) {
        val = val.replace(/[^\a-\z\A-\Z0-9]/g, '');
        return val;
    }
    // 校验是否包含非英文及数字
const checkIsNoHasNumberEn = function(val) {
        return /[^\a-\z\A-\Z0-9]/g.test(val);
    }
    // 校验是否是电话号码
const checkIsTel = function(val) {
        return !(/^0[0-9-]{10,13}$/.test(val));
    }
    // 校验只能输入电话号码（只能输入-和0-9）
const checkTel = function(val) {
        val = val.replace(/[^-|\d]/g, '');
        return val;
    }
    // 校验电话号码 无区号
const checkIsTelNoZone = function(val) {
        return /^\d{7,8}$/.test(val);
    }
    // 校验电话区号
const checkIsTelZone = function(val) {
        return /^0\d{2,3}$/.test(val);
    }
    // 校验是否包特殊字符
const checkIsHasSpecialCharacters = function(val) {
        return /[`~!@#$%^&+=\\?:\"|,/;'\\[\\\]·～！@#￥%……&*+=\\{\\}\\|《》？：“”【】、；‘'，。\\、\\-]/g.test(val);
    }
    // 校验删除特殊字符及空格、汉字
const checkSpecialCharacters = function(val) {
        val = val.replace(/[`~!@#$%^&+=\\?:\"|,/;'\\[\\\]·～！@#￥%……&*+=\\{\\}\\|《》？：“”【】、；‘'，。\\、\\-]/g, '').replace(/^ +| +$/g, '').replace(/[\u4e00-\u9fa5]/g, '');
        return val;
    }
    // 校验删除特殊字符及空格
const checkSpecialCharactersTT = function(val) {
        val = val.replace(/[`~!@#$%^&+=\\?:\"|,/;'\\[\\\]·～！@#￥%……&*+=\\{\\}\\|《》？：“”【】、；‘'，。\\、\\-]/g, '').replace(/^ +| +$/g, '');
        return val;
    }
    // 校验删除特殊字符及空格 只能输入汉字
const checkSpecialCharactersAndNoChz = function(val) {
        val = val.replace(/[`~!@#$%^&+=\\?:\"|,/;'\\[\\\]·～！@#￥%……&*+=\\{\\}\\|《》？：“”【】、；‘'，。\\、\\-]/g, '').replace(/^ +| +$/g, '').replace(/[\a-\z\A-\Z0-9]/g, '');
        return val;
    }
    // 校验删除所有特殊字符
const checkDelAllSpecialCharacters = function(val) {
        val = val.replace(/[^\u4e00-\u9fa5\w]/g, '').replace(/^ +| +$/g, '');
        return val;
    }
    // 校验删除特殊字符及空格（#和-除外） 
const checkSpecialCharactersSub = function(val) {
        val = val.replace(/[`~!@$%^&+=\\?:\"|,/;'\\[\\\]·～！@￥%……&*（）+=\\{\\}\\|《》？：“”【】、；‘'，。\\、\\]/g, '').replace(/^ +| +$/g, '');
        return val;
    }
    // 校验是否包含特殊字符及空格（#和-除外） 
const checkIsHasSpecialCharactersSub = function(val) {
        return /[`~!@$%^&+=\\?:\"|,/;'\\[\\\]·～！@￥%……&*（）+=\\{\\}\\|《》？：“”【】、；‘'，。\\、\\]/g.test(val);
    }
    // 校验只允许输入字母及数字
const checkCharactersNum = function(val) {
        val = val.replace(/[^\a-\z\A-\Z0-9]/g, '');
        return val;
    }
    // 只能输入数字
const checkNum = function(val) {
        val = val.replace(/[^0-9]/g, '');
        return val;
    }
    // 校验是否包含数字和字母/^[0-9a-zA-Z]+$/g.
const checkIsHasNumberEn = function(val) {
        return /^[0-9a-zA-Z]+$/g.test(val);
    }
    // 校验是否字母开头并包含数字 
const checkIsBeginLetterOrtherNum = function(val) {
        return /^[a-zA-Z][a-zA-Z0-9]{5,20}$/g.test(val);
    }
    // 校验密码 
const checkPassword = function(val) {
        return /(?!^[0-9]+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,20}$/.test(val);
    }
    // 判断字符串是否为空
const checkIsNull = function(val) {
        return typeof val == "undefined" || val == null || val == ""
    }
    // 校验是否包含文字
const checkChineseCharacter = function(val) {
        return /^[(\u4e00-\u9fa5)]+$/g.test(val)
    }
    // 防抖
let timer = null;
const debounce = function(fn, wait) {　
        if (typeof fn !== 'function') {　　　 return　 }
        wait = wait || 1000;
        return function() {
            if (timer !== null) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn.apply(this, arguments);
            }, wait);
        }
    }
    // 校验表单项是否有校验不通过项  返回数组  长度为0则无
const setIndexList = function(list, index, flag) {
        if (flag) {
            if (!list.includes(index)) {
                list.push(index);
            }
        } else {
            if (list.includes(index)) {
                list.splice(list.indexOf(index), 1);
            }
        }
        return list;
    }
    //加法 
const accAdd = function(arg1, arg2) {
        let r1, r2, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        return (accMul(arg1, m) + accMul(arg2, m)) / m
    }
    //减法 
const Subtr = function(arg1, arg2) {
    let r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 乘法
const accMul = function(arg1, arg2) {
        let m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) {};
        try { m += s2.split(".")[1].length } catch (e) {};
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }
    // const accDiv = function(arg1, arg2)
    //   {
    //   var t1 = 0, t2 = 0, r1, r2;
    //   try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    //   try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    //   with (Math) {
    //   r1 = Number(arg1.toString().replace(".", ""))
    //   r2 = Number(arg2.toString().replace(".", ""))
    //   return (r1 / r2) * pow(10, t2 - t1);
    //   }
    // } 
    // 省份证校验
const checkID = function(val) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/g.test(val)
    }
    // 省份证校验
const checkIDIsHasOther = function(val) {
        val = val.replace(/([^\d{15}$])|([^\d{18}$])|([^\d{17}(\d|X|x)$])/g, '');
        return val;
    }
    // 校验正整数
const checkIsInteger = function(val) {
        return /^(0|[1-9][0-9]*)$/.test(val) && /^\d{6}$/.test(val);
    }
    // 校验正整数
const checkIsMoreInteger = function(val) {
        return /(^[1-9]\d*$)/g.test(val);
    }
    // 校验输入正整数
const checkInteger = function(val) {
    val = val.replace(/[^1-9]/g, '');
    return val;
}
module.exports = {
    formatTime,
    formatHM,
    checkPhone,
    toHide,
    checkNum,
    decimalPoint,
    checkNonZeroHead,
    checkSpecialCharacters,
    checkSpecialCharactersAndNoChz,
    checkIsHasSpace,
    checkIsHasSpecialCharacters,
    checkNumberEn,
    checkDelAllSpecialCharacters,
    checkIsNoHasNumberEn,
    checkIsTel,
    checkIsTelNoZone,
    checkTel,
    checkSpecialCharactersSub,
    checkIsHasSpecialCharactersSub,
    checkCharactersNum,
    checkIsBeginLetterOrtherNum,
    checkIsHasNumberEn,
    checkPassword,
    checkIsNull,
    checkChineseCharacter,
    debounce,
    setIndexList,
    formatFilterTime,
    formatFreightTime,
    accAdd,
    Subtr,
    accMul,
    checkID,
    checkIDIsHasOther,
    checkIsInteger,
    checkInteger,
    checkIsMoreInteger,
    checkIsTelZone,
    checkSpecialCharactersTT
}