<template>
	
	<div class="productNavWrap center clearfix">
		<div class="pageNav left">
			<div class="routerUrl">
				<router-link to='/index'><img src="../../images/back-icon.png" alt="">返回首页</router-link>
			</div>
			<ul class="pageNavList">
				<li>
					<router-link :class='[ recentClass == 0 ? "active" : ""]' to='/product/productData' @click.native='recentNavChange(0)'><i class="iconfont">&#xe666;</i>数据概况</router-link>
				</li>
				<li>
					<router-link :class='[ recentClass == 1 ? "active" : ""]' to='/product/chanceCenter' @click.native='recentNavChange(1)'><i class="iconfont">&#xe69b;</i>产品中心</router-link>
				</li>
				<li>
					<p :class='[ recentClass == 2 ? "active" : ""]' @click='chanceNavChange(2)'><i class="iconfont">&#xe502;</i>产品管理</p>
					<ul class="pageSecondList" v-if='chanceNavShow'>
						<li><router-link to='/product/chanceInfo' :class='[ chanceClass == 1 ? "active" : ""]' @click.native='chanceNavChoose(1)'>产品信息</router-link></li>
						<li><router-link to='/product/chanceBanner' :class='[ chanceClass == 2 ? "active" : ""]' @click.native='chanceNavChoose(2)'>轮播图</router-link></li>
						<li><router-link to='/product/chanceVideo' :class='[ chanceClass == 3 ? "active" : ""]' @click.native='chanceNavChoose(3)'>品牌视频</router-link></li>
						<li><router-link to='/product/chanceIntro' :class='[ chanceClass == 4 ? "active" : ""]' @click.native='chanceNavChoose(4)'>首页</router-link></li>
						<li><router-link to='/product/chanceExample' :class='[ chanceClass == 5 ? "active" : ""]' @click.native='chanceNavChoose(5)'>产品</router-link></li>
					</ul>
				</li>
				<!-- <li>
					<router-link :class='[ recentClass == 3 ? "active" : ""]' to='/product/productAsk' @click.native='recentNavChange(3)'><i class="iconfont">&#xe893;</i>项目问答</router-link>
				</li> -->
				<li>
					<p :class='[ recentClass == 4 ? "active" : ""]' @click='pocketNavChange(4)'><i class="iconfont">&#xe78d;</i>红包管理</p>
					<ul class="pageSecondList" v-if='pocketNavShow'>
						<li><router-link to='/product/pocketOrder' :class='[ pocketClass == 1 ? "active" : ""]' @click.native='pocketNavChoose(1)'>红包订单</router-link></li>
						<li><router-link to='/product/pocketTemplate' :class='[ pocketClass == 2 ? "active" : ""]' @click.native='pocketNavChoose(2)'>模板管理</router-link></li>
					</ul>
				</li>
				<!-- <li>
					<router-link :class='[ recentClass == 5 ? "active" : ""]' to='/product/productService' @click.native='recentNavChange(5)'><i class="iconfont">&#xe6b6;</i>客服列表</router-link>
				</li> -->
				<li>
					<router-link :class='[ recentClass == 5 ? "active" : ""]' to='/product/chargeManage' @click.native='recentNavChange(5)'><i class="iconfont">&#xe704;</i>佣金管理</router-link>
				</li>
			</ul>

		</div>
		<div class="pageContent left">
			<router-view></router-view>
		</div>


	</div>

</template>


<script>

	import '../../css/aside.css'

	export default{
		name:'productNavPage',
		data(){
			return{
				chanceNavShow:false,
				pocketNavShow:false,
				recentClass:0,
				chanceClass:0,
				pocketClass:0
			}
		},
		props:[],
		mounted(){

			if(sessionStorage.getItem('recentProductNav')){
				this.recentClass = sessionStorage.getItem('recentProductNav')
			}else{
				this.recentClass = 0
			}


			//session存储布尔类型的值
			if(sessionStorage.getItem('chanceProductShow') === "true"){
				this.chanceNavShow = true
			}else if(sessionStorage.getItem('chanceProductShow') === "false"){
				this.chanceNavShow = false
			}

			if(sessionStorage.getItem('pocketProductShow') === "true"){
				this.pocketNavShow = true
			}else if(sessionStorage.getItem('pocketProductShow') === "false"){
				this.pocketNavShow = false
			}
			
			this.chanceClass = sessionStorage.getItem('chanceProductNav')
			this.pocketClass = sessionStorage.getItem('pocketProductNav')

			console.log(this.chanceNavShow)
		},
		methods:{
			recentNavChange(i){
				this.recentClass = i;
				this.chanceNavShow =false;
				this.pocketNavShow=false;
				this.chanceClass=0;
				this.pocketClass=0;
				sessionStorage.setItem('recentProductNav',i)
				sessionStorage.setItem('chanceProductShow',this.chanceNavShow)
				sessionStorage.setItem('pocketProductShow',this.pocketNavShow)
				sessionStorage.setItem("chanceProductNav",0)
				sessionStorage.setItem("pocketProductNav",0)

			},
			chanceNavChange(i){
				this.chanceNavShow = !this.chanceNavShow;
				this.recentClass = 2;
				//sessionStorage.setItem('recentNav',i)
				//sessionStorage.setItem('chanceShow',!this.chanceNavShow)
				sessionStorage.setItem('pocketProductShow',false)
				sessionStorage.setItem("chanceProductNav",0)
				sessionStorage.setItem("pocketProductNav",0)
			},
			pocketNavChange(i){
				this.pocketNavShow = !this.pocketNavShow;
				this.recentClass = 4
				//sessionStorage.setItem('recentNav',i)
				//sessionStorage.setItem('pocketShow',!this.pocketNavShow)
				sessionStorage.setItem('chanceProductShow',true)
				sessionStorage.setItem("chanceProductNav",0)
				sessionStorage.setItem("pocketProductNav",0)
			},
			chanceNavChoose(i){
				this.chanceClass = i;
				sessionStorage.setItem('recentProductNav',2)
				sessionStorage.setItem('chanceProductShow',true)
				sessionStorage.setItem("chanceProductNav",i)
			},
			pocketNavChoose(i){
				this.pocketClass = i;
				sessionStorage.setItem('recentProductNav',4)
				sessionStorage.setItem('pocketProductShow',true)
				sessionStorage.setItem("pocketProductNav",i)
			}
		}
	}

</script>


<style>

</style>