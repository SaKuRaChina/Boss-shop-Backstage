<template>

	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos productServiceBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">添加内容</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="slim-outer-box">
				<div class="slim-inner-box">
					<div class="jumperContent">
					<div class="eachJumperLine coverUploadHeadline">
						<label for="">产品封面</label>
						<div class="JumperLineInput">
							<div class="uploadBannerPic">
								<img :src="pageObj.productCover + '!default'" alt="">
							</div>
							<el-upload
							  	class="avatar-uploader"
							  	action = ''
							  	:show-file-list="false"
							  	accept='image/*'
							  	:http-request="selfUpload">
							  	<button class="commonBtn jumperFileBtn">选择文件</button>
							</el-upload>
							
						</div>
					</div>
					<div class="eachJumperLine">
						<label for="">产品名称:</label>
						<div class="JumperLineInput">
							<el-input size='small' v-model="pageObj.productName" placeholder="">
							</el-input>
						</div>
					</div> 
					<div class="eachJumperLine contentHeadling">
						<label for="">产品介绍:</label>
						<div class="JumperLineInput">
							<textarea v-model='pageObj.productDetails'></textarea>
						</div>
					</div>

					<div class="eachJumperLine coverUploadHeadline">
						<label for="">内容详情图</label>
						<div class="JumperLineInput">
							<div class="uploadBannerPic" v-for='(item,index) in pageObj.coverArr' :key='item.id'  @mouseenter='showClear(index)' @mouseleave='hideClear(index)' @click='clearPic(index)'>
								<img :src="item.url + '!default'" alt="">
								<p v-if='item.show'>x</p>
							</div>
							<el-upload
							  	class="avatar-uploader"
							  	action = ''
							  	:show-file-list="false"
							  	accept='image/*'
							  	:http-request="selfArrUpload">
							  	<button class="commonBtn jumperFileBtn">选择文件</button>
							  	<span>最多可添加9张</span>
							</el-upload>
							
						</div>
					</div>
					<div class="jumperLine"></div>
					<button class="commonBtn jumperBtn" @click='subCharge'>确定</button>
				</div>
				</div>
			</div>
		</div>
		
	</div>


</template>


<script>

	import COS from '../../../static/cos-js-sdk-v5.min.js'

	export default{
		name:'productService',
		data(){
			return {
				headlineType:[],
				id:0,
				pageObj:{
					productName:"",
					productCover:"",
					productDetails:"",
					url:"",
					coverArr:[]
				},
				spaceObj:{
					productName:"",
					productCover:"",
					productDetails:"",
					url:"",
					coverArr:[]
				},
				
			}
		},
		props:['productServiceShow','addEdit'],
		computed:{
			isShow(){
				return this.productServiceShow
			}
		},
		mounted(){
			
		},
		methods:{
			initSpace(){

				for(var key in this.pageObj){
					delete this.pageObj[key]
				}

				this.pageObj.coverArr = []


				this.pageObj = Object.assign({},this.pageObj,this.spaceObj)
				
				
				//console.log(this.pageObj)

			},
			initEdit(id){
				console.log(id)
				var that = this

				that.id = id;

				$.ajax({
					type:'post',
					url:that.Global.router + '/account/editProductService',
					xhrFields:{withCredentials:true},
					data:{id:id},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							for(var key in that.pageObj){
								delete that.pageObj[key]
							}

							that.pageObj.coverArr = []

							if(res.result.productCover != null){
								var tempCover = res.result.url.split(',')
								res.result.coverArr = []
								for(var i=0; i<tempCover.length; i++){
									res.result.coverArr.push({'url':tempCover[i],'show':false})
								}
							}
							
							that.pageObj = Object.assign({},that.pageObj,res.result)


							console.log(that.pageObj)

							

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
			
			hideParent(){
				this.$parent.productServiceShow = false
			},
			showClear(i){
				this.pageObj.coverArr[i].show = true
			},
			hideClear(i){
				this.pageObj.coverArr[i].show = false
			},
			clearPic(i){
				this.pageObj.coverArr.splice(i,1)
			},
			subCharge(){
				var that = this

				console.log(that.pageObj)
				console.log(that.addEdit)

				//上传地址
				var url = that.addEdit ? that.Global.router + '/account/addProductService' : that.Global.router + '/account/updateProductService'

				var tempPicArr = []
				for(var i=0; i<that.pageObj.coverArr.length; i++){
					tempPicArr.push(that.pageObj.coverArr[i].url)
				}
				

				var sendObj = {}

				sendObj.productName = that.pageObj.productName
				sendObj.productCover = that.pageObj.productCover
				sendObj.productDetails = that.pageObj.productDetails
				sendObj.url = tempPicArr.join(',')
				

				if(that.addEdit){
					//添加
					

				}else{
					//编辑
					sendObj.id = that.id
				}

				console.log(sendObj)

				$.ajax({
					type:'post',
					url:url,
					xhrFields:{withCredentials:true},
					data:sendObj,
					success(res){
						console.log(res)

						if(res.code === "0000"){

							that.$alert('添加成功', '提示', {confirmButtonText: '确定'});
							that.$parent.productServiceShow = false
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


			},
			selfUpload(files){
				var that = this
				console.log(that.pageObj.picType,that.pageObj.coverArr.length)

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

		                   	that.pageObj.productCover = finalPath
		                }
		            }

		        });

				
			},
			selfArrUpload(files){
				var that = this
				console.log()
				if(that.pageObj.coverArr.length >= 9){
					that.$alert('最多上传9张图片','提示',{confirmButtonText: '确定'})
				}else{

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

			                   	that.pageObj.coverArr.push({'url':finalPath,'show':false})
			                }
			            }

			        });


				}

				
			},
		}
	}



</script>


<style>



</style>