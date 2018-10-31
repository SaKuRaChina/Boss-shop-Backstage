<template>
  <div class="logWrap">
    <label for="">用户名：</label><input type="text" v-model='userName'><br />
    <label for="">密　码：</label><input type="text" v-model='userPassword'><br />
    <button @click='login'>登录</button>
  </div>
</template>

<script>


export default {
  name: 'Log',
  mounted(){
    console.log(this.Global.router)
    
  },
  data () {
    return {
      userName:'',
      userPassword:''
    }
  },
  methods:{
    login(){
      let that = this
      console.log(this.userName,this.userPassword)

      $.ajax({
        type:'POST',
        url:this.Global.router + '/business/login',
        data:{'loginName':this.userName,'password':this.userPassword},
        xhrFields: {
            withCredentials: true
        },
        success:function(res){

          console.log(res)

          if(res.code === "0000"){
            that.$router.push({name:'index'})

            sessionStorage.setItem('isOppor',res.result.isOppor)
            sessionStorage.setItem('isPacket',res.result.isPacket)
            sessionStorage.setItem('isProduct',res.result.isProduct)

          }else if(res.code === "1500"){
            that.$alert(res.message,'提示')
          }

        },
        fail:function(res){
          console.log(res)
        }

      })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  input{width: 200px;height: 40px;margin-bottom: 20px;}
  button{width: 90px;height:40px;}
</style>
