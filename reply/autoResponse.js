//这个模块自动回复的模块化，是定义用户发过来的消息，响应返回什么类型数据
//实现自动回复

module.exports = (userData) => {
  let options = {
    toUserName: userData.FromUserName,
    fromUserName: userData.ToUserName,
    createTime: Date.now(),
    type: 'text',
  }
  //这里说明用户发送的是普通消息
  if(userData.MsgType === 'text'){
    if(userData.Content === '1') {
      options.content = '小猪佩奇，我配你';
    }else if (userData.Content && userData.Content.indexOf('2') !== -1) {
      options.content = '生活很糟糕，\n但我很可爱';
    }else {
      options.content = '今天天气不错，你要请我吃饭吗？' ;
    }
  }else if(userData.MsgType === 'voice') {
    //这里说明用户发送的是语音消息，Recognition语音识别结果，UTF8编码
    options.content = userData.Recognition;
  }else if(userData.MsgType === 'location') {
    //这里说明用户发送的是地理位置消息
    options.content = `地理位置纬度:${userData.Location_X} \n地理位置经度:${userData.Location_Y} \n地图缩放大小:${userData.Scale} \n地理位置信息:${userData.Label}`
  }else if(userData.MsgType === 'event') {
    //用户关注事件
    if(userData.Event === 'subscribe') {
      options.content = '等了好久终于等到今天，\n梦了好久终于把梦实现。\n感谢你关注我的公众号，\n祝你年年有钱岁岁有我。'
      if(userData.EventKey) {
        options.content = '感谢扫码关注公众号，你可真是优秀呢。'
      }
    }else if(userData.Event === 'unsubscribe') {
      用户取关事件
      console.log('用户取消了关注');
      options.content = '';
    }else if(userData.Event === 'CLICK') {
      //用户点击了菜单
      options.content = '你想了解什么具体内容呢？可以帮你解答的哦。'
    }
  }
  return options
}
