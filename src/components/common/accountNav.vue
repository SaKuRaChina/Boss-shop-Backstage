<template>
	
	<div class="AccountNavWrap center clearfix">
		<div class="pageNav left">
			
			<ul class="pageNavList">
				<li>
					<p :class='[ recentClass == 1 ? "active" : ""]' @click='chanceNavChange(1)'><i class="iconfont">&#xe8dd;</i>账户管理</p>
					<ul class="pageSecondList" v-if='chanceNavShow'>
						<li><router-link to='/account/accountInfo' :class='[ chanceClass == 1 ? "active" : ""]' @click.native='chanceNavChoose(1)'>账户信息</router-link></li>
						<li><router-link to='/account/accountSecurity' :class='[ chanceClass == 2 ? "active" : ""]' @click.native='chanceNavChoose(2)'>安全中心</router-link></li>
					</ul>
				</li>
				<li>
					<p :class='[ recentClass == 2 ? "active" : ""]' @click='pocketNavChange(2)'><i class="iconfont">&#xe703;</i>公司信息</p>
					<ul class="pageSecondList" v-if='pocketNavShow'>
						<li><router-link to='/account/companyBase' :class='[ pocketClass == 1 ? "active" : ""]' @click.native='pocketNavChoose(1)'>基本信息</router-link></li>
						<li><router-link to='/account/companyService' :class='[ pocketClass == 2 ? "active" : ""]' @click.native='pocketNavChoose(2)'>产品服务</router-link></li>
						<li><router-link to='/account/companyHonor' :class='[ pocketClass == 3 ? "active" : ""]' @click.native='pocketNavChoose(3)'>公司荣誉</router-link></li>
					</ul>
				</li>
				
				<li>
					<router-link :class='[ recentClass == 3 ? "active" : ""]' to='/account/companyMember' @click.native='recentNavChange(3)'><i class="iconfont">&#xe6b6;</i>公司成员</router-link>
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
		name:'AccountNavPage',
		data(){
			return{
				chanceNavShow:false,
				pocketNavShow:false,
				recentClass:1,
				chanceClass:0,
				pocketClass:0
			}
		},
		props:[],
		mounted(){

			if(sessionStorage.getItem('recentAccountNav')){
				this.recentClass = sessionStorage.getItem('recentAccountNav')
			}else{
				this.recentClass = 1
			}


			//session存储布尔类型的值
			if(sessionStorage.getItem('chanceAccountShow') === "true"){
				this.chanceNavShow = true
			}else if(sessionStorage.getItem('chanceAccountShow') === "false"){
				this.chanceNavShow = false
			}

			if(sessionStorage.getItem('pocketAccountShow') === "true"){
				this.pocketNavShow = true
			}else if(sessionStorage.getItem('pocketAccountShow') === "false"){
				this.pocketNavShow = false
			}
			
			this.chanceClass = sessionStorage.getItem('chanceAccountNav')
			this.pocketClass = sessionStorage.getItem('pocketAccountNav')

			console.log(this.chanceNavShow)
		},
		methods:{
			recentNavChange(i){
				this.recentClass = i;
				this.chanceNavShow =false;
				this.pocketNavShow=false;
				this.chanceClass=0;
				this.pocketClass=0;
				sessionStorage.setItem('recentAccountNav',i)
				sessionStorage.setItem('chanceAccountShow',this.chanceNavShow)
				sessionStorage.setItem('pocketAccountShow',this.pocketNavShow)
				sessionStorage.setItem("chanceAccountNav",0)
				sessionStorage.setItem("pocketAccountNav",0)

			},
			chanceNavChange(i){
				this.chanceNavShow = !this.chanceNavShow;
				this.recentClass = i;
				//sessionStorage.setItem('recentNav',i)
				//sessionStorage.setItem('chanceShow',!this.chanceNavShow)
				this.pocketNavShow = false
				sessionStorage.setItem('pocketAccountShow',false)
				sessionStorage.setItem("chanceAccountNav",0)
				sessionStorage.setItem("pocketAccountNav",0)
			},
			pocketNavChange(i){
				this.pocketNavShow = !this.pocketNavShow;
				this.recentClass = i
				//sessionStorage.setItem('recentNav',i)
				//sessionStorage.setItem('pocketShow',!this.pocketNavShow)
				this.chanceNavShow = false
				sessionStorage.setItem('chanceAccountShow',true)
				sessionStorage.setItem("chanceAccountNav",0)
				sessionStorage.setItem("pocketAccountNav",0)
			},
			chanceNavChoose(i){
				this.chanceClass = i;
				sessionStorage.setItem('recentAccountNav',1)
				sessionStorage.setItem('chanceAccountShow',true)
				sessionStorage.setItem("chanceAccountNav",i)
			},
			pocketNavChoose(i){
				this.pocketClass = i;
				sessionStorage.setItem('recentAccountNav',2)
				sessionStorage.setItem('pocketAccountShow',true)
				sessionStorage.setItem("pocketAccountNav",i)
			}
		}
	}

</script>


<style>

</style>