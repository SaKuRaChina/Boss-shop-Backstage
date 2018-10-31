<template>
	
	<div class="programWrap">
		
		<TotalNav :activeClass='0'></TotalNav>

		<PocketaNav></PocketaNav>

	</div>


</template>



<script>

	import TotalNav from '../../common/totalNav'
	import PocketaNav from '../../common/pocketNav'

	export default{
		name:'pocketIndex',
		data(){
			return {

			}
		},
		components:{
			TotalNav,PocketaNav
		},
		mounted(){

		},
		methods:{

		}
	}


</script>



<style>


</style>