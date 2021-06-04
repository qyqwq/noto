<template>
  <el-input
    v-model="form.totalWithdrawalQuota"
    style="width:200px;text-align:right"
    placeholder="请输入内容"
    :disabled="!isChange"
    maxlength="20"
    @focus="moneyFocus(form,'zekou')"
    @blur="moneyBlur(form,'zekou',0)"
  />

</template>

<script>
export default {
  data(){
    return {
      form: {
        'totalWithdrawalQuota': '1.00', // 可提现总额
      },
    }
  },
  methods:{
    // 金额失去焦点
    moneyBlur(object, name, num = 2) {
      object[name] = this.formatMoney(object[name], num)
    },
    // 金额焦点
    moneyFocus(object, name) {
      object[name] = (object[name] + '').replace(/,/g, '')
    },
  }
}
</script>

<style>

</style>