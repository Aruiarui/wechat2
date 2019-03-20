//封装中间件函数
const sha1 = require('sha1');
const template = require('./template');
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
      console.log(userData)
      
      //实现自动回复
      let options = {
        toUserName: userData.FromUserName,
        fromUserName: userData.ToUserName,
        createTime: Date.now(),
        type: 'text',
        content: '今天天气不错，你要请我吃饭吗？'  //这里是将值给后面的options
      }
       //这里是除去定义的几种回复，其他时间回复这个
      if(userData.Content === '1') {
        options.content = '小猪佩奇，我配你';
        //indexof方法，检测字符串中是否包含指定的内容，包含返回值为 0，不包含返回值为 -1.
      }else if (userData.Content && userData.Content.indexOf('2') !== -1) {
        options.content = '生活很糟糕，\n但我很可爱';
      } 
      if (userData.MsgType === 'image') {
        //这里缺少MediaId，所以简单按接收普通消息处理，将用户发过来的图片继续发过去
        options.mediaId = userData.MediaId;
        options.type = 'image';
      }
      if (userData.MsgType === 'voice') {
        //这里缺少MediaId，所以简单按接收普通消息处理，将用户发过来的语音继续发过去
        options.mediaId = userData.MediaId;
        options.type = 'voice';
      }
      if (userData.MsgType === 'video') {
        //这里缺少MediaId，所以简单按接收普通消息处理，将用户发过来的语音继续发过去
        options.mediaId = userData.MediaId;
        options.type = 'video';
      }

      const replyMessage = template(options);
      console.log(replyMessage)
      //返回响应  官方规定必须返回xml数据结构，在官方文档被动回复用户消息里
      res.send(replyMessage)
    }else {
      res.end('error')
    }
  }
}
