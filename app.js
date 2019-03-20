const express = require('express');
const sha1 = require('sha1');
const app = express();
//配置接口信息，验证服务器的有效性

app.use( (req, res) => {     //这里使用中间件接受所有请求和地址
  console.log(req.query);    //这里打印微信服务器发送过来的请求参数

  //这是微信发过来的请求参数
  // { signature: 'd0757da7d8702185c8a47220ecd606fdff350a4b',  这一项是加密签名
  // echostr: '6005791357281499903',   这是微信后台生成的随机字符串，每次都不一样
  // timestamp: '1552994983',      微信后台发送的时间戳 
  // nonce: '2050104182' }    微信后台生成的随机数字

  //验证消息的确来自微信服务器
  const {signature,echostr,timestamp,nonce} = req.query;
  const token = 'wechatwechat';    //定义在接口配置信息里的token
  const sortArr = [token,timestamp,nonce].sort();
  console.log(sortArr);
  
  const sha1Str = sha1(sortArr.join(''));
  console.log(sha1Str);     //返回加密后的字符串

  if(sha1Str === signature) {
    //说明消息来自微信服务器
    res.end(echostr)
  }else {
    res.end('error')
  }
});
app.listen(3000,err=>{
  if(!err) console.log('路由连接成功');
  else console.log('服务器连接失败');
});