<template>
	
	<div class="packetDataWrap">
		
		<div class="dataTop">
			<div class="dataTitle clearfix">
				<h2 class="dataTitleName left"><span>数据概况</span><em>Data Profiling</em></h2>
			</div>
			
			<div class="dataProfiling2">
				<div class="profilingFirst clearfix">
					<div class="eachprofilingFirst left">
						<p>阅读量</p>
						<h4>{{ dataCount.readNum }}</h4>
					</div>
					<div class="eachprofilingFirst left">
						<p>转发(次)</p>
						<h4>{{ dataCount.forwardNum }}</h4>
					</div>
					<div class="eachprofilingFirst left">
						<p>评论(条)</p>
						<h4>{{ dataCount.commentNum }}</h4>
					</div>
					<div class="eachprofilingFirst left">
						<p>粉丝(人)</p>
						<h4>{{ dataCount.fansNum }}</h4>
					</div>
					<div class="eachprofilingFirst left">
						<p>沟通(次)</p>
						<h4>{{ dataCount.talkNum }}</h4>
					</div>
				</div>
				<div class="profilingSecond clearfix">
					<div class="eachprofilingSecond left">
						<p>总消费(元)</p>
						<h4>{{ dataCount.consume / 1000 }}</h4>
					</div>
					<div class="eachprofilingSecond left">
						<p>红包消费(元)</p>
						<h4>{{ dataCount.redConsume / 1000 }}</h4>
					</div>
					<div class="eachprofilingSecond left">
						<p>佣金消费(元)</p>
						<h4>{{ dataCount.commissionConsume / 1000 }}</h4>
					</div>
					<div class="eachprofilingSecond left">
						<p>围观(人)</p>
						<h4>{{ dataCount.onLookNum }}</h4>
					</div>
				</div>
			</div>

			<div class="dataTitle clearfix">
				<h2 class="dataTitleName left"><span>点击时段概况</span><em>Click time profile</em></h2>
				<div class="dataTitleSlot right clearfix">
					<div class="dataSelect yearSelect left">
					 	<el-date-picker
					 		size="small"
					        v-model="clickYear"
					        type="date"
					        value-format='yyyy-MM-dd'
					        placeholder="选择年月日">
					    </el-date-picker>
					</div>
					<button class="commonBtn dataSelectBtn" @click='getClick'>查询</button>
				</div>
			</div>

			<div class="dataClick">
				<div id="dataClickChart" class="dataClickChart"></div>
			</div>

			<div class="dataTitle clearfix">
				<h2 class="dataTitleName left"><span>红包转化概况</span><em>Conversation rate</em></h2>
				<div class="dataTitleSlot right clearfix">
					 <div class="dataSelect left">
					 	<label>时间范围：</label>
					 	<el-radio-group v-model="conversation.type">
						    <el-radio :label="1" @change='conversation.dateRange = null'>今天</el-radio>
						    <el-radio :label="2" @change='conversation.dateRange = null'>昨天</el-radio>
						    <el-radio :label="3" @change='conversation.dateRange = null'>过去七天</el-radio>
						    <el-radio :label="4" @change='conversation.dateRange = null'>本月</el-radio>
						</el-radio-group>
					 </div>
					 <div class="dataSelect left">
					 	<el-date-picker
					 		size="small"
					        v-model="conversation.dateRange"
					        type="daterange"
					        placeholder="选择日期范围"
					        value-format='yyyy-MM-dd'
					        @change='conversation.type = 5'>
					    </el-date-picker>
					 </div>
					 <button class="commonBtn dataSelectBtn" @click='getConversation'>查询</button>
				</div>
			</div>
			<div class="dataConversation">
				<div id="dataConversationChart" class="dataConversationChart"></div>
			</div>

			<div class="dataTitle clearfix">
				<h2 class="dataTitleName left"><span>佣金转化概况</span><em>Commission conversation</em></h2>
				<div class="dataTitleSlot right clearfix">
					 <div class="dataSelect yearSelect left">
					 	<el-date-picker
					 		size="small"
					        v-model="commissionYear"
					        type="year"
					        value-format='yyyy'
					        placeholder="选择年份"
					        :picker-options='readYearPicker'>
					    </el-date-picker>
					 </div>
					 <button class="commonBtn dataSelectBtn" @click='getCommission'>查询</button>
				</div>
			</div>
			<div class="dataCommission">
				<div id="dataCommissionChart" class="dataCommissionChart"></div>
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
				clickYear:null,
				readYearPicker:{
					disabledDate(time){
						return time.getTime() < new Date('2018').getTime()
					}
				},
				conversation:{
					type:3,
					dateRange:null
				},
				commissionYear:null,
			}
		},
		mounted(){
			this.initDataProfiling()
			this.initDataClick()
			this.initConversation()
			this.initDataCommission()
			
		},
		methods:{
			initDataProfiling(){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/opportunity/dataOverview',
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						if(res.code == "0000"){
							that.dataCount = Object.assign({},that.dataCount,res.result)
						}
						
					},
					error(){}
				})
			},
			initDataClick(arr = {}){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/opportunity/clickOverview',
					xhrFields:{withCredentials:true},
					data:arr,
					success(res){
						console.log(res)

						if(res.code == "0000"){
							if(res.result != null){
								var numArr = [];
								var hourArr = [];
								for(var i=0; i<res.result.length; i++){
									numArr.push(res.result[i].number)
									hourArr.push(res.result[i].hours + ':00')
								}

								that.initDataClickChart(hourArr,numArr)
							}
						}
					},
					error(){}
				})
			},
			initConversation(arr = {type:3}){
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
								that.initDataConversationChart(data1,data2,xdata)
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
			initDataCommission(arr = {}){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/opportunity/commissionOverview',
					xhrFields:{withCredentials:true},
					data:arr,
					success(res){
						console.log(res)

						if(res.code === "0000"){
							var clickArr = [],dateArr = [],moneyArr = [];
							if(res.result != null){
								for(var i=0; i<res.result.clickList.length; i++){
									clickArr.push(res.result.clickList[i].clickNum)
									dateArr.push(res.result.clickList[i].date)
								}
								for(var i=0; i<res.result.commissionList.length; i++){
									moneyArr.push(res.result.commissionList[i].totalMoney / 1000)
								}
								that.initDataCommissionChart(moneyArr,clickArr,dateArr)
							}
						}
					},
					error(){}
				})
			},
			initDataClickChart(xData,yData){
				var that = this
				var myChart = that.$echarts.init(document.getElementById('dataClickChart'));

		        // 指定图表的配置项和数据
		        var option = {
		            tooltip: {
		            	trigger: 'axis',
		            },
		            grid:{
		            	left:"6%",
		            	right:"6%"
		            },
		            xAxis: {
		                data: xData,
		                boundaryGap: false,
		            },
		            yAxis: {
		            	type:"value",
		            	name: '(点击次数)',
		            },
		            series:[{
						
		                type: 'line',
		                smooth:true,
		                data: yData,
		                lineStyle:{
		                	color:{
		                		type: 'linear',
							    x: 0,
							    y: 0,
							    x2: 1,
							    y2: 1,
							    colorStops: [{
							        offset: 0, color: '#25d9d8' // 0% 处的颜色
							    }, {
							        offset: 1, color: '#ab7dff' // 100% 处的颜色
							    }],
		                	},
		                	width:3,
		                	shadowColor: 'rgba(0,0,0,0.1)',
		                    shadowBlur: 3,
		                    shadowOffsetY: 10
		                },
		                // symbol:"none",
		                itemStyle:{
	                    	color:"#25d9d8",
	                    },
	                    areaStyle:{
	                    	color:{
	                    		type: 'linear',
							    x: 0,
							    y: 0,
							    x2: 0,
							    y2: 1,
							    colorStops: [{
							        offset: 0, color: 'rgba(37,136,243,0.5)' // 0% 处的颜色
							    }, {
							        offset: 1, color: 'rgba(37,136,243,0)' // 100% 处的颜色
							    }],
	                    	}
	                    }
		            }]
		        };

		        // 使用刚指定的配置项和数据显示图表。
		        myChart.setOption(option);
			},
			initDataConversationChart(data1,data2,xdata){
				var that = this
				var myChart = that.$echarts.init(document.getElementById('dataConversationChart'));

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
			initDataCommissionChart(data1,data2,xdata){
				var that = this
				var myChart = that.$echarts.init(document.getElementById('dataCommissionChart'));

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
			getClick(){
				if(this.clickYear != null){
					var sendObj = {
						date:this.clickYear
					}
					console.log(sendObj)
					this.initDataClick(sendObj)
				}else{

					this.initDataClick()
				}
			},
			getConversation(){
				var that = this;
				var sendObj = {}
				console.log(that.conversation.dateRange)

				sendObj.type = that.conversation.type
				if(that.conversation.dateRange != null){
					
					sendObj.startDate = that.conversation.dateRange[0]
					sendObj.endDate = that.conversation.dateRange[1]
					
				}else{
					if(sendObj.type == 5){
						that.conversation.type = 3
						sendObj.type = 3
					}
				}
				console.log(sendObj)
				that.initConversation(sendObj)
			},
			getCommission(){
				var that = this
				if(that.commissionYear != null){
					var sendObj = {
						date:that.commissionYear
					}
					
					that.initDataCommission(sendObj)
				}else{
					var date = new Date().getFullYear()
					
					var sendObj = {
						date:date
					}
					that.initDataCommission(sendObj)
				}
			}
		}
	}

</script>


<style>


</style>