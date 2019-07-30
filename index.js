'use strict'
;(function(VideoPlayer) {
  var videoTypeMap = {
    ogv: 'type=\'video/ogg; codecs="theora, vorbis"\'',
    mp4: 'type=\'video/mp4; codecs="avc1.42E01E, mp4a.40.2"\'',
    mov: 'type=\'video/mp4; codecs="avc1.42E01E, mp4a.40.2"\'',
    webm: 'type=\'video/webm; codecs="vp8, vorbis"\' />'
  }

  var regExps = [
    {
      // bilibili & b23 video
      from: /<a href="(?:https?:\/\/)?(?:www\.)?(?:bilibili|b23)\.(?:tv|com)(?:\/video)?\/av(\d+).*?">bplayer<\/a>/g,
      // prettier-ignore
      to:
        '<div class="video-plugin-box bilibili embed-responsive embed-responsive-16by9">' +
            '<iframe src="//player.bilibili.com/player.html?aid=$1&cid=105486090&page=1" scrolling="no" border="0" frameborder="no" framespacing="0"></iframe>' +
        '</div>'
    },
    {
      // local video
      from: /<a href="\/(:*.*.(mp4|ogv|mov|webm))">lplayer<\/a>/g,
      // prettier-ignore
      to:
        '<div class="video-plugin-box local"  data-src="$1" data-type="video/mp4" data-codec="avc1.42E01E, mp4a.40.2">' +
            '<video class="vplayer" controls preload  autobuffer>' +
                '<source src="/$1" />' +
            '</video>' +
        '</div>'
    }
  ]

  VideoPlayer.parse = function(data, callback) {
    if (!data || !data.postData || !data.postData.content) {
      return callback(null, data)
    }

    var err = null

    try {
      for (var i = 0; i < regExps.length; i++) {
        data.postData.content = data.postData.content.replace(
          regExps[i].from,
          regExps[i].to
        )
      }
    } catch (e) {
      err = e
    }

    callback(err, data)
  }

  VideoPlayer.addScripts = function(scripts, callback) {
      //TODO 判断是否支持 HTML5 video 标签
    scripts.push('/static/html5media.min.js')
    callback(null, scripts)
  }
})(module.exports)
