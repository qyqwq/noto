<template />

<script>
import { mapGetters } from 'vuex'
var lang = {
  zh: {

  }
}
export default {
  data: function() {
    return {

    }
  },
  computed: {
    ...mapGetters(['user']),
    lang() {
      return lang[this.$store.getters.language]
    },
  },
  methods:{
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
  }
}
</script>

<style>

</style>
