<template>
	
	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos rejectBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">驳回原因</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent">
				<textarea name="" id="" disabled>{{ reason }}</textarea>
			</div>
		</div>
		
	</div>


</template>


<script>

	export default{
		name:'rejectJumper',
		data(){
			return{
				value:'',
				
			}
		},
		props:['rejectShow','reason'],
		computed:{
			isShow(){
				return this.rejectShow
			}
		},
		methods:{
			hideParent(){
				this.$parent.rejectShow = false
			}
		}
	}


</script>


<style>
	
	
</style>