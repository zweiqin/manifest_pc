<template>
  <div class="main">
    <div class="father">
      <div class="msg">案例一子组件传递过来的数据：{{ msg }}</div>
      <div class="children">
        案例一children
        <Children @toFather="transferOut($event)"></Children>
      </div>
    </div>
  </div>
</template>
<script>
import Children from './Children.vue'

export default {
  components: {
    Children
  },
  data() {
    return {
      msg: '案例一还没有传'
    }
  },
  methods: {
    // 子=>父组件通信中转方法出口，传入父组件方法以及参数即可
    transferOut(e) {
      if (!this[e.method]) {
        console.error(`还没有在父组件的methods对象中定义 ${e.method} 方法`)
      } else {
        this[e.method](e.value)
      }
    },
    submit5(value) {
      console.log('触发了submit5方法')
      this.msg = value
    }
  }
}
</script>
