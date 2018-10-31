<template>
	<div class="receiptRecordWrap">
		<div class="financeMain">
			<h2 class="financeTitle">发票记录列表</h2>
			<div class="pageSearch financeSearch">
				<div class="eachSearch">
					<label for="">时间范围:</label>
					<el-date-picker size="small"
				        v-model="searchObj.startTime"
				        type="date"
				        value-format='yyyy-MM-dd'
				        placeholder="选择日期">
				    </el-date-picker>
				    <span>-</span>
				    <el-date-picker size="small"
				        v-model="searchObj.endTime"
				        type="date"
				        value-format='yyyy-MM-dd'
				        placeholder="选择日期">
				    </el-date-picker>
				</div>
				<button class="commonBtn" @click='searchPage'>查询</button>
			</div>
			<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>发票号</th>
						<th>发票类型</th>
						<th>发票金额</th>
						<th>申请时间</th>
						<th>当前状态</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='item in pageArr' :key='item.id'>
						<td>{{ item.invoiceCode }}</td>
						<td>电子发票(普通)</td>
						<td>{{ item.invoiceMoney / 1000 }}</td>
						<td>{{ item.createTime }}</td>
						<td :class="{'yellowTd':item.state == 1, 'cyanTd':item.state == 2,'redTd':item.state == 3}">{{ getState(item.state) }}</td>
						<td>
							<button v-if='item.state == 3' @click='rejectShow=true;reason=item.reason'>驳回原因</button>
						</td>
					</tr>
					<tr v-if='pageArr.length == 0'>
						<td colspan="10">暂无数据...</td>
					</tr>
				</tbody>
			</table>
			
		</div>


		<RejectReason :rejectShow='rejectShow' :reason='reason'></RejectReason>


	</div>

</template>

<script type="text/javascript">

	import '../../css/finance.css'
	import RejectReason from '../jumper/rejectReason'

	export default{
		data(){
			return {
				searchObj:{

				},
				pageArr:[],
				rejectShow:false,
				reason:''
			}
		},
		components:{
			RejectReason
		},
		mounted(){
			this.initPage()

		},
		methods:{
			initPage(arr = {}){
				var that = this;
				$.ajax({
					type:"post",
					url:that.Global.router + '/invoice/getInvoiceList',
					data:arr,
					xhrFields:{
						withCredentials:true
					},
					success(res){
						console.log(res)
						if(res.code === "0000"){

							that.pageArr = [];
							for(var i=0; i<res.result.detail.length; i++){
								that.pageArr.push(res.result.detail[i])
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
			getState(i){
				var state = "";
				switch(parseInt(i)){
					case 1:
						state = "申请中";
						break;
					case 2:
						state = "申请成功";
						break;
					case 3:
						state = "驳回";
						break
				}
				return state
			},
			searchPage(){
				console.log(this.searchObj)
				this.initPage(this.searchObj)
			}
		}
	}



</script>


<style>

</style>