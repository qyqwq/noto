<template>
  <edit ref="edit" edit-title="修改合作商" @add_suc="add_suc" />
</template>

<script>
import edit from './components/edit'
export default {
  components: {
    edit
  },
  data() {
    return {
    }
  },
  mounted() {
    // 获取合作商详情
    if (this.$route.query.id) {
      this.$api.get('/api/pc/partners/channel/detail', {
        id: this.$route.query.id
      }).then(res => {
        this.$refs.edit.setData(res)
      })
    } else {
      this.$message.error('参数错误')
    }
  },
  methods: {
    add_suc() {
      this.$router.back(-1)
    }
  }
}
</script>

<style>

</style>
