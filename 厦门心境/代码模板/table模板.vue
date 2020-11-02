<template>
<!-- @/views/financeManage/dataSummary/img/USDT.png -->
  <!-- 币种记录 -->
  <div class="qyTable">
    <!-- 第一行 -->
    <div class="flex-center">{{ lang.bz }}</div>
    <div class="title">
      <span>
        <img class="img" :src="require('./img/比索.png')" alt />
      </span>
      <span>{{ lang.bs }} {{ symbol['比索'] }}</span>
    </div>
    <div class="title">
      <span>
        <img class="img" :src="require('./img/人民币.png')" alt />
      </span>
      <span>{{ lang.rmb }}{{ symbol['人民币'] }}</span>
    </div>
    <div class="title">
      <span>
        <img class="img" :src="require('./img/美元.png')" alt />
      </span>
      <span>{{ lang.my }} {{ symbol['美元'] }}</span>
    </div>
    <div class="title">
      <span>
        <img class="img" :src="require('./img/港币.png')" alt />
      </span>
      <span>{{ lang.gb }} {{ symbol['港币'] }}</span>
    </div>
    <div class="title">
      <span>
        <img class="img" :src="require('./img/澳门元.png')" alt />
      </span>
      <span>{{ lang.amy }} {{ symbol['澳门元'] }}</span>
    </div>
    <div class="title">
      <span>
        <img class="img" :src="require('./img/USDT.png')" alt />
      </span>
      <span>USDT{{ symbol['USDT'] }}</span>
    </div>
    <!-- 第二行 -->
    <div class="flex-center">{{ lang.ljjy }}</div>
    <!-- 比索 -->
    <!-- :class="['title',money.pesoMoney<0?'in':'out']" -->
    <div class="title">1</div>
    <!-- 人民币 -->
    <div class="title">1</div>
    <!-- 美元 -->
    <div class="title">1</div>
    <!-- 港币 -->
    <div class="title">1</div>
    <!-- 澳门元 -->
    <div class="title">1</div>
    <!-- USDT -->
    <div class="title">1</div>
    <!-- 第三行 -->
    <div class="flex-center">{{ lang.zhye }}</div>
    <!-- 比索 -->
    <div class="title">1</div>
    <!-- 人民币 -->
    <div class="title">1</div>
    <!-- 美元 -->
    <div class="title">1</div>
    <!-- 港币 -->
    <div class="title">1</div>
    <!-- 澳门元 -->
    <div class="title">1</div>
    <!-- USDT -->
    <div class="title">1</div>
  </div>
</template>
<script>
import { getLanguage } from '@/lang/index'
var lang = {
  zh: {
    jysj: '交易时间',
    // 时间搜索框部分
    start_placeholder: '开始时间',
    range_separator: '至',
    end_placeholder: '结束时间',
    select: '请选择',
    jybz: '交易币种',
    jhbz: '结汇币种',
    ssts: '付款人/付款账号/收款人/收款账号', // 搜索提示
    cx: '查询',
    bz: '币种',
    bs: '比索',
    rmb: '人民币',
    my: '美元',
    gb: '港币',
    amy: '澳门元',
    ljjy: '累计交易',
    zhye: '账户余额'
  }
}
export default {
  data: function() {
    return {
      lang: lang[getLanguage()], // 语言

      // 币种符号
      symbol: {
        人民币: '',
        港币: '',
        澳门元: '',
        美元: '',
        比索: '',
        USDT: ''
      },
      // 各币种余额
      balance: {

      },

      // 时间选择
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() >
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            )
          )
        }
      }
    }
  },
  watch: {
    // 语言
    '$i18n.locale': function() {
      this.lang = lang[this.$i18n.locale]
    }
  },
  mounted() {
    // 获取币种
    this.$api.get('/apiEnterprise/etp/currency/list').then((res) => {
      this.wtCurrency = res
      this.settWtCurrency = res
      res.forEach(e => {
        this.symbol[e.name] = e.symbol
      })
    })
  },
  methods: {
    // 搜索
    depositSearch() {
      this.param.ssk = this.ssk
      this.getList()
    },
    // 获取表格
    getList() {},
    // 表格方法
    getDefaultDate() {
      var date = this.dateFormat('YYYY-mm-dd', new Date())
      var arr = date.split('-')
      var year = arr[0] // 获取当前日期的年份
      var month = arr[1] // 获取当前日期的月份
      var day = arr[2] // 获取当前日期的日
      var year2 = year
      var month2 = parseInt(month) - 1
      if (month2 == 0) {
        // 如果是1月份，则取上一年的12月份
        year2 = parseInt(year2) - 1
        month2 = 12
      }
      var day2 = day
      var days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        // 如果原来日期大于上一月的日期，则取当月的最大日期。比如3月的30日，在2月中没有30
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2 // 月份填补成2位。
      }
      var t2 = year2 + '-' + month2 + '-' + day2
      return t2
    },
    dateFormat(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          )
        }
      }
      return fmt
    },
    // 每页条数变化
    handleSizeChange(val) {
      this.params.limit = val
      this.getList()
    },
    // 页数变化
    handleCurrentChange(val) {
      this.params.page = val
      this.getList()
    },
  }
}
</script>

<style lang="scss">
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.qyTable {
  border: 1px solid #ebeef5;
  border-width: 1px 0 0 1px;
  overflow: hidden;
  .out{
    color:rgb(255, 102, 102);
  }
  .in{
    color:rgb(0, 153, 0);
  }
  & > div {
    float: left;
    width: calc(100% / 7);
  }
  & > * {
    border: 1px solid #ebeef5;
    border-width: 0 1px 1px 0;
    height: 30px;
    text-align: center;
    font-size: .9rem;
  }
  .title {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 5px 0 0;
  }
  .img {
    height: 16px;
    width: 16px;
  }
  span {
    margin: 0 5px;
  }
}
</style>