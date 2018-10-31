<template>
	
	<div class="packetDataWrap">
		
		<div class="dataTop">
			<div class="dataTitle clearfix">
				<h2 class="dataTitleName left"><span>数据概况</span><em>Data Profiling</em></h2>
			</div>
			<div class="dataProfiling clearfix">
				<div class="eachProfiling left clearfix">
					<div class="eachProfilingTotal left">
						<p>阅读量</p>
						<h4>{{ dataCount.sumReadNum }}</h4>
					</div>
					<div class="eachProfilingTime left">
						<p><span>今日</span><em>{{ dataCount.todayReadNum }}</em></p>
						<p><span>昨日</span><em>{{ dataCount.yesterdayReadNum }}</em></p>
					</div>
				</div>
				<div class="eachProfiling left clearfix">
					<div class="eachProfilingTotal left">
						<p>转发(次)</p>
						<h4>{{ dataCount.sumForwardNum }}</h4>
					</div>
					<div class="eachProfilingTime left">
						<p><span>今日</span><em>{{ dataCount.todayForwardNum }}</em></p>
						<p><span>昨日</span><em>{{ dataCount.yesterdayForwardNum }}</em></p>
					</div>
				</div>
				<div class="eachProfiling left clearfix">
					<div class="eachProfilingTotal left">
						<p>沟通(次)</p>
						<h4>{{ dataCount.sumTalkNum }}</h4>
					</div>
					<div class="eachProfilingTime left">
						<p><span>今日</span><em>{{ dataCount.todayTalkNum }}</em></p>
						<p><span>昨日</span><em>{{ dataCount.yesterdayTalkNum }}</em></p>
					</div>
				</div>
				<div class="eachProfiling left clearfix">
					<div class="eachProfilingTotal left">
						<p>红包总计(元)</p>
						<h4>{{ dataCount.sumRedAmount / 1000 }}</h4>
					</div>
					<div class="eachProfilingTime left">
						<p><span>今日</span><em>{{ dataCount.todayRedAmount / 1000 }}</em></p>
						<p><span>昨日</span><em>{{ dataCount.yesterdayRedAmount / 1000 }}</em></p>
					</div>
				</div>
			</div>

			<div class="dataTitle clearfix">
				<h2 class="dataTitleName left"><span>数据趋势</span><em>Data trend</em></h2>
				<div class="dataTitleSlot right clearfix">
					 <div class="dataSelect left">
					 	<label>时间范围：</label>
					 	<el-radio-group v-model="dataTrend.type">
						    <el-radio :label="1" @change='dataTrend.dateRange=null'>今天</el-radio>
						    <el-radio :label="2" @change='dataTrend.dateRange=null'>昨天</el-radio>
						    <el-radio :label="3" @change='dataTrend.dateRange=null'>过去七天</el-radio>
						    <el-radio :label="4" @change='dataTrend.dateRange=null'>本月</el-radio>
						</el-radio-group>
					 </div>
					 <div class="dataSelect left">
					 	<el-date-picker
					 		size="small"
					        v-model="dataTrend.dateRange"
					        type="daterange"
					        value-format='yyyy-MM-dd'
					        placeholder="选择日期范围"
					        @change="dataTrend.type=5">
					    </el-date-picker>
					 </div>
					 <button class="commonBtn dataSelectBtn" @click='getDataTrend'>查询</button>
				</div>
			</div>
			<div class="dataTrend">
				<div id="dataTrendChart" class="dataTrendChart"></div>
			</div>

			<div class="dataTitle clearfix">
				<h2 class="dataTitleName left"><span>广告计划概况</span><em>Outline of the plan</em></h2>
				<div class="dataTitleSlot right clearfix">
					<div class="dataSelect left">
					 	<el-date-picker
					 		size="small"
					        v-model="dataOutline.dateRange"
					        type="daterange"
					        value-format='yyyy-MM-dd'
					        placeholder="选择日期范围">
					    </el-date-picker>
					</div>
					<button class="commonBtn dataSelectBtn" @click='getDataOutline'>查询</button>
				</div>
			</div>
			<div class="dataOutline">
				<table class="dataTable" border="0" cellpadding="0" cellspacing="0">
					<thead>
						<tr>
							<th>
								<span>时间</span>
								<div class="dataTableSelect">
									<img :src="[outlineOrder == 1 ? require('../../../images/data-top-active.png') : require('../../../images/data-top.png')]" @click='sortOutline("createTime",0,1)'>
									<img :src="[outlineOrder == 2 ? require('../../../images/data-bottom-active.png') : require('../../../images/data-bottom.png')]" @click='sortOutline("createTime",1,2)'>
								</div>
							</th>
							<th>
								<span>广告计划</span>
								<div class="dataTableSelect">
									<img :src="[outlineOrder == 3 ? require('../../../images/data-top-active.png') : require('../../../images/data-top.png')]" @click='sortOutline("templateName",0,3)'>
									<img :src="[outlineOrder == 4 ? require('../../../images/data-bottom-active.png') : require('../../../images/data-bottom.png')]" @click='sortOutline("templateName",1,4)'>
								</div>
							</th>
							<th>
								<span>广告点击数</span>
								<div class="dataTableSelect">
									<img :src="[outlineOrder == 5 ? require('../../../images/data-top-active.png') : require('../../../images/data-top.png')]"  @click='sortOutline("advertisingClickNum",0,5)'>
									<img :src="[outlineOrder == 6 ? require('../../../images/data-bottom-active.png') : require('../../../images/data-bottom.png')]" @click='sortOutline("advertisingClickNum",1,6)'>
								</div>
							</th>
							<th>
								<span>红包点击数</span>
								<div class="dataTableSelect">
									<img :src="[outlineOrder == 7 ? require('../../../images/data-top-active.png') : require('../../../images/data-top.png')]"  @click='sortOutline("redClickNum",0,7)'>
									<img :src="[outlineOrder == 8 ? require('../../../images/data-bottom-active.png') : require('../../../images/data-bottom.png')]" @click='sortOutline("redClickNum",1,8)'>
								</div>
							</th>
							<th>
								<span>平均点击单位(元)</span>
								<div class="dataTableSelect">
									<img :src="[outlineOrder == 9 ? require('../../../images/data-top-active.png') : require('../../../images/data-top.png')]" @click='sortOutline("singleMoney",0,9)'>
									<img :src="[outlineOrder == 10 ? require('../../../images/data-bottom-active.png') : require('../../../images/data-bottom.png')]" @click='sortOutline("singleMoney",1,10)'>
								</div>
							</th>
							<th>
								<span>总花费(元)</span>
								<div class="dataTableSelect">
									<img :src="[outlineOrder == 11 ? require('../../../images/data-top-active.png') : require('../../../images/data-top.png')]" @click='sortOutline("amount",0,11)'>
									<img :src="[outlineOrder == 12 ? require('../../../images/data-bottom-active.png') : require('../../../images/data-bottom.png')]" @click='sortOutline("amount",1,12)'>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td colspan="2">总计</td>
							<td>{{ totalOutline.advertisingClickNum }}</td>
							<td>{{ totalOutline.redClickNum }}</td>
							<td>{{ totalOutline.singleMoney / 1000 }}</td>
							<td style="border-right:  1px solid #dadada">{{ totalOutline.amount / 1000}}</td>
						</tr>
						<tr v-for='item in outlineArr'>
							<td>{{ item.createTime }}</td>
							<td>{{ item.templateName }}</td>
							<td>{{ item.advertisingClickNum }}</td>
							<td>{{ item.redClickNum }}</td>
							<td>{{ item.singleMoney / 1000}}</td>
							<td style="border-right:  1px solid #dadada">{{ item.amount / 1000}}</td>
						</tr>
						
					</tbody>
				</table>
			</div>
		</div>

	</div>

