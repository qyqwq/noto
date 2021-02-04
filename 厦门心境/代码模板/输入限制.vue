<template>
  <div>
    <el-input
      v-model="params.wtUserId"
      placeholder="请输入"
      clearable
      maxlength="8"
      @input="$input_limit({
        object:params,
        name:'wtUserId',
        option:['number']
      })"
    />
  </div>
</template>

<script>
export default {

}
/**
 * @object 对象
 * @name 变量名
 * @option ['number','chinese','english','char','space'] 默认配置数组
 * @Expand '`_+\-~!@#$^&%*()=|{}':;',\\\[\]...' 自定义字符串 会添加进正则字符串
 * @regexp 自定义正则 会无效其他配置
 */
Vue.prototype.$input_limit = function({ object, name, option, expand, regexp }) {
  var regMap = {
    number: '\\d',
    chinese: '\\u4e00-\\u9fa5',
    english: 'A-Za-z',
    char: '`_+\\s-~!@#$^&%*\\(\\)=|{}\':;,\\\[\\]\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“。，、？',
    space: ' '
  }

  // 查找值
  var v = object
  var v2 = object
  var key
  name.split('.').forEach(e => {
    v2 = v
    v = v[e]
    key = e
  })

  // 自定义正则
  if (regexp && regexp.constructor === RegExp) {
    // console.log(regexp, v2[key], v)
    v2[key] = v.replace(regexp, '')
  } else {
    var regStr = ''
    // 默认规则
    if (option && option.constructor === Array) {
      option.forEach(e => {
        if (regMap[e]) {
          regStr += regMap[e]
        }
      })
    }
    // 使用扩展
    if (expand && expand.constructor === String) {
      regStr += expand
    }
    // console.log(new RegExp('[^' + regStr + ']'), v2[key], v)
    v2[key] = v.replace(new RegExp('[^' + regStr + ']', 'ig'), '')
  }
}
</script>

<style>

</style>