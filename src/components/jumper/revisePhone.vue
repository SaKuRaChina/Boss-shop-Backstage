<template>
	
	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos revisePhoneBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">修改密保手机</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent">
				<div class="eachJumperLine">
					<label for="">手机号:</label>
					<div class="JumperLineInput">
						<el-input size='small' v-model="jumperObj.phone" placeholder="请输入11位手机号"></el-input>
					</div>
				</div>
				<div class="eachJumperLine">
					<label for="">验证码:</label>
					<div class="JumperLineInput shortLineInput">
						<el-input size='small' v-model="jumperObj.code" type='number' placeholder="请输入验证码">
							<!-- <template slot="suffix"></template> -->
						</el-input>
					</div>
					<span class="checkCode" @click='getCode'>获取验证码</span>
				</div>
				
				
			</div>
			<div class="jumperLine"></div>
			<button class="commonBtn jumperBtn" @click='subCharge'>确定</button>
		</div>
		
	</div>


</template>


<script>

	export default{
		name:'RevisePhone',
		data(){
			return{
				jumperObj:{
					phone:'',
					code:''
				}
			}
		},
		props:['revisePhoneShow','type'],
		computed:{
			isShow(){
				return this.revisePhoneShow
			}
		},
		methods:{
			getCode(){
				var that = this;
				console.log(that.jumperObj.phone)

				if(that.jumperObj.phone.length!= 11){
					that.$alert('请输入11位手机号','提示', {confirmButtonText: '确定'})
				}else{
					$.ajax({
						type:"post",
						url:that.Global.router + "/sms/sendMessage",
						xhrFields:{withCredentials: true},
						data:{
							phone:that.jumperObj.phone
						},
						success(res){
							if(res.code === "0000"){
								that.$alert('验证码发送成功','提示', {confirmButtonText: '确定'})
								// this.$parent.revisePhoneShow = false
								// this.$parent.initPhone()
							}else if(res.code == "1003"){
								that.$alert('登录失效，请重新登录', '提示', {
						          	confirmButtonText: '确定',
						          	callback: action => {
							         	that.$router.push({name:'Log'})
						          	}
						        });
							}else{
								that.$alert(res.message, '提示', {confirmButtonText: '确定'});
								}
						}
					})
				}
			},
			subCharge(){
				var that = this;
				//console.log(that.jumperObj)

				if(that.jumperObj.phone.length != 11){
					that.$alert('请输入11位手机号','提示', {confirmButtonText: '确定'})
				}else if(that.jumperObj.code.length <= 0){
					that.$alert('请输入验证码','提示', {confirmButtonText: '确定'})
				}else{
					$.ajax({
						type:"post",
						url:that.Global.router + "/account/updatePhone",
						xhrFields:{withCredentials: true},
						data:{
							phone:that.jumperObj.phone,
							code:that.jumperObj.code
						},
						success(res){
							if(res.code === "0000"){
								that.$alert('密保手机修改成功','提示', {confirmButtonText: '确定'})
								that.$parent.revisePhoneShow = false
								that.$parent.initPhone()
							}else if(res.code == "1003"){
								that.$alert('登录失效，请重新登录', '提示', {
						          	confirmButtonText: '确定',
						          	callback: action => {
							         	that.$router.push({name:'Log'})
						          	}
						        });
							}else{
								that.$alert(res.message, '提示', {confirmButtonText: '确定'});
							}
						}
					})
				}
				
			},
			hideParent(){
				this.$parent.revisePhoneShow = false
			}
		}
	}


</script>


<style>
	
	
</style>