
<script>

const router = "http://192.168.1.188:8081"
// const router = "http://192.168.1.177:8086"
// const router = "http://192.168.1.157:8091"
// const router = "http://192.168.1.158:8090"




//获取接口报错提示
let failDeal = function(){
	console.log('fail')
    this.$alert('请求出错','提示',{confirmButtonText: '确定'})
}




//深复制对象
let cloneObj = function (obj){
    var newObj = {};
    if(obj instanceof Array){
        newObj = []
    };

    for(var key in obj){
        var val = obj[key]
        newObj[key] = typeof val === "object" ? cloneObj(val) : val
    }
    return newObj
}





export default{
	router,failDeal,cloneObj
}



</script>
