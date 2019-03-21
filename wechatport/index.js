//获取access_token模块
const rq = require('request-promise-native');
const {writeFile} = require('fs')
//首先发送请求获取access_token，来判断是否过期或是否存在
async function getAccessToken() {
  const appid = 'wx99e8a26e628e6539';
  const appsecret = '37e7e20bd4f1682722779e92123a248f';
  //定义请求地址
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
  //发送请求，但是这是在js中发请求，需要借助包来发送ajax请求
  const result = await rq({method:'GET',url, json:true})
  //设置过期时间,提前5分钟刷新
  result.expires_in = Date.now() + 7200000 - 300000;
  //保存下来获取的内容，保存为一个文件,只能保存字符串类型
  writeFile('./accessToken.txt',JSON.stringify(result),(err)=> {
    if(!err) console.log('文件保存成功');
    else console.log('err')
  })
  return result;
}
getAccessToken()