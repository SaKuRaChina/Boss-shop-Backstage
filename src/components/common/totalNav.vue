<template>
	<div class="totalNavWrap">

		<div class="center clearfix">
			<div class="logo clearfix">
				<img src="../../images/logo.png" alt="">
				<p>巨牛BOSS后台管理系统</p>
			</div>
			<div class="navList">
				<ul class="clearfix">
					<li :class="[activeClass == 0 ? 'active' : '']">
						<router-link to='/index'>首页</router-link>
					</li>
					<li :class="[activeClass == 1 ? 'active' : '']">
						<router-link to='/account' @click.native='clearAccount'>账户中心</router-link>
					</li>
					<li :class="[activeClass == 2 ? 'active' : '']">
						<router-link to='/finance' @click.native='clearFinance'>财务中心</router-link>
					</li>
					<span>|</span>
					<li>
						<router-link to='' @click.native='showQr = true' @mouseenter.native='showQr = true' @mouseleave.native='showQr = false'>客户端下载</router-link>
					</li>
				</ul>
				<div class="qrWraper" v-show='showQr'>
					<img class="triangle" src="../../images/triangle.png">
					<h3><img src="../../images/logo.png">官方网站</h3>
					<img class="qrImg" src="../../images/qrcode.jpg">
					<p>巨牛BOSS APP下载</p>
				</div>
			</div>
			
			
			<!-- <div class="loginer">
				<img :src="headImg" alt="">
				<p>{{ headName }}</p>
			</div> -->

			<div class="loginer" @click='logOut'>
				<img src="../../images/logout.png" alt="">
				<p>退出登录</p>
			</div>


		</div>


		
	</div>
</template>


<script>

	export default{
		name:"totalNav",
		data(){
			return{
				headName:"",
				headImg:"",
				showQr:false
			}
		},
		props:["activeClass"],
		mounted(){
			this.initHead()
		},
		methods:{
			initHead(){
				// console.log("yes")
				var that = this;
				$.ajax({
					type:"post",
					url:that.Global.router + '/business/loginData',
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						if(res.code === "0000"){

							that.headName = res.result.firmName
							if(res.result.url == null){
								that.headImg = require('../../images/icon-default.png')
							}else{
								that.headImg = res.result.url
							}

						}
						// else if(res.code === "1003"){
						// 	that.$alert('登录失效，请重新登录', '提示', {
					 //          	confirmButtonText: '确定',
					 //          	callback: action => {
						//          	that.$router.push({name:'Log'})
					 //          	}
					 //        });
                    		
						// }else{
						// 	that.$alert(res.message, '提示', {confirmButtonText: '确定'});
                    		
						// }

					},
					error(){}
				})

			},
			clearAccount(){
				sessionStorage.removeItem('recentAccountNav')
				sessionStorage.removeItem('chanceAccountShow')
				sessionStorage.removeItem('pocketAccountShow')
				sessionStorage.removeItem('chanceAccountNav')
				sessionStorage.removeItem('pocketAccountNav')
				//this.$router.push({path:'/program'})
			},
			clearFinance(){
				sessionStorage.removeItem('financeNav')
				this.$parent.navClick()
			},
			logOut(){
				var that = this
				that.$confirm("确定退出？","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(()=>{

					$.ajax({
						type:'post',
						url:that.Global.router + "/business/loginOut",
						xhrFields:{withCredentials:true},
						success(res){
							console.log(res)

							if(res.code === "0000"){
								that.$router.push({name:'Log'})
							}else{
								that.$alert(res.message, '提示', {confirmButtonText: '确定'});
							}

						},
						error(){}
					})

				}).catch(()=>{})
			}
		}

	}



</script>


<style scoped>

	.totalNavWrap{width:100%;height: 90px;background: #fff;margin-bottom: 20px;}
	
	.logo{float: left;padding: 20px 0;}
	.logo img{display: block;float: left;width: 50px;height: 50px;float: left;}
	.logo p{float: left;line-height: 50px;height: 50px;font-size: 24px;padding: 0 10px;}
	
	.navList{float: left;margin-left: 150px;position: relative;} 
	.navList li{float: left;margin: 0 10px;line-height: 88px;border-bottom: 2px solid transparent;}
	.navList li a{color: #222;display: block;padding: 0 33px;}
	.navList .active{border-bottom-color: #222;}
	.navList span{display: block;float: left;line-height: 90px;color:#d8d8d8; }
	
	.loginer{float: right;padding: 30px 0;cursor: pointer;}
	.loginer img{width:18px;vertical-align: middle;}
	.loginer p{font-size:12px;color: #666;line-height: 30px;display: inline-block;}
	
	.qrWraper{position: absolute;top: 78px;right:0;z-index: 100;background: #fff;text-align: center;padding: 30px;box-shadow: 0 0 5px #ccc;}
	.qrWraper h3{font-weight: normal;font-size:16px;color: #666;line-height: 30px;height: 30px;}
	.qrWraper h3 img{width: 20px;vertical-align: middle;margin-right: 10px; }
	.qrImg{display: block;margin: 10px auto;width: 116px;}
	.qrWraper p{font-size: 12px;color: #666;}
	.qrWraper .triangle{position: absolute;top: -15px;left:50%;margin-left: -10px;width: 20px;}
	

</style>