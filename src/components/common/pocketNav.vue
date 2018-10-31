<template>
	
	<div class="pocketNavWrap center clearfix">
		<div class="pageNav left">
			<div class="routerUrl">
				<router-link to='/index'><img src="../../images/back-icon.png" alt="">返回首页</router-link>
			</div>
			<ul class="pageNavList">
				<li>
					<router-link :class='[ recentClass == 0 ? "active" : ""]' to='/pocket/pocketData' @click.native='recentNavChange(0)'><i class="iconfont">&#xe666;</i>广告统计</router-link>
				</li>
				
				<li>
					<p :class='[ recentClass == 4 ? "active" : ""]' @click='pocketNavChange(4)'><i class="iconfont">&#xe78d;</i>红包管理</p>
					<ul class="pageSecondList" v-if='pocketNavShow'>
						<li><router-link to='/pocket/pocketOrder' :class='[ pocketClass == 1 ? "active" : ""]' @click.native='pocketNavChoose(1)'>红包订单</router-link></li>
						<li><router-link to='/pocket/pocketTemplate' :class='[ pocketClass == 2 ? "active" : ""]' @click.native='pocketNavChoose(2)'>模板管理</router-link></li>
					</ul>
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
		name:'pocketNavPage',
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

			if(sessionStorage.getItem('recentPocketNav')){
				this.recentClass = sessionStorage.getItem('recentPocketNav')
			}else{
				this.recentClass = 0
			}


			//session存储布尔类型的值
			if(sessionStorage.getItem('chancePocketShow') === "true"){
				this.chanceNavShow = true
			}else if(sessionStorage.getItem('chancePocketShow') === "false"){
				this.chanceNavShow = false
			}

			if(sessionStorage.getItem('pocketPocketShow') === "true"){
				this.pocketNavShow = true
			}else if(sessionStorage.getItem('pocketPocketShow') === "false"){
				this.pocketNavShow = false
			}
			
			this.chanceClass = sessionStorage.getItem('chancePocketNav')
			this.pocketClass = sessionStorage.getItem('pocketPocketNav')

			console.log(this.chanceNavShow)
		},
		methods:{
			recentNavChange(i){
				this.recentClass = i;
				this.chanceNavShow =false;
				this.pocketNavShow=false;
				this.chanceClass=0;
				this.pocketClass=0;
				sessionStorage.setItem('recentPocketNav',i)
				sessionStorage.setItem('chancePocketShow',this.chanceNavShow)
				sessionStorage.setItem('pocketPocketShow',this.pocketNavShow)
				sessionStorage.setItem("chancePocketNav",0)
				sessionStorage.setItem("pocketPocketNav",0)

			},
			chanceNavChange(i){
				this.chanceNavShow = !this.chanceNavShow;
				this.recentClass = 2;
				//sessionStorage.setItem('recentNav',i)
				//sessionStorage.setItem('chanceShow',!this.chanceNavShow)
				sessionStorage.setItem('pocketPocketShow',false)
				sessionStorage.setItem("chancePocketNav",0)
				sessionStorage.setItem("pocketPocketNav",0)
			},
			pocketNavChange(i){
				this.pocketNavShow = !this.pocketNavShow;
				this.recentClass = 4
				//sessionStorage.setItem('recentNav',i)
				//sessionStorage.setItem('pocketShow',!this.pocketNavShow)
				sessionStorage.setItem('chancePocketShow',true)
				sessionStorage.setItem("chancePocketNav",0)
				sessionStorage.setItem("pocketPocketNav",0)
			},
			chanceNavChoose(i){
				this.chanceClass = i;
				sessionStorage.setItem('recentPocketNav',2)
				sessionStorage.setItem('chancePocketShow',true)
				sessionStorage.setItem("chancePocketNav",i)
			},
			pocketNavChoose(i){
				this.pocketClass = i;
				sessionStorage.setItem('recentPocketNav',4)
				sessionStorage.setItem('pocketPocketShow',true)
				sessionStorage.setItem("pocketPocketNav",i)
			}
		}
	}

</script>


<style>

</style>