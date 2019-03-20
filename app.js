const express = require('express');
const reply = require('./reply/index')

const app = express();

app.use(reply());

app.listen(3000,err=>{
  if(!err) console.log('路由连接成功');
  else console.log('服务器连接失败');
});