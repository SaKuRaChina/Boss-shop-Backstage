<template>
	
	<div class="chanceInfoWrap">
		

		<div class="pageFormBox">
			<div class="pageForm">
				<div class="eachPageForm">
					<label for="">公司简介</label>
					<div class="richText">
						<textarea v-model='comment'></textarea>
					</div>
				</div>
				<div class="pageFormLine"></div>
				<div class="eachPageForm">
					<label for="">　　　　</label>
					<button class="commonBtn subBtn" @click='savePage'>保存</button>
				</div>
			</div>
		</div>


	</div>

</template>


<script>

	

	export default{
		name:"CompanyBase",
		data(){
			return {
				firmId:0,
				comment:''
			}
		},
		mounted(){
			this.initPage()
			
		},
		
		methods:{
			initPage(){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/account/editFirmMessage',
					data:{type:1},
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)

						if(res.code === "0000"){

							that.firmId = res.result.firmId
							that.comment = res.result.firmIntroduction

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
			savePage(){
				
				var that = this
				
				$.ajax({
					type:'post',
					url:that.Global.router + '/account/updateFirmMessage',
					data:{
						firmId:that.firmId,
						comment:that.comment
					},
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							that.$alert('保存成功','提示',{confirmButtonText: '确定'})
							that.initPage()
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
				

				
			}
		}
	}

</script>


<style scoped>
	
	.eachPageForm .richText{height: 400px;}
	.eachPageForm .richText textarea{width: 600px;height: 300px;}


</style>