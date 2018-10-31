<template>
	
	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos ownChargeBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">佣金管理</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent">
				<!-- <div class="eachJumperLine">
					<label for="">标题:</label>
					<div class="JumperLineInput">
						<el-input size='small' v-model="jumperObj.title" placeholder="最少10个字，最多20个字"></el-input>
					</div>
				</div> -->
				<div class="eachJumperLine">
					<label for="">佣金金额:</label>
					<div class="JumperLineInput shortLineInput">
						<el-input size='small' v-model="jumperObj.totalMoney" type='number' placeholder="">
							<template slot="suffix">元</template>
						</el-input>
					</div>
					<span>1000元起</span>
				</div>
				<div class="eachJumperLine">
					<label for="">单个金额:</label>
					<div class="JumperLineInput shortLineInput">
						<el-input size='small' v-model="jumperObj.singleMoney"  type='number' placeholder="">
							<template slot="suffix">元</template>
						</el-input>
					</div>
					<!-- <span>单个金额最低0.1元，金额越大转发量越高</span> -->
				</div>
				<div class="eachJumperLine">
					<label for="">　　　　</label>
					<div class="JumperLineInput">
						<span>单个金额最低0.1元，金额越大转发量越高</span>
					</div>
					
				</div>
				<!-- <div class="eachJumperLine">
					<label for="">付款方式:</label>
					<div class="JumperLineInput">
						<el-select v-model="jumperObj.payType" size="small" placeholder="请选择">
						    <el-option
							    v-for="item in payType"
							    :key="item.id"
							    :label="item.name"
							    :value="item.val">
						    </el-option>
						</el-select>
					</div>
				</div> -->
			</div>
			<div class="jumperLine"></div>
			<button class="commonBtn jumperBtn" @click='subCharge'>提交</button>
		</div>
		
	</div>


</template>


<script>

	export default{
		name:'OwnCharge',
		data(){
			return{
				jumperObj:{
					title:'',
					totalMoney:'',
					singleMoney:'',
					payType:1
				},
				payType:[
					{id:0,val:1,name:"账户余额"},
					{id:1,val:2,name:"平台捐赠余额"},
				]
			}
		},
		props:['ownChargeShow','type'],
		computed:{
			isShow(){
				return this.ownChargeShow
			}
		},
		methods:{
			subCharge(){
				var that = this;
				console.log(that.jumperObj)

				var sendObj = {
					title:that.jumperObj.title,
					payType:1,
					totalMoney:that.jumperObj.totalMoney*1000,
					singleMoney:that.jumperObj.singleMoney*1000,
					type:that.type,
				}

				console.log(sendObj)

				// if(sendObj.title.length == 0){
				// 	that.$alert('请输入标题','提示',{confirmButtonText: '确定'})
				// }else{

					$.ajax({
						type:'post',
						url:that.Global.router + '/commission/addCommission',
						xhrFields:{withCredentials:true},
						data:sendObj,
						success(res){
							console.log(res)
							if(res.code === '0000'){

								that.$alert('发布成功', '提示', {confirmButtonText: '确定'});
								that.$parent.ownChargeShow = false
								that.$parent.initPage()


							}else if(res.code === '1003'){
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


				// }

				
			},
			hideParent(){
				this.$parent.ownChargeShow = false
			}
		}
	}


</script>


<style>
	
	
</style>