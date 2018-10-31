<template>
	
	<div class='chanceCenterWrap'>

		<h3 class="pageTitle">
			<span>红包订单</span>
			<em>Order of red packets</em>
			<a href='javascript:void(0)' @click='addPocket'><i class="el-icon-plus"></i>添加订单</a>
		</h3>

		<div class="pageTableBox">
			<div class="pageSearch">
				<div class="eachSearch">
					<label for="">地域选择:</label>
					<el-select class='elSearchThree' size="medium" v-model="searchObj.province" placeholder="请选择" name='province' @change='selectProv' @visible-change='clickProv'>
						<el-option
						v-for="(item,index) in proviceArr"
						:key="index"
						:label="item"
						:value="item">
						</el-option>
					</el-select>
					<el-select class='elSearchThree' size="medium" v-model="searchObj.city" name='city' placeholder="请选择" @change='selectCity' @visible-change='clickCity'>
						<el-option
						v-for="(item,index) in cityArr"
						:key="index"
						:label="item"
						:value="item">
						</el-option>
					</el-select>
					<el-select class='elSearchThree' size="medium" v-model="searchObj.county" name='county' placeholder="请选择">
						<el-option
						v-for="(item,index) in areaArr"
						:key="index"
						:label="item"
						:value="item">
						</el-option>
					</el-select>
					
				</div>
				<div class="eachSearch">
					<label for="">创建时间:</label>
					<el-date-picker size="small"
				      	v-model="searchObj.startTime"
				      	type="date"
				      	value-format='yyyy-MM-dd'
				      	placeholder="开始时间">
				    </el-date-picker>
				    <span>-</span>
				    <el-date-picker size="small"
				      	v-model="searchObj.endTime"
				      	type="date"
				      	value-format='yyyy-MM-dd'
				      	placeholder="结束时间">
				    </el-date-picker>
				</div>
				<div class="eachSearch">
					<label for="">红包状态:</label>
					<el-select v-model="searchObj.state" size="small" placeholder="请选择">
					    <el-option
						    v-for="item in stateArr"
						    :key="item.value"
						    :label="item.name"
						    :value="item.value">
					    </el-option>
					</el-select>
				</div>
				<div class="eachSearch">
					<label for="">广告类型:</label>
					<el-select v-model="searchObj.type" size="small" placeholder="请选择">
					    <el-option
						    v-for="item in typeArr"
						    :key="item.value"
						    :label="item.name"
						    :value="item.value">
					    </el-option>
					</el-select>
				</div>
				<button class="commonBtn" @click="searchPage">查询</button>
			</div>
			<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>广告类型</th>
						<th>创建时间</th>
						<th>红包金额</th>
						<th>红包个数</th>
						<th>发布范围</th>
						<th>当前剩余金额/个数</th>
						<th>红包状态</th>
						<th>红包用时</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='item in pageArr' :key='item.redpacketId'>
						<td>{{ getType(item.type) }}</td>
						<td>{{ item.createTime }}</td>
						<td>{{ (item.amount + item.serviceFee) / 1000}}</td>
						<td>{{ item.number }}</td>
						<td>{{ getScope(item.scope) }}</td>
						<td>{{ item.amount / 1000 }}/{{ item.surplus }}</td>
						<td :class="{'yellowTd':item.state == 0,'cyanTd':item.state == 1,'redTd':item.state == 3}">{{ getState(item.state) }}</td>
						<td>{{ getCostTime(item.endTime,item.releaseTime) }}</td>
						<td>
							<button type="button" :disabled='item.state != 0' @click='editThis(item.redpacketId)'>编辑</button>
							<button type="button" :disabled='item.state != 0' @click='payThis(item.redpacketId)'>支付</button>
							<button type="button" :disabled='item.state == 1' @click='delThis(item.redpacketId)'>删除</button>
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

		<SendPocket :sendPocketShow='sendPocketShow' :addEdit='addEdit' :templateId='templateObj.templateId' :templateName='templateObj.templateName' ref='sendPocket'></SendPocket>
		<ChooseTemplate :chooseTemplateShow='chooseTemplateShow' ref='chooseTemplate'></ChooseTemplate>
	</div>

</template>


