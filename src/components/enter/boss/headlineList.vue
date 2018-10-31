<template>
	
	<div class="topListWrap">
		
		<h3 class="pageTitle">
			<span>头条列表</span>
			<em>Headline</em>
			<a href='javascript:void(0)' @click='addOrder'><i class="el-icon-plus"></i>添加内容</a>
		</h3>
		
		<div class="pageTableBox">
			<div class="pageSearch">
				<div class="eachSearch">
					<label for="">创建时间:</label>
					<el-date-picker size="small"
				        v-model="searchObj.startDate"
				        type="date"
				        value-format='yyyy-MM-dd'
				        placeholder="选择日期">
				    </el-date-picker>
				    <span>-</span>
				    <el-date-picker size="small"
				        v-model="searchObj.endDate"
				        type="date"
				        value-format='yyyy-MM-dd'
				        placeholder="选择日期">
				    </el-date-picker>
					
				</div>
				<div class="eachSearch">
					<label for="">类型:</label>
					<el-select v-model="searchObj.headlineType" size="small" placeholder="请选择">
					    <el-option
						    v-for="item in typeArr"
						    :key="item.name"
						    :label="item.name"
						    :value="item.value">
					    </el-option>
					</el-select>
				</div>
				<div class="eachSearch">
					<label for="">状态:</label>
					<el-select v-model="searchObj.approvalStatus" size="small" placeholder="请选择">
					    <el-option
						    v-for="item in statusArr"
						    :key="item.name"
						    :label="item.name"
						    :value="item.value">
					    </el-option>
					</el-select>
				</div>
				<div class="eachSearch">
					<label for="">头条类别:</label>
					<el-select v-model="searchObj.sortId" size="small" placeholder="请选择">
					    <el-option
						    v-for="item in sortArr"
						    :key="item.sortId"
						    :label="item.name"
						    :value="item.sortId">
					    </el-option>
					</el-select>
				</div>
				<button class="commonBtn" @click='searchPage'>查询</button>
			</div>
			<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>类型</th>
						<th>头条类别</th>
						<th>标题</th>
						<th>封面图</th>
						<th>创建时间</th>
						<th>状态</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='(item,index) in pageArr'>
						<td>{{ getType(item.headlineType) }}</td>
						<td>{{ item.sortName }}</td>
						<td>{{ item.headlineTitle }}</td>
						<td class="bgTd">
							<img :src="item + '!default'" alt="" v-for='item in item.picArr'>
						</td>
						<td>{{ item.headlineTime }}</td>
						<td :class="{'yellowTd':item.approvalStatus == 0,'cyanTd':item.approvalStatus == 1,'redTd':item.approvalStatus == 2}">{{ getState(item.approvalStatus) }}</td>
						<td >
							<button type="button" :disabled='item.approvalStatus != 0 || item.status != 3' @click='submitItem(item.id)'>提交</button>
							<button type="button" :disabled='item.approvalStatus != 1 || item.status != 0' v-if='item.approvalStatus != 2' @click='releaseItem(item.id)'>发布</button>
							<button type="button" :disabled='item.approvalStatus == 2' v-if='item.approvalStatus != 2' @click='watchItem(item.id)'>查看</button>
							<button type="button" v-if='item.approvalStatus == 2' @click='rejectItem(index)'>驳回原因</button>
							<button type="button" :disabled='item.approvalStatus != 0 || item.status != 3' @click='editItem(item.id)' v-if='item.approvalStatus != 2'>编辑</button>
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
		
		
		<BossHeadline ref='bosshead' :bossHeadlineShow='bossHeadlineShow' :addEdit='addEdit' :editWatch='editWatch'></BossHeadline>

		<RejectReason :rejectShow='rejectShow' :reason='reason'></RejectReason>

	</div>



</template>




