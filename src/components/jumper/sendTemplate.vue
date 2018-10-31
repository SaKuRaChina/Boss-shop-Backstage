<template>

	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos sendTemplateBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">添加模板</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent slim-outer-box">
				<div class="slim-inner-box">
					<div class="eachJumperLine">
						<label for="">模板名称:</label>
						<div class="JumperLineInput">
							<el-input size='small' v-model="pageObj.templateName" placeholder="限制4-6个字">
							</el-input>
						</div>
					</div> 
					<div class="eachJumperLine">
						<label for="">标题:</label>
						<div class="JumperLineInput">
							<el-input size='small' v-model="pageObj.title" placeholder="">
							</el-input>
						</div>
					</div> 
					<div class="eachJumperLine coverSelectHeadline">
						<label for="">广告类型:</label>
						<div class="JumperLineInput">
							<el-radio v-model="pageObj.type" label="1" :disabled='!addEdit'>广告图</el-radio>
	  						<el-radio v-model="pageObj.type" label="2" :disabled='!addEdit'>视频</el-radio>
	  						<el-radio v-model="pageObj.type" label="3" :disabled='!addEdit'>图文</el-radio>
						</div>
					</div>

					<div class="eachJumperLine contentHeadling" v-if='pageObj.type == 3'>
						<label for="">红包内容:</label>
						<div class="JumperLineInput">
							<textarea v-model='pageObj.comment'></textarea>
						</div>
					</div>

					<div class="eachJumperLine videoHeadline" v-if='pageObj.type == 2'>
						<label for="">上传视频</label>
						<div class="JumperLineInput">
							<el-upload
							  	class="avatar-uploader"
							  	action = ''
							  	:show-file-list="false"
							  	:http-request="selfUploadVideo">
							  	<button class="commonBtn jumperFileBtn" :disabled='videoUploading'>上传视频</button>
							  	<div class="jumperVideoLine" v-if='videoUploading'><em :style='{width:videoRate + "%"}'></em></div>
							  	<span v-if='videoUploading'>{{ videoRate }}%</span>
							</el-upload>
							<span>{{ pageObj.videoUrl }}</span>
							<el-upload
							  	class="avatar-uploader"
							  	action = ''
							  	:show-file-list="false"
							  	accept='image/*'
							  	:http-request="selfUploadCover">
							  	<button class="commonBtn jumperFileBtn">上传封面</button>
							  	<!-- <div class="jumperVideoLine"><em></em></div> -->
							  	<!-- <span>{{ videoRate }}%</span> -->
							</el-upload>
							<span>{{ pageObj.videoPic }}</span>
						</div>	
					</div>

					<div class="eachJumperLine coverUploadHeadline" v-if='pageObj.type != 2'>
						<label for="">红包图片</label>
						<div class="JumperLineInput">
							<div class="uploadBannerPic" v-for='(item,index) in pageObj.pics' :key='item.id'  @mouseenter='showClear(index)' @mouseleave='hideClear(index)' @click='clearPic(index)'>
								<img :src="item.url + '!default'" alt="">
								<p v-if='item.show'>x</p>
							</div>
							<el-upload
							  	class="avatar-uploader"
							  	action = ''
							  	:show-file-list="false"
							  	accept='image/*'
							  	:http-request="selfUpload">
							  	<button class="commonBtn jumperFileBtn">选择图片</button>
							</el-upload>
							
						</div>
					</div>


					<div class="eachJumperLine coverSelectHeadline" v-if='pageObj.type == 1'>
						<label for="">链接类型:</label>
						<div class="JumperLineInput">
							<el-radio v-model="pageObj.linkType" label="1" @change='updateWeb'>商户号</el-radio>
	  						<el-radio v-model="pageObj.linkType" label="2">外部链接</el-radio>
						</div>
					</div>

					<div class="eachJumperLine" v-if='pageObj.type != 2'>
						<label for="">{{ pageObj.type == 1 ? '　　　　' : '链接地址:'}}</label>
						<div class="JumperLineInput">
							<el-input size='small' v-model="pageObj.web" placeholder="" :disabled='pageObj.linkType == 1 && pageObj.type != 3'>
							</el-input>
						</div>
					</div>

					<div class="eachJumperLine" v-if='pageObj.type == 2'>
						<label for="">商户名称:</label>
						<div class="JumperLineInput">
							<el-input size='small' v-model="pageObj.businessName" placeholder="">
							</el-input>
						</div>
					</div>
					
				</div>
				<div class="jumperLine"></div>
				<button class="commonBtn jumperBtn" @click='subCharge' :disabled='saveUploading'>提交</button>
			</div>
		</div>
		
	</div>


