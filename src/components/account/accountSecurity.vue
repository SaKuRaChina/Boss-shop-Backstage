<template>
	
	<div class='accountSecurityWrap'>
		<!-- <div>暂未开通</div> -->
		<div class="pageFormBox securityBox">
			<div class="securityTitle">
				<img src="../../images/security.png">
				<span>安全中心</span>
			</div>
			<p class="securityP">密保手机：<em>{{ phone }}</em><a href="javascript:void(0)" @click='revisePhoneShow=true'>修改</a></p>
			<button class="commonBtn" @click='revisePassportShow=true'>修改登录密码</button>
		</div>


		<RevisePassport :revisePassportShow='revisePassportShow'></RevisePassport>
		<RevisePhone :revisePhoneShow='revisePhoneShow'></RevisePhone>

	</div>


</template>

<script>

	import RevisePassport from '../jumper/revisePassport'
	import RevisePhone from '../jumper/revisePhone'

	export default{
		data(){
			return {
				phone:'',
				revisePassportShow:false,
				revisePhoneShow:false
			}
		},
		components:{
			RevisePassport,RevisePhone
		},
		mounted(){
			this.initPhone()
		},
		methods:{
			initPhone(){
				var that = this;
				$.ajax({
					type:"post",
					url:that.Global.router + "/account/getBoundPhone",
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							that.phone = res.result
						}else if(res.code === "1003"){
							that.$alert('登录失效，请重新登录', '提示', {
					          	confirmButtonText: '确定',
					          	callback: action => {
						         	that.$router.push({name:'Log'})
					          	}
					        });
						}else{
							that.$alert(res.message, '提示', {confirmButtonText: '确定'});
						}
					},
					error(){}
				})
			}
		}
	}
	


</script>


<style>

	.pageFormBox .securityP{padding: 20px 0;line-height: 20px;font-size:12px;color: #666;}
	.pageFormBox .securityP em{font-style: normal;}
	.pageFormBox .securityP a{color:#e99100;display: inline-block;margin-left: 25px;}
	.pageFormBox button{width: 100px;height: 27px;border: 1px solid #979797;border-radius: 0;}
</style>