<template>

	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos bossHeadlineBox" :class="[pageObj.titleType == 1 ? 'bossHeadlineBox1' : 'bossHeadlineBox2' ]">
			<div class="jumperTitle clearfix">
				<h2 class="left">添加内容</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent outer-box">
				<div class="inner-box">
						<div class="eachJumperLine">
						<label for="">类型:</label>
						<div class="JumperLineInput">
							<el-radio value="0" v-model="pageObj.titleType" label="1" :disabled='addEdit==false' @click='changeType(1)'>图文</el-radio>
	  						<el-radio value="1" v-model="pageObj.titleType" label="2" :disabled='addEdit==false' @click='changeType(2)'>视频</el-radio>
						</div>
					</div>
					<div class="eachJumperLine">
						<label for="">头条类别:</label>
						<div class="JumperLineInput">
							<el-select v-model="pageObj.sortId" size="small" placeholder="请选择" :disabled='!editWatch'>
							    <el-option
								    v-for="item in headlineType"
								    :key="item.sortId"
								    :label="item.name"
								    :value="item.sortId">
							    </el-option>
							</el-select>
						</div>
					</div>
					<div class="eachJumperLine">
						<label for="">标题:</label>
						<div class="JumperLineInput">
							<el-input size='small' v-model="pageObj.headlineTitle" placeholder="" :disabled='!editWatch'>
							</el-input>
						</div>
					</div> 
					<div class="eachJumperLine contentHeadling">
						<label for="">内容:</label>
						<div class="JumperLineInput longLineInput">
							<Ueditor :innerhtml='pageObj.headlineContent' ref='editor'></Ueditor>	
						</div>
					</div>

					<!-- 视频上传 -->
					<div class="eachJumperLine videoHeadline videoHeadline">
						<label for="">视频上传</label>
						<div class="JumperLineInput longLineInput">
							<el-upload
							  	class="avatar-uploader"
							  	action = ''
							  	:show-file-list="false"
							  	:http-request="selfUploadVideo">
							  	<button :disabled='videoUploading' class="commonBtn jumperFileBtn">选择文件</button>
							  	<div class="jumperVideoLine" v-if='videoUploading'><em :style='{width:videoRate + "%"}'></em></div>
							  	<span v-if='videoUploading'>{{ videoRate }}%</span>
							</el-upload>
							<span>{{ pageObj.headlineVideoUrl }}</span>
						</div>	
					</div>


					<div class="eachJumperLine coverSelectHeadline">
						<label for="">封面图:</label>
						<div class="JumperLineInput">
							<el-radio v-model="pageObj.picType" :disabled='addEdit==false' label="1">单图</el-radio>
	  						<el-radio v-model="pageObj.picType" :disabled='addEdit==false' label="2">三图</el-radio>
						</div>
					</div>
					<div class="eachJumperLine coverUploadHeadline">
						<label for="">{{ pageObj.titleType == 1 ? '　' : '封面图'}}</label>
						<div class="JumperLineInput longLineInput">
							<div class="uploadBannerPic" v-for='(item,index) in pageObj.coverArr' :key='item.id'  @mouseenter='showClear(index)' @mouseleave='hideClear(index)' @click='clearPic(index)'>
								<img :src="item.url + '!default'" alt="">
								<p v-if='item.show'>x</p>
							</div>
							<el-upload
							  	class="avatar-uploader"
							  	action = ''
							  	:show-file-list="false"
							  	accept='image/*'
							  	:http-request="selfUpload">
							  	<button class="commonBtn jumperFileBtn" :disabled='!editWatch'>选择文件</button>
							</el-upload>
							
						</div>
					</div>
					<div v-if='editWatch' class="jumperLine jumperLineLong"></div>
					<button class="commonBtn jumperBtn" @click='subCharge' :disabled='saveUploading' v-if='editWatch'>提交</button>
				</div>
			</div>
		</div>
		
	</div>


</template>


