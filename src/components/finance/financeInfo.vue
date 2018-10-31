<template>

	<div class="financeInfoWrap">
		
		<div class="financeMain">
			<h2 class="financeTitle">账户：{{ firmName }}</h2>
			<ul class="financeTips">
				<li :class="[pageType == 1 ? 'active' : '']" @click='pageType = 1'>充值订单</li>
				<li :class="[pageType == 2 ? 'active' : '']" @click='pageType = 2'>消费订单</li>
			</ul>
			<div class="financeInfoCont" v-if='pageType == 1'>
				<div class="pageSearch">
					<div class="eachSearch">
						<label for="">状态:</label>
						<el-select v-model="searchCharge.orderType" size="small" placeholder="请选择">
						    <el-option
							    v-for="item in chargeTypeArr"
							    :key="item.value"
							    :label="item.name"
							    :value="item.value">
						    </el-option>
						</el-select>
					</div>
					<div class="eachSearch">
						<label for="">创建时间:</label>
						<el-date-picker size="small"
					        v-model="searchCharge.startTime"
					        type="date"
					        value-format='yyyy-MM-dd'
					        placeholder="选择日期">
					    </el-date-picker>
					    <span>-</span>
					    <el-date-picker size="small"
					        v-model="searchCharge.endTime"
					        type="date"
					        value-format='yyyy-MM-dd'
					        placeholder="选择日期">
					    </el-date-picker>
					</div>
					<button class="commonBtn" @click='searchChargeFn'>查询</button>
				</div>
				<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
					<thead>
						<tr>
							<th>订单号</th>
							<th>日期</th>
							<th>订单类型</th>
							<th>支付方式</th>
							<th>支付状态</th>
							<th>订单金额</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for='item in pageChargeArr' :key='item.id'>
							<td>{{ item.orderNum }}</td>
							<td>{{ item.createTime }}</td>
							<td>{{ getChargeType(item.type) }}</td>
							<td>{{ getChargePay(item.payType) }}</td>
							<td>{{ getState(item.state)}}</td>
							<td>{{ item.amount / 1000 }}</td>
						</tr>
						<tr v-if='pageChargeArr.length == 0'>
							<td colspan="10">暂无数据...</td>
						</tr>
					</tbody>
				</table>
				<div class="pagination">
					<el-pagination
					    @current-change="chargeChangeSize"
					    :current-page="chargePaginationObj.currentPage"
					    :page-size="chargePaginationObj.pageSize"
					    layout="total, prev, pager, next, jumper"
					    :total="chargePaginationObj.totalCount">
				    </el-pagination>
				</div>
			</div>
			<div class="financeInfoCont" v-if='pageType == 2'>
				<div class="pageSearch">
					<div class="eachSearch">
						<label for="">状态:</label>
						<el-select v-model="searchCost.orderType" size="small" placeholder="请选择">
						    <el-option
							    v-for="item in costTypeArr"
							    :key="item.value"
							    :label="item.name"
							    :value="item.value">
						    </el-option>
						</el-select>
					</div>
					<div class="eachSearch">
						<label for="">创建时间:</label>
						<el-date-picker size="small"
					        v-model="searchCost.startTime"
					        type="date"
					        value-format='yyyy-MM-dd'
					        placeholder="选择日期">
					    </el-date-picker>
					    <span>-</span>
					    <el-date-picker size="small"
					        v-model="searchCost.endTime"
					        type="date"
					        value-format='yyyy-MM-dd'
					        placeholder="选择日期">
					    </el-date-picker>
					</div>
					<button class="commonBtn" @click='searchCostFn'>查询</button>
				</div>
				<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
					<thead>
						<tr>
							<th>日期</th>
							<th>订单类别</th>
							<th>订单号</th>
							<th>订单金额</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for='item in pageCostArr' :key='item.id'>
							<td>{{ item.createTime }}</td>
							<td>{{ getCostType(item.type) }}</td>
							<td>{{ item.orderNum }}</td>
							<td>{{ item.amount / 1000 }}</td>
						</tr>
						<tr v-if='pageCostArr.length == 0'>
							<td colspan="10">暂无数据...</td>
						</tr>
					</tbody>
				</table>
				<div class="pagination">
					<el-pagination
					    @current-change="consumeChangeSize"
					    :current-page="consumePaginationObj.currentPage"
					    :page-size="consumePaginationObj.pageSize"
					    layout="total, prev, pager, next, jumper"
					    :total="consumePaginationObj.totalCount">
				    </el-pagination>
				</div>
			</div>
		</div>


	</div>


