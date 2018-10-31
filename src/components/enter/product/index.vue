<template>
	
	<div class="programWrap">
		
		<TotalNav :activeClass='0'></TotalNav>

		<ProductaNav></ProductaNav>

	</div>


</template>



<script>

	import TotalNav from '../../common/totalNav'
	import ProductaNav from '../../common/productNav'

	export default{
		name:'productIndex',
		data(){
			return {

			}
		},
		components:{
			TotalNav,ProductaNav
		},
		mounted(){

		},
		methods:{

		}
	}


</script>



<style>


</style>