</template>


<script>

	
	import COS from '../../../static/cos-js-sdk-v5.min.js'

	export default{
		name:'sendTemplate',
		data(){
			return {
				headlineType:[],
				id:0,
				pageObj:{
					templateName:'',
					title:'',
					type:'1',
					comment:'',
					videoId:'',
					videoUrl:'',
					videoPic:'',
					linkType:'1',
					pics:[]
				},
				spaceObj:{
					templateName:'',
					title:'',
					type:'1',
					comment:'',
					videoId:'',
					videoUrl:'',
					videoPic:'',
					linkType:'1',
					pics:[]
				},
				videoUploading:false,
				saveUploading:false,
				videoRate:0
			}
		},
		props:['sendTemplateShow','addEdit'],
		computed:{
			isShow(){
				return this.sendTemplateShow
			}
		},
		mounted(){
			
		},
		methods:{
			initSpace(){

				console.log(this.pageObj)

				this.pageObj.pics.splice(0,this.pageObj.pics.length)

				for(var key in this.pageObj){
					delete this.pageObj[key]
				}
				this.pageObj = Object.assign({},this.pageObj,this.spaceObj)
				this.$parent.sendTemplateShow = true
				
			},
			initCopy(id){
				console.log(id)
				var that = this

				that.id = id;

				$.ajax({
					type:'post',
					url:that.Global.router + '/redpacket/template/info',
					xhrFields:{withCredentials:true},
					data:{templateId:id},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							if(that.pageObj.pics.length > 0){
								that.pageObj.pics.splice(0,that.pageObj.pics.length)
							}
							
							for(var key in that.pageObj){
								delete that.pageObj[key]
							}

							var tempObj = {}
							tempObj.templateName = res.result.templateName;
							tempObj.title = res.result.title
							tempObj.type = res.result.type.toString()

							if(tempObj.type == 1){
								//广告图
								tempObj.web = res.result.web;
				                tempObj.linkType = res.result.linkType.toString();
				                tempObj.pics = [];
				                tempObj.pics.push({'url':res.result.adPic,'show':false})
							}else if(tempObj.type == 2){
								tempObj.videoId = res.result.videoId;
				                tempObj.videoUrl = res.result.videoUrl;
				                tempObj.videoPic = res.result.videoPic;
				                tempObj.pics = [];
				                tempObj.businessName = res.result.businessName;
							}else if(tempObj.type == 3){
								tempObj.comment = res.result.comment;
				                tempObj.web = res.result.web;
				                var tempPic = res.result.picUrls.split(',')
				                tempObj.pics = [];
				                for(var i=0; i<tempPic.length; i++){
				                	tempObj.pics.push({'url':tempPic[i],'show':false})
				                }
							}

							that.pageObj = Object.assign({},that.pageObj,tempObj)

							//console.log(that.pageObj)
							that.$parent.sendTemplateShow = true

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
			updateWeb(){
				this.pageObj.web = ''
			},
			changeType(i){
				this.pageObj.titleType = i
			},
			hideParent(){
				this.$parent.sendTemplateShow = false
			},
			showClear(i){
				this.pageObj.pics[i].show = true
			},
			hideClear(i){
				this.pageObj.pics[i].show = false
			},
			clearPic(i){
				this.pageObj.pics.splice(i,1)
			},
			subCharge(){
				var that = this
				
				var sendObj = {}
				
				sendObj.templateName = that.pageObj.templateName;
				sendObj.title = that.pageObj.title
				sendObj.type = that.pageObj.type

				if(sendObj.templateName.length < 4 || sendObj.templateName.length > 6){
					that.$alert('模板名称限制4-6个字', '提示', {confirmButtonText: '确定'});
				}else{
					//处理数据
					if(sendObj.type == 1){
						//广告图
						sendObj.web = that.pageObj.web;
		                sendObj.linkType = that.pageObj.linkType;
		                sendObj.adPic = that.pageObj.pics[0].url
					}else if(sendObj.type == 2){
						sendObj.videoId = that.pageObj.videoId;
		                sendObj.videoUrl = that.pageObj.videoUrl;
		                sendObj.videoPic = that.pageObj.videoPic + "!default";
		                sendObj.businessName = that.pageObj.businessName;
					}else if(sendObj.type == 3){
						var tempPic = []
						for(var i=0; i<that.pageObj.pics.length; i++){
							tempPic.push(that.pageObj.pics[i].url)
						}

						console.log(tempPic)

						sendObj.comment = that.pageObj.comment;
		                sendObj.web = that.pageObj.web;
		                sendObj.pics = tempPic;

					}

					console.log(sendObj)


					$.ajax({
						type:'post',
						url:that.Global.router + "/redpacket/template/save",
						xhrFields:{withCredentials:true},
						data:sendObj,
						success(res){
							console.log(res)
							if(res.code === "0000"){
								that.$alert('提交审核成功', '提示', {confirmButtonText: '确定'});
								that.$parent.initPage();
								that.$parent.sendTemplateShow = false

							}
						},
						error(){}
					})

				}

			},
			selfUpload(files){
				var that = this
				console.log(that.pageObj.picType,that.pageObj.pics.length)

				if(that.pageObj.type == 1 && that.pageObj.pics.length == 1){
					that.$alert('广告图类型最多上传1张图片','提示',{confirmButtonText: '确定'})
				}else if(that.pageObj.picType == 3 && that.pageObj.pics.length >= 9){
					that.$alert('图文类型最多上传9张图片','提示',{confirmButtonText: '确定'})
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

			                   	that.pageObj.pics.push({'url':finalPath,'show':false})
			                }
			            }

			        });


				}

				
			},
			selfUploadVideo(files){

				console.log('loading')
				console.log(files)
				var that = this

				//获取签名
				var getSignature = function(callback){
					$.ajax({
						type:'post',
						url:that.Global.router + '/upload/getUploadVideoSign',
						data:{},
						xhrFields:{withCredentials: true},
						success(res){
							if(res.code == "0000"){
								console.log(res)
				                callback(res.result.sign);
				            }else{
				                that.$alert('获取签名失败','提示',{confirmButtonText: '确定'})
				            }
						},
						error(){}
					})
		    	};

				var videoFile = files.file;
				var resultMsg = qcVideo.ugcUploader.start({
					videoFile: videoFile,
					getSignature: getSignature,
					allowAudio: 1,
					success: function(res){

						console.log(res)
					},
					error: function(res){
						console.log(res)
					},
					progress: function(res){
						
						that.videoUploading = true;
						that.saveUploading = true
						//console.log(res)
						that.videoRate = parseInt(res.curr * 100)
					},
					finish: function(res){
						console.log(res)
						that.videoUploading = false;
						that.saveUploading = false
						
						that.pageObj.videoId = res.fileId
						that.pageObj.videoUrl = res.videoUrl;
						

					}
				});

			},
			selfUploadCover(files){
				var that = this
				console.log(that.pageObj.picType,that.pageObj.pics.length)

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

		                   	that.pageObj.videoPic = finalPath
		                }
		            }

		        });
			}
		}
	}



</script>


<style>



</style>