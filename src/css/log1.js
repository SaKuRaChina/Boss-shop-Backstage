var userName;
var userPwd;
var time = 7;
var phone;
var rsaPwd;
// var ajaxUrl = "http://192.168.1.188:8081";
$(function(){
	
	//判断是否记住密码
	if( $.cookie("cookieUserName")!="" && $.cookie("cookieUserName")!="null" && $.cookie("cookieUserName")!=null && $.cookie("cookieUserPwd")!="" && $.cookie("cookieUserPwd")!="null" && $.cookie("cookieUserPwd")!=null){
		$("#logName").val($.cookie("cookieUserName"));
		$("#logPwd").val($.cookie("cookieUserPwd"));
	}
	
	$(".backToLog").click(function(){
		$(".changePwdArea").hide();
		$(".logType").show();
	});
	$(".fPwd").click(function(){
		$(".changePwdArea").show();
		$(".logType").hide();
	});
	
	
	
	$(".logIn").click(function(){
		
		if($("#logName").val()==""){
			layer.msg("请输入账号");
		}else if($("#logPwd").val()==""){
			layer.msg("请输入密码");
		}else{
			userName = $("#logName").val();
			userPwd = $("#logPwd").val();
			if(userPwd.length>16){
				rsaPwd = userPwd;
			}else{
	            var encrypt = new JSEncrypt();
	            encrypt.setPublicKey($("#tra").val());
	            rsaPwd = encrypt.encrypt(userPwd);
			}

			//是否保存密码
			if($("input:checkbox[name='remPwd']").is(':checked')){
				//记住密码
				$.cookie("cookieUserName",userName, { expires: 7 });
				$.cookie("cookieUserPwd",rsaPwd, { expires: 7 });
				var ii = layer.load();
				$.ajax({
					type:"POST",
					xhrFields: {withCredentials: true},
					url:ajaxUrl+"/business/login",
					data:{"loginName":userName,"password":rsaPwd},
					success:function(data){
						if(data.code==0000){
							layer.close(ii);
							layer.msg(data.message);
							localStorage.setItem("topUserName",data.result.firmName);
							localStorage.setItem("topUserPic",data.result.url);
							if(data.result.businessType==1){
								window.location.href="https://merchant.juniuboss.com/opportunity.html";
                                // window.location.href="http://192.168.1.144:8020/merchant/opportunity.html";
							}else if(data.result.businessType==2){
                                // window.location.href="http://192.168.1.144:8020/merchant/opportunity.html";
								window.location.href="https://merchant.juniuboss.com/opportunity.html";
							}

						}else{
							layer.close(ii);
							layer.msg(data.message);
						}
						console.log(data)
						console.log(rsaPwd)
					},error:function(data){
						layer.msg("请刷新页面重试");
						layer.close(ii);
						console.log("错误");
						console.log(data);
					}
				});
			}else{
				//不记住密码
				$.cookie("cookieUserName", null);
				$.cookie("cookieUserPwd", null);
				var ii = layer.load();
				$.ajax({
					type:"POST",
					xhrFields: {withCredentials: true},
					url:ajaxUrl+"/business/login",
					data:{"loginName":userName,"password":rsaPwd},
					success:function(data){
						if(data.code=="0000"){
							layer.close(ii);
							layer.msg(data.message);
							localStorage.setItem("topUserName",data.result.firmName);
							localStorage.setItem("topUserPic",data.result.url);
							window.location.href="https://merchant.juniuboss.com/opportunity.html";
                            // window.location.href="http://192.168.1.144:8020/merchant/opportunity.html";
						}else{
							layer.close(ii);
							layer.msg(data.message);
						}
						console.log(data)
						console.log(rsaPwd)
					},error:function(data){
						layer.msg(data.message);
						layer.close(ii);
						console.log("错误");
						console.log(data);
					}
				});
			}
		}
		
	})
	
	
	//点击获取验证码
	$(".getYzm").click(function(){
		phone = $("#phoneName").val();
		if(!isPoneAvailable(phone)){
			layer.msg("请输入正确手机号");
		}else if($(this).text()=="获取验证码"){
			countdown();
			$.ajax({
				type:"POST",
				xhrFields: {withCredentials: true},
				url:ajaxUrl+"/sms/sendMessage",
				data:{"phone":phone},
				success:function(data){
					console.log(data);
					layer.msg("验证码已发送");
					time = 7;
					$(this).text(time);
				},error:function(data){
					layui.use('layer', function(){
						var layer = layui.layer;
						layer.msg("请刷新重试");
					});
					console.log("错误");
					console.log(data);
				}
			});
		}
	});
	
	//倒计时
	function countdown(){
		if(time==0){
			$(".getYzm").text("获取验证码");
		}else{
			time=time-1;
			$(".getYzm").text(time);
			setTimeout(function(){
				countdown();
			},1000)
		}
	}
	
	
	//修改密码确认
	$(".newPwdConfirm").click(function(){
		if($("#phoneName").val()==""){
			layer.msg("请输入手机号");
		}else if($("#yzm").val()==""){
			layer.msg("请输入验证码");
		}else if($("#newPwd").val()==""){
			layer.msg("请输入新密码");
		}else{
			var code = $("#yzm").val();
			var password = $("#newPwd").val();
			var ii = layer.load();
			
	        var encrypt = new JSEncrypt();
	        encrypt.setPublicKey($("#tra").val());
	        rsaPwd = encrypt.encrypt(password);
	        
			$.ajax({
				type:"POST",
				xhrFields: {withCredentials: true},
				url:ajaxUrl+"/business/forgetPassword",
				data:{"phone":phone,"code":code,"password":rsaPwd},
				success:function(data){
					console.log(data);
					if(data.code=="0000"){
						layer.close(ii);
						$(".backToLog").click();
						layer.msg("修改成功");
					}else{
						layer.msg(data.message);
						layer.close(ii);
					}
				},error:function(data){
					layui.use('layer', function(){
						var layer = layui.layer;
						layer.msg("请刷新重试");
					});
					console.log("错误");
					console.log(data);
				}
			});
		}
	});
	
	
	
	
	
	
	// 判断是否为手机号
	function isPoneAvailable(pone) {
		var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if (!myreg.test(pone)) {
			return false;
		} else {
			return true;
		}
	}
	
	
	
	

	
	
})
