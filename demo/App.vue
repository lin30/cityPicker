<template>
  <div id="app">
    <picker title="居住地址" :location="location" @get-val="addressPick"></picker>
  </div>
</template>
<script>
  import Picker from './components/picker.vue'
  export default {
    data() {
      return {
        location: {
          id: '140000 141100 141121',
          name: '山西省 吕梁市 文水县'
        }
      }
    },
    components: {
      Picker
    },
    methods: {
      addressPick(name, code) {
        console.log(name, code)
      }
    }
  }

</script>
<style>
  #app {
    width: 80%;
    margin: 0 auto;
    border-bottom: 1px solid #eee;
  }

</style>