</template>


<script>

	import "../../../css/data.css"

	export default{
		name:"packetData",
		data(){
			return{
				dataCount:{},
				dataTrend:{
					type:3,
					dateRange:null
				},
				totalOutline:{},
				dataOutline:{
					dateRange:null
				},
				outlineArr:[],
				outlineIcon:{
					createTime:0,
					templateName:0,
					advertisingClickNum:0,
					redClickNum:0,
					singleMoney:0,
					amount:0,
				},
				outlineOrder:1

			}
		},
		mounted(){
			this.initDataProfiling()
			this.initDataTrend()
			this.initDataOutline()
		},
		methods:{
			initDataProfiling(){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/redpacket/dataOverview',
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							that.dataCount = Object.assign({},that.dataCount,res.result)
						}

					},
					error(){}
				})
			},
			initDataTrend(arr = {type:3}){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + "/redpacket/dataAnalysis",
					data:arr,
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						var data1 = []
						var data2 = []
						var xdata = []

						if(res.code === "0000"){
							if(res.result != null){
								for(var i=0; i<res.result.consumeList.length; i++){
									data1.push(res.result.consumeList[i].consume / 1000)
									xdata.push(res.result.consumeList[i].date)
								}
								for(var i=0; i<res.result.clickList.length; i++){
									data2.push(res.result.clickList[i].clickNum)
								}
								that.initDataTrendChart(data1,data2,xdata)
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
			initDataTrendChart(data1,data2,xdata){
				var that = this
				var myChart = that.$echarts.init(document.getElementById('dataTrendChart'));

		        // 指定图表的配置项和数据
		        var option = {
		            tooltip: {
		            	trigger: 'axis',
		            },
		            grid:{
		            	left:"6%",
		            	right:"6%"
		            },
		            legend: {
		                itemGap:40,
		                data:[
			                {
			                	name:"总消费(元)",
			                	icon:"circle",
			                	textStyle:{
			                		color:"#666"
			                	}
			                },
			                {
			                	name:"点击数",
			                	icon:"circle",
			                	textStyle:{
			                		color:"#666"
			                	}
			                }
		                ],
		            },
		            xAxis: {
		                data: xdata,
		                boundaryGap: false,
		            },
		            yAxis: [
		            	{
				            name: '总消费(元)',
				            type: 'value',
				            axisLine:{
				            	show:false
				            }
				        },
				        {
				            name: '点击数',
				            type: 'value',
				            axisLine:{
				            	show:false
				            },
				            splitLine:{
				            	show:false
				            }
				        }
		            ],
		            series: [
		            {
		                name: '总消费(元)',
		                type: 'line',
		                data: data1,
		                lineStyle:{
		                	color:"#55cfd9"
		                },
		                // symbol:"none",
		                itemStyle:{
	                    	color:"#55cfd9",
	                    	borderColor:"#55cfd9"
	                    },
		            },
		            {
						name: '点击数',
		                type: 'line',
		                yAxisIndex:1,
		                data: data2,
		                lineStyle:{
		                	color:"#918dd4"
		                },
		                // symbol:"none",
		                itemStyle:{
	                    	color:"#918dd4",
	                    	borderColor:"#918dd4"
	                    },
		            }
		            ]
		        };

		        // 使用刚指定的配置项和数据显示图表。
		        myChart.setOption(option);
			},
			initDataOutline(arr = {}){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/redpacket/advertisingPlanOverview',
					data:arr,
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							that.totalOutline = Object.assign({},that.totalOutline,res.result.total)

							that.outlineArr = []
							if(res.result.list != null){
								for(var i=0; i<res.result.list.length; i++){
									that.outlineArr.push(res.result.list[i])
								}
							}
						}
					},
					error(){}
				})
			},
			getDataTrend(){
				var that = this;
				var sendObj = {}
				console.log(that.dataTrend.dateRange)

				sendObj.type = that.dataTrend.type
				if(that.dataTrend.dateRange != null){
					
					sendObj.startDate = that.dataTrend.dateRange[0]
					sendObj.endDate = that.dataTrend.dateRange[1]
					
				}else{
					if(sendObj.type == 5){
						that.dataTrend.type = 3
						sendObj.type = 3
					}
				}
				console.log(sendObj)
				that.initDataTrend(sendObj)
			},
			getDataOutline(){
				var that = this
				that.outlineOrder = 1
				var sendObj = {}
				if(that.dataOutline.dateRange != null){
					if(that.dataOutline.dateRange.length != 0){
						sendObj.startDate = that.dataOutline.dateRange[0]
						sendObj.endDate = that.dataOutline.dateRange[1]
					}
					
				}
				console.log(sendObj)
				this.initDataOutline(sendObj)
			},
			sortOutline(name,type,order){
				
				this.outlineArr.sort(this.compare(name,type))
				this.outlineOrder = order
			},
			compare(prop,type){
				return function (obj1,obj2) {
					var val1 = obj1[prop]
					var val2 = obj2[prop]

					if(type != 0){
						if(val1 > val2){
							return -1
						}else if(val1 < val2){
							return 1
						}else{
							return 0
						}
					}else{
						if(val1 < val2){
							return -1
						}else if(val1 > val2){
							return 1
						}else{
							return 0
						}
					}
					
				}
			}
		}
	}

</script>


<style>


</style>