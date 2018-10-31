<template>
	
	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos sendPocketBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">派发红包</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent  slim-outer-box">
				<div class="slim-inner-box">
					<div class="eachJumperLine">
						<label for="">模板名称:</label>
						<div class="JumperLineInput">
							<button class="commonBtn jumperFileBtn" @click="selectTemplate" :disabled='!addEdit'>选择模板</button>
							<span>{{ templateName }}</span>
						</div>
					</div> 
					<div class="eachJumperLine">
						<label for="">红包金额:</label>
						<div class="JumperLineInput">
							<el-input size='small' v-model="pageObj.amount" placeholder="">
								<template slot="suffix">元</template>
							</el-input>
						</div>
					</div> 
					<div class="eachJumperLine">
						<label for="">红包个数:</label>
						<div class="JumperLineInput">
							<el-input size='small' v-model="pageObj.number" placeholder="">
								<template slot="suffix">个</template>
							</el-input>
						</div>
					</div> 
					<div class="eachJumperLine coverSelectHeadline">
						<label for="">红包规则:</label>
						<div class="JumperLineInput">
							<el-radio v-model="pageObj.rule" label="2">等额红包</el-radio>
	  						<el-radio v-model="pageObj.rule" label="1">拼手气红包</el-radio>
						</div>
					</div>
					<div class="eachJumperLine coverSelectHeadline">
						<label for="">发布范围:</label>
						<div class="JumperLineInput">
							<el-radio class="fouthLabel" v-model="pageObj.scope" label="5">全国</el-radio>
	  						<el-radio class="fouthLabel" v-model="pageObj.scope" label="4">省</el-radio>
	  						<el-radio class="fouthLabel" v-model="pageObj.scope" label="3">市</el-radio>
	  						<el-radio class="fouthLabel" v-model="pageObj.scope" label="2">区/县</el-radio>
						</div>
					</div>
					
					<div class="eachJumperLine coverSelectHeadline">
						<label for="">　　　　</label>
						<div class="JumperLineInput elSelectThree">
							<el-select size="medium" v-model="pageObj.province" placeholder="请选择" name='province' @change='selectProv' @visible-change='clickProv' :disabled="pageObj.scope == 5">
								<el-option
								v-for="(item,index) in proviceArr"
								:key="index"
								:label="item"
								:value="item">
								</el-option>
							</el-select>
							<el-select size="medium" v-model="pageObj.city" name='city' placeholder="请选择" @change='selectCity' @visible-change='clickCity' :disabled="pageObj.scope == 5 || pageObj.scope == 4">
								<el-option
								v-for="(item,index) in cityArr"
								:key="index"
								:label="item"
								:value="item">
								</el-option>
							</el-select>
							<el-select size="medium" v-model="pageObj.county" name='county' placeholder="请选择" :disabled="pageObj.scope != 2">
								<el-option
								v-for="(item,index) in areaArr"
								:key="index"
								:label="item"
								:value="item">
								</el-option>
							</el-select>
						</div>
					</div>

					<div class="eachJumperLine coverSelectHeadline">
						<label for="">发布时间:</label>
						<div class="JumperLineInput">
							<el-radio v-model="pageObj.timeType" label="1">立即发放</el-radio>
	  						<el-radio v-model="pageObj.timeType" label="2">定时发放</el-radio>
						</div>
					</div>

					<div class="eachJumperLine">
						<label for="">　　　　</label>
						<div class="JumperLineInput">
							<el-date-picker size="small"
								:disabled='pageObj.timeType == 1'
						      	v-model="pageObj.releaseTime"
						      	type="datetime"
						      	value-format='yyyy-MM-dd HH:mm:ss'
						      	placeholder="选择日期时间">
						    </el-date-picker>
							
						</div>
					</div>
				</div>
				<div class="jumperLine"></div>
				<button class="commonBtn jumperBtn" @click='subCharge'>提交</button>
			</div>
			
		</div>
		
	</div>


</template>


