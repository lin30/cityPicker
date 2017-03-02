var MobileArea = function() {
  this.gearArea
  this.data
  this.index = 0
  this.value = [0, 0, 0]
    // this.column = 3
}
MobileArea.prototype = {
  init: function(params) {
    this.params = params
    this.data = params.data
    this.trigger = document.querySelector(params.trigger)
    this.keys = params.keys
    this.column = params.column
    this.type = params.type || 1
    switch (this.type) {
      case 1:
      case 2:
        break
      default:
        throw new Error('错误提示: 没有这种数据源类型')
    }
    this.bindEvent()
  },
  bindEvent: function() {
    var _self = this
      // 呼出插件
    function popupArea(e) {
      _self.gearArea = document.querySelector('.gearArea')
        // _self.gearArea.className = 'gearArea'
      _self.gearArea.innerHTML = '<div class="areaCtrl slideInUp">' +
        '<div class="areaBtnBox">' +
        '<div class="areaBtn lareaCancel">取消</div>' +
        '<div class="areaBtn lareaFinish">确定</div>' +
        '</div>' +
        '<div class="lareaRollMask">' +
        '<div class="areaRoll">' +
        '<div>' +
        '<div class="gear areaProvince" data-areatype="areaProvince"></div>' +
        '<div class="areaGrid">' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<div class="gear areaCity" data-areatype="areaCity"></div>' +
        '<div class="areaGrid">' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<div class="gear areaCounty" data-areatype="areaCounty"></div>' +
        '<div class="areaGrid">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
      document.body.appendChild(_self.gearArea)
      areaCtrlInit()
      var lareaCancel = _self.gearArea.querySelector('.lareaCancel')
      lareaCancel.addEventListener('touchstart', function(e) {
        _self.close(e)
      })
      var lareaFinish = _self.gearArea.querySelector('.lareaFinish')
      lareaFinish.addEventListener('touchstart', function(e) {
        _self.finish(e)
      })

      var areaProvince = _self.gearArea.querySelector('.areaProvince')
      var areaCity = _self.gearArea.querySelector('.areaCity')
      var areaCounty = _self.gearArea.querySelector('.areaCounty')
      if (_self.column === 2) {
        areaCounty.parentNode.style.display = 'none'
      }
      if (_self.column === 1) {
        areaCounty.parentNode.style.display = 'none'
        areaCity.parentNode.style.display = 'none'
      }
      areaProvince.addEventListener('touchstart', gearTouchStart)
      areaProvince.addEventListener('touchmove', gearTouchMove)
      areaProvince.addEventListener('touchend', gearTouchEnd)
      areaCity.addEventListener('touchstart', gearTouchStart)
      areaCity.addEventListener('touchmove', gearTouchMove)
      areaCity.addEventListener('touchend', gearTouchEnd)
      areaCounty.addEventListener('touchstart', gearTouchStart)
      areaCounty.addEventListener('touchmove', gearTouchMove)
      areaCounty.addEventListener('touchend', gearTouchEnd)
    }
    // 初始化插件默认值
    function areaCtrlInit() {
      _self.gearArea.querySelector('.areaProvince').setAttribute('val', _self.value[0])
      _self.gearArea.querySelector('.areaCity').setAttribute('val', _self.value[1])
      _self.gearArea.querySelector('.areaCounty').setAttribute('val', _self.value[2])

      switch (_self.type) {
        case 1:
          _self.setGearTooth(_self.data)
          break
        case 2:
          _self.setGearTooth(_self.data[0])
          break
      }
    }
    // 触摸开始
    function gearTouchStart(e) {
      e.preventDefault()
      var target = e.target
      while (true) {
        if (!target.classList.contains('gear')) {
          target = target.parentElement
        } else {
          break
        }
      }
      clearInterval(target['int_' + target.id])
      target['old_' + target.id] = e.targetTouches[0].screenY
      target['o_t_' + target.id] = (new Date()).getTime()
      var top = target.getAttribute('top')
      if (top) {
        target['o_d_' + target.id] = parseFloat(top.replace(/em/g, ''))
      } else {
        target['o_d_' + target.id] = 0
      }
      target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms'
    }
    // 手指移动
    function gearTouchMove(e) {
      e.preventDefault()
      var target = e.target
      while (true) {
        if (!target.classList.contains('gear')) {
          target = target.parentElement
        } else {
          break
        }
      }
      target['new_' + target.id] = e.targetTouches[0].screenY
      target['n_t_' + target.id] = (new Date()).getTime()
      var f = (target['new_' + target.id] - target['old_' + target.id]) * 30 / window.innerHeight
      target['pos_' + target.id] = target['o_d_' + target.id] + f
      target.style['-webkit-transform'] = 'translate3d(0,' + target['pos_' + target.id] + 'em,0)'
      target.setAttribute('top', target['pos_' + target.id] + 'em')
      if (e.targetTouches[0].screenY < 1) {
        gearTouchEnd(e)
      }
    }
    // 离开屏幕
    function gearTouchEnd(e) {
      e.preventDefault()
      var target = e.target
      while (true) {
        if (!target.classList.contains('gear')) {
          target = target.parentElement
        } else {
          break
        }
      }
      var moveDiff = target['new_' + target.id] - target['old_' + target.id]
      var flag = moveDiff / (target['n_t_' + target.id] - target['o_t_' + target.id])
      if (Math.abs(flag) <= 0.2) {
        target['spd_' + target.id] = (flag < 0 ? -0.08 : 0.08)
      } else {
        if (Math.abs(flag) <= 0.5) {
          target['spd_' + target.id] = (flag < 0 ? -0.16 : 0.16)
        } else {
          if (target['new_' + target.id] === undefined) {
            flag = 0
          }
          target['spd_' + target.id] = flag / 2
        }
      }
      if (!target['pos_' + target.id]) {
        target['pos_' + target.id] = 0
      }
      rollGear(target)
    }
    // 缓动效果
    function rollGear(target) {
      var d = 0
      var stopGear = false

      function setDuration() {
        target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms'
        stopGear = true
      }
      clearInterval(target['int_' + target.id])
      target['int_' + target.id] = setInterval(function() {
        var pos = target['pos_' + target.id]
        var speed = target['spd_' + target.id] * Math.exp(-0.03 * d)
        pos += speed
        if (Math.abs(speed) > 0.1) {} else {
          var b = Math.round(pos / 2) * 2
          pos = b
          setDuration()
        }
        if (pos > 0) {
          pos = 0
          setDuration()
        }
        var minTop = -(target.dataset.len - 1) * 2
        if (pos < minTop) {
          pos = minTop
          setDuration()
        }
        if (stopGear) {
          var gearVal = Math.abs(pos) / 2
          setGear(target, gearVal)
          clearInterval(target['int_' + target.id])
        }
        target['pos_' + target.id] = pos
        target.style['-webkit-transform'] = 'translate3d(0,' + pos + 'em,0)'
        target.setAttribute('top', pos + 'em')
        d++
      }, 30)
    }
    // 控制插件滚动后停留的值
    function setGear(target, val) {
      val = Math.round(val)
      target.setAttribute('val', val)
      switch (_self.type) {
        case 1:
          _self.setGearTooth(_self.data)
          break
        case 2:
          switch (target.dataset['areatype']) {
            case 'areaProvince':
              _self.setGearTooth(_self.data[0])
              break
            case 'areaCity':
              var ref = target.childNodes[val].getAttribute('ref')
              var childData = []
              var nextData = _self.data[2]
              for (var i in nextData) {
                if (i === ref) {
                  childData = nextData[i]
                  break
                }
              }
              _self.index = 2
              _self.setGearTooth(childData)
              break
          }
      }
    }
    popupArea()
  },
  // 重置节点个数
  setGearTooth: function(data) {
    var _self = this
    var item = data || []
    var l = item.length
    var gearChild = _self.gearArea.querySelectorAll('.gear')
    var gearVal = gearChild[_self.index].getAttribute('val')
    var maxVal = l - 1
    if (gearVal > maxVal) {
      gearVal = maxVal
    }
    gearChild[_self.index].setAttribute('data-len', l)
    if (l > 0) {
      var id = item[gearVal][this.keys['id']]
      var childData
      switch (_self.type) {
        case 1:
          childData = item[gearVal].child
          break
        case 2:
          var nextData = _self.data[_self.index + 1]
          for (var i in nextData) {
            if (i === id) {
              childData = nextData[i]
              break
            }
          }
          break
      }
      var itemStr = ''
      for (let i = 0; i < l; i++) {
        itemStr += "<div class='tooth' ref='" + item[i][this.keys['id']]
        itemStr += "'>" + item[i][this.keys['name']] + '</div>'
      }
      gearChild[_self.index].innerHTML = itemStr
      gearChild[_self.index].style['-webkit-transform'] = 'translate3d(0,' + (-gearVal * 2) + 'em,0)'
      gearChild[_self.index].setAttribute('top', -gearVal * 2 + 'em')
      gearChild[_self.index].setAttribute('val', gearVal)
      _self.index++
      if (_self.index > 2) {
        _self.index = 0
        return
      }
      _self.setGearTooth(childData)
    } else {
      gearChild[_self.index].innerHTML = "<div class='tooth'></div>"
      gearChild[_self.index].setAttribute('val', 0)
      if (_self.index === 1) {
        gearChild[2].innerHTML = "<div class='tooth'></div>"
        gearChild[2].setAttribute('val', 0)
      }
      _self.index = 0
    }
  },
  finish: function(e) {
    e.preventDefault()
    var _self = this
    var areaProvince = _self.gearArea.querySelector('.areaProvince')
    var areaCity = _self.gearArea.querySelector('.areaCity')
    var areaCounty = _self.gearArea.querySelector('.areaCounty')
    var provinceVal = parseInt(areaProvince.getAttribute('val'))
    var provinceText = areaProvince.childNodes[provinceVal].textContent
    var provinceCode = areaProvince.childNodes[provinceVal].getAttribute('ref')
    var cityVal = parseInt(areaCity.getAttribute('val'))
    var cityText = areaCity.childNodes[cityVal].textContent
    var cityCode = areaCity.childNodes[cityVal].getAttribute('ref')
    var countyVal = parseInt(areaCounty.getAttribute('val'))
    var countyText = areaCounty.childNodes[countyVal].textContent
    var countyCode = areaCounty.childNodes[countyVal].getAttribute('ref')
    cityText = cityText ? (' ' + cityText) : ''
    countyText = countyText ? (' ' + countyText) : ''
    _self.value = [provinceVal, cityVal, countyVal]
    cityCode = cityCode ? (' ' + cityCode) : ''
    countyCode = countyCode ? (' ' + countyCode) : ''
    var codeStr = ''
    var nameText = ''
    if (_self.column === 1) {
      nameText = provinceText
      codeStr = provinceCode
    } else if (_self.column === 2) {
      nameText = provinceText + cityText
      codeStr = provinceCode + cityCode
    } else {
      nameText = provinceText + cityText + countyText
      codeStr = provinceCode + cityCode + countyCode
    }
    _self.trigger.value = nameText
    _self.trigger.style.color = '#333'
    _self.trigger.setAttribute('codeStr', codeStr)
      // 记录当前选择的地区
    this.location = {
      name: _self.trigger.value,
      id: _self.trigger.getAttribute('codeStr')
    }
    // var evt = new CustomEvent('input')
    // CustomEvent不兼容低版本
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent('input', true, true, { detail: '' })
    _self.trigger.dispatchEvent(evt)
  },
  close: function(e) {
    e.preventDefault()
    var _self = this
    // var evt = new CustomEvent('input')
    var evt = document.createEvent('Event')
    evt.initEvent('input', true, true)
    if (this.location) {
      _self.setLocation(this.location)
    }
    _self.trigger.dispatchEvent(evt)
  },
  setGear: function(target, val) {
    const _self = this
    val = Math.round(val)
    target.setAttribute('val', val)
    switch (_self.type) {
      case 1:
        _self.setGearTooth(_self.data)
        break
      case 2:
        switch (target.dataset['areatype']) {
          case 'areaProvince':
            _self.setGearTooth(_self.data[0])
            break
          case 'areaCity':
            var ref = target.childNodes[val].getAttribute('ref')
            var childData = []
            var nextData = _self.data[2]
            for (var i in nextData) {
              if (i === ref) {
                childData = nextData[i]
                break
              }
            }
            _self.index = 2
            _self.setGearTooth(childData)
            break
        }
    }
  },
  setLocation(location) {
    const val = location.id
    const arr = val.split(' ')
    if (arr.length !== this.column) {
      throw new Error('传入的column值与设定的默认地址格式不匹配')
    }
    const provArr = this.data.filter((one) => {
      return one.id === arr[0]
    })
    const provInd = this.data.indexOf(provArr[0])
    if (this.column === 1) {
      this.setPos(provInd, 0, 0)
    } else if (this.column === 2) {
      const cityArr = provArr[0].child.filter((one) => {
        return one.id === arr[1]
      })
      const cityInd = provArr[0].child.indexOf(cityArr[0])
      this.setPos(provInd, cityInd, 0)
    } else {
      const cityArr = provArr[0].child.filter((one) => {
        return one.id === arr[1]
      })
      const cityInd = provArr[0].child.indexOf(cityArr[0])
      const townArr = cityArr[0].child.filter((one) => {
        return one.id === arr[2]
      })
      const townInd = cityArr[0].child.indexOf(townArr[0])
      this.setPos(provInd, cityInd, townInd)
    }
    // 重新设置位置
    this.trigger.value = location.name
    // if (location.showDate === true) {
    this.trigger.style.color = '#333'
    // }
    this.trigger.setAttribute('codeStr', location.id)
      // 记录当前选择的地区
    this.location = {
      name: this.trigger.value,
      id: this.trigger.getAttribute('codeStr')
    }
  },
  setPos: function(pInd, cInd, tInd) {
    const areaProvince = document.querySelector('.areaProvince')
    const areaCity = document.querySelector('.areaCity')
    const areaCounty = document.querySelector('.areaCounty')
    areaProvince.style.transform = `translate3d(0px, ${-2 * pInd}em, 0px)`
    areaProvince.setAttribute('top', `${-2 * pInd}em)`)
    areaProvince.setAttribute('val', pInd)
    this.setGear(areaProvince, pInd)
    areaCity.setAttribute('val', cInd)
    areaCity.style.transform = `translate3d(0px, ${-2 * cInd}em, 0px)`
    areaCity.setAttribute('top', `${-2 * cInd}em)`)
    this.setGear(areaCity, cInd)
    areaCounty.setAttribute('val', tInd)
    areaCounty.style.transform = `translate3d(0px, ${-2 * tInd}em, 0px)`
    areaCounty.setAttribute('top', `${-2 * tInd}em)`)
  }
}
export default MobileArea
