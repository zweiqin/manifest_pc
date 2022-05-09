export function getSum(arr) {
    //求和
    arr=arr.filter(v=>v!=null)
    let sum = [].concat(...arr).reduce((acc, val) => Number(acc) + Number(val), 0);
    console.log('sum',sum,arr);
    if(sum&&sum%1!=0){
        //小数保持2位
        // return (sum).toFixed(2);
        return (sum).toFixed(3).slice(0,-1)
    }else{
        //整数
        return sum
    }
}
export function Fixed(sum) {
    sum = Number(sum);
    if(sum&&sum%1!=0){
    //小数保持2位
    return (sum).toFixed(3).slice(0,-1)%1?(sum).toFixed(3).slice(0,-1):Math.round(sum)
        // return (parseInt(sum * 100) / 100).toFixed(2);
    }else{
    //整数
    return sum
    }
}
//去重
export function filterData(resources,key){
    var temp = {};
     resources = resources.reduce((prev, curv) => {
         // 如果临时对象中有这个key，什么都不做
         if (temp[curv[key]]) {
         }
         // 如果临时对象没有就把这个key加进去，同时把当前的这个对象加入到prev中
         else {
             temp[curv[key]] = true;
             prev.push(curv);
         }
         return prev
     }, []);
    console.log("去重结果", resources);
    return resources;
}
