var shareInfo = (function(mod) {
  function identify(URL) {
    requestUrl=URL.match("http://www.nbd.com.cn/corp/NBD/js/m.nbd.com.cn")?"http://m.nbd.com.cn/get_wechat_signature":"http://www.nbd.com.cn/get_wechat_signature";
    $.ajax({
      type:'post',
      url:requestUrl,
      data:{share_url:URL},
      success:function(res) {
        wx.config({
          debug: false,
          appId: res.data.appid,
          timestamp: res.data.timestamp,
          nonceStr: res.data.noncestr,
          signature: res.data.signature,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
        });
      }
    });
  }
  /**
   * [init description]
   * @author mao
   * @version 1
   * @date    2017-06-06
   * @param   {object}   options 穿入参数
   * img, title, desc, shareURL
   */
  mod.init = function(options) {
    //认证
    identify(options.shareURL);

    wx.ready(function(){
      var imageurl = options.img,
          title = options.title,
          desc = options.desc,
          link = options.shareURL;

      wx.onMenuShareTimeline({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imageurl,
        success: function () {},
        cancel: function () {}
      });

      wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imageurl,
        success: function () {},
        cancel: function () {}
      });

      wx.onMenuShareQQ({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imageurl,
        success: function () {},
        cancel: function () {}
      });

      wx.onMenuShareQZone({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imageurl,
        success: function () {},
        cancel: function () {}
      });
    });

    wx.error(function(res){
      console.log(res);
    });

  }

  return mod;
})(shareInfo || {})