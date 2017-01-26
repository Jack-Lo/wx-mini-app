var download = require('download-git-repo')

function Processing (cnt) {
  var _t = this
  _t.cnt = cnt
  _t.timer = null
  _t.stream = process.stderr

  return _t
}

Processing.prototype = {
  start () {
    var _t = this
    var stream = _t.stream
    var str = '...'
    var maxLen = str.length
    var len = 0
    var cnt = _t.cnt

    clearInterval(_t.timer)

    stream.write(cnt + '\n\n')

    var timer = _t.timer = setInterval(() => {
      if (len + 1 > maxLen) {
        len = 1
      } else {
        len++
      }

      var s = cnt + str.substr(0, len) + '\n\n'
      stream.cursorTo(0)
      stream.moveCursor(0, -2)
      stream.clearLine(0)
      stream.write(s)
    }, 300)
  },
  stop () {
    var _t = this

    clearInterval(_t.timer)
  }
}

module.exports = Processing