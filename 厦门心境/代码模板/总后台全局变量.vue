<template>
  
</template>

<script>
    // 类型接口
    this.$store.dispatch('api/kpiTypes').then(res => {
      this.kpiTypes = res
    })
    // 合作商验收拒绝理由
    this.$store.dispatch('api/checkReason').then(res => {
      this.checkReason = res
    })
    // 获取币种
    this.$store.dispatch('api/currencys').then(res => {
      var c = {}
      res.forEach(e => {
        c[e.id] = e
      })
      this.currencys = c
    })
    // 物业类型
    this.$store.dispatch('api/propertyType').then(res => {
      this.propertyType = res.list
    })
    
</script>

<style>

</style>