<template>
  <transition name="picker-fade">
    <div class="picker" v-show="state===1" @touchmove.prevent @click="cancel">
      <transition name="picker-move">
        <div class="picker-panel" v-show="state===1" @click.stop>
          <div class="picker-choose border-bottom-1px">
            <span class="cancel" @click="cancel">{{cancelTxt}}</span>
            <span class="confirm" @click="confirm">{{confirmTxt}}</span>
            <h1 class="picker-title">{{title}}</h1>
          </div>
          <div class="picker-content">
            <div class="mask-top border-bottom-1px"></div>
            <div class="mask-bottom border-top-1px"></div>
            <div class="wheel-wrapper" ref="wheelWrapper">
              <div class="wheel" v-for="data in pickerData">
                <ul class="wheel-scroll">
                  <li v-for="item in data" class="wheel-item">{{item.text}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="picker-footer"></div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from './bscroll.js'

  const STATE_HIDE = 0
  const STATE_SHOW = 1

  const COMPONENT_NAME = 'picker'
  const EVENT_SELECT = 'select'
  const EVENT_VALUE_CHANGE = 'valuechange'
  const EVENT_CANCEL = 'cancel'
  const EVENT_CHANGE = 'change'

  export default {
    name: COMPONENT_NAME,
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      title: {
        type: String
      },
      cancelTxt: {
        type: String,
        default: 'cancel'
      },
      confirmTxt: {
        type: String,
        default: 'confirm'
      },
      selectedIndex: {
        type: Array,
        default() {
          return []
        }
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        state: STATE_HIDE,
        pickerData: this.data.slice(),
        pickerSelectedIndex: this.selectedIndex,
        pickerSelectedVal: [],
        pickerSelectedText: []
      }
    },
    created() {
      if (!this.pickerSelectedIndex.length) {
        this.pickerSelectedIndex = []
        for (let i = 0; i < this.pickerData.length; i++) {
          this.pickerSelectedIndex[i] = 0
        }
      }
    },
    methods: {
      confirm() {
        if (!this._canConfirm()) {
          return
        }
        this.hide()

        let changed = false
        for (let i = 0; i < this.pickerData.length; i++) {
          let index = this.wheels[i].getSelectedIndex()
          this.pickerSelectedIndex[i] = index

          let value = null
          if (this.pickerData[i].length) {
            value = this.pickerData[i][index].value
          }
          if (this.pickerSelectedVal[i] !== value) {
            changed = true
          }
          this.pickerSelectedVal[i] = value
          this.pickerSelectedText[i] = this.pickerData[i][index].text
        }

        this.$emit(EVENT_SELECT, this.pickerSelectedVal, this.pickerSelectedIndex, this.pickerSelectedText)

        if (changed) {
          this.$emit(EVENT_VALUE_CHANGE, this.pickerSelectedVal, this.pickerSelectedIndex, this.pickerSelectedText)
        }
      },
      cancel() {
        this.hide()
        this.$emit(EVENT_CANCEL)
      },
      show() {
        if (this.state === STATE_SHOW) {
          return
        }
        this.state = STATE_SHOW
        if (!this.wheels || this.dirty) {
          this.$nextTick(() => {
            this.wheels = []
            let wheelWrapper = this.$refs.wheelWrapper
            for (let i = 0; i < this.pickerData.length; i++) {
              this._createWheel(wheelWrapper, i)
            }
            this.dirty = false
          })
        } else {
          for (let i = 0; i < this.pickerData.length; i++) {
            this.wheels[i].enable()
            this.wheels[i].wheelTo(this.pickerSelectedIndex[i])
          }
        }
      },
      hide() {
        this.state = STATE_HIDE

        for (let i = 0; i < this.pickerData.length; i++) {
          this.wheels[i].disable()
        }
      },
      setData(data) {
        this.pickerData = data.slice()
        this.dirty = true
      },
      setSelectedIndex(index) {
        this.pickerSelectedIndex = index
      },
      refill(datas) {
        let ret = []
        if (!datas.length) {
          return ret
        }
        datas.forEach((data, index) => {
          ret[index] = this.refillColumn(index, data)
        })
        return ret
      },
      refillColumn(index, data) {
        if (this.state !== STATE_SHOW) {
          console.error('can not use refillColumn when picker is not show')
          return
        }
        const wheelWrapper = this.$refs.wheelWrapper
        let scroll = wheelWrapper.children[index].querySelector('.wheel-scroll')
        let wheel = this.wheels[index]
        if (scroll && wheel) {
          let oldData = this.pickerData[index]
          this.$set(this.pickerData, index, data)
          let selectedIndex = wheel.getSelectedIndex()
          let dist = 0
          if (oldData.length) {
            let oldValue = oldData[selectedIndex].value
            for (let i = 0; i < data.length; i++) {
              if (data[i].value === oldValue) {
                dist = i
                break
              }
            }
          }
          this.pickerSelectedIndex[index] = dist
          this.$nextTick(() => {
            // recreate wheel so that the wrapperHeight will be correct.
            wheel = this._createWheel(wheelWrapper, index)
            wheel.wheelTo(dist)
          })
          return dist
        }
      },
      scrollTo(index, dist) {
        const wheel = this.wheels[index]
        this.pickerSelectedIndex[index] = dist
        wheel.wheelTo(dist)
      },
      refresh() {
        this.$nextTick(() => {
          this.wheels.forEach((wheel, index) => {
            wheel.refresh()
          })
        })
      },
      _createWheel(wheelWrapper, i) {
        if (!this.wheels[i]) {
          this.wheels[i] = new BScroll(wheelWrapper.children[i], {
            wheel: {
              selectedIndex: this.pickerSelectedIndex[i],
              /** 默认值就是下面配置的两个，为了展示二者的作用，这里再配置一下 */
              wheelWrapperClass: 'wheel-scroll',
              wheelItemClass: 'wheel-item'
            },
            probeType: 3
          })

          this.wheels[i].on('scrollEnd', () => {
            this.$emit(EVENT_CHANGE, i, this.wheels[i].getSelectedIndex())
          })
        } else {
          this.wheels[i].refresh()
        }

        return this.wheels[i]
      },
      _canConfirm() {
        return this.wheels.every((wheel) => {
          return !wheel.isInTransition
        })
      }
    },
    watch: {
      data(newData) {
        this.setData(newData)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  
  border-top-1px($color)
  &:before
    border-top: 1px solid $color

border-right-1px($color)
  &:after
    border-right: 1px solid $color

border-bottom-1px($color)
  &:after
    border-bottom: 1px solid $color

border-left-1px($color)
  &:before
    border-left: 1px solid $color

border-1px($color = #ccc, $radius = 2px, $style = solid)
  position: relative
  &:after
    content: ""
    pointer-events: none // 解决iphone上的点击无效Bug
    display: block
    position: absolute
    left: 0
    top: 0
    transform-origin: 0 0
    border: 1px $style $color
    border-radius: $radius
    box-sizing border-box
    width 100%
    height 100%
    @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2)
      width: 200%
      height: 200%
      border-radius: $radius * 2
      transform: scale(.5) translateZ(0)
    @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
      width: 300%
      height: 300%
      border-radius: $radius * 3
      transform: scale(.33) translateZ(0)

border-none()
  &:before
    display: none
  &:after
    display: none

flex-fix()
  -ms-flex: 1 1 0.000000001px
  -webkit-box-flex: 1
  -webkit-flex: 1
  flex: 1
  -webkit-flex-basis: 0.000000001px
  flex-basis: 0.000000001px
  width: 1%

touch-active(type = orange)
  if (type == orange)
    &:active
      color: #fcc1a6
      background-color: rgba(250, 143, 84, .04)
  else
    &:active
      color: #c6c6c6
      background-color: rgba(0, 0, 0, .04)

hide-scrollbar()
  &::-webkit-scrollbar
    width: 0
    height: 0

bg-image($url)
  background-image: url($url + "@2x.png")
  @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3)
    background-image: url($url + "@3x.png")

vendor(prop, args)
  -webkit-{prop} args
  -moz-{prop} args
  {prop} args

transition()
  vendor('transition', arguments)

transform()
  vendor('transform', arguments)
// 颜色定义规范
//// 主基调
$color-main = #007bff
$color-main-ll = #5aaaff
$color-main-l = #3b99fc
$color-main-d = #0069d9

$color-orange = #fc9153
$color-regular-blue= #4a4c5b
$color-background = #f3f4f5
$color-background-grew = #e8864c
$color-background-grey = #f2f2f2
$color-title-background = #f7f7f7

//// 文字信息
$color-dark-grey = #333
$color-grey = #666
$color-light-grey = #999
$color-light-grey-s = #ccc
$color-light-grey-ss = #eee
$color-white = #fff
//// 其他辅色

////// 灰色
$color-light-grey-sss = #fcfcfc
////// 橘色
$color-dark-orange = #f08250
$color-light-orange = #fc9153
$color-grey-orange = #ffc4a6

////// 黄色
$color-dark-yellow = #ffd00b
$color-light-yellow = #ffe650
$color-grey-yellow = #ffedb4

////// 红色
$color-dark-red = #bd2630
$color-light-red = #db2a36
$color-grey-red = #ff525d

////// 粉色
$color-dark-pink = #aa337a
$color-light-pink = #d24b82
$color-grey-pink = #ef65ab

////// 紫色
$color-dark-purple = #48296d
$color-light-purple = #6a2d8e
$color-grey-purple = #af72c5

////// 黄绿色
$color-dark-greenyellow = #8bb93f
$color-light-greenyellow = #bfd141
$color-grey-greenyellow = #d5e08c

////// 绿色
$color-dark-deepgreen = #1b733e
$color-light-deepgreen = #50a050
$color-grey-deepgreen = #80c075
$color-green = #75D370
$color-green-opacity = rgba(117, 211, 112, .05)
$color-vue-green = #42b983
$color-vue-green-opacity = rgba(66, 185, 131, .05)

////// 深青色
$color-dark-cyan = #018172
$color-light-cyan = #28aa91
$color-grey-cyan = #71c3bc

////// 藏青色
$color-dark-cadetblue = #256ea8
$color-light-cadetblue = #3ca0e6
$color-grey-cadetblue = #96caf0

////// 蓝色
$color-dark-blue = #233c64
$color-light-blue = #1e4191
$color-grey-blue = #6e82d7

//// 横线色值
$color-row-line = #ebebeb
//// 竖线色值
$color-col-line = #f5f5f5

/// click & touch active background-color
$color-active-light-orange = rgba(252, 145, 83, .04)
$color-active-light-gray = rgba(0, 0, 0, .04)

/// click & touch active color
$color-active-light-orange-fe = #fdc2a5
$color-active-light-gray-fe = #c2c2c2

/// mask background-color
$color-mask-bgc = rgba(37, 38, 45, .4)

// 字体大小定义规范
$fontsize-large-xxxx = 30px
$fontsize-large-xxx = 24px
$fontsize-large-xx = 20px
$fontsize-large-x = 18px
$fontsize-large = 16px
$fontsize-medium = 14px
$fontsize-small = 12px
$fontsize-small-s = 10px

// 边框圆角大小
$radius-size-medium = 0.3rem
$radius-size-small = 0.1rem

/// 内容区阴影
$box-shadow-content = 0 1px 3px rgba(0, 0, 0, .1)

  .picker
    position: fixed
    left: 0
    top: 0
    z-index: 100
    width: 100%
    height: 100%
    overflow: hidden
    text-align: center
    font-size: $fontsize-medium
    background-color: $color-mask-bgc
    &.picker-fade-enter, &.picker-fade-leave-active
      opacity: 0
    &.picker-fade-enter-active, &.picker-fade-leave-active
      transition: all .3s ease-in-out

    .picker-panel
      position: absolute
      z-index: 600
      bottom: 0
      width: 100%
      height: 273px
      background: $color-white
      &.picker-move-enter, &.picker-move-leave-active
        transform: translate3d(0, 273px, 0)
      &.picker-move-enter-active, &.picker-move-leave-active
        transition: all .3s ease-in-out
      .picker-choose
        position: relative
        height: 60px
        color: $color-light-grey
        .picker-title
          margin: 0
          line-height: 60px
          font-weight: normal
          text-align: center
          font-size: $fontsize-large-x
          color: $color-dark-grey
        .confirm, .cancel
          position: absolute
          top: 6px
          padding: 16px
          font-size: $fontsize-medium
        .confirm
          right: 0
          color: $color-main
          &:active
            color: $color-main-ll
        .cancel
          left: 0
          &:active
            color: $color-active-light-gray-fe
      .picker-content
        position: relative
        top: 20px
        .mask-top, .mask-bottom
          z-index: 10
          width: 100%
          height: 68px
          pointer-events: none
          transform: translateZ(0)
        .mask-top
          position: absolute
          top: 0
          background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8))
        .mask-bottom
          position: absolute
          bottom: 1px
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8))
      .wheel-wrapper
        display: flex
        padding: 0 16px
        .wheel
          flex-fix()
          height: 173px
          overflow: hidden
          font-size: $fontsize-large-xx
          .wheel-scroll
            padding: 0
            margin-top: 68px
            line-height: 36px
            list-style: none
            .wheel-item
              list-style: none
              height: 36px
              overflow: hidden
              white-space: nowrap
              color: $color-dark-grey
    .picker-footer
      height: 20px
</style>
