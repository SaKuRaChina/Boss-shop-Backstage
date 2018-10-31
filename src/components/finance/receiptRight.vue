<template>
	<div class="receiptRightWrap">
		

		<div class="financeMain">
			<h2 class="financeTitle">增值税发票资质信息</h2>
			<div class="financeList" v-if='isCheck'>
				<div class="eachFinanceList">
					<em>用户名</em><span>{{ firmObj.loginName }}</span>
				</div>
				<div class="eachFinanceList">
					<em>客户发票抬头</em><span>{{ firmObj.firmName}}</span>
				</div>
				<div class="eachFinanceList">
					<em>增值税发票类型</em><span>增值税普通</span>
				</div>
				<div class="eachFinanceList">
					<em>纳税人识别号</em><span>{{ firmObj.discernCode}}</span>
				</div>
				<div class="eachFinanceList">
					<em>状态</em><span :class="{'yellowSpan':firmObj.state == 1,'cyanSpan':firmObj.state == 2,'redSpan':firmObj.state == 3}">{{ firmObj.stateText }}</span>
				</div>
				<div class="eachFinanceList">
					<em>提交人</em><span>{{ firmObj.loginName }}</span>
				</div>
				<div class="eachFinanceList">
					<em>提交时间</em><span>{{ firmObj.createTime }}</span>
				</div>
				<div class="eachFinanceList">
					<em>操作</em><span class="blueSpan" @click='isCheck = false'>修改</span>
				</div>
			</div>
			<div class="financeList checkFinanceList" v-else='isCheck'>
				<div class="eachFinanceList">
					<em>用户名</em><span>{{ firmObj.loginName }}</span>
				</div>
				<div class="eachFinanceList">
					<em>客户发票抬头</em><span>{{ firmObj.firmName}}</span>
				</div>
				<div class="eachFinanceList">
					<em>增值税发票类型</em><span>增值税普通</span>
				</div>
				<div class="eachFinanceList">
					<em><i>*</i>纳税人识别号</em><input type="text" name="" v-model='discernCode'>
				</div>
				<div class="eachFinanceList">
					<!-- <em><i>*</i>请下载<a href='../../file/receiptInfo.docx' download="发票信息提交模板">发票信息提交模板</a>,打印盖章后，拍照上传</em><span class="blueSpan">上传附件</span> -->
					<em><i>*</i>请下载<a href='javascript:void(0)' @click='getModel'>发票信息提交模板</a>,打印盖章后，拍照上传</em>
					<el-upload
					  	class="avatar-uploader financeFileWrap"
					  	action = ''
					  	:show-file-list="false"
					  	accept='image/*'
					  	:http-request="selfUpload">
					  	<button class="financeFile blueSpan">上传附件</button>
					</el-upload>
					<span class="modelUrl">{{ invoiceModel }}</span>
					<!-- <a href='http://localhost:8080/banner.jpg' download="test">下载</a> -->
				</div>
				<div class="receiptBtnWrap">
					<button type='button' class="commonBtn financeBtn" @click='isCheck = true'>返回</button>
					<button type='button' class="commonBtn financeBtn" @click='subInvoice'>提交</button>
				</div>
				<div class="notice">
					<h3><img src="../../images/exclamation.png">重要提醒</h3>
					<ul class="noticeTips">
						<li>1.为提高审核通过率，缩短审核时间，强烈建议使用官方模板，且印章不要遮挡模板的信息文字</li>
						<li>2.请使用公章或者财务章（红章）在模板盖章</li>
						<li>3.图片不超过5M，图片的长宽在200-2000范围内，仅限于jpg、png、gif类型</li>
					</ul>
				</div>
			</div>
		</div>

	</div>


</template>


<script type="text/javascript">
	
	import '../../css/finance.css'
	import COS from '../../../static/cos-js-sdk-v5.min.js'

	export default{
		data(){
			return {
				isCheck:true,
				firmObj:{
					loginName:'',
					firmName:''
				},
				discernCode:'',
				invoiceModel:''
			}
		},
		mounted(){
			this.initCertification()
		},
		methods:{
			initCertification(){
				var that = this;
				that.discernCode = "";
				that.invoiceModel = "";

				$.ajax({
					type:'post',
					url:that.Global.router + '/invoice/getInvoiceAptitude',
					xhrFields:{
						withCredentials:true
					},
					success(res){
						console.log(res)
						if(res.code === "0000"){

							if(res.result.state != null){
								switch(parseInt(res.result.state)){
									case 1:
										res.result.stateText = "已审核";
										break;
									case 2:
										res.result.stateText = "审核中";
										break;
									case 3:
										res.result.stateText = "审核驳回";
										break;
									case 4:
										res.result.stateText = "已过期";
										break;
									default:
										res.result.stateText = ""
								}

								that.firmObj = Object.assign({},that.firmObj,res.result)
								that.discernCode = res.result.discernCode
								that.invoiceModel = res.result.invoiceModel

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
					error(){}
				})

			},
			getModel(){
                const elink = document.createElement('a') // 创建a标签
                elink.download = '巨牛BOSS发票信息提交表.docx'
                elink.style.display = 'none'
                
                elink.href = this.Global.router + "/invoice/uploadTemplate"
                
                document.body.appendChild(elink)
                elink.click()
                document.body.removeChild(elink)
                            
			},
			subInvoice(){
				var that = this
				var sendObj = {
					discernCode:that.discernCode,
					invoiceModel:that.invoiceModel
				}
				console.log(sendObj)
				if(that.discernCode.length <= 0){
					that.$alert('请输入纳税人识别号', '提示', {confirmButtonText: '确定'});
				}else if(that.invoiceModel.length <= 0){
					that.$alert('请上传发票附件', '提示', {confirmButtonText: '确定'});
				}else{
					$.ajax({
						type:"post",
						url:that.Global.router + "/invoice/updateInvoiceAptitude",
						xhrFields:{withCredentials:true},
						data:sendObj,
						success(res){
							console.log(res)
							if(res.code == "0000"){
								that.$alert('上传成功', '提示', {confirmButtonText: '确定'});
								that.initCertification()
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
						}
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

		                   	that.invoiceModel = finalPath
		                }
		            }

		        });

			},
		}
	}




</script>


<style type="text/css">
	

</style>