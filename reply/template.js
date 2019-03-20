//这里定义回复用户的6种模板模块

module.exports = (options) => {
  let replyMessage = `<xml>
      <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
      <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
      <CreateTime>${options.createTime}</CreateTime>
      <MsgType><![CDATA[${options.type}]]></MsgType>`;
 
  if (options.type === 'text') {
    replyMessage += `<Content><![CDATA[${options.content}]]></Content>`;
  } else if (options.type === 'image') {
    replyMessage += `<Image>
        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
      </Image>`;
  } else if (options.type === 'voice') {
    replyMessage += `<Voice>
    <MediaId><![CDATA[${options.mediaId}]]></MediaId>
  </Voice>`
  } else if (options.type === 'video') {
    replyMessage += `<Video>
    <MediaId><![CDATA[${options.mediaId}]]></MediaId>
    <Title><![CDATA[${options.title}]]></Title>
    <Description><![CDATA[${options.description}]]></Description>
  </Video>`
  } else if (options.type === 'music') {
    replyMessage += `<Music>
    <Title><![CDATA[${options.title}]]></Title>
    <Description><![CDATA[${options.description}]]></Description>
    <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>    //音乐链接地址
    <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>     //高音质链接地址
    <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
  </Music>`
  } else if (options.type === 'news') {
    replyMessage += `<ArticleCount>${options.content.length}</ArticleCount>
      <Articles>`;
      //reduce 方法必须传两个参数，第一个为初始值，或者计算结束后的返回值；第二个为当前元素
    replyMessage += options.content.reduce((prev, curr) => {
      return prev + `<item>
      <Title><![CDATA[${curr.title}]]></Title>
      <Description><![CDATA[${curr.description}]]></Description>
      <PicUrl><![CDATA[${curr.picUrl}]]></PicUrl>
      <Url><![CDATA[${curr.url}]]></Url>
    </item>`;
    }, '')
    
    replyMessage += `</Articles>`;
  }
  
  replyMessage += '</xml>';
  
  return replyMessage;
}