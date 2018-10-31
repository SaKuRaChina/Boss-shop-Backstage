<template>
	
	<div class="chanceInfoWrap">
		
		<h3 class="pageTitle">
			<span>轮播图</span>
			<em>Banner</em>
		</h3>
		

		<div class="pageFormBox">
			<div class="pageForm">
				<div class="eachPageForm">
					<label for="">轮播图上传</label>
					<div class="pageUpload bannerUpload">
						<div class="uploadBannerWrap">
							<div class="uploadBannerPic" v-for='(item,index) in pageBanner' :key='item.url' @mouseenter='showClear(index)' @mouseleave='hideClear(index)' @click='clearPic(index)'>
								<img :src="item.url + '!default'" alt="">
								<p v-if='item.show'>x</p>
							</div>
						</div>
						<el-upload
						  	class="avatar-uploader"
						  	action = ''
						  	:show-file-list="false"
						  	accept='image/*'
						  	:http-request="selfUpload">
						  	<button class="commonBtn choseBtn" :disabled='pageBanner.length>=5'>选择文件</button>
						</el-upload>
						<span>请上传3-5张图片</span>
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

	import COS from '../../../../static/cos-js-sdk-v5.min.js'

	export default{
		name:"ChanceBanner",
		data(){
			return {
				pageBanner:[],
			}
		},
		mounted(){
			this.initPage()
		},
		methods:{
			initPage(){
				var that = this

				$.ajax({
					type:'post',
					url:that.Global.router + "/business/editBusinessPhoto",
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)
						if(res.code === "0000"){

							that.pageBanner = []

							var picArr = [];

							if(res.result.url != null){
								picArr = res.result.url.split(',')
								for(var i=0; i<picArr.length; i++){
									that.pageBanner.push({'url':picArr[i],'show':false})
								}
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
					error(res){}
				})

			},
			showClear(i){
				this.pageBanner[i].show = true
			},
			hideClear(i){
				this.pageBanner[i].show = false
			},
			clearPic(i){
				this.pageBanner.splice(i,1)
			},
			savePage(){
				var that = this;
				console.log(that.pageBanner)

				if(that.pageBanner.length < 3){
					that.$alert('请至少上传3张图片','提示',{confirmButtonText: '确定'})
				}else{
					var sendArr = []
					for(var i=0; i<that.pageBanner.length; i++){
						sendArr.push(that.pageBanner[i].url)
					}

					const sendUrl = sendArr.join(',')

					console.log(sendUrl)

					$.ajax({
						type:'post',
						url:that.Global.router + '/business/addBusinessPhoto',
						data:{url:sendUrl},
						xhrFields:{withCredentials: true},
						success(res){
							console.log(res)

							if(res.code === "0000"){
								that.$alert('保存成功','提示',{comfirmButtonText:'确定'});
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
						error(res){}
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

		                    
		                    that.pageBanner.push({'url':finalPath,'show':false})
		                    
		                }
		            }

		        });
			}

		}
	}

</script>


<style>



</style>