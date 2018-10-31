<template>
	<div class="chargeManageWrap">

		
		<div class="pageTableBox">
			<div class="pageSearch">
				<div class="eachSearch">
					<label for="">性别:</label>
					<el-select v-model="searchObj.sex" size="small" placeholder="请选择">
					    <el-option
						    v-for="item in sexArr"
						    :key="item.value"
						    :label="item.name"
						    :value="item.value">
					    </el-option>
					</el-select>
				</div>
				<div class="eachSearch">
					<label for="">姓名/电话:</label>
					<el-input size='small' placeholder="" v-model='searchObj.param'></el-input>
				</div>
				<button class="commonBtn" @click='searchPage'>查询</button>
			</div>
			<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>姓名</th>
						<th>性别</th>
						<th>职位</th>
						<th>电话</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='item in pageArr' :key='item.id'>
						<td>{{ item.userName }}</td>
						<td>{{ getSex(item.sex) }}</td>
						<td>{{ item.position }}</td>
						<td>{{ item.phone }}</td>
						<td>
							<button type="button" @click='watchItem(item.id)'>查看</button>
							<button :class="[item.worker == 0 ? 'cyanBtn' : 'redBtn']" type="button" @click='changeItem(item.id)'>{{item.worker == 0 ? '设定为客服' : '取消设定' }}</button>
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

		<MemberDetail :memberDetailShow='memberDetailShow' ref='memberDetail'></MemberDetail>


	</div>

</template>


<script>

	import MemberDetail from '../jumper/memberDetail'

	export default{
		data(){
			return{
				sexArr:[
					{'name':'不限',value:''},
					{'name':'男',value:'1'},
					{'name':'女',value:'0'},
				],
				searchObj:{
					sex:'',
					param:''
				},
				pageArr:[],
				paginationObj:{},
				memberDetailShow:false
			}
		},
		mounted(){
			this.initPage()
		},
		components:{
			MemberDetail
		},
		methods:{
			initPage(arr = {}){
				var that = this
				console.log(arr)
				$.ajax({
					type:'post',
					url:that.Global.router + '/account/getFirmMemberList',
					data:arr,
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						if(res.code === '0000'){

							that.pageArr = []
							if(res.result.detail != null){
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
			changeSize(val){
				console.log(val)
				var sendObj = {
					sex:this.searchObj.sex,
					param:this.searchObj.param,
					currentPage:val,
					type:1
				}
				
				this.initPage(sendObj)
			},
			searchPage(){
				var that = this;

				var sendObj = {
					sex:this.searchObj.sex,
					param:this.searchObj.param,
					currentPage:1,
					type:1
				}

				console.log(sendObj)
				that.initPage(sendObj)
			},
			watchItem(id){
				//console.log(id)
				this.$refs.memberDetail.initJumper(id)
			},
			changeItem(id){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/account/setWorker',
					data:{id:id},
					xhrFields:{withCredentials:true},
					success(res){
						
						console.log(res)
						if(res.code === "0000"){

							that.$alert('更改成功', '提示', {confirmButtonText: '确定'});
							var sendObj = {
								currentPage:that.paginationObj.currentPage
							}
							that.initPage(sendObj)

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


<style>

</style>