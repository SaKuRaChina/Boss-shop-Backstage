<template>
	
	<div class="jumperWrap" v-show='isShow'>
		<div class="jumperPos pocketPromotionBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">开通红包推广</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent">
				<div class="indexJumperIntro">
					<h4>1、什么是红包推广？</h4>
					<p>红包推广基于以发布红包的方式，发布广告内容，包含图文样式，广告图样式以及视频样式的多种展现方式。</p>
				</div>
				<div class="indexJumperIntro">
					<h4>2、开通费用？</h4>
					<p>巨牛BOSS采用预付费制，最低需缴纳5600元，其中包含预存推广费5000元，服务费600元，（服务费和预存推广费根据地区情况可能会有所变动，具体费用由客户和服务商另行约定）</p>
				</div>
				<div class="jumperLine"></div>
				<button class="commonBtn jumperBtn" @click='getService'>确认，开通服务</button>
			</div>
		</div>
		
	</div>


</template>


<script>

	export default{
		name:'productPromotionJumper',
		data(){
			return{
				
			}
		},
		computed:{
			isShow(){
				return this.pocketPromotionShow
			}
		},

		mounted(){

		},
		props:['pocketPromotionShow'],
		methods:{
			getService(){
				var that = this
				$.ajax({
					type:"post",
					url:that.Global.router + '/create/createItem',
					data:{type:1},
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)

						if(res.code === "0000"){

							//开通成功处理
							that.$alert('开通成功', '提示', {confirmButtonText: '确定'});
							that.$parent.pocketPromotionShow = false
							//that.$emit('success')
							sessionStorage.setItem('isPacket',1)
							that.$parent.isPacket = sessionStorage.getItem('isPacket')


						}else if(res.code === "1003"){
							that.$alert('登录失效，请重新登录', '提示', {
					          	confirmButtonText: '确定',
					          	callback: action => {
						         	that.$router.push({name:'Log'})
					          	}
					        });
						}else{
							that.$alert(res.message, '提示', {confirmButtonText: '确定'});
						}
					},
					error(){}
				})
			},
			hideParent(){
				this.$parent.pocketPromotionShow = false
			}
		}

	}


</script>


<style>
	
	
</style>