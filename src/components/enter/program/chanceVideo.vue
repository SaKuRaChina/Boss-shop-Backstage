<template>
	
	<div class="chanceInfoWrap">
		
		<h3 class="pageTitle">
			<span>品牌视频</span>
			<em>Brand video</em>
		</h3>
		

		<div class="pageFormBox">
			<div class="pageForm">
				<div class="eachPageForm">
					<label for="">标题</label>
					<div class="elInput">
						<el-input size="medium" v-model="pageObj.title" placeholder="请输入内容"></el-input>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">封面图上传</label>
					<div class="pageUpload">
						<img :src="pageObj.picUrl + '!default'" alt="">
						<el-upload
						  	class="avatar-uploader"
						  	action = ''
						  	:show-file-list="false"
						  	accept='image/*'
						  	:http-request="selfUpload">
						  	<button :disabled='picUploading' class="commonBtn choseBtn">选择文件</button>
						  	<!-- <span>未选择任何文件</span> -->
						</el-upload>
					</div>
				</div>
				<div class="eachPageForm">
					<label for="">视频上传</label>
					<div class="pageUpload">
						<div class="pageVideoWrap" id='video'>
							
						</div>
						<div class="pageVideoRate" v-if='videoUploading'>
							<div class="rateBar"><em :style='{width:videoRate + "%"}'></em></div>
							<span>{{ videoRate }}%</span>
						</div>
						<el-upload
						  	class="avatar-uploader"
						  	action = ''
						  	:show-file-list="false"
						  	:http-request="selfUploadVideo">
						  	<button :disabled='videoUploading' class="commonBtn choseBtn">选择文件</button>
						  	<!-- <span>未选择任何文件</span> -->
						</el-upload>
					</div>
				</div>
				<div class="pageFormLine"></div>
				<div class="eachPageForm">
					<label for="">　　　　</label>
					<button class="commonBtn subBtn" :disabled='saveUploading' @click='savePage'>保存</button>
				</div>
			</div>
				
			
		</div>


	</div>

</template>


<script>

	import COS from '../../../../static/cos-js-sdk-v5.min.js'
	//import $ from '../../../../static/jquery-3.1.0.min.js'

	export default{
		name:"ChanceVideo",
		data(){
			return {
				pageObj:{},
				picUploading:false,
				videoUploading:false,
				saveUploading:false,
				videoRate:0
			}
		},
		mounted(){

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

			this.initPage()
			
		},
		methods:{
			initPage(){
				var that = this

				$.ajax({
					type:'post',
					url:that.Global.router + '/business/editBusinessVideo',
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)
						if(res.code === "0000"){

							that.pageObj = Object.assign({},that.pageObj,res.result)

							that.playVideo(that.pageObj.brandVideo,that.pageObj.picUrl + '!default')

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
			playVideo(url,cover){
				var videoObject = {
					container:'#video',
					variable:'player',
					autoplay:false,
					poster:cover,
					video:url,
				};
				var player=new ckplayer(videoObject);
				
			},
			savePage(){
				var that = this

				console.log(that.pageObj)

				let sendObj = {}
				sendObj.picUrl = that.pageObj.picUrl
				sendObj.brandVideo = that.pageObj.brandVideo
				sendObj.brandVideoId = that.pageObj.brandVideoId
				sendObj.title = that.pageObj.title
				
				console.log(sendObj)

				$.ajax({
					type:'post',
					url:that.Global.router + '/business/addBusinessVideo',
					data:sendObj,
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)
						if(res.code === "0000"){

							that.$alert('保存成功','提示',{confirmButtonText: '确定'});
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
		                
		                that.picUploading = true;
						that.saveUploading = true
		            }
		        },function(err,data){
		            //console.log(err,data);
		            that.picUploading = false;
					that.saveUploading = false

		            if (err && err.error) {
		            	that.$alert('文件上传失败' + err.error.Message, '提示', {confirmButtonText: '确定'});
		                
		            } else if (err) {
		            	that.$alert('文件上传失败' + err, '提示', {confirmButtonText: '确定'});
		               
		            } else{

		                if (data.statusCode == 200) {
		                    var visitUrlPrefix = 'http://boss-1256403611.picbj.myqcloud.com/';
		                    var finalPath = visitUrlPrefix + filePath;
		                    console.log(finalPath)

		                    that.pageObj.picUrl = finalPath

		                    
		                }
		            }

		        });
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
						
						that.pageObj.brandVideoId = res.fileId
						that.pageObj.brandVideo = res.videoUrl;
						that.playVideo(that.pageObj.brandVideo,that.pageObj.picUrl + '!default')

					}
				});

			}
		}
	}

</script>


<style>



</style>