<template>
	
	<div class="programWrap">
		
		<TotalNav :activeClass='0'></TotalNav>

		<ProgramNav></ProgramNav>

	</div>


</template>



<script>

	import TotalNav from '../../common/totalNav'
	import ProgramNav from '../../common/programNav'

	export default{
		name:'programIndex',
		data(){
			return {

			}
		},
		components:{
			TotalNav,ProgramNav
		},
		mounted(){

		},
		methods:{

		}
	}


</script>



<style>


</style>