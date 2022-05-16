<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
    data() {
      return{
        isRouterAlive: true,//控制视图是否显示的变量
        myPath:'',
        is_connect: 0,
        websock: null
      }
    },
   watch: {
    $route(to ,from){
      // if(to.path == '/login'){
      //   this.myPath = 'login'
      //   if(this.is_connect == 1){
      //     this.websock.close()
      //     this.is_connect = 0
      //   }
      // }else{
      //   if(this.is_connect == 0){
      //     // this.initWebSocket();
      //     this.is_connect = 1
      //   }
      // }
    }
   },
    methods: {
      reload () {
          this.isRouterAlive = false;//先关闭，
          this.$nextTick(function () {
            this.isRouterAlive = true;//再打开
        })
      },
      initWebSocket(){
        const wsuri = "ws://192.168.0.37:2348";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        let actions = "ok";
        this.websocketsend(actions);
      },
      websocketonerror(){//连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
        console.log(e.data)
        let actions = "ok";
        this.websocketsend(actions);
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        if(!this.myPath == 'login'){
          this.is_connect = 0
          this.initWebSocket()
        }
      }
    }
}
</script>
