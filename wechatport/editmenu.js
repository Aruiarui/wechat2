//实现微信公众号的各个接口，建立菜单文件
const rp = require('request-promise-native');
const fetchAccessToken = require('./accessToken');

const menu = {
  "button": [
    {
      "type": "click",
      "name": "主页🌈",
      "key": "main"
    },
    {
      "name": "网页⚡",
      "sub_button": [
        {
          "type": "view",  //view表示网页类型，click表示点击类型，miniprogram表示小程序类型      
          "name": "知乎",
          "url": "https://www.zhihu.com/"
        },
        {
          "type": "view",
          "name": "百度",
          "url": "https://www.baidu.com/"
        },
        {
          "type": "scancode_waitmsg",
          "name": "扫码带提示",
          "key": "rselfmenu_0_0"
        },
        {
          "type": "scancode_push",
          "name": "扫码推事件",
          "key": "rselfmenu_0_1",
        }
      ]
    },
    {
      "name": "图片🌺",
      "sub_button": [
        {
          "type": "pic_sysphoto",
          "name": "系统拍照发图",
          "key": "rselfmenu_1_0",
        },
        {
          "type": "pic_photo_or_album",
          "name": "拍照或者相册发图",
          "key": "rselfmenu_1_1",
        },
        {
          "type": "pic_weixin",
          "name": "微信相册发图",
          "key": "rselfmenu_1_2",
        },
        {
          "name": "发送位置", 
          "type": "location_select", 
          "key": "rselfmenu_2_0"
        }
      ]
    }
  ]
}
//创建新菜单前必须将旧菜单删掉
async function createMenu() {
  // 获取access_token
  //因为fetchAccessToken()返回的是promise对象，所以要用await
  const { access_token } = await fetchAccessToken();
  // 定义请求地址
  const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
  // 发送请求
  const result = await rp({method: 'POST', url, json: true, body: menu});
  
  return result;
}

async function deleteMenu() {
  const { access_token } = await fetchAccessToken();
  // 定义请求地址
  const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`;
  // 发送请求
  const result = await rp({method: 'GET', url, json: true});
  
  return result;
} 
//这里定义立即可执行函数来验证代码正确性
(async()=>{
  const result = await deleteMenu();
  const result1 = await createMenu();
  console.log(result,result1)
})()