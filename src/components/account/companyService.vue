<template>
	<div class="chargeManageWrap">

		
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
				<button class="commonBtn" @click='searchPage'>查询</button>
				<div class="pageAdd">
					<a href="javascript:void(0)" @click='addItem()'><i class="el-icon-plus"></i>添加订单</a>
				</div>
			</div>
			<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>产品名称</th>
						<th>封面图</th>
						<th>创建时间</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='item in pageArr' :key='item.id'>
						<td>{{ item.productName }}</td>
						<td class="bgTd">
							<img :src="item.productCover + '!default'">
						</td>
						<td>{{ item.productTime }}</td>
						<td>
							<button type="button" @click='editItem(item.id)'>编辑</button>
							<button type="button" @click='delItem(item.id)'>删除</button>
						</td>
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

		<ProductService :productServiceShow='productServiceShow' :addEdit='addEdit' ref='productService'></ProductService>


	</div>

</template>


<script>

	import ProductService from '../jumper/productService'

	export default{
		data(){
			return{
				searchObj:{
					startTime:'',
					endTime:''
				},
				pageArr:[],
				paginationObj:{},
				productServiceShow:false,
				addEdit:true
			}
		},
		mounted(){
			this.initPage()
		},
		components:{
			ProductService
		},
		methods:{
			initPage(arr = {}){
				var that = this
				console.log(arr)
				$.ajax({
					type:'post',
					url:that.Global.router + '/account/getProductServiceList',
					data:arr,
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						if(res.code === '0000'){

							that.pageArr = []

							if(res.result.detail[0] != null){
								for(var i=0; i<res.result.detail.length;i++){
									that.pageArr.push(res.result.detail[i])
								}

								that.paginationObj = {
									currentPage:res.result.currentPage,
									nextPage:res.result.nextPage,
									pageSize:res.result.pageSize,
									prePage:res.result.prePage,
									totalCount:res.result.totalCount,
									totalPage:res.result.totalPage
								}
							}

							//判断是否有进行中的任务
							if(res.result.state == 0){
								that.shallAdd = false
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
			changeSize(val){
				console.log(val)
				var sendObj = {
					startTime:this.searchObj.startTime,
					endTime:this.searchObj.endTime,
					currentPage:val,
					type:1
				}
				
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
			addItem(){
				this.productServiceShow = true;
				this.addEdit = true
				this.$refs.productService.initSpace()
			},
			editItem(id){
				this.productServiceShow = true;
				this.addEdit = false
				this.$refs.productService.initEdit(id)
			},
			delItem(id){
				console.log(id)
				var that = this

				that.$confirm("确定删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(()=>{

					$.ajax({
						type:'post',
						url:that.Global.router + "/account/deleteProductService",
						data:{id:id},
						xhrFields:{withCredentials:true},
						success(res){
							console.log(res)

							if(res.code === "0000"){
								that.$alert('删除成功', '提示', {confirmButtonText: '确定'});
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

				}).catch(()=>{})
				
			}
		}
	}

</script>


<style>

</style>