<template>
	
	<div class="chanceInfoWrap">
		
		<h3 class="pageTitle">
			<span>项目介绍</span>
			<em>Product Introduction</em>
		</h3>
		

		<div class="pageFormBox">
			<div class="pageForm">
				<div class="eachPageForm">
					<label for="">项目介绍上传</label>
					<div class="richText" ref='editorWrap'>
						<Ueditor :innerhtml='pageText' ref='editor'></Ueditor>
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

	import Ueditor from '../../common/Ueditor'

	export default{
		name:"ChanceIntro",
		data(){
			return {
				pageText:''
			}
		},
		mounted(){
			this.initPage()
			
		},
		components:{
			Ueditor
		},
		methods:{
			initPage(){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + '/business/editBusinessDocument',
					data:{type:1},
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)

						if(res.code === "0000"){

							that.pageText = res.result.document

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
			savePage(){
				console.log(this.$refs.editor.outerhtml)
				var that = this

				let documentHtml = that.$refs.editor.outerhtml;

				//console.log(documentHtml)

				$.ajax({
					type:'post',
					url:that.Global.router + '/business/addBusinessDocument',
					data:{
						document:documentHtml
					},
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							that.$alert('保存成功','提示',{confirmButtonText: '确定'})
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
		}
	}

</script>


<style>



</style>