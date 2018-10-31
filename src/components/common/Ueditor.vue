<template>
	
	<div class="ueditorWrap" >
		<textarea id="ueditor">
			
		</textarea>
		<input type="file" id="ueditorUpload" accept="image/*" style="display: none">
		
	</div>
	
</template>

<script>


	//ueditor富文本编辑器
	import '../../../static/ueditor/ueditor.config.js'
	import '../../../static/ueditor/ueditor.all.js'
	import '../../../static/ueditor/lang/zh-cn/zh-cn.js'
	import '../../../static/ueditor/ueditor.parse.min.js'
	
	import COS from '../../../static/cos-js-sdk-v5.min.js'

	export default{
		name:'Ueditor',
		props:['innerhtml'],
		data(){
			return{
				ue:null,
			}
		},
		computed:{
			outerhtml(){
				return this.ue.getContent()
			}
		},
		mounted(){
			//console.log('yes')
			var that = this
			that.ue = new UE.ui.Editor({
		        wordCountMsg:"当前已输入{#count}个字符",
		        toolbars:[
		            ["undo","redo","|","bold","italic","underline","strikethrough","fontsize","paragraph","forecolor","backcolor","|","indent","subscript","superscript","fontborder","justifyleft","justifyright","justifycenter","justifyjustify"],
		            ["autotypeset","anchor","snapscreen","date","|","source","pasteplain",,"|","background","emotion","spechars","map","horizontal","formatmatch","insertcode","link","unlink","selectall","|","preview","|","removeformat","cleardoc"]
		        ],
		        pasteplain:true
		    });
		    that.expendHandler()
		    that.ue.render("ueditor")

			setTimeout(function () {
				
			    that.ue.ready(function(){
			    	that.ue.setContent(that.innerhtml)
			    })
			},200)
			console.log(that.innerhtml)
			
		},
		update(){
			console.log('update')
		},
		destoryed(){
			console.log('destory')
			this.ue.destory()
		},
		methods:{
			pushHtml(html){
				 //this.ue.ready(function(){
			    	this.ue.setContent(html)
			    	this.ue.execCommand( 'removeformat', 'font-size');

			    //})
			},
			expendHandler(){
				var that = this
				// ueditor 扩展
				UE.registerUI("上传图片",function(editor,uiName){
				    

				    editor.registerCommand(uiName,{

				        //执行命令通用接口:
				        execCommand: function() {

				            $("#ueditorUpload").click();

				            $("#ueditorUpload").change(function(){

				                //图片上传获取签名
				                var cos = new COS({
				                    getAuthorization: function(options,callback){

				                        $.ajax({
				                            type:'post',
				                            url:that.Global.router + "/upload/getUploadImgSign",
				                            data:{filePath:"/" + options.Key},
				                            success(res){
				                            	if(res.code == "0000"){
					                                callback(res.result.sign);
					                            }else{
					                                jumper('获取签名失败:'+res.result.message)
					                            }
				                            },
				                            error(){
				                                
				                            }
				                        })
				                
				                    }
				                })

				                var bucketName = 'boss-1256403611';
				                var regionName = 'ap-beijing';
				                var fileName = this.files[0].name;
				                var file = this.files[0];
				                var startUploadImg = function(){
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

				                    console.log(bucketName,regionName,filePath);
				                    console.log(fileName)

				                    cos.putObject({
				                        Bucket: bucketName,
				                        Region: regionName,
				                        Key: filePath,
				                        Body:file,
				                        onProgress: function (info) {
				                            //console.log(info)
				                        }
				                    },function(err,data){
				                        console.log(err,data);

				                        if (err && err.error) {
				                            jumper('文件上传失败' + err.error.Message);
				                        } else if (err) {
				                            jumper('文件上传失败' + err);
				                        } else{

				                            if (data.statusCode == 200) {
				                                var visitUrlPrefix = 'http://boss-1256403611.picbj.myqcloud.com/';
				                                var finalPath = visitUrlPrefix + filePath;
				                                console.log(finalPath)

				                                that.ue.execCommand('insertHtml', '<img style="display: block;width:100%" src="'+ finalPath +'!default" />');
				                                $("#ueditorUpload").remove();
				                                $(".ueditorWrap").append('<input type="file" id="ueditorUpload" style="display: none">')

				                            }
				                        }

				                    });
				                }
				                startUploadImg()
				            });



				        }
				    })

				    //创建一个button
				    var btn = new UE.ui.Button({
				        //按钮的名字
				        name: uiName,
				        //提示
				        title: uiName,
				        //添加额外样式，指定icon图标，这里默认使用一个重复的icon
				        cssRules: 'background-position:-380px 0px;',
				        //点击时执行的命令
				        onclick: function() {
				            //这里可以不用执行命令,做你自己的操作也可
				            editor.execCommand(uiName);
				        }
				    });
				    //当点到编辑内容上时，按钮要做的状态反射
				    editor.addListener('selectionchange', function() {
				        var state = editor.queryCommandState(uiName);
				        if (state == -1) {
				            btn.setDisabled(true);
				            btn.setChecked(false);
				        } else {
				            btn.setDisabled(false);
				            btn.setChecked(state);
				        }
				    });
				    //因为你是添加button,所以需要返回这个button
				    return btn;


				})
			}
		}
	}


</script>


<style>

</style>