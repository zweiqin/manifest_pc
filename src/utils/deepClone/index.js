//这个是index.js文件
import deepclone from './deepClone'
let _Vue = null
export default class DeepClone {
  static install(Vue) { //install方法需要的参数是Vue的构造方法。调用该方法时会传递Vue的构造函数
    //首先判断插件是否已经被安装，如果已经被安装，就不需要重复安装。
    if (DeepClone.install.installed) {    //1、判断当前插件是否已经被安装:
      return      //条件成立，表明插件已经被安装，什么都不要做。
    }
    DeepClone.install.installed = true
    _Vue = Vue    //2、把Vue构造函数记录到全局变量中。
    _Vue.prototype.$deepclone = deepclone
  }
}
