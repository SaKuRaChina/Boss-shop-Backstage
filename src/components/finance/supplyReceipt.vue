<template>
	<div class="supplyReceiptWrap">
		<div class="financeMain">
			<h2 class="financeTitle">申请发票</h2>
			<div class="receiptContain clearfix">
				<h3 class="left">开具发票</h3>
				<div class="receiptDetail left">
					<div class="receiptDetailLine"></div>
					<p><label>发票类型</label><em>电子发票(普通)</em></p>
					<p><label>发票抬头</label><em>{{ firmName }}</em></p>
					<p>
						<label>未开额度</label>
						<el-select v-model='sureQuote.rechargeId' size="mini" placeholder="请选择" v-if='shallSupply == true' @change="selectQuota">
						    <el-option
							    v-for="item in unOpenArr"
							    :key="item.value"
							    :label="item.name"
							    :value="item.value">
						    </el-option>
						</el-select>
						<em v-if='shallSupply == false'>0</em>
						<a v-if='shallSupply == false' href="javascript:void(0)">全部开具</a>
					</p>
					<p>
						<label>开票金额</label>
						<em>
							<el-input size='mini' placeholder="" disabled v-model='invoiceMoney'>
							</el-input>
						</em>
						<!-- <i>申请金额不得低于1000</i> -->
					</p>
				</div>

			</div>
			<div class="receiptContain clearfix">
				<h3 class="left">开票资质信息</h3>
				<div class="receiptDetail left">
					<div class="receiptDetailLine"></div>
					<p><label>纳税人识别号</label><em>{{ discernCode }}</em></p>
					<button class="commonBtn financeBtn" :disabled='!shallSupply || isFirst' @click='subCharge'>提交</button>
				</div>
				
			</div>
		</div>

	</div>

</template>

<script>

	import '../../css/finance.css'

	export default{
		data(){
			return {
				unOpenArr:[],
				isFirst:true,
				shallSupply:false,  //能开为true,没有额度为false
				firmName:"",
				state:'',  //判断是否可以提交
				invoiceMoney:"",
				discernCode:"",
				rechargeId:"",
				sureQuote:{
					invoiceMoney:'',
					rechargeId:''
				}
			}
		},
		mounted(){
			//信息展示
			this.initCertification()

			//未开额度
			this.initUnopen()
		},
		methods:{
			initCertification(){
				console.log('yes')
				var that = this;
				$.ajax({
					type:"post",
					url:that.Global.router + '/invoice/getInvoiceAptitude',
					xhrFields:{
						withCredentials:true
					},
					success(res){
						console.log(res)
						if(res.code == "0000"){
							if(res.result.state == null){
								that.$alert("请先上传发票资质","提示",{confirmButtonText:'确定'}).then(()=>{})
								that.isFirst = true
							}else{
								that.state = res.result.state
								that.discernCode = res.result.discernCode
								that.firmName = res.result.firmName
								that.isFirst = false
							}
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
					errror(res){
						console.log(res)
					}
				})
			},
			initUnopen(){
				var that = this
				$.ajax({
					type:"post",
					url:that.Global.router + "/invoice/getRechargeList",
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							if(res.result.length == 0){
								that.shallSupply = false
							}else{
								that.shallSupply = true
								that.unOpenArr.splice(0,that.unOpenArr.length)
								for(var i=0; i<res.result.length; i++){
									that.unOpenArr.push({"name":"充值单号：" + res.result[i].orderNum + "  充值金额：" + res.result[i].amount / 1000, "value": res.result[i].id,"money":res.result[i].amount})
								}
							}

						}
					},
					error(){}
				})
			},
			selectQuota(value){
				var that = this
				for(var i=0; i<that.unOpenArr.length; i++){
					if(that.unOpenArr[i].value == value){
						that.invoiceMoney = that.unOpenArr[i].money / 1000;
						that.sureQuote.invoiceMoney = that.unOpenArr[i].money;
						that.sureQuote.rechargeId = that.unOpenArr[i].value;

					}
				}
				console.log(value)
				//console.log('test')
			},
			subCharge(){
				var that = this

				var sendObj = {};
				sendObj.invoiceMoney = that.sureQuote.invoiceMoney;
				sendObj.rechargeId = that.sureQuote.rechargeId;
				sendObj.discernCode = that.discernCode;

				console.log(sendObj)
				
				if(that.state != 1){
					that.$alert("发票资质审核暂未成功","提示",{confirmButtonText:'确定'}).then(()=>{})
				}else if(sendObj.rechargeId.length == 0){
					that.$alert("请选择发票","提示",{confirmButtonText:'确定'}).then(()=>{})
				}else{

					$.ajax({
						type:'post',
						url:that.Global.router + "/invoice/addInvoice",
						xhrFields:{withCredentials:true},
						data:sendObj,
						success(res){
							console.log(res)
							if(res.code == "0000"){
									that.$alert('申请已提交', '提示', {confirmButtonText: '确定'});
									that.initCertification();
									that.initUnopen()
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
	}


</script>



<style type="text/css"></style>