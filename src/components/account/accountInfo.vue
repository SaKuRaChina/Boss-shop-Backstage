<template>
	
	<div class='accountInfoWrap'>
		<!-- <p>暂未开通</p> -->

		<div class="accountBrief">
			<div class="briefTop clearfix">
				<img :src="headImg" class="briefHead left">
				<div class="briefName left">
					<h3>{{ headName}}</h3>
					<p><span>已通过实名认证审核</span><img src="../../images/index-certification.png"></p>
				</div>
			</div>
			<p class="briefBot">
				<span>客服联系方式</span>
				<span>推广顾问：{{ serviceObj.name }}</span>
				<span>顾问电话：{{ serviceObj.phone }}</span>
			</p>
		</div>

		<div class="accountMsg">
			<div class="msgTitle">商户信息</div>
			<div class="msgList clearfix">
				<div class="eachMagList left">
					<!-- <div class="msgLi"><span>商户类别</span><em>{{ pageObj.typeName }}</em></div> -->
					<div class="msgLi"><span>商户账号</span><em>{{ pageObj.loginName }}</em></div>
					<div class="msgLi"><span>商户名称</span><em>{{ pageObj.firmName }}</em></div>
					<div class="msgLi"><span>商户所在地</span><em>{{ pageObj.province + pageObj.city + pageObj.prefecture }}</em></div>
					<div class="msgLi"><span>商户详细地址</span><em>{{ pageObj.address}}</em></div>
					<div class="msgLi">
						<span>营业执照</span>
						<div class="msgPicWrap clearfix">
							<div class="eachMsgPic left">
								<img :src="pageObj.businessLicenseArr[0] + '!default'">
								<p>原件</p>
							</div>
							<div class="eachMsgPic left">
								<img :src="pageObj.businessLicenseArr[1] + '!default'">
								<p>手持营业执照</p>
							</div>
						</div>
					</div>
					<div class="msgLi"><span>营业执照注册号</span><em>{{ pageObj.registerNumber }}</em></div>
					<div class="msgLi"><span>成立日期</span><em>{{ pageObj.registerDate }}</em></div>
					<div class="msgLi"><span>营业期限</span><em>{{ pageObj.busnissTerm }}</em></div>
					<div class="msgLi"><span>注册资本</span><em>{{ pageObj.registeredFund }}</em></div>
					<div class="msgLi"><span>网站链接</span><em>{{ pageObj.website }}</em></div>
					<div class="msgLi">
						<span>租赁地址证明</span>
						<div class="msgPicWrap clearfix">
							<div class="eachMsgPic left">
								<img :src="pageObj.leaseProve + '!default'" v-if='pageObj.leaseProve.length != 0'>
							</div>
						</div>
					</div>
					<div class="msgLi">
						<span>授权书扫描件</span>
						<div class="msgPicWrap clearfix">
							<div class="eachMsgPic left">
								<img :src="pageObj.authorizationUrl + '!default'" v-if='pageObj.authorizationUrl.length != 0'>
							</div>
						</div>
					</div>
					<div class="msgLi">
						<span>税票信息</span>
						<div class="msgPicWrap">
							<div class="eachMsgPic left">
								<img :src="pageObj.taxReceipt + '!default'" v-if='pageObj.taxReceipt.length != 0'>
							</div>
						</div>
					</div>
					<div class="msgLi">
						<span>电子合同</span>
						<div class="msgPicWrap clearfix">
							<div class="eachMsgPic left">
								<img :src="pageObj.electronicContract + '!default'" v-if='pageObj.electronicContract != null'>
							</div>
						</div>
					</div>
					<div class="msgLi"><span>合同期限</span><em v-if='pageObj.startTime != null || pageObj.endTime != null'>{{ pageObj.startTime + '-' + pageObj.endTime}}</em></div>
				</div>
				<div class="eachMagList left">
					<div class="msgLi"><span>法人姓名</span><em>{{ pageObj.legalName }}</em></div>
					<div class="msgLi"><span>法人职位</span><em>{{ pageObj.legalIdentity }}</em></div>
					<div class="msgLi"><span>法人电话</span><em>{{ pageObj.legalPhone }}</em></div>
					<div class="msgLi"><span>联系邮箱</span><em>{{ pageObj.legalEmail }}</em></div>
					<div class="msgLi"><span>QQ号码</span><em>{{ pageObj.legalQQ }}</em></div>
					<div class="msgLi"><span>微信号码</span><em>{{ pageObj.legalWechat }}</em></div>
					<div class="msgLi"><span>法人身份证号</span><em>{{ pageObj.legalCardNum }}</em></div>
					<div class="msgLi">
						<span>法人身份证照片</span>
						<div class="msgPicWrap clearfix">
							<div class="eachMsgPic left">
								<img :src="pageObj.legalCard[0] + '!default'">
								<p>身份证正面</p>
							</div>
							<div class="eachMsgPic left">
								<img :src="pageObj.legalCard[1] + '!default'" >
								<p>身份证反面</p>
							</div>
							<div class="eachMsgPic left">
								<img :src="pageObj.legalCard[2] + '!default'" >
								<p>手持证件照</p>
							</div>
						</div>
					</div>
					<div class="msgLi"><span>运营者姓名</span><em>{{ pageObj.operationName }}</em></div>
					<div class="msgLi"><span>运营者职位</span><em>{{ pageObj.operationIdentity }}</em></div>
					<div class="msgLi"><span>运营者电话</span><em>{{ pageObj.operationPhone }}</em></div>
					<div class="msgLi"><span>联系邮箱</span><em>{{ pageObj.email }}</em></div>
					<div class="msgLi"><span>QQ号码</span><em>{{ pageObj.qqNumber }}</em></div>
					<div class="msgLi"><span>微信号码</span><em>{{ pageObj.wechat }}</em></div>
					<div class="msgLi"><span>运营者身份证号</span><em>{{ pageObj.operationCardNum }}</em></div>
					<div class="msgLi">
						<span>运营者身份证照片</span>
						<div class="msgPicWrap clearfix">
							<div class="eachMsgPic left">
								<img :src="pageObj.operatorCard[0] + '!default'">
								<p>身份证正面</p>
							</div>
							<div class="eachMsgPic left">
								<img :src="pageObj.operatorCard[1] + '!default'" >
								<p>身份证反面</p>
							</div>
							<div class="eachMsgPic left">
								<img :src="pageObj.operatorCard[2] + '!default'">
								<p>手持证件照</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>


