<template>
  <div class="cell_box v-picker">
    <div class="cell_primary">
      <p style="font-size:0.15rem;">{{title}}</p>
    </div>
    <div class="cell_ft">
      <div style="text-align:right;" class="flex" @touchstart="showPicker">
        <input :id="'name-box-' + uuid" class="cell_primary" value="请选择" style="border:none;text-align:right;font-size:0.14rem;color: #999999;" @input="getVal" readonly="readonly">
        <i class="icon-loan-more"></i>
      </div>
    </div>
    <div class="gearArea" v-show="show"></div>
  </div>
</template>

<script>
  import Picker from './pickr.js'
  import dat from './data.json'
  export default {
    name: 'c-picker',
    props: {
      datas: {
        type: Array,
        default () {
          return dat
        }
      },
      dType: {
        type: Number,
        default: 1
      },
      title: {
        type: String,
        default: '居住地址'
      },
      location: {
        type: Object
      },
      column: {
        type: Number,
        default: 3
      }
    },
    data() {
      return {
        uuid: Math.random().toString(36).substring(3, 8),
        show: false
      }
    },
    watch: {
      location() {
        this.setLocation()
      }
    },
    mounted() {
      this.render()
      this.setLocation()
    },
    methods: {
      setLocation() {
        if (this.location && this.location.id) {
          this.picker.setLocation(this.location)
        }
      },
      showPicker() {
        this.show = true
      },
      getVal(e) {
        this.show = false
        this.$emit('get-val', e.target.value, e.target.getAttribute('codeStr'))
      },
      render() {
        const _this = this
        this.picker = new Picker()
        this.picker.init({
          'trigger': `#name-box-${this.uuid}`,
          'keys': {
            id: 'id',
            name: 'name'
          },
          'type': _this.dType,
          'data': _this.datas,
          'column': _this.column
        })
      }
    }
  }

</script>

<style src="../style/picker.css"></style>
<style>
  @font-face {
    font-family: 'icomoon';
    src: url('../style/fonts/icomoon.eot?r1pvgs');
    src: url('../style/fonts/icomoon.eot?r1pvgs#iefix') format('embedded-opentype'), url('../style/fonts/icomoon.ttf?r1pvgs') format('truetype'), url('../style/fonts/icomoon.woff?r1pvgs') format('woff'), url('../style/fonts/icomoon.svg?r1pvgs#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
  }
</style>