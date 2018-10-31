<template>
	<div class="chargeManageWrap">

		<h3 class="pageTitle">
			<span>佣金管理</span>
			<em>Commission</em>
			<a href='javascript:void(0)' @click='addOrder'><i class="el-icon-plus"></i>添加订单</a>
		</h3>

		<!-- <div>暂未开通</div> -->
		
		<div class="pageTableBox">
			<div class="pageSearch">
				<div class="eachSearch">
					<label for="">创建时间:</label>
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
				<!-- <div class="eachSearch">
					<label for="">状态:</label>
					<el-select v-model="value" size="small" placeholder="请选择">
					    <el-option
						    v-for="item in options"
						    :key="item.value"
						    :label="item.label"
						    :value="item.value">
					    </el-option>
					</el-select>
				</div> -->
				
				<button class="commonBtn" @click='searchPage'>查询</button>
			</div>
			<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>标题</th>
						<th>创建时间</th>
						<th>转发人数</th>
						<th>有效访问(人)</th>
						<th>佣金金额</th>
						<th>剩余金额</th>
						<th>任务状态</th>
						
					</tr>
				</thead>
				<tbody>
					<tr v-for='item in pageArr' :key='item.id'>
						<td>{{ item.title }}</td>
						<td>{{ item.createTime }}</td>
						<td>{{ item.transmitNum }}</td>
						<td>{{ item.viewNum }}</td>
						<td>{{ (item.totalMoney / 1000).toFixed(2) }}</td>
						<td>{{ (item.balanceMoney / 1000).toFixed(2) }}</td>
						<td :class="[item.state == 1 ? 'cyanTd' : 'redTd']">{{ getState(item.state) }}</td>
					</tr>
					<tr v-if='pageArr.length == 0'>
						<td colspan="10">暂无数据...</td>
					</tr>
				</tbody>
			</table>
			<div class="pagination">
				<el-pagination
				    @current-change="changeSize"
				    :current-page="paginationObj.currentPage"
				    :page-size="paginationObj.pageSize"
				    layout="total, prev, pager, next, jumper"
				    :total="paginationObj.totalCount">
			    </el-pagination>
			</div>
		</div>


		<OwnCharge :ownChargeShow='ownChargeShow' :type='2'></OwnCharge>


	</div>

</template>


<script>

	import OwnCharge from '../../jumper/ownCharge'

	export default{
		data(){
			return{
				searchObj:{
					startTime:'',
					endTime:''
				},
				ownChargeShow:false,
				pageArr:[],
				paginationObj:{},
				shallAdd:true,
			}
		},
		mounted(){
			this.initPage()
		},
		components:{
			OwnCharge
		},
		methods:{
			initPage(arr = {type:2}){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/commission/selectCommission',
					data:arr,
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						if(res.code === '0000'){

							that.pageArr = []
							if(res.result.page.detail != null){
								for(var i=0; i<res.result.page.detail.length;i++){
									that.pageArr.push(res.result.page.detail[i])
								}


								that.paginationObj = {
									currentPage:res.result.page.currentPage,
									nextPage:res.result.page.nextPage,
									pageSize:res.result.page.pageSize,
									prePage:res.result.page.prePage,
									totalCount:res.result.page.totalCount,
									totalPage:res.result.page.totalPage
								}
							}

							//判断是否有进行中的任务
							if(res.result.state == 0){
								that.shallAdd = false
							}
						}
					},
					error(){}
				})
			},
			getState(i){
				var state = ''
				switch(parseInt(i)){
					case 1:
						state = "进行中";
						break;
					case 2:
						state = "已完成";
					case 3:
						state = "已结算"
				}
				return state
			},
			changeSize(val){
				console.log(val)
				var sendObj = {
					startTime:this.searchObj.startTime,
					endTime:this.searchObj.endTime,
					currentPage:val,
					type:1
				}
				console.log(sendObj)
				this.initPage(sendObj)
			},
			searchPage(){
				var that = this;

				var sendObj = {
					startTime:this.searchObj.startTime,
					endTime:this.searchObj.endTime,
					currentPage:1,
					type:1
				}

				console.log(sendObj)
				that.initPage(sendObj)
			},
			addOrder(){
				var that = this

				if(that.shallAdd){
					that.ownChargeShow = true
				}else{
					that.$alert('您已有未结算的佣金任务，请等待结算之后再次添加', '提示', {confirmButtonText: '确定'});
				}
				
			}
		}
	}

</script>


<style>

</style>