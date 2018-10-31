<template>
	
	<div class="chanceInfoWrap" v-cloak>
		
		<h3 class="pageTitle">
			<span>商机信息</span>
			<em>Business Opportunity</em>
		</h3>
		

		<div class="pageFormBox">
			<div class="pageForm">
				<div class="eachPageForm">
					<label for="">商机类型</label>
					<div class="elSelect">
						<el-select size="medium" v-model="pageObj.typeId" placeholder="请选择">
							<el-option
							v-for="item in shopType"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">商户名称</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.businessName" placeholder="最多7个字"></el-input>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">加盟数量</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.shopNum"  type='number' placeholder="请输入内容"></el-input>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">投资额度</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.investmentAmounts" placeholder="请输入内容"></el-input>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">成立时间</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.foundingTime" placeholder="请输入内容"></el-input>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">公司地址</label>
					<div class="elSelect elSelectThree">
						<el-select size="medium" v-model="pageObj.province" placeholder="请选择" name='province' @change='selectProv' @visible-change='clickProv'>
							<el-option
							v-for="(item,index) in proviceArr"
							:key="index"
							:label="item"
							:value="item">
							</el-option>
						</el-select>
						<el-select size="medium" v-model="pageObj.city" name='city' placeholder="请选择" @change='selectCity' @visible-change='clickCity'>
							<el-option
							v-for="(item,index) in cityArr"
							:key="index"
							:label="item"
							:value="item">
							</el-option>
						</el-select>
						<el-select size="medium" v-model="pageObj.prefecture" name='prefecture' placeholder="请选择" >
							<el-option
							v-for="(item,index) in areaArr"
							:key="index"
							:label="item"
							:value="item">
							</el-option>
						</el-select>
						
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">合同年限</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.compactAgeLimit" placeholder="请输入内容"></el-input>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">主营产品</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.profession" placeholder="请输入内容"></el-input>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">咨询电话</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.mobile" placeholder="请输入内容"></el-input>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">封面图</label>
					<div class="pageUpload">
						<img :src="pageObj.url + '!default'" alt="">
						<el-upload
						  	class="avatar-uploader"
						  	action = ''
						  	:show-file-list="false"
						  	accept='image/*'
						  	:http-request="selfUpload">
						  	<button class="commonBtn choseBtn">选择文件</button>
						  	<!-- <span>未选择任何文件</span> -->
						</el-upload>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">标题</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.title" placeholder="最多20个字"></el-input>
					</div>
				</div>
				<div class="pageFormLine"></div>
				<div class="eachPageForm">
					<label for="">　　　　</label>
					<button class="commonBtn subBtn" @click='savePage'>保存</button>
				</div>
			</div>
				
			
		</div>


	</div>

</template>


