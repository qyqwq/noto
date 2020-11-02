
<el-form-item label="创建时间">
  <el-date-picker
    v-model="time"
    type="datetimerange"
    value-format="yyyy-MM-dd HH:mm:ss"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :default-time="['00:00:00','23:59:59']"
    :picker-options="pickerOptions"
    :default-value="getLastMonth()"
  />

</el-form-item>


import { getLastMonth } from '@/utils/util'
pickerOptions: {
  disabledDate(time) {
    return time.getTime() > new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
  }
}

  methods: {
    getLastMonth,
  }