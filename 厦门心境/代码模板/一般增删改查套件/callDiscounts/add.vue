<template>
  <edit edit-title="添加合作商" @add_suc="add_suc" />
</template>

<script>
import edit from './components/edit'
export default {
  components: {
    edit
  },
  methods: {
    add_suc() {
      this.$router.push({ path: '/partner/partnerList' })
    }
  }
}
</script>

<style>

</style>