<script>

	import Area from '../../common/area'
	import SendPocket from '../../jumper/sendPocket'
	import ChooseTemplate from '../../jumper/chooseTemplate'

	export default{
		data(){
			return {
				proviceArr:[],  //三级联动省
				cityArr:[],   //三级联动市
				areaArr:[],   //三级联动区
				provIndex:0,  //存储选取的省级index
				searchObj:{
					state:"",
					type:"",
					province:"",
					city:"",
					county:"",
				},
				stateArr:[
					{name:'不限',value:""},
					{name:'未开始',value:0},
					{name:'未领完',value:1},
					{name:'已完成',value:3},
				],
				typeArr:[
					{name:'不限',value:""},
					{name:'广告图',value:1},
					{name:'视频',value:2},
					{name:'图文',value:3},
				],
				templateObj:{
					templateId:"",
					templateName:""
				},
				pageArr:[],
				paginationObj:{},
				sendPocketShow:false,
				chooseTemplateShow:false,
				addEdit:true,
			}
		},
		components:{
			SendPocket,ChooseTemplate
		},
		mounted(){
			this.proviceArr = Area.dsy.Items[0]
			this.initPage()

		},
		methods:{
			initPage(arr = {}){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/redpacket/list',
					xhrFields:{withCredentials:true},
					data:arr,
					success(res){
						console.log(res)
						if(res.code === "0000"){
							if(res.result != null){
								that.pageArr.splice(0,that.pageArr.length)

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
						type = "广告图";
						break;
					case 2:
						type = "视频";
						break;
					case 3:
						type = "图文";
						break 
				}
				return type
			},
			getScope(i){
				var scope = ''
				switch (parseInt(i)){
					case 5:
						scope = "全国";
						break;
					case 4:
						scope = "省级";
						break;
					case 3:
						scope = "市级";
						break;
					case 2:
						scope = "区县级";
						break
				}
				return scope
			},
			getState(i){
				var state = '';
				switch(parseInt(i)){
					case 0:
						state = "未开始";
						break;
					case 1:
						state = "派发中";
						break;
					case 3:
						state = "已完成";
						break 
				}
				return state
			},
			getCostTime(time1,time2){
				var finalGap = ''
				if(time1 != null && time2 != null){
					var timeA = new Date(time1.replace(/-/g,"/"))
					var timeB = new Date(time2.replace(/-/g,"/"))
					//console.log(timeA,timeB)
					var gap = timeA.getTime() - timeB.getTime();
					finalGap = Math.floor(gap/60/60/1000)
				}

				return finalGap	
			},
			changeSize(val){
				//console.log(val)
				var sendArr = {
					currentPage:val,
					state:this.searchObj.state,
					type:this.searchObj.type,
					province:this.searchObj.province,
					city:this.searchObj.city,
					county:this.searchObj.county,
				}

				//console.log(sendArr)
				this.initPage(sendArr)
			},
			selectProv(value){

				this.searchObj.province = value
				this.searchObj.city = ''
				this.searchObj.county = ''

				this.cityArr = []
				this.areaArr = []
				
				let index = 0;

				for(let i=0;i<this.proviceArr.length;i++){
					if(this.proviceArr[i] == value){
						index = i
					}
				}

				this.provIndex = index;
				this.cityArr = Area.dsy.Items['0_' + index]
			},
			clickProv(type){
				if(type) this.selectProv()
			},
			selectCity(value){

				this.searchObj.city = value
				this.searchObj.county = ''
				this.areaArr = []
				let index = 0;

				for(let i=0;i<this.cityArr.length;i++){
					if(this.cityArr[i] == value){
						index = i
					}
				}

				this.areaArr = Area.dsy.Items['0_' + this.provIndex + '_' + index];
			},
			clickCity(type){
				if(type) this.selectCity()
			},
			selectArea(value){
				
				let that = this
				that.searchObj.county = ''
				
				setTimeout(function(){
					that.searchObj.county = value;
				},100)
			},
			clickArea(type){
				if(type) this.selectArea()
			},
			searchPage(){
				var that = this
				console.log(that.searchObj)

				this.initPage(that.searchObj)
			},
			addPocket(){
				//console.log("yse")
				this.addEdit = true
				this.$refs.sendPocket.initSpace()
			},
			editThis(id){
				this.addEdit = false
				this.$refs.sendPocket.initEdit(id)
			},
			payThis(id){
				var that = this
				that.$confirm('确定支付？','提示',{
					confirmButtonText:'确定',
					cancelButtomText:'取消'
				}).then(()=>{

					$.ajax({
						type:"post",
						url:that.Global.router + '/redpacket/pay',
						data:{redpacketId:id},
						xhrFields:{withCredentials: true},
						success(res){
							console.log(res)
							if(res.code === "0000"){
								that.$alert("支付成功","提示",{confirmButtonText:'确定'});
								setTimeout(function () {
									that.initPage()
								},1000)
								
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
			delThis(id){
				var that = this
				that.$confirm('确定删除？','提示',{
					confirmButtonText:'确定',
					cancelButtomText:'取消'
				}).then(()=>{

					$.ajax({
						type:"post",
						url:that.Global.router + '/redpacket/delete',
						data:{redpacketId:id},
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
			}
		}
	}

</script>


<style>

</style>