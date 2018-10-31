<template>
	<div class="indexWrap">
		
		<TotalNav :activeClass='0' ref='totalNav'></TotalNav>

		<div class="indexAccount center clearfix">
			<div class="indexAccountDetail left clearfix">
				<div class="myInfo left">
					<img :src="headImg" class="mineHead" @click='changeHead' alt="">
					<div class="myName">
						<h4>{{ headName }}</h4>
						<p>
							<span>已通过实名认证审核</span>
							<img class="accountIdentity" src="../../images/index-certification.png" alt="">
						</p>
					</div>
				</div>
				<div class="myAccount left">
					<router-link class="myAccountRecharge" to="/charge"><img src="../../images/turn-right.png" alt="" />账户充值</router-link>
					<div class="myAccontNum clearfix">
						<div class="eachAccountNum left">
							<p>账户余额</p>
							<h4>{{ recentObj.balance / 1000}}</h4>
						</div>
						<div class="eachAccountNum left">
							<p>平台捐赠</p>
							<h4>{{ recentObj.donate / 1000}}</h4>
						</div>

						<div class="eachAccountNum left">
							<p>今日消耗</p>
							<h4>{{ recentObj.todayConsume / 1000 }}</h4>
						</div>
					</div>
				</div>
			</div>
			<div class="indexAccountSwiper right">
				<el-carousel :interval="3000" arrow="always" height='200px' >
				    <el-carousel-item v-for="item in bannerArr" :key="item.num">
				        <img class="elPic" :src="item.url" alt="">
				    </el-carousel-item>
				</el-carousel>
			</div>
		</div>


		<div class="indexPromotion center">
			<div class="indexTitle">
				<img src="../../images/index-promotion.png" alt="">
				<h3>推广产品</h3>
				<p>Promotion of products</p>
			</div>
			<div class="indexPromotionDetail clearfix">
				<h2 class="left">推广总数</h2>
				<div class="eachIndexPromotion left clearfix">
					<img src="../../images/index-promotion-read.png" alt="">
					<div class="left">
						<p>总阅读</p>
						<h3>{{ totalObj.totalRead }}</h3>
					</div>
				</div>
				<div class="eachIndexPromotion left clearfix">
					<img src="../../images/index-promotion-consume.png" alt="">
					<div class="left">
						<p>总消费</p>
						<h3>{{ totalObj.totalAmount / 1000}}</h3>
					</div>
				</div>
				<div class="eachIndexPromotion left clearfix">
					<img src="../../images/index-promotion-return.png" alt="">
					<div class="left">
						<p>总转发</p>
						<h3>{{ totalObj.totalTransfer }}</h3>
					</div>
				</div>
				<div class="eachIndexPromotion left clearfix">
					<img src="../../images/index-promotion-watch.png" alt="">
					<div class="left">
						<p>总围观</p>
						<h3>{{ totalObj.totalOnLook }}</h3>
					</div>
				</div>
			</div>
			<!-- <div class="datePicker">
				<el-date-picker
			        v-model="timePick"
			        type="daterange"
			        align="right"
			        unlink-panels
			        range-separator="-"
			        start-placeholder="开始日期"
			        end-placeholder="结束日期"
			        size="small"
			        :picker-options="timePick"
			        value-format='yyyy-MM-dd'
			        @change='selectTotal'>
			    </el-date-picker>
			</div> -->
			<div class="indexPromotionTips clearfix">
				<div class="eachPromotionTip left">
					<div class="promotionTipType clearfix">
						<h3 class="left">红包推广</h3>
						<img src="../../images/index-setting.png" alt="" @click='pocketSelector = true'>
						<button class="commonBtn indexBtn right" type="button" :disabled='isPacket == 0' @click='toPocket'>进入</button>
						<button class="commonBtn indexBtn right" type="button" v-if='isPacket == 0' @click='openPocketService' >开通</button>
					</div>

					<!-- <div>暂未开通</div> -->

					<div class="promotionTipShow clearfix" :class="{'lease6':pocketShowArr.length<=6,'lease8':pocketShowArr.length>6&&pocketShowArr.length<=8,'lease10':pocketShowArr.length>8&&pocketShowArr.length<10}">
						<p v-for='item in pocketShowArr' :key='item.id'><i>{{ item.name }}</i><em>{{ item.num }}</em></p>
					</div>
					<div class="promotionTipSetting" v-if='pocketSelector'>
						<div class="checkContain">
							<el-checkbox v-for='(item,index) in pocketArr'  :key='item.id' :label="item.name" :checked='item.checked' @change='checkPocket(index)'></el-checkbox>
						</div>
						<button class="commonBtn indexBtn" type="button" @click='procketShow'>确定</button>
						<button class="commonBtn indexBtn grayBtn" type="button" @click='pocketSelector = false'>取消</button>
					</div>
				</div>
				<div class="eachPromotionTip left">
					<div class="promotionTipType clearfix">
						<h3 class="left">项目推广</h3>
						<img src="../../images/index-setting.png" alt="" @click='programSelector = true'>
						<button class="commonBtn indexBtn right" type="button" :disabled='isOppor == 0' @click='toProgram'>进入</button>
						<button class="commonBtn indexBtn right" type="button" v-if='isOppor == 0' @click='openProgramService'>开通</button>
					</div>
					<div class="promotionTipShow clearfix" :class="{'lease6':programShowArr.length<=6,'lease8':programShowArr.length>6&&programShowArr.length<=8,'lease10':programShowArr.length>8&&programShowArr.length<=10}">
						<p v-for='item in programShowArr' :key='item.id'><i>{{ item.name }}</i><em>{{ item.num }}</em></p>
					</div>
					<div class="promotionTipSetting" v-if='programSelector'>
						<div class="checkContain">
							<el-checkbox v-for='(item,index) in programArr' :key='item.id' :label="item.name" :checked='item.checked' @change='checkProgram(index)'></el-checkbox>
						</div>
						<button class="commonBtn indexBtn" type="button" @click='programShow'>确定</button>
						<button class="commonBtn indexBtn grayBtn" type="button" @click='programSelector = false'>取消</button>
					</div>
				</div>
				<div class="eachPromotionTip right">
					<div class="promotionTipType clearfix">
						<h3 class="left">产品推广</h3>
						<img src="../../images/index-setting.png" alt="" @click='productSelector=true'>
						<button class="commonBtn indexBtn right" type="button" :disabled='isProduct == 0' @click='toProduct'>进入</button>
						<button class="commonBtn indexBtn right" type="button" v-if='isProduct == 0' @click='openProductService'>开通</button>
					</div>
					<div class="promotionTipShow clearfix" :class="{'lease6':productShowArr.length<=6,'lease8':productShowArr.length>6&&productShowArr.length<=8,'lease10':productShowArr.length>8&&productShowArr.length<=10}">
						<p v-for='item in productShowArr' :key='item.id'><i>{{ item.name }}</i><em>{{ item.num }}</em></p>
					</div>
					<div class="promotionTipSetting" v-if='productSelector'>
						<div class="checkContain">
							<el-checkbox v-for='(item,index) in productArr' :key='item.id' :label="item.name" :checked='item.checked' @change='checkProduct(index)'></el-checkbox>
						</div>
						<button class="commonBtn indexBtn" type="button" @click='productShow'>确定</button>
						<button class="commonBtn indexBtn grayBtn" type="button" @click='productSelector=false'>取消</button>
					</div>
				</div>
			</div> 
		</div>
		

		<div class="indexMarketing center">
			<div class="indexTitle">
				<img src="../../images/index-marketing.png" alt="">
				<h3>营销服务</h3>
				<p>Marketing service</p>
			</div>
			<div class="indexPromotionTips clearfix">
				<div class="eachPromotionTip left">
					<div class="promotionTipType clearfix">
						<h3 class="left">BOSS头条</h3>
						<img src="../../images/index-setting.png" alt="" @click='topSelsctor = true'>
						<button class="commonBtn indexBtn right" type="button" @click='toBoss'>进入</button>
					</div>
					<div class="promotionTipShow clearfix" :class="{'lease6':topShowArr.length<=6,'lease8':topShowArr.length>6&&topShowArr.length<=8,'lease10':topShowArr.length>8&&topShowArr.length<10}">
						<p v-for='item in topShowArr' :key='item.id'><i>{{ item.name }}</i><em>{{ item.num }}</em></p>
					</div>
					<div class="promotionTipSetting" v-if='topSelsctor'>
						<div class="checkContain">
							<el-checkbox v-for='(item,index) in topArr' :key='item.id' :label="item.name" :checked='item.checked' @change='checkTop(index)'></el-checkbox>
						</div>
						<button class="commonBtn indexBtn" type="button" @click='topShow'>确定</button>
						<button class="commonBtn indexBtn grayBtn" type="button" @click='topSelsctor=false'>取消</button>
					</div>
				</div>
				
			</div> 
		</div>
		
		
		<MineHead :mineHeadShow='mineHeadShow' :headImg='headImg' :headName='headName'></MineHead>
		<PocketPromotion :pocketPromotionShow='pocketPromotionShow'></PocketPromotion>
		<ProductPromotion :productPromotionShow='productPromotionShow' :isProduct='isProduct' @success='productSuccess'></ProductPromotion>
		<ProgramPromotion :programPromotionShow='programPromotionShow' :isOppor='isOppor' @success='programSuccess'></ProgramPromotion>
		
		
	</div>

