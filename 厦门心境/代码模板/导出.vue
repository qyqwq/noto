<template>
  
</template>

<script>
export default {
  methods:{
    // 导出
    outExcel() {
      var url = process.env.BASE_API +
      '/api/sys/user/outExcel?'
      var flag = false
      Object.keys(this.params).forEach(e => {
        if (e !== 'page' && e !== 'limit' && e != 'totalCount') {
          if (this.params[e]) {
            if (flag) {
              url += '&'
            }
            url = url + `${e}=${this.params[e]}`
            flag = true
          }
        }
      })
      alert(url)
      window.location.href = url
    },
  }
}
</script>

<style>

</style>