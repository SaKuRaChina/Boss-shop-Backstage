<template>

	<div class="financeWrap">
		
		<TotalNav :activeClass='2'></TotalNav>
		
		<FinanceNav ref='financeNav'></FinanceNav>
		
	</div>


</template>


<script type="text/javascript">

	import TotalNav from '../common/totalNav';
	import FinanceNav from '../common/financeNav'

	export default{
		name:"Finance",
		data(){
			return{

			}
		},
		components:{
			TotalNav,FinanceNav
		},
		methods:{
			navClick(){
				this.$refs.financeNav.initFinanceNav()
			}
		}
	}


</script>



<style>



</style>