</template>


<script>

	import TotalNav from '../common/totalNav'
	import MineHead from '../jumper/mineHead'
	import PocketPromotion from '../jumper/pocketPromotion'
	import ProductPromotion from '../jumper/productPromotion'
	import ProgramPromotion from '../jumper/programPromotion'



	export default{
		name:"Index",
		data(){
			return{
				headImg:'',
				headName:'',
				recentObj:{},
				bannerArr:[
					{url:require('../../images/banner.jpg'),num:0},
					{url:require('../../images/banner.jpg'),num:1},
					{url:require('../../images/banner.jpg'),num:2},

					{url:require('../../images/banner.jpg'),num:3},
				],
				timePick:'',
				totalObj:{},
				pocketSelector:false,
				programSelector:false,
				productSelector:false,
				topSelsctor:false,
				pocketArr:[],
				pocketShowArr:[],
				programArr:[],
				programShowArr:[],
				productArr:[],
				productShowArr:[],
				topArr:[],
				topShowArr:[],
				mineHeadShow:false,
				pocketPromotionShow:false,
				productPromotionShow:false,
				programPromotionShow:false,
				isPacket:0,
				isOppor:0,
				isProduct:0,

			}
		},
		components:{
			TotalNav,MineHead,PocketPromotion,ProductPromotion,ProgramPromotion
		},
		mounted(){

			//初始化模块按钮
			this.isPacket = sessionStorage.getItem('isPacket')
			this.isOppor = sessionStorage.getItem('isOppor')
			this.isProduct = sessionStorage.getItem('isProduct')
			console.log(this.isOppor)

			//初始化账户余额
			this.initRecent()

			//初始化头像
			this.initHead()

			//初始化红包推广
			this.initPocket()

			//初始化推广总数
			this.initTotal()

			//初始化项目推广
			this.initProgram()

			//初始化产品推广
			this.initProduct()

			//初始化BOSS头条
			this.initTop()

		},
		methods:{
			initHead(){

				var that = this;
				$.ajax({
					type:"post",
					url:that.Global.router + '/business/loginData',
					xhrFields:{withCredentials:true},
					success(res){
						//console.log(res)

						if(res.code === "0000"){

							that.headName = res.result.firmName
							if(res.result.url == null){
								that.headImg = require('../../images/icon-default.png')
							}else{
								that.headImg = res.result.url
							}

							that.$refs.totalNav.initHead()

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
			initRecent(){

				var that = this;
				$.ajax({
					type:'post',
					url:that.Global.router + '/homepage/getAccessAndBusiness',
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							that.recentObj = Object.assign({},that.recentObj,res.result)
						}
					},
					error(){}
				})

			},
			initTotal(arr={}){

				var that = this
				$.ajax({
					type:"post",
					url:that.Global.router + '/homepage/getTotalData',
					xhrFields:{withCredentials:true},
					data:arr,
					success(res){
						console.log(res)
						if(res.code == "0000"){
							that.totalObj = Object.assign({},that.totalObj,res.result)
						}
					},
					error(){}
				})

			},
			initProgram(){
				var that = this
				$.ajax({
					type:"post",
					url:that.Global.router + '/homepage/getBusiness',
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)
						if(res.code == "0000"){
							that.programArr.push({id:0,name:"项目阅读量",num:res.result.readNum,checked:true})
							that.programArr.push({id:1,name:"项目转发量",num:res.result.transfer,checked:true})
							that.programArr.push({id:2,name:"项目评论量",num:res.result.comment,checked:true})
							that.programArr.push({id:3,name:"项目关注量",num:res.result.attention,checked:true})
							that.programArr.push({id:4,name:"项目沟通量",num:res.result.linkUp,checked:true})
							that.programArr.push({id:5,name:"项目围观量",num:res.result.onLook,checked:true})
							that.programArr.push({id:6,name:"消费总额",num:res.result.consumer / 1000,checked:true})
							that.programArr.push({id:7,name:"红包消费",num:res.result.redPacketConsumer / 1000,checked:true})
							that.programArr.push({id:8,name:"佣金消费",num:res.result.commissionConsumer / 1000,checked:true})

							that.programShowArr = that.programArr
						}
						
					},
					error(){}
				})
			},
			initPocket(){
				var that = this;
				$.ajax({
					type:"post",
					url:that.Global.router + '/homepage/getRedPacket',
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)
						if(res.code === "0000"){

							that.pocketArr.push({id:0,name:"消费",num:res.result.consumer,checked:true})
							that.pocketArr.push({id:1,name:"点击",num:res.result.point,checked:true})
							that.pocketArr.push({id:2,name:"转发",num:res.result.transfer,checked:true})
							that.pocketArr.push({id:3,name:"沟通",num:res.result.linkUp,checked:true})
							that.pocketArr.push({id:4,name:"阅读量",num:res.result.readNum,checked:true})
							that.pocketArr.push({id:5,name:"红包总计",num:res.result.count,checked:true})

							that.pocketShowArr = that.pocketArr
						}
					},
					error(){}
				})
			},
			initProduct(){
				var that = this
				$.ajax({
					type:"post",
					url:that.Global.router + '/homepage/getProduct',
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)
						if(res.code == "0000"){
							that.productArr.push({id:0,name:"产品阅读量",num:res.result.readNum,checked:true})
							that.productArr.push({id:1,name:"产品转发量",num:res.result.transfer,checked:true})
							that.productArr.push({id:2,name:"产品关注量",num:res.result.attention,checked:true})
							that.productArr.push({id:3,name:"产品沟通量",num:res.result.linkUp,checked:true})
							that.productArr.push({id:4,name:"产品围观量",num:res.result.onLook,checked:true})
							that.productArr.push({id:5,name:"消费总额",num:res.result.consumer / 1000,checked:true})
							that.productArr.push({id:6,name:"红包消费",num:res.result.redPacketConsumer / 1000,checked:true})
							that.productArr.push({id:7,name:"佣金消费",num:res.result.commissionConsumer / 1000,checked:true})

							that.productShowArr = that.productArr
						}
						

					},
					error(){}
				})
			},
			initTop(){
				var that = this;
				$.ajax({
					type:'post',
					url:that.Global.router + '/homepage/getHeadLine',
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							that.topArr.push({id:0,name:"文章量",num:res.result.essayNum,checked:true})
							that.topArr.push({id:1,name:"视频量",num:res.result.videoNum,checked:true})
							that.topArr.push({id:2,name:"文章阅读量",num:res.result.essayRedNum,checked:true})
							that.topArr.push({id:3,name:"视频观看量",num:res.result.videoRedNum,checked:true})
							that.topArr.push({id:4,name:"佣金消费",num:res.result.commissionConsumer / 1000,checked:true})

							that.topShowArr = that.topArr
						}
					},
					error(){}
				})
			},
			checkPocket(i){
				this.pocketArr[i].checked = !this.pocketArr[i].checked
			},
			checkProgram(i){
				this.programArr[i].checked = !this.programArr[i].checked
			},
			checkProduct(i){
				this.productArr[i].checked = !this.productArr[i].checked
			},
			checkTop(i){
				this.topArr[i].checked = !this.topArr[i].checked 
			},
			procketShow(){
				var that = this
				that.pocketShowArr = [];
				console.log(that.pocketArr)
				for(let i=0; i<that.pocketArr.length; i++){
					if(that.pocketArr[i].checked){
						that.pocketShowArr.push(that.pocketArr[i])
					}
				}
				that.pocketSelector = false
			},
			programShow(){
				var that = this
				that.programShowArr = [];
				console.log(that.programArr)
				for(let i=0; i<that.programArr.length; i++){
					if(that.programArr[i].checked){
						that.programShowArr.push(that.programArr[i])
					}
				}
				that.programSelector = false
			},
			productShow(){
				var that = this
				that.productShowArr = [];
				console.log(that.productArr)
				for(let i=0; i<that.productArr.length; i++){
					if(that.productArr[i].checked){
						that.productShowArr.push(that.productArr[i])
					}
				}
				that.productSelector = false
			},
			topShow(){
				var that = this
				that.topShowArr = [];
				console.log(that.topArr)
				for(let i=0; i<that.topArr.length; i++){
					if(that.topArr[i].checked){
						that.topShowArr.push(that.topArr[i])
					}
				}
				that.topSelsctor = false
			},
			selectTotal(value){
				
				var sendObj = {
					startTime:value[0],
					endTime:value[1]
				}
				console.log(sendObj)
				this.initTotal(sendObj)
			},
			changeHead(){
				this.mineHeadShow = true
			},
			openPocketService(){

				this.pocketPromotionShow = true
			},
			openProductService(){
				this.productPromotionShow = true
			},
			openProgramService(){
				this.programPromotionShow = true;
			},
			toPocket(){
				//清空页面session
				sessionStorage.removeItem('recentPocketNav')
				sessionStorage.removeItem('chancePocketShow')
				sessionStorage.removeItem('pocketPocketShow')
				sessionStorage.removeItem('chancePocketNav')
				sessionStorage.removeItem('pocketPocketNav')
				this.$router.push({path:'/pocket'})
			},
			toProgram(){
				//清空页面session
				sessionStorage.removeItem('recentNav')
				sessionStorage.removeItem('chanceShow')
				sessionStorage.removeItem('pocketShow')
				sessionStorage.removeItem('chanceNav')
				sessionStorage.removeItem('pocketNav')
				this.$router.push({path:'/program'})
			},
			toProduct(){
				
				sessionStorage.removeItem('recentProductNav')
				sessionStorage.removeItem('chanceProductShow')
				sessionStorage.removeItem('pocketProductShow')
				sessionStorage.removeItem('chanceProductNav')
				sessionStorage.removeItem('pocketProductNav')

				this.$router.push({path:'/product'})
			},
			toBoss(){
				sessionStorage.clear()
				this.$router.push({path:'/boss'})
			},
			programSuccess(){
				
				this.isOppor = 1
			},
			productSuccess(){
				
				this.isProduct = 1
			},
			navClick(){
				//防报错用
			}
		}
	}



