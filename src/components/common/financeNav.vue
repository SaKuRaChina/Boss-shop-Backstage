<template>
	<div class="financeNavWrap center">
		<ul class="financeList">
			<li :class="[financeActive == 1 ? 'active' : '']" @click='changeFinanceNav(1)'>
				<router-link to='/financeInfo'>财务信息</router-link>
			</li>
			<!-- <li>
				<router-link to='/payfor'>交纳费用</router-link>
			</li>
			<li>
				<router-link to='/payRecord'>付款记录</router-link>
			</li> -->
			<li :class="[financeActive == 2 ? 'active' : '']" @click='changeFinanceNav(2)'>
				<router-link to='/receiptRecord'>发票记录</router-link>
			</li>
			<li :class="[financeActive == 3 ? 'active' : '']" @click='changeFinanceNav(3)'>
				<router-link to='/supplyReceipt'>申请发票</router-link>
			</li>
			<li :class="[financeActive == 4 ? 'active' : '']" @click='changeFinanceNav(4)'>
				<router-link to='/receiptRight'>发票资质</router-link>
			</li>
		</ul>
		<router-view></router-view>

	</div>
</template>


<script>

	export default{
		name:'FinanceNav',
		data(){
			return{
				financeActive:1
			}
		},
		mounted(){
			this.initFinanceNav()
		},
		methods:{
			initFinanceNav(){
				if(sessionStorage.getItem('financeNav')){
					this.financeActive = sessionStorage.getItem('financeNav')
				}else{
					this.financeActive = 1
				}
			},
			changeFinanceNav(i){
				this.financeActive=i;
				sessionStorage.setItem('financeNav',i)
			}
		}
	}


</script>


<style>
	
	.financeList{padding:18px 0;text-align: center;margin: 0 auto;}

	.financeList li{display: inline-block;margin: 0 30px;}
	.financeList li a{display: block;padding:0 19px;height:30px;line-height: 30px;font-size: 16px;color: #222;}
	.financeList .active a{color: #fff;background: linear-gradient(to right,#c7bffa,#9ea8ea)}
	.financeList li:hover a{color: #fff;background: linear-gradient(to right,#c7bffa,#9ea8ea)}

</style>