<script>
	import Area from '../common/area'

	export default{
		name:'sendPocketJumper',
		data(){
			return{
				redpacketId:0,
				pageObj:{
					amount:'',
					number:'',
					rule:'1',
					scope:'5',
					province:"",
					city:"",
					county:"",
					timeType:'1',
					releaseTime:'',
				},
				spaceObj:{
					amount:'',
					number:'',
					rule:'1',
					scope:'5',
					province:"",
					city:"",
					county:"",
					timeType:'1',
					releaseTime:'',
				},
				proviceArr:[],  //三级联动省
				cityArr:[],   //三级联动市
				areaArr:[],   //三级联动区
				provIndex:0,  //存储选取的省级index
				
			}
		},
		props:['sendPocketShow','addEdit','templateId','templateName'],
		computed:{
			isShow(){
				return this.sendPocketShow
			},
			'pageObj.templateId'(){
				return this.templateId
			},
			'pageObj.templateName'(){
				return this.templateName
			}
		},
		mounted(){
			this.proviceArr = Area.dsy.Items[0]
		},
		methods:{
			initSpace(){
				var that = this
				for(var key in that.pageObj){
					delete that.pageObj[key]
				}

				that.redpacketId = 0;
				that.$parent.templateObj.templateId = "";
				that.$parent.templateObj.templateName = "";

				that.pageObj = Object.assign({},that.pageObj,that.spaceObj)
				that.$parent.sendPocketShow = true

			},
			initEdit(id){
				var that = this
				$.ajax({
					type:"post",
					url:that.Global.router + "/redpacket/info",
					xhrFields:{withCredentials:true},
					data:{redpacketId:id},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							for(var key in that.pageObj){
								delete that.pageObj[key]
							}

							that.redpacketId = res.result.redpacketId;
							that.$parent.templateObj.templateName = res.result.templateName;
							that.pageObj = Object.assign({},that.pageObj,res.result)
							that.pageObj.rule = res.result.rule.toString()
							that.pageObj.scope = res.result.scope.toString()
							that.pageObj.timeType = res.result.timeType.toString()
							that.pageObj.amount = res.result.amount / 1000

							
							that.$parent.sendPocketShow = true
						}
					},
					error(){}
				})

			},
			subCharge(){

				console.log('yes')
				var that = this 

				var sendObj = {}
				sendObj.templateId = that.templateId
				sendObj.amount = that.pageObj.amount
				sendObj.number = that.pageObj.number
				sendObj.rule = that.pageObj.rule
				sendObj.scope = that.pageObj.scope
				sendObj.timeType = that.pageObj.timeType

				if(that.templateName.length == 0){
					that.$alert('请选择模板', '提示', {confirmButtonText: '确定'});
				}else if(sendObj.amount.length == 0){
					that.$alert('请输入红包金额', '提示', {confirmButtonText: '确定'});
				}else if(sendObj.number.length == 0){
					that.$alert('请输入红包个数', '提示', {confirmButtonText: '确定'});
				}else if(sendObj.timeType == 2 && that.pageObj.releaseTime.length <= 0){
					that.$alert('请选择发放时间', '提示', {confirmButtonText: '确定'});
				}else{

					//判断发布范围
					if(sendObj.scope == 2){
						sendObj.province = that.pageObj.province
						sendObj.city = that.pageObj.city
						sendObj.county = that.pageObj.county
					}else if(sendObj.scope == 3){
						sendObj.province = that.pageObj.province
						sendObj.city = that.pageObj.city
						sendObj.county = ''
					}else if(sendObj.scope == 4){
						sendObj.province = that.pageObj.province
						sendObj.city = ''
						sendObj.county = ''
					}


					//判断发布时间
					if(sendObj.timeType == 2){
						sendObj.releaseTime = that.pageObj.releaseTime
					}else if(sendObj.timeType == 1){
						sendObj.releaseTime = ""
					}

					//判断是否编辑
					if(!that.addEdit){sendObj.redpacketId = that.redpacketId}
					console.log(that.addEdit)

					var url = that.addEdit ? that.Global.router + '/redpacket/save' : that.Global.router + '/redpacket/update'

					console.log(sendObj)

					$.ajax({
						type:'post',
						url:url,
						xhrFields:{withCredentials:true},
						data:sendObj,
						success(res){
							console.log(res)
							if(res.code === "0000"){

								that.$alert('提交成功', '提示', {confirmButtonText: '确定'});
								that.$parent.sendPocketShow = false
								that.$parent.initPage()

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


			},
			selectTemplate(){
				this.$parent.chooseTemplateShow = true
			},
			selectProv(value){

				this.pageObj.province = value
				this.pageObj.city = ''
				this.pageObj.county = ''

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

				this.pageObj.city = value
				this.pageObj.county = ''
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
				that.pageObj.county = ''
				
				setTimeout(function(){
					that.pageObj.county = value;
				},100)
			},
			clickArea(type){
				if(type) this.selectArea()
			},
			hideParent(){
				this.$parent.sendPocketShow = false
			}
		}
	}


</script>


<style>
	
	
</style>