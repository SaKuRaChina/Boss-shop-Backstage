<template>
	
	<div class="programWrap">
		
		<TotalNav :activeClass='0'></TotalNav>

		<BossNav></BossNav>

	</div>


</template>



<script>

	import TotalNav from '../../common/totalNav'
	import BossNav from '../../common/bossNav'

	export default{
		name:'programIndex',
		data(){
			return {

			}
		},
		components:{
			TotalNav,BossNav
		},
		mounted(){

		},
		methods:{

		}
	}


</script>



<style>


</style>