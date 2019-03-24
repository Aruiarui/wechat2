const express = require('express');
const reply = require('./reply/index')
const sha1 = require('sha1');
require("./wechatport/editmenu");
const fetchTicket= require('./wechatport/ticket')
const {url,appId} = require('./http');
const app = express();


app.set('views','views')
app.set('view engine','ejs')
app.use(express.static('images'));


app.get('/views', async(req,res) => {

  const { ticket } = await fetchTicket();
  // const url = 'http://2ba2f609.ngrok.io/views';
  const noncestr = Math.random().toString().slice(2);
  const timestamp = Math.round(Date.now() / 1000);
  
  const arr = [
    `jsapi_ticket=${ticket}`,
    `url=${url}/views`,
    `noncestr=${noncestr}`,
    `timestamp=${timestamp}`
  ];
  
  const signature = sha1(arr.sort().join('&'));
  
  res.render('views', {noncestr, timestamp, signature, appId, url});

})

app.use(reply());

app.listen(3000,err=>{
  if(!err) console.log('路由连接成功');
  else console.log('服务器连接失败');
});