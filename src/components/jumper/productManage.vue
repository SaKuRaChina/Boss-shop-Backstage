<template>

	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos productManageBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">产品</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent outer-box">
				<div class="inner-box">
					<div class="eachJumperLine">
						<label for="">标题:</label>
						<div class="JumperLineInput">
							<el-input size='small' v-model="pageObj.title" placeholder="">
							</el-input>
						</div>
					</div> 
					<div class="eachJumperLine contentHeadling">
						<label for="">文章内容:</label>
						<div class="JumperLineInput longLineInput">
							<Ueditor :innerhtml='pageObj.content' ref='editor'></Ueditor>	
						</div>
					</div>
					<div class="eachJumperLine coverUploadHeadline">
						<label for="">封面图上传</label>
						<div class="JumperLineInput longLineInput">
							<div class="uploadBannerPic">
								<img :src="pageObj.surface + '!default'" alt="">
							</div>
							<el-upload
							  	class="avatar-uploader"
							  	action = ''
							  	:show-file-list="false"
							  	accept='image/*'
							  	:http-request="selfUpload">
							  	<button class="commonBtn jumperFileBtn">选择文件</button>
							</el-upload>
							<span>请选择上传图片格式，建议图片尺寸(宽*高如果不按尺寸上传会导致图片变形)</span>
						</div>
					</div>
					<div class="jumperLine jumperLineLong"></div>
					<button class="commonBtn jumperBtn" @click='subCharge'>提交</button>
				</div>
			</div>
		</div>
		
	</div>


</template>


<script>

	import Ueditor from '../common/Ueditor'
	import COS from '../../../static/cos-js-sdk-v5.min.js'

	export default{
		name:'ProductManage',
		data(){
			return {
				id:0,
				pageObj:{
					title:"",
					content:"",
					surface:"",
				},
				spaceObj:{
					title:"",
					content:"",
					surface:"",
				},
			}
		},
		props:['productManageShow','addEdit'],
		components:{Ueditor},
		computed:{
			isShow(){
				return this.productManageShow
			}
		},
		mounted(){
			
		},
		methods:{
			initSpace(){

				for(var key in this.pageObj){
					delete this.pageObj[key]
				}


				this.pageObj = Object.assign({},this.pageObj,this.spaceObj)
				this.$refs.editor.pushHtml(this.pageObj.content)
				
				//console.log(this.pageObj)

			},
			initEdit(id){
				console.log(id)
				var that = this

				that.id = id;

				$.ajax({
					type:'post',
					url:that.Global.router + '/product/editProduct',
					xhrFields:{withCredentials:true},
					data:{id:id},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							for(var key in that.pageObj){
								delete that.pageObj[key]
							}

							
							res.result.surface = res.result.surfaceUrl
							that.pageObj = Object.assign({},that.pageObj,res.result)
							
							//console.log(that.pageObj)

							that.$refs.editor.pushHtml(that.pageObj.content)


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
				this.$parent.productManageShow = false
			},
			subCharge(){
				var that = this
				var content = that.$refs.editor.outerhtml

				console.log(that.pageObj)
				console.log(that.addEdit)

				//上传地址
				var url = that.addEdit ? that.Global.router + '/product/addProduct' : that.Global.router + '/product/updateProduct'


				var sendObj = {}

				if(that.addEdit){
					//添加
				}else{
					//删除
					sendObj.id = that.id
				}

				sendObj.title = that.pageObj.title
				sendObj.content = content
				sendObj.surface = that.pageObj.surface
				
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
							that.$parent.productManageShow = false
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

				console.log(files)
				
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

		                   	that.pageObj.surface = finalPath
		                }
		            }

		        });


			
				
			},
		}
	}



</script>


<style>



</style>