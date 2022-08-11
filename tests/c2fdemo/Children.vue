<template>
  <div class="child">
    <el-row class="btn-list">
      <div class="btn">
        <el-button type="danger" @click="transferIn('submit5', '都有中转方法，且只能一次调用一个')">
          子组件和父组件都有中转方法
        </el-button>
      </div>
    </el-row>
  </div>
</template>
<script>
export default {
  methods: {
    // 子=>父组件通信中转方法入口，传入父组件方法以及参数即可
    transferIn(method, value) {
      this.$emit('toFather', {
        method,
        value
      })
    }
  }
}
</script>
