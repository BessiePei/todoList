<template>
  <!-- 强制出现 display: block -->
  <div class="modal modal-backdrop" tabindex="-1" role="dialog" style="display: block" data-backdrop="true" >
    <div class="modal-dialog" role="document">
      <div class="modal-header">
        <!-- 弹窗标题-->
        <h4 class="modal-title">{{dialogInfo.title || '提示'}}</h4>
        <button type="button" class="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <!-- 弹窗内容 -->
        <p>{{dialogInfo.text}}</p>
      </div>
      <div class="modal-footer">
        <!-- 取消按钮，点击取消，cancelText可设置按钮文案 -->
        <button type="button" class="btn btn-default" @click="cancel()">{{dialogInfo.cancelText || '取消'}}</button>
        <button type="button" class="btn btn-primary" @click="confirm()">{{dialogInfo.confirmText || '确认'}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import vm from "../main"
export default {
  name: "ConfirmDialog",
  props: {
    // 弹窗相关信息
    dialogInfo: {
      type:Object,
      default: () =>{}
    }
  },
  methods: {
    // 点击取消
    cancel() {
      // 先判断reject方法在不在
      if(this.dialogInfo.reject) {
        // 取消就reject掉
        this.dialogInfo.reject();
        // 触发done事件，方便后续弹窗关闭、移除等逻辑处理
        this.$emit("done");
      }
    },
    // 点击确认
    confirm() {
      // 要先判断一下resolve方法在不在
      if(this.dialogInfo.resolve) {
        // 确认就resolve掉
        this.dialogInfo.resolve();
        // 触发done事件，方便后续弹窗关闭、移除等逻辑处理
        this.$emit("done");
      }
    }
  }
}
</script>

<style scoped>
/* scoped：该组件中局部引入 bootstrap 样式，不影响全局样式 */
@import "https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css";
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: rgb(0,0,0,0.5);
}
.modal-dialog {
  background-color: white;
}

</style>