//获取access_token模块
const rp = require('request-promise-native');
const { writeFile, readFile } = require('fs')
//首先发送请求获取access_token，来判断是否过期或是否存在
//定义这个函数是为了下面的复用
async function getAccessToken() {
  const appid = 'wx99e8a26e628e6539';
  const appsecret = '37e7e20bd4f1682722779e92123a248f';
  //定义请求地址
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
  //发送请求，但是这是在js中发请求，需要借助包来发送ajax请求
  const result = await rp({ method: 'GET', url, json: true })
  //设置过期时间,提前5分钟刷新
  result.expires_in = Date.now() + 7200000 - 300000;
  //保存下来获取的内容，保存为一个文件,只能保存字符串类型
  writeFile('./accessToken.txt', JSON.stringify(result), (err) => {
    if (!err) console.log('文件保存成功');
    else console.log('err')
  })
  return result;
}

//这个函数是最终要调用的
//最终获取access_token
module.exports = function fetchAccessToken() {
  //一开始，先获取文件，来判断文件是否存在在进行后续操作
  return new Promise((resolve,reject) => {
    //要在外面拿到异步函数的数据，所以要用promise
    readFile('./accessToken.txt', (err, data) => { 
      if(!err) {
        //可以获取到，就是文件存在
        resolve(JSON.parse(data.toString()));
      }else {
        //文件不存在
        reject(err);
      }
    }) 
  })
    .then(res => {
      if(res.expires_in < Date.now()) {
          //这里如果命中，那就是文件已经过期了，所以在重新调用
          //这里return出来的是promise对象，内部有access_token
        return getAccessToken();
      }else {
        //命中这里则是文件存在且没有过期，直接返回
        //这里直接return出access_token
        return res;
      }
    })
    .catch(err => {
      //命中这里则是有错误，直接调用就可以了
      return getAccessToken();
    })
}

// (async()=>{
//   const result = await fetchAccessToken();
//   console.log(result)
// })()  调用立即可执行函数运行这个页面，检查问题