<script>

	import BossHeadline from '../../jumper/bossHeadline'
	import RejectReason from '../../jumper/rejectReason'
	
	export default{
		data(){
			return {
				typeArr:[
					{name:'不限',value:''},
					{name:'单图',value:1},
					{name:'多图',value:2},
					{name:'视频',value:3},
				],
				statusArr:[
					{name:'不限',value:'0'},
					{name:'未审核',value:0},
					{name:'审核通过',value:1},
					{name:'驳回',value:2},
				],
				sortArr:[],
				searchObj:{},
				pageArr:[],
				bossHeadlineShow:false,
				rejectShow:false,
				reason:'',
				paginationObj:{},
				addEdit:true,   //判断添加或编辑
				editWatch:true,

				value:'',
				vlaue:"",
				options:[]
			}
		},
		components:{
			BossHeadline,RejectReason
		},
		mounted(){

			this.initType()
			this.initPage()

			//再次引入jq
			const j = document.createElement('script');
			j.type = 'text/javascript';
			j.src = 'https://code.jquery.com/jquery-3.0.0.min.js'
			document.body.appendChild(j)

			//引入线上视频上传js
			const s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = '//imgcache.qq.com/open/qcloud/js/vod/sdk/ugcUploader.js'
			document.body.appendChild(s)

		},
		methods:{
			initType(){
				var that = this
				$.ajax({
					type:'post',
					url: that.Global.router + '/headline/headlineSort',
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							
							that.sortArr = [];
							that.sortArr.push({name:'不限',sortId:''})
							for(var i=0; i<res.result.length;i++){
								that.sortArr.push(res.result[i])
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
			initPage(arr = {}){
				console.log(arr)
				var that = this
				$.ajax({
					type:'post',
					url: that.Global.router + '/headline/list',
					xhrFields:{withCredentials:true},
					data:arr,
					success(res){
						console.log(res)

						if(res.code === "0000"){
							that.pageArr = [];

							for(var i=0; i<res.result.detail.length;i++){
								res.result.detail[i].picArr = res.result.detail[i].headlinePictureUrl.split(',')
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

					},
					error(){}
				})

			},
			getType(i){

				var type = '';
				
				switch (parseInt(i)){
					case 1:
						type = '单图'
						break
					case 2:
						type = '三图'
						break
					case 3:
						type = '视频'
						break
				}

				return type

			},
			getState(i){
				var state = '';
				
				switch (parseInt(i)){
					case 0:
						state = '待审核'
						break
					case 1:
						state = '审核通过'
						break
					case 2:
						state = '驳回'
						break;
					default:
						state = ''
				}

				return state
			},
			submitItem(id){

				var that = this;

				that.$confirm('确定提交吗?','提示',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(()=>{

					$.ajax({
						type:'post',
						url:that.Global.router + '/headline/submitHeadline',
						data:{id:id},
						xhrFields:{withCredentials:true},
						success(res){
							console.log(res)

							if(res.code === "0000"){
								that.$alert('提交成功','提示',{confirmButtonText:'确定'})
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

			},
			releaseItem(id){
				console.log(id)
				var that = this;

				that.$confirm('确定发布吗?','提示',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(()=>{

					$.ajax({
						type:'post',
						url:that.Global.router + '/headline/releaseHeadline',
						data:{id:id},
						xhrFields:{withCredentials:true},
						success(res){
							console.log(res)

							if(res.code === "0000"){
								that.$alert('发布成功','提示',{confirmButtonText:'确定'})
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
				
			},
			rejectItem(i){
				console.log(i)

				this.reason = this.pageArr[i].approvalReason;
				this.rejectShow = true
			},
			editItem(id){
				//console.log(id)

				this.bossHeadlineShow = true
				this.addEdit = false
				this.editWatch = true
				this.$refs.bosshead.initEdit(id)
			},
			watchItem(id){
				this.bossHeadlineShow = true
				this.addEdit = false
				this.editWatch = false
				this.$refs.bosshead.initEdit(id)
			},
			delItem(id){
				var that = this;

				that.$confirm('确定删除吗?','提示',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(()=>{

					$.ajax({
						type:'post',
						url:that.Global.router + '/headline/deleteHeadline',
						data:{id:id},
						xhrFields:{withCredentials:true},
						success(res){
							console.log(res)

							if(res.code === "0000"){
								that.$alert('删除成功','提示',{confirmButtonText:'确定'})
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
				
			},
			changeSize(val){
				//console.log(val)
				var sendArr = {
					param:this.keyWord,
					currentPage:val
				}

				//console.log(sendArr)
				this.initPage(sendArr)
			},
			addOrder(){
				this.bossHeadlineShow = true
				this.addEdit = true
				this.editWatch = true
				this.$refs.bosshead.initSpace()
			},
			searchPage(){
				console.log(this.searchObj)
				this.initPage(this.searchObj)
			},
			
		}
	}


</script>




<style>



</style>