<script>

	import Area from '../../common/area'
	import COS from '../../../../static/cos-js-sdk-v5.min.js'

	export default{
		name:"ChanceInfo",
		data(){
			return {
				shopType: [],
				proviceArr:[],  //三级联动省
				cityArr:[],   //三级联动市
				areaArr:[],   //三级联动区
				provIndex:0,  //存储选取的省级index
				pageObj:{
					typeId:'',
					businessName:'',
					shopNum:'',
					investmentAmounts:'',
					foundingTime:'',
					province:'',
					city:'',
					prefecture:'',
					compactAgeLimit:'',
					profession:'',
					mobile:'',
					title:'',
					url:''
				},  //页面展示对象

				options:[],
				value: '',
				input:'',
				
			}
		},
		mounted(){
			//获取商户类型
			this.getType();
			this.initPage()
			
			this.proviceArr = Area.dsy.Items[0]
		},
		methods:{
			getType(){
				var that = this;
				$.ajax({
					type:'POST',
					url:this.Global.router + '/business/getBusinessType',
					xhrFields: {
                        withCredentials: true
                    },
                    success:function(res){
                    	//console.log(res)
                    	if(res.code === "0000"){
							for(let i=0;i<res.result.length; i++){
								that.shopType.push(res.result[i])
							}
						}
                    },
                    fail:function(res){
                    	console.log(res)
                    }
				})
			},
			initPage(){
				var that = this

				$.ajax({
					type:'POST',
					url:this.Global.router + '/business/editBusinessMsg',
					xhrFields: {
                        withCredentials: true
                    },
                    success:function(res){
                    	console.log(res)

                    	if(res.code === "0000"){

                    		that.pageObj = Object.assign({},that.pageObj,res.result.oppor)
                    		console.log(that.pageObj)

                    	}else if(res.code == "1003"){
                    		that.$alert('登录失效，请重新登录', '提示', {
					          	confirmButtonText: '确定',
					          	callback: action => {
						         	that.$router.push({name:'Log'})
					          	}
					        });
                    		
                    	}else{
                    		that.$alert(res.message,'提示',{confirmButtonText: '确定'})
                    	}

                    },
                    fail:function(res){
                    	console.log(res)
                    }

				})
			},
			selectProv(value){

				this.pageObj.province = value
				this.pageObj.city = ''
				this.pageObj.prefecture = ''

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
				this.pageObj.prefecture = ''
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
				
				setTimeout(function(){
					that.pageObj.prefecture = value;
				},100)
			},
			savePage(){
				var that = this
				console.log(that.pageObj)
				let sendObj = {}

				if(that.pageObj.businessName.length > 7){

					that.$alert('标题限制7字以内','提示',{confirmButtonText:'确实'})

				}else if(that.pageObj.title.length > 20){

					that.$alert('标题限制20字以内','提示',{confirmButtonText:'确实'})

				}else{

					sendObj.businessName = that.pageObj.businessName
					sendObj.investmentAmounts = that.pageObj.investmentAmounts
					sendObj.shopNum = that.pageObj.shopNum
					sendObj.title = that.pageObj.title
					sendObj.foundingTime = that.pageObj.foundingTime
					sendObj.province = that.pageObj.province
					sendObj.city = that.pageObj.city
					sendObj.prefecture = that.pageObj.prefecture
					sendObj.profession = that.pageObj.profession
					sendObj.compactAgeLimit = that.pageObj.compactAgeLimit
					sendObj.mobile = that.pageObj.mobile
					sendObj.picUrl = that.pageObj.url
					sendObj.typeId = that.pageObj.typeId

					console.log(sendObj)

					$.ajax({
						type:'post',
						url:that.Global.router + '/business/addBusinessMsg',
						data:sendObj,
						xhrFields:{withCredentials: true},
						success(res){
							console.log(res)
							if(res.code === "0000"){
								that.$alert("修改成功","提示",{confirmButtonText: '确定'});
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

				}

				
			},
			selfUpload(files){
				var that = this

				var fileName = files.file.name;
				var file = files.file;
				var bucketName = 'boss-1256403611';
			    var regionName = 'ap-beijing';

			    //获取签名
				var cos = new COS({
			        getAuthorization: function(options,callback){
			        	console.log(options)

			        	$.ajax({
							type:'POST',
							url:that.Global.router + '/upload/getUploadImgSign',
							data:{filePath:"/" + options.Key},
							contentType:'application/x-www-form-urlencoded',
							xhrFields: {
		                        withCredentials: true
		                    },
		                    success:function(res){
		                    	//console.log(res)
		                    	if(res.code === '0000'){
				                    callback(res.result.sign);
				                }else{
				                    that.$alert(res.message, '提示', {confirmButtonText: '确定'});
				                }
		                    },
		                    fail:function(res){
		                    	console.log(res)
		                    }
						})
			        }
			    });

				
		        var temp = fileName.split(".");
		        var tempLength = temp.length;

		        var nowDate = new Date();//获取系统当前时间

		        var year = nowDate.getFullYear();
		        var month = nowDate.getMonth()+1;
		        var date = nowDate.getDate();
		        if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        };
		        if(date <= 9){date = "0" + date}
		        var filePath = 'img/' + year + month + date+ '/' + Math.random().toString(36).substr(2) + '.' + temp[tempLength - 1];

		        //console.log(bucketName,regionName,fileName,filePath);
		        
		        //上传图片
		        cos.putObject({
		            Bucket: bucketName,
		            Region: regionName,
		            Key: filePath,
		            Body:file,
		            onProgress: function (info) {
		                //console.log(info)
		            }
		        },function(err,data){
		            //console.log(err,data);

		            if (err && err.error) {
		            	that.$alert('文件上传失败' + err.error.Message, '提示', {confirmButtonText: '确定'});
		                
		            } else if (err) {
		            	that.$alert('文件上传失败' + err, '提示', {confirmButtonText: '确定'});
		               
		            } else{

		                if (data.statusCode == 200) {
		                    var visitUrlPrefix = 'http://boss-1256403611.picbj.myqcloud.com/';
		                    var finalPath = visitUrlPrefix + filePath;
		                    console.log(finalPath)

		                    that.pageObj.url = finalPath

		                    
		                }
		            }

		        });
			},
		    
		}
	}

</script>


<style>



</style>