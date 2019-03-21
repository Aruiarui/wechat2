//封装中间件函数
const sha1 = require('sha1');
const template = require('./template');
const autoResponse = require('./autoResponse');
const { getUserDataAsync, parseXmlData, formatjsData } = require('../utils/tools');

module.exports = () => {
  return async (req, res) => {    
    //console.log(req.query);    //这里打印微信服务器发送过来的请求参数
    //验证消息的确来自微信服务器
    const {signature, echostr, timestamp, nonce} = req.query;
    const token = 'wechatwechat';    //定义在接口配置信息里的token
    //const sortArr = [token, timestamp, nonce].sort();
    // console.log(sortArr);
    //const sha1Str = sha1(sortArr.join(''));
  
    const sha1Str = sha1([token, timestamp, nonce].sort().join(''));
  
    if(req.method === 'GET') {
      //3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
      if(sha1Str === signature) {
      //如果是get请求，说明消息来自微信服务器
        res.end(echostr);
      }else {
        res.end('error'); 
      }
    }else if(req.method === 'POST') {
      //说明消息说微信用户发过来的
      // console.log(req.body）；
      //过滤掉不是微信服务器发过来的消息
      if(sha1Str !== signature) {
        res.end('error');
        return;
      }
  
      //这里加async和await是为了拿到promise里的数据，  这样就获取到了用户发送过来的消息 
      const xmlData = await getUserDataAsync(req);   //getUserDataAsync()方法返回的是一个promise对象，必须加await才可以拿到promise对象里的值
      //trim方法调用可以去除字符串首尾的空格，这里trim会对xmlData数据首尾两端去空格。然后在将数据转化为js对象
      const jsData = parseXmlData(xmlData);
      //格式化jsData
      const userData = formatjsData(jsData);
      //自动回复的模块化，是定义用户发过来的消息，响应返回什么类型数据
      const options = autoResponse(userData);
      //这里定义回复用户的6种模板模块
      const replyMessage = template(options);
      //这里打印回复信息是为了在出错时方便检查错误
      console.log(replyMessage)
      //返回响应  官方规定必须返回xml数据结构，在官方文档被动回复用户消息里
      res.send(replyMessage)
    }else {
      res.end('error')
    }
  }
}
