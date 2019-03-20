const express = require('express');
const sha1 = require('sha1');
const { parseString } = require('xml2js');
const app = express();


//第一次提交的内容是为了让微信验证开发者服务器是有效的，也让开发者验证消息是否来源于微信服务器的.只有做完这两步，保证都没有问题，才能做接下来的工作
//第二次提交的内容是连接上测试公众号，模拟用户发送消息，实现自动回复功能
app.use(async (req, res) => {    
  console.log(req.query);    //这里打印微信服务器发送过来的请求参数
  //这是微信发过来的请求参数
  // { signature: 'd0757da7d8702185c8a47220ecd606fdff350a4b',  这一项是加密签名
  // echostr: '6005791357281499903',   这是微信后台生成的随机字符串，每次都不一样
  // timestamp: '1552994983',      微信后台发送的时间戳 
  // nonce: '2050104182' }    微信后台生成的随机数字
  //验证消息的确来自微信服务器
  const {signature, echostr, timestamp, nonce} = req.query;
  const token = 'wechatwechat';    //定义在接口配置信息里的token
  const sortArr = [token, timestamp, nonce].sort();
  // console.log(sortArr);
  const sha1Str = sha1(sortArr.join(''));
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
    const xmlData = await new Promise((resolve, reject) => {
      let xmlData = '';
      req.on('data', data =>{
        //console.log(data.toString()); //将Buffer数据改为可视字符串
        xmlData += data.toString();
      //这是终端返回的用户输入的信息 xml数据
      //<xml><ToUserName><![CDATA[gh_69cd0426f988]]></ToUserName>   开发者测试的微信号id  
      // <FromUserName><![CDATA[owNFj1u0affezBC1tL1bU9VQdxMY]]></FromUserName>    用户的openid
      // <CreateTime>1553005316</CreateTime>    发送消息的时间戳
      // <MsgType><![CDATA[text]]></MsgType>    发送消息的类型
      // <Content><![CDATA[234]]></Content>     发送的消息的具体内容
      // <MsgId>22233692407839319</MsgId>       发送消息的id，默认保留3天  通过这条id可以找到当前的消息数据，但是一般不用这个
      // </xml>
      })
      //这里只看date事件不能确定是否成功，所以通过链式调用的方式还可以绑定一个事件
      .on('end',() => {
        //已验证可以触发这个事件，所以说明数据接收完毕，调用resolve方法
        //console.log(xmlData);
        resolve(xmlData);
      })
    })
    //trim方法调用可以去除字符串首尾的空格，这里trim会对xmlData数据首尾两端去空格。然后在将数据转化为js对象
    let jsData = null;
    //调用userString方法
    parseString(xmlData, {trim: true}, (err, result) => {
      if(!err) {
        jsData = result;   
      }else {
        jsData = {};
      }
    })
    const {xml} = jsData;
    let userData = {};
    //for in 遍历属性名
    for (let key in xml) {
      const value = xml[key];
      userData[key] = value[0];  //去掉数组
    //这是去掉数组打印出来的内容
    // { ToUserName: 'gh_69cd0426f988',
    //   FromUserName: 'owNFj1u0affezBC1tL1bU9VQdxMY',
    //   CreateTime: '1553012016',
    //   MsgType: 'text',
    //   Content: '222',
    //   MsgId: '22233783182899494' }
    }
    console.log(userData);
    //实现自动回复
    let replyMes = '今天天气不错，你要请我吃饭吗？'; //这里是出去定义的几种回复，其他时间回复这个
    if(userData.Content === '1') {
      replyMes = '小猪佩奇，我配你';
      //indexof方法，检测字符串中是否包含指定的内容，包含返回值为 0，不包含返回值为 -1.
    }else if (userData.Content.indexOf('2') !== -1) {
      replyMes = '生活很糟糕，\n但我很可爱';
    }
    let replyMessage = `<xml>
      <ToUserName><![CDATA[${userData.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${replyMes}]]></Content> 
    </xml>`
    //返回响应  官方规定必须返回xml数据结构，在官方文档被动回复用户消息里
    res.send(replyMessage)
  }else {
    res.end('error')
  }
});
app.listen(3000,err=>{
  if(!err) console.log('路由连接成功');
  else console.log('服务器连接失败');
});