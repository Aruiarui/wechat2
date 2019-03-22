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
// (async()=>{
//   const result = await deleteMenu();
//   const result1 = await createMenu();
//   console.log(result,result1)
// })()

//为用户创建标签
async function createTags(name) {
  const { access_token } = await fetchAccessToken();
  // 定义请求地址
  const url = `https://api.weixin.qq.com/cgi-bin/tags/create?access_token=${access_token}`;
  // 发送请求
  return await rp({method: 'POST', url, json: true, body:{tag: {name}}});
  return 
} 

// 获取标签下粉丝列表
async function getListFans(tagid, next_openid='') {
  const { access_token } = await fetchAccessToken();
  // 定义请求地址
  const url = `https://api.weixin.qq.com/cgi-bin/user/tag/get?access_token=${access_token}`;
  // 发送请求  tagid是前面的返回值； next_openid是拉取列表的最后一个用户的OPENID
  return await rp({method: 'POST', url, json: true, body:{tagid,   next_openid}});
 
} 

// 批量为用户打标签     openid_list是粉丝的用户列表id   tagid标签id 
async function batchTags(openid_list, tagid) {
  const { access_token } = await fetchAccessToken();
  // 定义请求地址
  const url = `https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging?access_token=${access_token}`;
  // 发送请求  tagid是前面的返回值；next_openid是拉取列表的最后一个用户的OPENID
  return await rp({method: 'POST', url, json: true, body:{openid_list , tagid }});
  
} 



// 获取用户身上的标签列表 
async function batchTags(openid) {
  const { access_token } = await fetchAccessToken();
  // 定义请求地址
  const url = `https://api.weixin.qq.com/cgi-bin/tags/getidlist?access_token=${access_token}`;
  // 发送请求  
  return await rp({method: 'POST', url, json: true, body:{openid }});
} 
 
// (async()=>{
//   const result = await createTags('family3');
//   console.log(result);

//   const result1 = await batchTags([
//     'owNFj1u0affezBC1tL1bU9VQdxMY',
//     'owNFj1inVKfeIojeVLDP_k-Bgy4s',
//     'owNFj1peYg9yFD381RkeVTtD8xuY'
//   ], result.tag.id);
//   const result2 = await getListFans(result.tag.id);
//   const result3 = await batchTags([
//     'owNFj1inVKfeIojeVLDP_k-Bgy4s',
//     'owNFj1peYg9yFD381RkeVTtD8xuY'
//   ]);
//   console.log(result1,result2,result3)
// })()