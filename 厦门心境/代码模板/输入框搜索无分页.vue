<template>
  <el-autocomplete
    v-model="rowData.payBank"
    :fetch-suggestions="autocompleteSearch"
    placeholder="请输入内容"
    :maxlength="20"
    style="width:100%"
    @select="autocompleteSelect"
  >
    <template slot-scope="{ item }">
      {{ `${item.name} / ${item.egName}` }}
    </template>
  </el-autocomplete>
</template>

<script>
export default {
  data() {
    return {
      rowData:{
        payBank:''
      },

      bankList: [], //
    };
  },
  mounted() {
    this.getBankList()
  },
  methods: {
    // 银行列表
    getBankList() {
      this.$api.get('/api/etp/vip/recharge/allbank').then(res => {
        this.bankList = res
      })
    },
    // 银行搜索
    autocompleteSearch(query, cb) {
      cb([])
      if (query) {
        cb(this.bankList.filter((e) => {
          const s = e.name + ' / ' + e.egName
          return s.indexOf(query) !== -1
        }))
      } else {
        cb(this.bankList)
      }
    },
    // 银行输入建议选择
    autocompleteSelect(item) {
      this.rowData.payBank = item.name + ' / ' + item.egName
    },
  },
};
</script>

<style>
</style>