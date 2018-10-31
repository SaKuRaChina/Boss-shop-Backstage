<template>
	
	<div class="chanceInfoWrap" v-cloak>
		
		<h3 class="pageTitle">
			<span>产品信息</span>
			<em>Product Center</em>
		</h3>
		

		<div class="pageFormBox">
			<div class="pageForm">
				<div class="eachPageForm">
					<label for="">产品类别</label>
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
					<label for="">产品名称</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.productName" placeholder="最多7个字"></el-input>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">封面图</label>
					<div class="pageUpload">
						<img :src="pageObj.surfaceUrl + '!default'" alt="">
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
					<label for="">购买地址</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.buyUrl" placeholder="请输入内容"></el-input>
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
				pageObj:{
					typeId:'',
					productName:'',
					surfaceUrl:'',
					buyUrl:'',
					title:'',
				},  //页面展示对象

				options:[],
				value: '',
				input:'',
				
			}
		},
		mounted(){
			
			this.initPage()
			
			this.proviceArr = Area.dsy.Items[0]
		},
		methods:{
			
			initPage(){
				var that = this

				$.ajax({
					type:'POST',
					url:this.Global.router + '/product/editProductMsg',
					xhrFields: {
                        withCredentials: true
                    },
                    success:function(res){
                    	console.log(res)

                    	if(res.code === "0000"){

                    		that.shopType = []

                    		for(var key in that.pageObj){
                    			delete that.pageObj[key]
                    		}

                    		res.result.product.surfaceUrl = res.result.product.url
                    		that.pageObj = Object.assign({},that.pageObj,res.result.product)
                    		console.log(that.pageObj)

                    		for(var i=0; i<res.result.type.length; i++){
                    			that.shopType.push(res.result.type[i])
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
                    fail:function(res){
                    	console.log(res)
                    }

				})
			},
			
			savePage(){
				var that = this
				console.log(that.pageObj)
				let sendObj = {}

				if(that.pageObj.productName.length > 7){

					that.$alert('标题限制7字以内','提示',{confirmButtonText:'确实'})

				}else if(that.pageObj.title.length > 20){

					that.$alert('标题限制20字以内','提示',{confirmButtonText:'确实'})

				}else{

					sendObj.typeId = that.pageObj.typeId
					sendObj.productName = that.pageObj.productName
					sendObj.surfaceUrl = that.pageObj.surfaceUrl
					sendObj.buyUrl = that.pageObj.buyUrl
					sendObj.title = that.pageObj.title

					console.log(sendObj)

					$.ajax({
						type:'post',
						url:that.Global.router + '/product/updateProductMsg',
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

		                    that.pageObj.surfaceUrl = finalPath

		                    
		                }
		            }

		        });
			},
		    
		}
	}

</script>


<style>



</style>