</template>


<script type="text/javascript">

	export default{
		name:"accountInfo",
		data(){
			return {
				headName:"",
				headImg:"",
				serviceObj:{
					name:'',
					phone:''
				},
				pageObj:{
					typeName:"",
	                loginName:"",
	                firmName:"",
	                province:"",
	                city:"",
	                prefecture:"",
	                address:"",
	                businessLicense:"",
	                businessLicenseArr:[],
	                certification:[],
	                registerNumber:"",
	                registerDate:"",
	                busnissTerm:"",
	                registeredFund:"",
	                website:"",
	                leaseProve:"",
	                authorizationUrl:"",
	                taxReceipt:"",
	                legalName:"",
	                legalIdentity:"",
	                legalPhone:"",
	                legalEmail:"",
	                legalQQ:"",
	                legalWechat:"",
	                legalCardNum:"",
	                legalCardUrl:"",
	                legalCard:[],
	                operationName:"",
	                operationIdentity:"",
	                operationPhone:"",
	                email:"",
	                qqNumber:"",
	                wechat:"",
	                operationCardNum:"",
	                operationCardUrl:"",
	                operatorCard:[]
				}
			}
		},
		mounted(){
			this.initPage();
			this.initHead()
		},
		methods:{
			initHead(){

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

			},
			initPage(){
				var that = this
				$.ajax({
					type:"post",
					url:that.Global.router + "/account/getBusinessAccount",
					xhrFields: {
			            withCredentials: true
			        },
			        success(res){
			        	console.log(res)
			        	if(res.code === "0000"){
			        		if(res.result.business != null){


			        			res.result.business.businessLicenseArr = res.result.business.businessLicense.split(',')
		          				res.result.business.legalCard = res.result.business.legalCardUrl.split(',')
		          				res.result.business.operatorCard = res.result.business.operationCardUrl.split(',')


			        			that.serviceObj = Object.assign({},that.serviceObj,res.result.console)
			        			that.pageObj = Object.assign({},that.pageObj,res.result.business)
			        		}
			        	}
			        },
			        error(){

			        }
				})
			}
		}
	}
	


</script>



<style type="text/css">
	
	.accountBrief{background: #fff;padding: 0 43px;}
	.briefTop{padding: 25px 0;border-bottom: 1px solid #f2f3f8;}
	.briefHead{width: 60px;height: 60px;display: block;margin: 0 10px;border-radius: 50%;}
	.briefName h3{font-weight: normal;line-height:20px;font-size: 14px;padding: 10px 0;}
	.briefName p{line-height: 16px;font-size: 12px;color: #888;}
	.briefName img{width:10px;margin: 5px;vertical-align: middle;}
	.briefBot{padding:20px 0;line-height: 20px;font-size: 12px;color: #666; }
	.briefBot span{display: inline-block;margin-right: 60px;}

	.accountMsg{background: #fff;margin-top: 20px;padding-bottom: 50px;margin-bottom: 30px;}
	.msgTitle{padding: 15px 0;line-height: 30px;font-size: 20px;font-weight: normal;padding-left: 43px;}
	.eachMagList{padding-left: 43px;width: 49%;box-sizing: border-box;}
	.eachMagList:nth-child(1){border-right: 1px solid #dadada;}
	.eachMagList .msgLi{padding: 10px 0;line-height: 22px;font-size: 16px;}
	.eachMagList .msgLi span{display: inline-block;color: #666;width:136px;vertical-align: top;}
	.eachMagList .msgLi em{display: inline-block;font-style: normal;width:300px;}
	.eachMagList .msgPicWrap{display: inline-block;width:300px;}
	.eachMagList .eachMsgPic{margin-right:15px;}
	.eachMagList .eachMsgPic img{width: 80px;}
	.eachMagList .eachMsgPic p{font-size: 12px;color: #222;text-align: center;}

</style>