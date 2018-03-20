<template>
  <div id="app">
    <!--<picker title="居住地址" :location="location" @get-val="addressPick"></picker>-->
    <div class="select" @click="showPicker(0)" ref="select0"><button> 局部调用 </button></div>
    <br/>
    <div class="select" @click="showPicker(1)" ref="select0"><button> 全局调用</button> </div>
    <picker @select="handleSelect" :selected-index="[2]"
            ref="picker0"></picker>
  </div>
</template>
<script>
  import Picker from './components/bscroll/picker.vue'
  let data1 = [
    {
      text: '剧毒',
      value: 1
    }, {
      text: '蚂蚁',
      value: 2
    },
    {
      text: '幽鬼',
      value: 3
    },
    {
      text: '主宰',
      value: 4
    },
    {
      text: '卡尔',
      value: 5
    },
    {
      text: '宙斯',
      value: 6
    },
    {
      text: '巫医',
      value: 7
    }, {
      text: '巫妖',
      value: 8
    },
    {
      text: '神谕者',
      value: 9
    },
    {
      text: '撼地神牛',
      value: 10
    },
    {
      text: '蓝胖子',
      value: 11
    },
    {
      text: '水晶室女',
      value: 12
    },
    {
      text: '莉娜',
      value: 13
    },
    {
      text: '斯拉克',
      value: 14
    },
    {
      text: '斯拉达',
      value: 15
    }
  ]
  let data2 = [
    {
      text: '全局组件调用',
      value: '11'
    }
  ]
  export default {
    data() {
      return {
        location: {
          id: '140000 141100 141121',
          name: '山西省 吕梁市 文水县'
        },
        data1
      }
    },
    mounted() {
      const props = {
        data: [data2]
      }
      const on = { 
        select: (a, b, c)=> { console.log(a[0], b[0], c[0]) } 
      } 
      // 全局组件调用
      const picker = this.$picker(props, on)
      picker.show()
      // HTML 标签调用组件
      this.$refs.picker0.setData([data1])
    },
    components: {
      // Picker
    },
    methods: {
      addressPick(name, code) {
        console.log(name, code)
      },
      showPicker(index) {
        if (index === 0) {
          let picker = this.$refs['picker' + index]
          picker.show()
        } else {
          this.$picker().show()
        }
      },
      handleSelect(val, ind, text) {
        this.$refs.picker0.setData([])
        console.log(val[0], ind[0], text[0])
      }
    }
  }

</script>
<style>
  #app {
    width: 80%;
    margin: 0 auto;
  }
  .select button {
    border: 1px solid red;
  }
</style>
