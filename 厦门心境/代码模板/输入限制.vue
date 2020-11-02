input_number(name) {
  var v = this
  var v2 = this
  var key
  name.split('.').forEach(e => {
    v2 = v
    v = v[e]
    key = e
  })
  this.$nextTick(() => {
    v2[key] = v.replace(/[^\d]/g, '')
  })
},

input_cn(name) {
  var v = this
  var v2 = this
  var key
  name.split('.').forEach(e => {
    v2 = v
    v = v[e]
    key = e
  })
  this.$nextTick(() => {
    v2[key] = v.replace(
      /[ `_+\-~!@#$^&%*()=|{}':;',\\\[\].<>\/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\d]/g,
      ''
    )
  })
},
input_money(name) {
  var v = this
  var v2 = this
  var key
  name.split('.').forEach(e => {
    v2 = v
    v = v[e]
    key = e
  })
  this.$nextTick(() => {
    v2[key] = v2[key].match(/\d+(\.\d{0,2})?/)
      ? v2[key].match(/\d+(\.\d{0,2})?/)[0]
      : "";
  });
},
//银行卡 4位一空格
Vue.prototype.$input_bankNo = function(data, name) {
  var v = data
  var v2 = data
  var key
  name.split('.').forEach(e => {
    v2 = v
    v = v[e]
    key = e
  })
  this.$nextTick(() => {
    v = v.replace(/[\D]/g, '')
    if (/^[\d]{0,19}$/.test(v.replace(/\s/g, ''))) {
      // 每四位数字加一个空格
      v2[key] = v.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ')
    }
  })
}