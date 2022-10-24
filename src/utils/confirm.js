// 获取该实例
import vm from '../main'

// 传入标题、内容、确认按钮和取消按钮的文案
export function confirmDialog({title,text,cancelText,confirmText}) {
    return new Promise((resolve,reject) => {
        // 把 reject 和 resolve 通过W$emit时间传参带过去，方便进行Promise状态扭转
        vm.$emit("setDialog",{
            title,
            text,
            cancelText,
            confirmText,
            resolve,
            reject
        })
    })
}

export default confirmDialog;