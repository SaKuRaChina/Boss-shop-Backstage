<template>
	
	<div class="chanceInfoWrap">
		
		<h3 class="pageTitle">
			<span>产品</span>
			<em>Product</em>
			<a href='javascript:void(0)' @click='addOrder'><i class="el-icon-plus"></i>添加产品</a>
		</h3>
		

		<div class="pageTableBox">
			<table class="pageTable" border='0' cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>标题</th>
						<th>缩略图</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='item in pageArr'>
						<td>{{ item.title }}</td>
						<td class="bgTd">
							<img :src="item.surfaceUrl + '!default'">
						</td>
						<td>
							<button type="button" @click='editItem(item.id)'>编辑</button>
							<button type="button" @click='delItem(item.id)'>删除</button>
						</td>
					</tr>
					<tr v-if='pageArr.length == 0'>
						<td colspan='10'>暂无数据...</td>
					</tr>
				</tbody>
			</table>
		</div>
				
		<ProductManage :productManageShow='productManageShow' :addEdit='addEdit' ref='productManage'></ProductManage>

	</div>

</template>


<script>

	
	import ProductManage from '../../jumper/productManage'

	export default{
		name:"ChanceExample",
		data(){
			return {
				pageArr:[],
				productManageShow:false,
				addEdit:true
			}
		},
		mounted(){
			this.initPage()

		},
		components:{
			ProductManage
		},
		methods:{
			initPage(){
				var that = this

				$.ajax({
					type:'post',
					url:that.Global.router + '/product/selectProductList',
					xhrFields:{withCredentials: true},
					success(res){
						console.log(res)

						if(res.code === "0000"){
							that.pageArr = [];

							for(var i=0; i<res.result.length; i++){
								that.pageArr.push(res.result[i])
							}

							//console.log(that.pageArr)

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
			addOrder(){
				var that = this

				that.productManageShow = true
				that.addEdit = true;
				that.$refs.productManage.initSpace()
				
			},
			editItem(id){
				console.log(id)
				this.productManageShow = true
				this.addEdit = false;
				this.$refs.productManage.initEdit(id)
			},
			delItem(id){
				console.log(id)
				var that = this

				that.$confirm("确定删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(()=>{

					$.ajax({
						type:'post',
						url:that.Global.router + "/product/deleteProduct",
						data:{id:id},
						xhrFields:{withCredentials:true},
						success(res){
							console.log(res)

							if(res.code === "0000"){
								that.$alert('删除成功', '提示', {confirmButtonText: '确定'});
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
				
			}
		}
	}

</script>


<style>



</style>