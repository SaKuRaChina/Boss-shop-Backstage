<template>
	<div class="accountWrap">
		
		<TotalNav  :activeClass='1'></TotalNav>
		

		<AccountNav></AccountNav>

	</div>

</template>

<script>

	import TotalNav from '../common/totalNav'
	import AccountNav from '../common/accountNav'

	export default{
		name:"Account",
		data(){
			return{

			}
		},
		components:{
			TotalNav,AccountNav
		},
		methods:{
			navClick(){
				//防报错用
			}
		}
	}


</script>


<style>


</style>