<template>
	
	<div class='chanceCenterWrap' v-cloak>
		<h3 class="pageTitle">
			<span>产品中心</span>
			<em>Product Center</em>
		</h3>
		
		<div class="pageTableBox">
			<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>产品类别</th>
						<th>产品名称</th>
						<th>状态</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='(item,index) in pageArr'>
						<td>{{ item.typeName }}</td>
						<td>{{ item.productName }}</td>
						<td :class='{"yellowTd":item.isAudit == 1,"cyanTd":item.isAudit == 2,"redTd":item.isAudit == 3}'>{{ getState(item.isAudit) }}</td>
						<td>
							<button type="button" @click='checkThis(item.id)' v-if='item.isAudit == 0 || item.isAudit == 1' :disabled='item.isAudit == 1'>上传审核</button>
							<button type="button" @click='rejectThis(item.comment)' v-if='item.isAudit == 3'>驳回原因</button>
						</td>
					</tr>
					
				</tbody>
			</table>
		</div>
		

		<RejectReason :rejectShow='rejectShow' :reason='reason'></RejectReason>


	</div>

</template>


<script>

	import RejectReason from '../../jumper/rejectReason'

	export default{
		name:"ChanceCenter",
		data(){
			return{
				pageArr:[],
				reason:'',
				rejectShow:false
			}
		},
		mounted(){

			this.initPage()
		},
		components:{
			RejectReason
		},
		methods:{
			initPage(){
				var that = this;
				$.ajax({
					type:'post',
					url:that.Global.router + '/product/selectProductCenter',
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)
						if(res.code === "0000"){
							that.pageArr = []
							that.pageArr.push(res.result)

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
			getState(i){
				//console.log(i)

				let audit = '';
				switch (parseInt(i)){
					case 0:
						audit = '';
						break;
					case 1:
						audit = '详情审核中';
						break
					case 2:
						audit = '在线';
						break
					case 3:
						audit = '审核驳回';
						break

				}

				return audit

			},
			checkThis(id){
				var that = this;
				console.log(id)

				that.$confirm('确定提交审核？','提示',{
					confirmButtonText:'确定',
					cancelButtomText:'取消'
				}).then(()=>{

					$.ajax({
						type:"post",
						url:that.Global.router + '/product/uploading',
						data:{id:id},
						xhrFields:{withCredentials: true},
						success(res){
							console.log(res)
							if(res.code === "0000"){
								that.$alert("提交审核成功","提示",{confirmButtonText:'确定'});
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

				}).catch(()=>{})
			},
			rejectThis(reason){
				this.reason = reason;
				this.rejectShow = true
			}

		}
	}


</script>


<style>

</style>