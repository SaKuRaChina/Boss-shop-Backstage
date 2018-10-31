<template>
	
	<div class="chanceInfoWrap">
		
		<h3 class="pageTitle">
			<span>轮播图</span>
			<em>Banner</em>
		</h3>
		

		<div class="pageFormBox">
			<div class="pageForm">
				<div class="eachPageForm">
					<label for="">优秀案例上传</label>
					<div class="pageUpload bannerUpload">
						<div class="uploadBannerWrap">
							<div class="uploadBannerPic" v-for='(item,index) in pageArr' :key='item.id'  @mouseenter='showClear(index)' @mouseleave='hideClear(index)' @click='clearPic(index)'>
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
						  	<button class="commonBtn choseBtn">选择文件</button>
						</el-upload>
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
		name:"ChanceExample",
		data(){
			return {
				pageArr:[]
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
					url:that.Global.router + '/business/editBusinessCase',
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							that.pageArr = [];

							for(var i=0; i<res.result.length; i++){
								that.pageArr.push({id:res.result[i].id,url:res.result[i].url,show:false})
							}

							console.log(that.pageArr)

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
			showClear(i){
				this.pageArr[i].show = true
			},
			hideClear(i){
				this.pageArr[i].show = false
			},
			clearPic(i){
				this.pageArr.splice(i,1)
			},
			savePage(){
				var that = this
				console.log(that.pageArr)
				var sendArr = []

				if(that.pageArr.length == 0){
					that.$alert('请上传案例', '提示', {confirmButtonText: '确定'})
				}else{

					for(var i=0; i<that.pageArr.length;i++){
						sendArr.push(that.pageArr[i].url)
					}

					var url = sendArr.join(',')

					$.ajax({
						type:'post',
						url:that.Global.router + '/business/addBusinessCase',
						data:{url:url},
						xhrFields:{withCredentials: true},
						success(res){
							console.log(res)
							if(res.code === "0000"){

								that.$alert('保存成功', '提示', {confirmButtonText: '确定'});
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

		                    
		                    that.pageArr.push({'url':finalPath,'show':false})
		                    
		                }
		            }

		        });
			}
		}
	}

</script>


<style>



</style>