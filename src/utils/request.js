import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

const defaultOpt = { login: true }

let done = true

function baseRequest(options) {
  const token = getToken()
  const headers = options.headers || {}
  headers['token'] = token
  options.headers = headers
  if (options.login && !token) {
    console.log(store.getters.token)
    console.log('options', options)
    return Promise.reject({ msg: '未登录', toLogin: true })
  }
  return instance(options)
    .then((res) => {
      const data = res.data || {}
      if (res.status !== 200) {
        return Promise.reject({ msg: '请求失败', res, data })
      }

      if ([410000, 410001, 410002].indexOf(data.status) !== -1) {
        store.dispatch('user/logout')
        // 401则重回首页，采用节流的写法
        if (done) {
          done = false
          MessageBox.alert('非法操作,请重新登录！', '操作异常', {
            confirmButtonText: '确定',
            callback: (action) => {
              // 跳转登录页   callback点击确定按钮后的回调函数
              router.replace({
                path: '/login'
              })
            }
          })
          setTimeout(() => {
            // 计时结束后再置为可执行
            done = true
          }, 1000)
        }
      } else if (data.status === 401) {
        // 所有的reject都被catch捕获
        return Promise.reject({ msg: res.data.msg, res, data })
      } else if (data.status === 200) {
        return Promise.resolve(data, res)
      } else {
        return Promise.reject({ msg: res.data.msg, res, data })
      }
    })
    .catch((err) => {
      console.log(err.response || err, 'err_status')
      if (err.response && err.response.status === 500) {
        Message.error('服务器错误！')
      } else {
        const data = err.data
        return Promise.reject({ msg: data.msg, err, data })
      }
    })
}

/**
 * http 请求基础类
 * 参考文档 https://www.kancloud.cn/yunye/axios/234845
 *
 */
const request = ['post', 'put', 'patch'].reduce((request, method) => {
  /**
   *
   * @param url string 接口地址
   * @param data object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, data = {}, options = {}) => {
    return baseRequest(Object.assign({ url, data, method }, defaultOpt, options))
  }
  return request
}, {})

;['get', 'delete', 'head'].forEach((method) => {
  /**
   *
   * @param url string 接口地址
   * @param params object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, params = {}, options = {}) => {
    return baseRequest(Object.assign({ url, params, method }, defaultOpt, options))
  }
})

export default request
