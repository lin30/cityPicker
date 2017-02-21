## 省市区选择器

### usage

```
    <picker title="居住地址" title="居住地址" :show="showpkr" @show-picker="showPicker" @get-val="addressPick"></picker>
```


### props
| 名字 | 类型 | 默认 | 描述
|:-|-|-|-|
|title |String | '居住地址' |左侧标题
|dType |Number | 1 | 数据源类型,1--参考data.json 2--参考data2.json
|datas| Array | picker/data.json | 数据源
|location |Object | 无 | 可设置默认地址，格式为{id:'',name:''} id为省市代码，name为省市名字
|column |Number | 3 | 默认显示省市区3栏，可传1,2,3
|show |Boolean | false | 表示选择框显示或隐藏

### dType为1时,数据格式
```
{"id":"2","name":"\u5317\u4eac\u5e02",
  "child":[{"id":"2288","name":"\u4e1c\u57ce\u533a"},
           {"id":"2300","name":"\u660c\u5e73\u533a",
          child:[{"id":"","name":""}]}]
}
```
### 设置默认地址
```data中初始化location
    location: {
      id: '140000 141100 141121',
      name: '山西省 吕梁市 文水县'
    }
```

### methods
|名字 |参数 |描述
|:-|-|-|
|getVal | 无 | 选择省市后,返回选中值value,key的回调函数
|show-picker | 无 | 点击表单 控制选择框的隐显