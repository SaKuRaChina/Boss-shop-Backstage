<template>
  <div class="logWrap">
    <div class="bgc_log">
      
      <p class="logTitle">
        <img src="../img/logo.png" />
        巨牛BOSS商户管理系统
        <span class="back"><a href="https://www.juniuboss.com/#/">返回首页</a></span>
      </p>
      
      <div class="logContainer">
        <img class="logLeft1" src="../img/logLeft1.png" />
        <div class="logType">
          <p class="title">商户登录</p>
          <div class="input_bb1">
            <label>
              <img style="width: 1.093vw;" src="../img/acount.png" />
              <input id="logName" class="account" v-model='userName' placeholder="请输入账号" type="text" />
            </label>
          </div>
          <div class="input_bb2">
            <label>
              <img style="width: 1.093vw;" src="../img/pwd.png" />
              <input id="logPwd" class="pwd" v-model='userPassword' placeholder="请输入密码" type="password" />
            </label>
          </div>
          <div class="fAr">
            <div class="fPwd" @click='fPwd'>
              忘记密码?
            </div>
            <div class="layui-form" id="remPwd" action="" style="float: right;">
              <!-- <input type="checkbox" name="remPwd" lay-skin="primary" title="记住密码" checked=""> -->
              <el-checkbox type="checkbox" name="remPwd" checked>记住密码</el-checkbox>
            </div>
          </div>
          <button class="logIn" @click='login'>登录</button>
          <p class="register">还没有账号？点击<span><a href="https://www.juniuboss.com/register1.html">申请注册</a></span></p>
        </div>
        
        <div class="changePwdArea">
          <p class="backToLog" @click='backToLog'>返回登录</p>
          <p class="title">修改密码</p>
          <div class="bbInput2">
            <label>
              <div>手机号码</div>
              <input id="phoneName" v-model='newPsd.phone' placeholder="注册时填写的手机号" type="text" />
              <p class="cl"></p>
            </label>
          </div>
          <div class="bbInput2 clearfix">
            <label>
              <div>短信验证码</div>
              <input id="yzm" placeholder="请输入短信验证码" type="text" v-model='newPsd.code' />
              <button class="getYzm" @click='getYzm' v-if="!timeShow">获取验证码</button>
              <span class="getYzm" v-if="timeShow">{{ countTime }}</span>
            </label>
          </div>
          <div class="bbInput2">
            <label>
              <div>设置新密码</div>
              <input id="newPwd" placeholder="8~12位数字和字母组合" type="password" v-model='newPsd.rsaPwd' />
              <p class="cl"></p>
            </label>
          </div>
          <button class="confirmChange newPwdConfirm" @click='newPwdConfirm'>确认修改</button>
        </div>
        
        
        
        
        
        
      </div>
      <p class="icpNum1">Copyright © 2018众企微动（北京）科技发展有限公司 京ICP备18034437号</p>
    </div>
  </div>
</template>

<script>

import '../css/public.css'
import '../../static/jsencrypt.js'

export default {
  name: 'Log',
  mounted(){
    //console.log(this.Global.router)

    if( $.cookie("cookieUserName")!="" && $.cookie("cookieUserName")!="null" && $.cookie("cookieUserName")!=null && $.cookie("cookieUserPwd")!="" && $.cookie("cookieUserPwd")!="null" && $.cookie("cookieUserPwd")!=null){
      this.userName = $.cookie("cookieUserName");
      this.userPassword = $.cookie("cookieUserPwd");
    }
    //console.log($.cookie("cookieUserName"))
    
  },
  data () {
    return {
      userName:'',
      userPassword:'',
      newPsd:{
        phone:"",
        code:"",
        rsaPwd:""
      },
      countTime:0,
      timeShow:false,
      timer:''
    }
  },
  methods:{
    login(){
      let that = this
      //console.log(that.userName,that.userPassword)

      if($("input:checkbox[name='remPwd']").is(':checked')){
        //记住密码
        $.cookie("cookieUserName",that.userName, { expires: 7 });
        $.cookie("cookieUserPwd",that.userPassword, { expires: 7 }); 

      }else{
        //不记住密码
        $.cookie("cookieUserName", null);
        $.cookie("cookieUserPwd", null);
      }

      $.ajax({
        type:'POST',
        url:that.Global.router + '/business/login',
        data:{'loginName':this.userName,'password':this.userPassword},
        xhrFields: {
            withCredentials: true
        },
        success:function(res){

          //console.log(res)

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

    },
    fPwd(){
      $(".changePwdArea").show();
      $(".logType").hide();
    },
    backToLog(){
      $(".changePwdArea").hide();
      $(".logType").show();
    },
    getYzm(){
      var that = this

      if(!that.isPoneAvailable(that.newPsd.phone)){
        that.$alert('请输入正确的手机号', '提示', {confirmButtonText: '确定'});
      }else{
        //console.log("send")
        $.ajax({
          type:"POST",
          xhrFields: {withCredentials: true},
          url:that.Global.router+"/sms/sendMessage",
          data:{"phone":that.newPsd.phone},
          success:function(data){
            console.log(data);
            that.$alert('验证码已发送', '提示', {confirmButtonText: '确定'});
            
            that.countTime = 7
            that.countdown()

          },error:function(data){
            that.$alert('请刷新重试', '提示', {confirmButtonText: '确定'});
            
            //console.log("错误");
            //console.log(data);
          }
        });
      }
    },
    countdown(){
      var that = this; 
      that.timer = window.setInterval(function () {
        
        if(that.countTime <= 0){
          that.timeShow = false
          window.clearInterval(that.timer)
        }else{
          that.countTime--;
          that.timeShow = true
        }
      },1000)

      
    },
    newPwdConfirm(){
      var that = this
      if($("#phoneName").val()==""){
        that.$alert('请输入手机号', '提示', {confirmButtonText: '确定'});
        
      }else if($("#yzm").val()==""){
        that.$alert('请输入验证码', '提示', {confirmButtonText: '确定'});
        
      }else if($("#newPwd").val()==""){
        that.$alert('请输入新密码', '提示', {confirmButtonText: '确定'});
        
      }else{
        var code = $("#yzm").val();
        var password = $("#newPwd").val();
        //var ii = layer.load();
        
        // var encrypt = new JSEncrypt();
        // encrypt.setPublicKey($("#tra").val());
        // rsaPwd = encrypt.encrypt(password);
            
        $.ajax({
          type:"POST",
          xhrFields: {withCredentials: true},
          url:that.Global.router+"/business/forgetPassword",
          data:{"phone":that.newPsd.phone,"code":that.newPsd.code,"password":that.newPsd.rsaPwd},
          success:function(data){
            console.log(data);
            if(data.code=="0000"){
              //layer.close(ii);
              $(".backToLog").click();
              that.$alert('修改成功', '提示', {confirmButtonText: '确定'});
              
            }else{
              that.$alert(data.message, '提示', {confirmButtonText: '确定'});
              
              //layer.close(ii);
            }
          },error:function(data){
            that.$alert('请刷新重试', '提示', {confirmButtonText: '确定'});
            
          }
        });
      }
    },
    isPoneAvailable(phone){
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(phone)) {
        return false;
      } else {
        return true;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
