<template>
	
	<div class="chargeWrap">
		
		<TotalNav :activeClass='0'></TotalNav>
		
		<div class="routerUrl center">
			<router-link to='/index'><img src="../../images/back-icon.png" alt="">返回首页</router-link>
		</div>


		<div class="chargeBox center">
			<h2>账户：<em>{{ pageObj.firmName }}</em></h2>
			<p><em class="label">充值账户：</em>{{ pageObj.firmName }}</em></p>
			<p><em class="label">账户总余额：</em><em class="boldFont">￥<span>{{ pageObj.balance / 1000}}</span></em></p>
			<p class="withBg"><em class="label">预付款金额：</em><em>￥</em><input type="text" v-model='money'/><em>元　　　　</em><i>付款金额不能少于1000元人民币</i></p>
			<p><i>具有法人实体的企业用户，请使用公司支付账号充值；个体营业者可以使用个人支付账号充值。</i></p>
			<div class="payType">
				<em class="label">支付方式：</em>
				<div class="eachCharge">
					<el-radio v-model='rechargeType' label='2'>
						<img src="../../images/wechat-pay.png" alt="">
						<span class="chargeSpan">微信</span>
					</el-radio>
				</div>
				<div class="eachCharge">
					<el-radio v-model='rechargeType' label='1'>
						<img src="../../images/ali-pay.png" alt="">
						<span class="chargeSpan">支付宝</span>
					</el-radio>
				</div>
				<div class="eachCharge">
					<el-radio v-model='rechargeType' label='3' disabled>
						<img src="../../images/bank-pay.png" alt="">
						<span class="chargeSpan">企业网银(暂未开通)</span>
					</el-radio>
				</div>
			</div>
			<div>
				<em class="label"></em>
				<button class="commonBtn" type="button" @click='rechargeAccount'>确认无误，付款</button>
			</div>
		</div>


		<div class="jumperWrap"  v-show='isShow'>
			<div class="jumperPos qrCodeBox">
				<div class="jumperTitle clearfix">
					<h2 class="left">微信付款码</h2>
					<img class="right" src="../../images/close-icon.png" alt="" @click='hideObj'>
				</div>
				<div class="jumperContent qrCodeContent">
					<div id="qrcode" class="qrcode">
				        <div id="codeico"></div>
				    </div>
					<p>微信扫码付款</p>
				</div>
			</div>
			
		</div>


	</div>



</template>


<script>

	import TotalNav from '../common/totalNav'

	import '../../../static/jquery.qrcode.min.js'

	export default{
		name:'charge',
		data(){
			return{
				pageObj:{
					firmName:"",
					balance:""
				},
				money:0,
				rechargeType:'2',
				isShow:false,
				orderNum:0,
				timer:null
			}
		},
		components:{
			TotalNav
		},
		mounted(){
			this.initPage()
		},
		methods:{
			initPage(){
				var that = this
				$.ajax({
					type:"post",
					url:that.Global.router + "/business/nameAndBalance",
					xhrFields:{
						withCredentials: true
					},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							if(res.result != null){
								that.pageObj = Object.assign({},that.pageObj,res.result)
							}
						}
					},
					error(){}
				})

			},
			rechargeAccount(){
				var that = this
				console.log(parseInt(that.money))
				if(parseInt(that.money) < 1000){
					that.$alert('付款金额不能少于1000元人民币', '提示', {confirmButtonText: '确定'});
				}else{
					$.ajax({
						type:'post',
						url:that.Global.router + "/business/accountRecharge",
						data:{
							money:that.money,
							rechargeType:that.rechargeType
						},
						xhrFields:{withCredentials:true},
						success(res){
							console.log(res)
							if(res.code === "0000"){
								if(that.rechargeType == 1){
									//支付宝
									var payUrl=res.result;
									$("body").append(payUrl);
								}else if(that.rechargeType == 2){
									//微信
									that.orderNum = res.result.orderNum;
									that.weixinPayCheck(1);

									var toCode = res.result.code_url;
									//console.log(toCode);
									var str = that.toUtf8(toCode);
									console.log(str);
									$("#qrcode").html('')

									if (window.applicationCache) {
									     //浏览器支持html5   canvas
									    $('#qrcode').qrcode({
										    render: "canvas",
											width: 200,
											height:200,
											text: toCode
										});
									}else{
									    //浏览器不支持html5   table
									    $('#qrcode').qrcode({
										    render: "table", 
										    width: 200,
										    height: 200,
										    text: toCode
									    });
									}

									that.isShow = true

									that.timer = window.setInterval(function (){
										that.weixinPayCheck(1)
									},2000)

								}
							}
						}
					})
				}
				
			},
			weixinPayCheck(type){
				var that = this
				$.ajax({
					type:"POST",
					xhrFields: {withCredentials: true},
					url:that.Global.router + "/business/WXNotice",
					data:{"orderNum":that.orderNum},
					success:function(res){
						console.log(res);

						if(res.code == "0000"){
							window.clearInterval(that.timer)
							that.isShow = false
							that.initPage()
						}

						if(type == 2){
							that.$confirm('订单尚未完成，您确定退出吗？','提示',{
								confirmButtonText:'确定',
								cancelButtomText:'取消'
							}).then(()=>{
								window.clearInterval(that.timer)
								that.isShow = false

							}).catch(()=>{})
						}

					},error:function(res){
						
						console.log("错误");
						console.log(res);
					}
				});
			},
			toUtf8(str) {        
				var out, i, len, c;
			    out = "";
			    len = str.length;
			    for(i = 0; i < len; i++) {
			    	c = str.charCodeAt(i);
			    	if ((c >= 0x0001) && (c <= 0x007F)) {
			        	out += str.charAt(i);
			    	} else if (c > 0x07FF) {
			        	out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			        	out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			        	out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			    	} else {
			        	out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			        	out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			    	}
			    }
			    console.log(out)
			    return out;   
			}, 
			hideObj(){
				this.weixinPayCheck(2)
			}
		}
	}



</script>


<style>
	
	.chargeBox{background: #fff;box-sizing: border-box;padding:0 28px 50px;}
	.chargeBox em,.chargeBox i,.chargeBox span{font-style: normal;display: inline-block;}
	.chargeBox .label{width:100px;padding-left:18px; }
	.chargeBox h2{height:65px;line-height: 65px;border-bottom: 1px solid #dadada;font-weight: normal;font-size: 18px;margin-bottom:20px;padding-left:18px; }
	.chargeBox p{height: 50px;line-height: 50px;font-size: 14px;}
	.chargeBox i{text-indent: 1em;font-size:12px;color: #888;}
	.chargeBox .withBg{background: #f3f4f8;}
	.chargeBox .boldFont{font-size: 24px;}
	.chargeBox input{height: 28px;line-height: 28px;width: 118px;border:1px solid #c5c6c8;margin: 10px;}
	
	.payType{padding: 40px 0;}
	.eachCharge{display: inline-block;width: 225px;}
	.eachCharge img{height: 40px;margin:0 5px;vertical-align: top;}
	.eachCharge .chargeSpan{font-size:12px; vertical-align: middle;height: 40px;line-height: 40px;}
	
	.chargeBox button{width:164px;height: 48px;line-height: 48px;text-align: center;color: #666;font-size: 14px;border: 1px solid #979797;background: none;}

</style>