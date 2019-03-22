//获取ticket模块
const rp = require('request-promise-native');
const fetchAccessToken = require('./accessToken')
const { writeFileAsync, readFileAsync } = require('../utils/tools')
//定义这个函数是为了下面的复用
async function getTicket() {
  const {access_token} = await fetchAccessToken();
  //定义请求地址
  const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
  //发送请求，但是这是在js中发请求，需要借助包来发送ajax请求
  const result = await rp({ method: 'GET', url, json: true })
  //设置过期时间,提前5分钟刷新
  result.expires_in = Date.now() + 7200000 - 300000;
  const ticket = {
    ticket:result.ticket,
    expires_in:result.expires_in
  }
  //保存下来获取的内容，保存为一个文件,只能保存字符串类型
  await writeFileAsync('./ticket.txt',ticket);
  return ticket;
}

//这个函数是最终要调用的
//最终获取access_token
function fetchTicket() {
  //一开始，先获取文件，来判断文件是否存在在进行后续操作
  return readFileAsync('./ticket.txt')

    .then(res => {
      if(res.expires_in < Date.now()) {
          //这里如果命中，那就是文件已经过期了，所以在重新调用
          //这里return出来的是promise对象，内部有access_token
        return getTicket();
      }else {
        //命中这里则是文件存在且没有过期，直接返回
        //这里直接return出access_token
        return res;
      }
    })
    .catch(err => {
      //命中这里则是有错误，直接调用就可以了
      return getTicket();
    })
}
module.exports = fetchTicket;
// (async()=>{
//   const result = await getTicket();
//   console.log(result)
// })()  //调用立即可执行函数运行这个页面，检查问题