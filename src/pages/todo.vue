<template>
  <div class="back">
    <div class="todopap">
      <section class="todoapp">
      <header class="header">
      <h1>todo</h1>
    <input class="new-todo" placeholder="接下来你要做什么？" v-model="newTodo"
           v-autofocus @keyup.enter="addTodo"/>
        </header>
      <section class="main" v-show="todos.length+1">
    <!--平滑展示匹配内容动画-->
    <TransitionGroup
        name="staggered-fade"
        tag="ul"
        v-bind:css="false"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        @leave="onLeave"
        class="todo-list"
    >
      <li
      v-for="todo in computedTodos"
      class="todo"
      :key="todo.id"
      v-autofocus
      :class="{ completed: todo.completed }"
      >
        <!-- 使用 todo-item 组件 -->
        <!-- “双向绑定”备忘内容 title 和备忘已完成状态 completed -->
        <!-- 监听 delete 事件 -->
        <todo-item
          v-bind:title.sync="todo.title"
          v-bind:completed.sync="todo.completed"
          @delete="removeTodo(todo)"
        ></todo-item>
        <!-- v-bind.sync="todo.title“ 相当于v-bind:title="todo.title"
  v-on:update:title="todo.title = $event"-->
      </li>
    </TransitionGroup>
        </section>
    <footer class="footer" v-show="todos.length">
        <span class="todo-count">
            <strong>{{remaining}}</strong> {{remaining | pluralize}} left
        </span>
        <ul class="filters">
          <li>
            <router-link :to="{query:{state:''}}" active-class="selected" exact>All</router-link>
          </li>
          <li>
            <router-link :to="{query: {state: 'active'}}" active-class="selected" exact
            >Active</router-link>
          </li>
          <li>
            <router-link
              :to="{query: {state: 'completed'}}"
              active-class="selected"
              exact
              >Completed</router-link>
          </li>
        </ul>
        <!--当前有已完成的备忘录时，一键清除已完成按钮出现-->
        <button class="clear-completed"
            @click="removeCompleted"
            v-show="todos.length > remaining">
            Clear Completed
        </button>
    </footer>
        </section>
    </div>
    </div>
</template>


<script>
import gsap from 'gsap'
// import  Velocity from 'velocity-animate'
import TodoItem from "@/components/TodoItem";
let id = 1;
export default {
    components: {
      "todo-item": TodoItem
    },
    data() {
        return {
          // 初始化的时候，获取下本地的缓存
            todos: JSON.parse(localStorage.getItem('todos') || '[]'),  //所有备忘录
          /*还可以使用 sessionStorage。
          不同之处在于 localStorage 里面存储的数据没有过期时间设置，
          而存储在 sessionStorage 里面的数据在页面会话结束（当前浏览器标签关闭）时会被清除
           */
          newTodo: "",
            editedTodo: {}
        };
    },
    watch: {
    // 侦听 todos 的变化
    todos(newVal) {
        // 每次更新写入缓存
        localStorage.setItem("todos", JSON.stringify(newVal));
      }
    },
    methods: {
        // 进入中
        beforeEnter(el) {
          el.style.opacity = 0;
          el.style.height = 0;
        },
        enter(el, done) {
          console.log("entering2");
      gsap.to(el, {
        opacity: 1,
        height: '58px',
        delay: el.dataset.index * 0.15,
        onComplete: done
      })
    },
    onLeave(el, done) { // 不走这段，不知道为什么
          console.log("leaving2");
      gsap.to(el, {
        opacity: 0,
        height: 0,
        delay: el.dataset.index * 0.15,
        onComplete: done
      })
    },
        // enter
    //     enter: function (el, done) {
    //       console.log("entering");
    //   var delay = el.dataset.index * 150
    //   setTimeout(function () {
    //     Velocity(  //已通过index.html引入全局js，解决
    //       el,
    //       { opacity: 1, height: '58px' },
    //       { complete: done }
    //     )
    //   }, delay)
    // },
    // onLeave: function(el, done) {
    //       console.log("leaving");
    //   var delay = el.dataset.index * 150
    //   setTimeout(function () {
    //     Velocity(
    //       el,
    //       { opacity: 0, height: 0 },
    //       { complete: done }
    //     )
    //   }, delay)
    // },

        //新增备忘
        addTodo() {
            //内容为空则不处理
            if (!this.newTodo) {
                return;
            }
            //向备忘列表中新增一条
            //最后新增的备忘查在最前面，用unshift
            this.todos.unshift({
                id: id++,
                title: this.newTodo,
                completed: false,
                date: ""
            });
            //添加成功后，清空输入框，方便重新输入。
            this.newTodo = "";
        },
        // //编辑备忘录
        // editTodo(todo) {
        //     this.editedTodo = { ...todo};
        // },
        // doneEdit(todo) {
        //     this.todos = this.todos.map(x => {
        //         return todo.id == x.id ? {...todo}:{...x};
        //     });
        //     //清空编辑对象
        //     this.editedTodo = {};
        // },
        // cancelEdit() {
        //      this.editedTodo = {};
        // },
        //删除备忘录
        removeTodo(todo) {
            //匹配 id 找出该备忘录，然后移除
            const index = this.todos.findIndex(x => x.id === todo.id);
            this.todos.splice(index,1);
        },
        //删除已经完成的
        removeCompleted() {
            this.todos = this.todos.filter(x => !x.completed);
        }
    },
    computed: {
        //计算剩余未完成的备忘录
        remaining(){
            //过滤掉已经完成的，获取数量
            return this.todos.filter(x => !x.completed).length;
        },
        // 计算匹配的备忘录
        computedTodos() {
          // 先过滤状态
          // this.$route 可获取当前路由信息
          const state = this.$route.query.state;
          console.log(state);
          const filterTodos = this.todos.filter(x => {
            if(state === "active") {
              return !x.completed;
            } else if (state === "completed") {
              return x.completed;
            } else {
              return true;
            }
          });
          // 过滤展示匹配的内容
          return filterTodos.filter(item => {
            return (
                item.title.toLowerCase().indexOf(this.newTodo.toLowerCase()) !== -1
            );
          })
        }
    },
    filters: {
        //计算单位
        pluralize(num) {
            //如果是多个，则加复数
            return num > 1 ? "items" : "item";
        }
    },
    directives: {
        autofocus: {
        // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
        inserted: function(el) {
            // el: 指令所绑定的元素，可以用来直接操作 DOM
            el.focus();
        }
        }
    }
};
</script>

<style scoped>
@import "https://unpkg.com/todomvc-app-css@2.1.0/index.css";
*, ::after, ::before {
    box-sizing: inherit;
}
.back {
  border: cornsilk 0px solid;
}

</style>