<script>

	import Ueditor from '../common/Ueditor'
	import COS from '../../../static/cos-js-sdk-v5.min.js'

	export default{
		name:'BossHeadline',
		data(){
			return {
				headlineType:[],
				id:0,
				pageObj:{
					sortId:"",
					titleType:"1",
					picType:"1",
					headlineTitle:"",
					headlineContent:" ",
					headlinePictureUrl:"",
					headlineVideoUrl:"",
					coverArr:[]
				},
				spaceObj:{
					sortId:"",
					titleType:"1",
					picType:"1",
					headlineTitle:"",
					headlineContent:"",
					headlinePictureUrl:"",
					headlineVideoUrl:"",
					coverArr:[]
				},
				videoUploading:false,
				saveUploading:false,
				videoRate:20
			}
		},
		props:['bossHeadlineShow','addEdit','editWatch'],
		components:{Ueditor},
		computed:{
			isShow(){
				return this.bossHeadlineShow
			}
		},
		mounted(){

			this.initType();
			
		},
		methods:{
			initType(){
				var that = this;
				$.ajax({
					type:"post",
					url:that.Global.router + '/headline/headlineSort',
					xhrFields:{withCredentials:true},
					success(res){
						//console.log(res)

						if(res.code === "0000"){
							that.headlineType = [];

							if(res.result != null){
								for(var i=0; i<res.result.length; i++){
									that.headlineType.push(res.result[i])
								}
							}
							
						}
					},
					error(){}
				})
			},
			initSpace(){

				for(var key in this.pageObj){
					delete this.pageObj[key]
				}


				this.pageObj = Object.assign({},this.pageObj,this.spaceObj)
				this.$refs.editor.pushHtml(this.pageObj.headlineContent)
				
				//console.log(this.pageObj)

			},
			initEdit(id){
				console.log(id)
				var that = this

				that.id = id;

				$.ajax({
					type:'post',
					url:that.Global.router + '/headline/checkHeadline',
					xhrFields:{withCredentials:true},
					data:{id:id},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							for(var key in that.pageObj){
								delete that.pageObj[key]
							}

							console.log(that.pageObj)

							res.result.coverArr = []
							if(res.result.headlinePictureUrl != null){
								var picArr = res.result.headlinePictureUrl.split(',')
								for(var i=0; i<picArr.length; i++){
									res.result.coverArr.push({'url':picArr[i],'show':false}) 
								}
								
							}

							if(res.result.headlineType == 1){
								res.result.titleType = "1"
								res.result.picType = "1"

							}else if(res.result.headlineType == 2){
								res.result.titleType = "1"
								res.result.picType = "2"

							}else if(res.result.headlineType == 3){
								res.result.titleType = "2"
							}
							that.pageObj = Object.assign({},that.pageObj,res.result)

							console.log(that.pageObj)

							that.$refs.editor.pushHtml(that.pageObj.headlineContent)


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
			changeType(i){
				this.pageObj.titleType = i
			},
			hideParent(){
				this.$parent.bossHeadlineShow = false
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
				var headlineContent = that.$refs.editor.outerhtml

				console.log(that.pageObj)
				console.log(that.addEdit)

				//上传地址
				var url = that.addEdit ? that.Global.router + '/headline/addHeadline' : that.Global.router + '/headline/editHeadline'


				var sendObj = {}

				if(that.pageObj.titleType == 1){
					if(that.pageObj.picType == 1){
						sendObj.headlineType = 1
					}else if(that.pageObj.picType == 2){
						sendObj.headlineType = 2
					}
					
				}else if(that.pageObj.titleType == 2){
					sendObj.headlineType = 3

				}

				if(that.addEdit){
					//添加
					sendObj.headlineContent = headlineContent

				}else{
					//编辑
					sendObj.id = that.id
				}

				sendObj.sortId = that.pageObj.sortId
				sendObj.headlineTitle = that.pageObj.headlineTitle

				var tempArr = []
				for(var i=0; i<that.pageObj.coverArr.length; i++){
					tempArr.push(that.pageObj.coverArr[i].url)
				}
				
				sendObj.headlinePictureUrl = tempArr.join(',')
				sendObj.headlineVideoUrl = that.pageObj.headlineVideoUrl

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
							that.$parent.bossHeadlineShow = false
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

				if(that.pageObj.picType == 1 && that.pageObj.coverArr.length == 1){
					that.$alert('最多上传1张封面图','提示',{confirmButtonText: '确定'})
				}else if(that.pageObj.picType == 2 && that.pageObj.coverArr.length == 3){
					that.$alert('最多上传3张封面图','提示',{confirmButtonText: '确定'})
				}else if(that.pageObj.titleType == 2 && that.pageObj.coverArr.length == 1){
					that.$alert('最多上传1张封面图','提示',{confirmButtonText: '确定'})
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
						that.pageObj.headlineVideoUrl = res.videoUrl;
						

					}
				});

			}
		}
	}



</script>


<style>



</style>