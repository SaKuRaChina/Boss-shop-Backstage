<template>
	
	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos memberDetailBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">公司成员</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="slim-outer-box">
				<div class="slim-inner-box">
					<div class="jumperContent rightLabel">
						<div class="eachJumperLine">
							<label for="">姓名:</label>
							<div class="JumperLineInput">
								<span>{{ jumperObj.userName }}</span>
							</div>
						</div>
						<div class="eachJumperLine">
							<label for="">性别:</label>
							<div class="JumperLineInput">
								<span>{{ getSex(jumperObj.sex) }}</span>
							</div>
						</div>
						<div class="eachJumperLine">
							<label for="">职位:</label>
							<div class="JumperLineInput">
								<span>{{ jumperObj.position }}</span>
							</div>
						</div>
						<div class="eachJumperLine">
							<label for="">电话:</label>
							<div class="JumperLineInput">
								<span>{{ jumperObj.phone }}</span>
							</div>
						</div>
						<div class="eachJumperLine">
							<label for="">身份证正面:</label>
							<div class="JumperLineInput JumperCard">
								<img :src="jumperObj.idCardFront + '!default'">
							</div>
						</div>
						<div class="eachJumperLine">
							<label for="">身份证反面:</label>
							<div class="JumperLineInput JumperCard">
								<img :src="jumperObj.idCardBack + '!default'">
							</div>
						</div>
						<div class="eachJumperLine">
							<label for="">职位证明:</label>
							<div class="JumperLineInput JumperCard">
								<img :src="jumperObj.verifyUrl + '!default'">
							</div>
						</div>
					</div>
					<div class="jumperLine"></div>
					<button class="commonBtn jumperBtn" @click='hideParent'>关闭</button>
				</div>
			</div>
		</div>
	</div>


</template>


<script>

	export default{
		name:'memberDetail',
		data(){
			return{
				jumperObj:{
					userName:"",
					sex:'',
					phone:'',
					idCardFront:'',
					idCardBack:'',
					verifyUrl:''
				},
				
			}
		},
		props:['memberDetailShow'],
		computed:{
			isShow(){
				return this.memberDetailShow
			}
		},
		methods:{
			initJumper(id){
				console.log(id)
				var that = this
				console.log(id)
				$.ajax({
					type:"post",
					url:that.Global.router + '/account/getFirmMember',
					xhrFields:{withCredentials:true},
					data:{id:id},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							for(var key in that.jumperObj){
								delete that.jumperObj[key]
							}

							that.jumperObj = Object.assign({},that.jumperObj,res.result)

							that.$parent.memberDetailShow = true

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
			getSex(i){
				var sex = '';

				switch (parseInt(i)){
					case 0:
						sex = "女";
						break;
					case 1:
						sex = "男";
						break;
					default:
						sex = "未知"
				}

				return sex

			},
			hideParent(){
				this.$parent.memberDetailShow = false
			}
		}
	}


</script>


<style>
	
	
</style>