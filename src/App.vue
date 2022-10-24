<template>
  <!--<div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>

  </div>-->
  <!--<main>
    <Todo />
    <TGtest />
  </main>-->
  <div id="app">
    <!--使用<router-view></router-view>来渲染最高级路由匹配到的组件 -->
    <router-view></router-view>
    <!-- 动态组件由vm实例的component控制 -->
    <!-- done 事件绑定用户操作完毕 -->
    <!--内置组件<component></component>，它渲染一个“元组件”为动态组件。根据is的值，来决定哪个组件被渲染-->
    <component
        v-for="(item,index) in items"
        :key="index"
        :is="item.component"
        :dialogInfo="item.dialogInfo"
        @done="doneDialog(index)"
    >
    </component>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import TGtest from './components/transposition-group-test.vue'
import Todo from './pages/todo.vue'
// 弹窗组件
import ConfirmDialog from "./components/ConfirmDialog";
// 获取 Vue 实例
import vm from "./main";
export default {
  name: 'app',
  data() {
    return {
      items: []
    };
  },
  mounted() {
    // 如果在这里，首次加载界面的时候，无法正确获取到Vue实例
    // DOM还没有更新
    this.$nextTick(()=>{
      // DOM现在更新了
      vm.$on("setDialog",dialogInfo => {
        // 将弹窗相关西悉尼、弹窗组件添加进 component 数组中
        this.items.push({dialogInfo,component: ConfirmDialog});
      })
    })
  },
  methods: {
    doneDialog(index) {
      // 用户已经点击了该弹窗，可以从列表中移除了
      this.items.splice(index,1);
    }
  }
}
</script>

<style>
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  background-color: cornsilk;
}*/
html,
body {
	margin: 0;
	padding: 0;
}

body {
	font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
	line-height: 1.4em;
	background: #fbfbfb;
	min-width: 230px;
	max-width: 550px;
	margin: 0 auto;
  /*https://blog.csdn.net/jjting/article/details/38295441*/
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-weight: 300;
}

</style>
