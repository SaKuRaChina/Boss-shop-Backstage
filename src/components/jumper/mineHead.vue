<template>
	
	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos mineHeadBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">用户头像</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent">
				<div class="mineHeadContent">
					<img :src="headPic">
					<span>{{ headName }}</span>
				</div>
			</div>
			<div class="jumperLine"></div>
			<el-upload
			  	class="avatar-uploader"
			  	action = ''
			  	:show-file-list="false"
			  	accept='image/*'
			  	:http-request="selfUpload">
			  	<button class="commonBtn jumperBtn">上传头像</button>
			</el-upload>
		</div>
		
	</div>


</template>


<script>

	import COS from '../../../static/cos-js-sdk-v5.min.js'

	export default{
		name:'OwnCharge',
		data(){
			return{
				
			}
		},
		props:['mineHeadShow','headImg','headName'],
		computed:{
			isShow(){
				return this.mineHeadShow
			},
			headPic(){
				return this.headImg
			}
		},
		mounted(){
			
		},
		methods:{
			subCharge(url){
				var that = this
				
				$.ajax({
					type:"post",
					url:that.Global.router + '/business/updateHeadUrl',
					data:{url:url},
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)

						if(res.code == "0000"){
							that.$alert('头像更改成功','提示',{confirmButtonText:'确定'})
							that.$parent.headImg = url
							that.$parent.initHead()
						}else if(res.code == "1003"){
							that.$alert(res.message, '提示', {confirmButtonText: '确定'});
						}
					},
					error(){}
				})
				
			},
			hideParent(){ 
				this.$parent.mineHeadShow = false
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
		                    var finalPath = visitUrlPrefix + filePath + '!90x90';
		                    console.log(finalPath)

		                   	that.subCharge(finalPath)

		                }
		            }

		        });

				
			}
		}
	}


</script>


<style>
	
	
</style>