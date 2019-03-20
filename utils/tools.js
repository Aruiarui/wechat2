//模块
//因为有多个模块，所以用对象管理
const { parseString } = require('xml2js');

module.exports = {
  //获取用户数据
  getUserDataAsync(req) {
    return new Promise((resolve, reject) => {
      let xmlData = '';
      req.on('data', data =>{
        //console.log(data.toString()); //将Buffer数据改为可视字符串
        xmlData += data.toString();
      })
      //这里只看date事件不能确定是否成功，所以通过链式调用的方式还可以绑定一个事件
      .on('end',() => {
        //已验证可以触发这个事件，所以说明数据接收完毕，调用resolve方法
        //console.log(xmlData);
        resolve(xmlData);
      })
    })
  },

  //解析拿到的xml数据为js对象
  parseXmlData(xmlData) {
    let jsData = null;
    //调用userString方法
    parseString(xmlData, {trim: true}, (err, result) => {
      if(!err) {
        jsData = result;   
      }else {
        jsData = {};
      }
    })
    return jsData;
  },

  //格式化jsData
  formatjsData(jsData) {
    const {xml} = jsData;
    let userData = {};
    //for in 遍历属性名
    for (let key in xml) {
      const value = xml[key];
      userData[key] = value[0];  //去掉数组
    }
    return userData;
  }
} 