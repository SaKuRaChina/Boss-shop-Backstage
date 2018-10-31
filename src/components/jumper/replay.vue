<template>
	
	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos replayBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">回复</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent">
				<textarea name="" id="" placeholder="请输入回复内容" v-model='replyText'></textarea>
			</div>
			<div class="jumperLine"></div>
			<button class="commonBtn jumperBtn" @click='replyThis'>提交</button>
		</div>
		
	</div>


</template>



<script>

	export default{
		name:'replayJumper',
		data(){
			return{
				replyText:'',
			}
		},
		props:['replayShow','id'],
		computed:{
			isShow(){
				return this.replayShow
			}
		},
		methods:{
			hideParent(){
				this.$parent.replayShow = false
			},
			replyThis(){
				//console.log(this.replyText,this.id)
				var that = this
				var sendObj = {
					id:this.id,
					comment:this.replyText
				}

				$.ajax({
					type:"post",
					url:that.Global.router + '/business/replyComment',
					data:sendObj,
					xhrFields:{
						withCredentials:true
					},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							that.$alert("回复成功","提示",{confirmButtonText:'确定'})
							that.$parent.replayShow = false
							that.$parent.initPage()
						}else if(res.code === "1003"){
							that.$alert('登录失效，请重新登录', '提示', {
					          	confirmButtonText: '确定',
					          	callback: action => {
						         	that.$router.push({name:'Log'})
					          	}
					        });
						}
					}
				})
			}
		}
	}


</script>


<style>
	
	
</style>