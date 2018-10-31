<template>

	<div class="jumperWrap"  v-show='isShow'>
		<div class="jumperPos chooseTemplateBox">
			<div class="jumperTitle clearfix">
				<h2 class="left">添加内容</h2>
				<img class="right" src="../../images/close-icon.png" alt="" @click='hideParent'>
			</div>
			<div class="jumperContent outer-box">
				<div class="inner-box">
					<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
						<thead>
							<tr>
								<th>模板名称</th>
								<th>标题</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for='item in pageArr' :key='item.templateId'>
								<td>{{ item.templateName }}</td>
								<td>{{ item.title }}</td>
								<td>
									<button @click='chooseThis(item.templateId,item.templateName)'>选择</button>
								</td>
							</tr>

							<tr v-if='pageArr.length == 0'>
								<td colspan="10">暂无数据...</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		
	</div>


</template>


<script>


	export default{
		name:'chooseTemplate',
		data(){
			return {
				id:0,
				pageArr:[]
				
			}
		},
		props:['chooseTemplateShow'],
		computed:{
			isShow(){
				return this.chooseTemplateShow
			}
		},
		mounted(){

			this.initList()
			
			
		},
		methods:{
			initList(){
				var that = this
				$.ajax({
					type:'post',
					url:that.Global.router + "/redpacket/template/available",
					xhrFields:{withCredentials:true},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							that.pageArr.splice(0,that.pageArr.length)

							for(var i=0; i<res.result.length;i++){
								that.pageArr.push(res.result[i])
							}
						}
					},
					error(){}
				})
			},
			chooseThis(id,name){
				console.log(id,name)
				this.$parent.templateObj.templateId = id;
				this.$parent.templateObj.templateName = name;
				this.$parent.chooseTemplateShow = false
			},
			hideParent(){
				this.$parent.chooseTemplateShow = false
			}
		}
	}



</script>


<style>



</style>