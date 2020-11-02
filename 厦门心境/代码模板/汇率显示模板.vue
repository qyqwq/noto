<template>
  <div>

    <el-table-column width="100" align="center" label="结算汇率">
        <div v-if="scope.row.rate" slot-scope="scope">
          <p class="rate_margin">
            {{ currency_symbol[scope.row.toupSymbol]?currency_symbol[scope.row.toupSymbol].egName:'' }}
            /
            {{ currency_symbol[scope.row.symbol]?currency_symbol[scope.row.symbol].egName:'' }}
          </p>
          <p> 1 : {{ scope.row.rate }}</p>
        </div>
      </el-table-column>

    <el-form-item label="结算汇率：">
      <span v-if="rowData.rate" class="rate_margin">
        {{ currency_symbol[rowData.toupSymbol]?currency_symbol[rowData.toupSymbol].egName:'' }}
        /
        {{ currency_symbol[rowData.symbol]?currency_symbol[rowData.symbol].egName:'' }}
      </span>
      <span v-if="rowData.rate"> 1 :  {{ rowData.rate }}</span>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data(){
    return {
      currency: {}, // 币种列表
      currency_symbol: {},// 币种键值对 symbol:data
    }
  },
  created() {
    this.$api.get('api/sys/currency/list').then((res) => {

      this.wtCurrency = res
      this.settWtCurrency = res


      var currency = {}
      var currency_symbol = {}
      res.forEach((e) => {
        currency[e.id] = e
        currency_symbol[e.symbol] = e
      })
      this.currency = currency
      this.currency_symbol = currency_symbol
    })
  },
}
</script>

<style>
.rate_margin{
  margin-right: 10px;
}
</style>