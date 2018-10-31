<template>
	
	<div class="ProgramNavWrap center clearfix">
		<div class="pageNav left">
			<div class="routerUrl">
				<router-link to='/index'><img src="../../images/back-icon.png" alt="">返回首页</router-link>
			</div>
			<ul class="pageNavList">
				<li>
					<router-link  :class='[bossNav == 1 ? "active" : ""]' to='/boss/headlineList'><i class="iconfont">&#xe703;</i>头条列表</router-link>
				</li>
				<!-- <li>
					<router-link to='/boss/chargeManage'><i class="iconfont">&#xe69b;</i>佣金管理</router-link>
				</li> -->
				
				
			</ul>

		</div>
		<div class="pageContent left">
			<router-view></router-view>
		</div>


	</div>

</template>


<script>

	import '../../css/aside.css'

	export default{
		name:'bossNavPage',
		data(){
			return{
				bossNav:1
			}
		},
		props:[],
		mounted(){

			
		},
		methods:{
			
		}
	}

</script>


<style>

</style>