</script>


<style type="text/css">

	.indexWrap{padding-bottom: 55px;}

	
	/*  企业信息、轮播图   */
	.indexAccount{margin-top:20px;}
	.indexAccountDetail{background: #fff;width: 780px;height: 200px;}
	.myInfo{padding:60px 0; text-align: center;width: 39%;height: 60px;}
	.myInfo img{display: inline-block;width:60px;height: 60px;border-radius: 50%;}
	.myInfo .mineHead{cursor: pointer;}
	.myInfo .myName{display: inline-block;text-align: left;vertical-align: top;padding: 10px 5px;}
	.myName h4{line-height: 20px;font-size: 14px;font-weight: normal;}
	.myName p{line-height: 14px;font-size: 12px;color: #888;}
	.myName .accountIdentity{width: 10px;height: 10px;}
	
	.myAccount{padding-top: 40px;width:60%;}
	.myAccountRecharge{display: block;width:150px;height: 40px;line-height: 40px;text-align: center;background: linear-gradient(to right,#c7bffa,#9ea8ea);color: #fff;font-size: 12px;}
	.myAccountRecharge img{width:12px;height: 12px;margin: auto 5px;}
	.myAccontNum{padding-top:25px;}
	.eachAccountNum{width: 32%;}
	.eachAccountNum p{line-height:20px;font-size: 12px;color: #666; }
	.eachAccountNum h4{line-height:40px;font-size: 20px;font-weight: normal;}
	
	.indexAccountSwiper{width: 400px;}
	.indexAccountSwiper .elPic{width: 100%;height: 100%;}
	.indexAccountSwiper .el-carousel__button{width: 10px;height: 10px;border-radius: 50%;}


	/*  公有标题   */
	.indexTitle{padding: 20px 0 10px;}
	.indexTitle img{width: 25px;height: 25px;display: inline-block;vertical-align: middle;}
	.indexTitle h3{display: inline-block;line-height:30px;font-size: 18px;font-weight: normal; padding: 0 5px;}
	.indexTitle p{display: inline-block;font-size: 18px;color: #666;}
	

	/*  推广产品  */
	.indexPromotion{position: relative;}
	.indexPromotionDetail{background: #fff;padding: 20px 0;box-sizing: border-box;}
	.indexPromotionDetail h2{font-size:18px;font-weight: normal;width: 21%;padding-left: 30px;box-sizing: border-box;line-height: 60px;}
	.eachIndexPromotion{width: 19.5%;height: 60px;}
	.eachIndexPromotion img{display: block;float: left;width: 40px;height: 40px;margin-right: 10px;padding:10px 0; }
	.eachIndexPromotion p{font-size: 12px;color: #666;line-height: 20px;}
	.eachIndexPromotion h3{font-size: 24px;line-height: 40px;font-weight: normal;}

	.datePicker{position:absolute;right: 0;top:20px; }

	.indexPromotionTips{padding-top: 20px;}
	.eachPromotionTip{width: 32%;background: #fff;padding:0 30px;box-sizing: border-box;position: relative;height: 260px;}
	.indexPromotionTips .eachPromotionTip:nth-child(2){margin: 0 2%;}
	.promotionTipType{padding: 20px 0 15px;border-bottom: 1px solid #f2f3f8;}
	.promotionTipType h3{line-height: 25px;font-size: 18px;font-weight: normal;}
	.promotionTipType img{display: block;width: 21px;height: 20=1px;float: left;margin:2px 5px;cursor: pointer;}
	.indexBtn{width:70px;height: 25px;line-height: 25px;text-align: center;margin-left: 5px;}
	.promotionTipShow{padding-top: 10px;}
	.promotionTipShow p{width: 49.9%;float: left;}
	.promotionTipShow p i{font-style: normal;font-size: 12px;color: #666;display: inline-block;width: 40%;line-height: 28px;}
	.promotionTipShow p em{font-style: normal;font-size: 16px;display: inline-block;width:60%; line-height: 28px;}

	/*  以下 class 用于 promotionTipShow 子元素个数不同时的 padding 值 */
	.lease6 p{padding: 10px 0;}
	.lease8 p{padding: 6px 0;}
	.lease10 p{padding: 2px 0;}
	
	.promotionTipSetting{position: absolute;top: 40px;left: 110px;background: #fff;width: 236px;padding:8px 18px;box-sizing: border-box;box-shadow: 0 0 5px #ccc;}
	.promotionTipSetting .el-checkbox{margin: 0;width: 46%;padding: 10px 0;}
	.promotionTipSetting .el-checkbox .el-checkbox__label{font-size: 12px;}
	.promotionTipSetting button{margin: 10px 0;}
	.promotionTipSetting .el-checkbox+.el-checkbox{margin-left: 0;}

	




</style>