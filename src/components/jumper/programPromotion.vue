<template>
	
	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos programPromotionBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">开通项目推广</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent">
				<div class="indexJumperIntro">
					<h4>1、什么是项目推广？</h4>
					<p>项目推广是根据要推广的项目进行推广，根据顾客需求，项目的价格和差异化、客服人员的引导等，既提高了项目的含金量，又让客户能大胆的投资项目。</p>
				</div>
				<div class="indexJumperIntro">
					<h4>2、开通费用？</h4>
					<p>巨牛BOSS采取预付费制，最低需缴纳0元，需要有持续发布佣金任务以及红包订单记录，一个月内无消费记录将暂停推广服务。（服务费和预存推广费根据地区情况可能会有所变动，具体费用由客户和服务商另行约定）</p>
				</div>
				<!-- <div class="jumperLine"></div>
				<div class="indexJumperPay">
					<div class="jumperPayTip"><em>账户总余额</em><span>{{ totalMoney }}</span></div>
					<div class="jumperPayTip">
						<label for="">推广时间</label>
						<el-select v-model="jumperObj.timeType" @change='changeTime' placeholder="请选择" size='small'>
						    <el-option
						        v-for="item in timeArr"
						        :key="item.id"
						        :label="item.name"
						        :value="item.sort">
						    </el-option>
						</el-select>
					</div>
					<div class="jumperPayTip">
						<label for="">付款方式</label>
						<el-select v-model="jumperObj.payType" @change='changePay' placeholder="请选择" size='small'>
						    <el-option
						        v-for="item in payArr"
						        :key="item.id"
						        :label="item.name"
						        :value="item.id">
						    </el-option>
						</el-select>
					</div>
					<div class="jumperPayTip"><em>付款金额</em><span>{{ jumperObj.money}}元</span></div>
				</div> -->
				<div class="jumperLine"></div>
				<button class="commonBtn jumperBtn" @click='getSevice'>确认，开通服务</button>
			</div>
		</div>
		
	</div>


</template>


<script>

	export default{
		name:'productPromotionJumper',
		data(){
			return{
				pageMoney:{
					balance:0,
					donate:0
				},
				totalMoney:0,
				timeArr:[],
				payArr:[
					{id:1,name:'账户余额'},
					{id:2,name:'平台捐赠余额'}
				],
				jumperObj:{
					money:0
				}
			}
		},
		props:['programPromotionShow','isOppor'],
		computed:{
			isShow(){
				return this.programPromotionShow
			}
		},
		mounted(){
			this.initDetail()
		},
		methods:{
			initDetail(){
				var that = this
				$.ajax({
					type:'post',
					url:this.Global.router + "/create/getCreateType",
					data:{
						type:1
					},
					xhrFields:{withCredentials: true},
					success(res){
						//console.log(res)
						if(res.code === "0000"){


							if(res.result != null){
								for(var i=0; i<res.result.create.length;i++){
									res.result.create[i].sloveMoney = res.result.create[i].money / 1000
									if(i == 0){
										res.result.create[i].name='3个月'
										res.result.create[i].sort=1
									}else if(i == 1){
										res.result.create[i].name='6个月'
										res.result.create[i].sort=2
									}else if(i == 2){
										res.result.create[i].name='12个月'
										res.result.create[i].sort=3
									}
									that.timeArr.push(res.result.create[i])
								}

								that.pageMoney.balance = res.result.wallet.balance / 1000
								that.pageMoney.donate = res.result.wallet.donate / 1000
							}
							

						}

					},
					error(){}
				})
			},
			changeTime(val){
				var that = this;
				//console.log(val)

				for(var i=0; i<that.timeArr.length; i++){
					if(that.timeArr[i].sort == val){
						that.jumperObj.money = that.timeArr[i].sloveMoney
					}
				}
			},
			changePay(val){
				console.log(val)
				if(val == 1){
					this.totalMoney = this.pageMoney.balance
				}else if(val == 2){
					this.totalMoney = this.pageMoney.donate
				}
			},
			getSevice(){
				console.log(this.jumperObj)
				console.log(this.isOppor)

				var that = this;
				var sendObj = {}

				sendObj.timeType = 3
				sendObj.payType = 1
				sendObj.money = 0
				sendObj.isCreate = 1;
				sendObj.type = 2;

				console.log(sendObj)

				
				$.ajax({
					type:"post",
					url:that.Global.router + '/create/createItem',
					data:sendObj,
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)

						if(res.code === "0000"){

							//开通成功处理
							that.$alert('开通成功', '提示', {confirmButtonText: '确定'});
							that.$parent.programPromotionShow = false
							//that.$emit('success')
							sessionStorage.setItem('isOppor',1)
							that.$parent.isOppor = sessionStorage.getItem('isOppor')


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
				this.$parent.programPromotionShow = false
			}
		}
	}


</script>


<style>
	
	
</style>