</template>


<script type="text/javascript">

	import '../../css/finance.css'

	export default{
		data(){
			return {
				firmName:"",
				pageChargeArr:[],
				pageCostArr:[],
				pageType:1,  //1:充值订单  2:消费订单
				chargeTypeArr:[
					{name:'不限',value:""},
					{name:'账户充值',value:1},
					{name:'平台赠送',value:2}
				],
				searchCharge:{},
				costTypeArr:[
					{name:'不限',value:""},
					{name:'红包发布',value:1},
					{name:'佣金发布',value:2},
					{name:'开通商机推广',value:8},
					{name:'开通产品推广',value:9}
				],
				searchCost:{},
				chargePaginationObj:{},
				consumePaginationObj:{}
			}
		},
		mounted(){
			this.initCertification()

			this.initCharge();
			this.initCost()
		},
		methods:{
			initCertification(){
				var that = this;

				$.ajax({
					type:'post',
					url:that.Global.router + '/invoice/getInvoiceAptitude',
					xhrFields:{
						withCredentials:true
					},
					success(res){
						console.log(res)
						if(res.code === "0000"){

							if(res.result != null){
								that.firmName = res.result.firmName
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
					error(){}
				})

			},
			initCharge(arr = {}){
				var that = this;
				$.ajax({
					type:'post',
					url:that.Global.router + '/finance/getRechargeOrderList',
					xhrFields: {
                        withCredentials: true
                    },
                    data:arr,
                    success(res){
                    	console.log(res)

                    	if(res.code === "0000"){
                    		that.pageChargeArr = [];
                    		for(var i=0; i<res.result.detail.length; i++){
                    			that.pageChargeArr.push(res.result.detail[i])
                    		}

                    		that.chargePaginationObj = Object.assign({},res.result,that.chargePaginationObj)

                    	}

                    },
                    error(){}
				})
			},
			initCost(arr = {}){
				var that = this;
				$.ajax({
					type:'post',
					url:that.Global.router + '/finance/getConsumerOrderList',
					data:arr,
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							that.pageCostArr = [];

							for(var i=0; i<res.result.detail.length; i++){
								that.pageCostArr.push(res.result.detail[i])
							}

							that.consumePaginationObj = Object.assign({},res.result,that.consumePaginationObj)
						}
					},
					error(){}
				})
			},
			getState(i){
				var state = "";
				switch(parseInt(i)){
					case 0:
						state = "未支付";
						break;
					case 1:
						state = "支付成功";
						break;
					case 2:
						state = "支付失败";
						break;
				}
				return state
			},
			getChargeType(i){
				var type = "";
				switch(parseInt(i)){
					case 1:
						type = "账户充值";
						break;
					case 2:
						type = "平台赠送";
						break;
				}
				return type
			},
			getCostType(i){
				var type = "";
				switch(parseInt(i)){
					case 1:
						type = "红包发布";
						break;
					case 2:
						type = "佣金发布";
						break;
					case 3:
						type = "商机红包发布";
						break;
					case 4:
						type = "产品红包发布";
						break;
					case 5:
						type = "商机佣金发布";
						break;
					case 6:
						type = "产品佣金发布";
						break;
					case 7:
						type = "头条佣金发布";
						break;
					case 8:
						type = "开通商机推广";
						break;
					case 9:
						type = "开通产品推广";
						break
				}
				return type
			},
			getChargePay(i){
				var pay = ""
				switch(parseInt(i)){
					case 1:
						pay = "支付宝";
						break;
					case 2:
						pay = "微信";
						break;
					case 3:
						pay = "银联";
						break;
					case 4:
						pay = "线下付款";
						break
				}
				return pay
			},
			chargeChangeSize(val){
				console.log(val)
				var sendObj = {
					currentPage:val,
				}
				
				this.initCharge(sendObj)
			},
			consumeChangeSize(val){
				console.log(val)
				var sendObj = {
					currentPage:val,
				}
				
				this.initCost(sendObj)
			},
			searchChargeFn(){
				console.log(this.searchCharge)

				this.initCharge(this.searchCharge)
			},
			searchCostFn(){
				console.log(this.searchCost)
				this.initCost(this.searchCost)
			},
		}
	}


</script>



<style></style>