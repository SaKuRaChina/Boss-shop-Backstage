<template>

	<div class='chanceCenterWrap'>

		<h3 class="pageTitle">
			<span>模板管理</span>
			<em>Template management</em>
			<a href='javascript:void(0)' @click='addTemplate'><i class="el-icon-plus"></i>添加模板</a>
		</h3>
		
		<div class="pageTableBox">
			<div class="pageSearch">
				<div class="eachSearch">
					<label for="">广告类型:</label>
					<el-select v-model="value" size="small" placeholder="请选择">
					    <el-option
						    v-for="item in options"
						    :key="item.value"
						    :label="item.label"
						    :value="item.value">
					    </el-option>
					</el-select>
				</div>
				<div class="eachSearch">
					<label for="">创建时间:</label>
					<el-date-picker size="small"
				        v-model="value"
				        type="daterange"
				        range-separator="至"
				        start-placeholder="开始日期"
				        end-placeholder="结束日期">
				    </el-date-picker>
				</div>
				<button class="commonBtn">查询</button>
			</div>
			<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>模板名称</th>
						<th>广告样式</th>
						<th>标题</th>
						<th>创建时间</th>
						<th>状态</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='item in pageArr' :key='item.templateId'>
						<td>{{ item.templateName }}</td>
						<td>{{ getType(item.type) }}</td>
						<td>{{ item.title }}</td>
						<td>{{ item.createTime }}</td>
						<td :class="{'yellowTd':item.templateState == 0,'cyanTd':item.templateState == 1,'redTd':item.templateState == 2}">{{ getState(item.templateState) }}</td>
						<td>
							<button type="button" v-if='item.templateState == 2' @click='rejectThis(item.templateId)'>驳回原因</button>
							<button type="button" :disabled='item.templateState != 1' @click='copyThis(item.templateId)'>复制</button>
							<button type="button" :disabled='item.templateState == 0' @click='delThis(item.templateId)'>删除</button>
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

		<SendTemplate :sendTemplateShow='sendTemplateShow' ref='sendTemplate' :addEdit='addEdit'></SendTemplate>
		<RejectReason :rejectShow='rejectShow' :reason='reason'></RejectReason>

	</div>

</template>


<script>

	import SendTemplate from '../../jumper/sendTemplate'
	import RejectReason from '../../jumper/rejectReason'

	export default{
		data(){
			return {
				pageArr:[],
				paginationObj:{

				},
				sendTemplateShow:false,
				rejectShow:false,
				reason:'',
				addEdit:true,

				options: [{
		            value: '选项1',
		            label: '黄金糕'
		        }, {
		            value: '选项2',
		            label: '双皮奶'
		        }, {
		            value: '选项3',
		            label: '蚵仔煎'
		        }, {
		            value: '选项4',
		            label: '龙须面'
		        }, {
		            value: '选项5',
		            label: '北京烤鸭'
		        }],
		        value: ''
			}
		},
		components:{
			SendTemplate,RejectReason
		},
		mounted(){
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
			initPage(arr = {}){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + "/redpacket/template/list",
					xhrFields:{withCredentials:true},
					data:arr,
					success(res){
						console.log(res)

						if(res.code === "0000"){
							if(res.result != null){
								that.pageArr = [];
								for(var i=0; i<res.result.detail.length; i++){
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
			getType(i){
				var type = '';
				switch(parseInt(i)){
					case 1:
						type = "广告图类型";
						break;
					case 2:
						type = "视频类型";
						break;
					case 3:
						type = "图文类型";
						break;
				}
				return type
			},
			getState(i){
				var state = '';
				switch(parseInt(i)){
					case 0:
						state = "审核中";
						break;
					case 1:
						state = "审核通过";
						break;
					case 2:
						state = "驳回";
						break;
				}
				return state
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
			rejectThis(id){
				var that = this;

				$.ajax({
					type:'post',
					url:that.Global.router + '/redpacket/template/info',
					data:{templateId:id},
					xhrFields:{withCredentials:true},
					success(res){
						if(res.code === "0000"){

							that.reason = res.result.overruleReason;
							that.rejectShow = true

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
			copyThis(id){
				var that = this;
				this.$refs.sendTemplate.initCopy(id)
				this.addEdit = false

			},
			delThis(id){
				var that = this
				that.$confirm('确定删除？','提示',{
					confirmButtonText:'确定',
					cancelButtomText:'取消'
				}).then(()=>{

					$.ajax({
						type:"post",
						url:that.Global.router + '/redpacket/template/delete',
						data:{templateId:id},
						xhrFields:{withCredentials: true},
						success(res){
							console.log(res)
							if(res.code === "0000"){
								that.$alert("删除成功","提示",{confirmButtonText:'确定'});
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
			addTemplate(){
				this.addEdit = true
				this.$refs.sendTemplate.initSpace()
			},
		}
	}

</script>


<style>

</style>