<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" class="filter-container">

      <el-form-item label="活动名称">
        <el-input
          v-model="listQuery.name"
          class="content"
          clearable
          style="width:180px"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="活动类型">
        <el-select v-model="listQuery.type" clearable placeholder="请选择">
          <el-option
            v-for="(i,key) in type"
            :key="key"
            :label="i"
            :value="key"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <el-date-picker
          v-model="listQuery.time"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00','23:59:59']"
          :picker-options="pickerOptions"
          :default-value="getLastMonth()"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :loading="listLoading"
          type="primary"
          @click="search('content')"
        >查询</el-button>
        <el-button
          :loading="listLoading"
          @click="reset"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询结束 -->
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        align="center"
        label="ID"
      />
      <!-- 活动类型 -->
      <el-table-column label="活动类型" align="">
        <template slot-scope="{row}">
          {{ type[row.type] }}
        </template>
      </el-table-column>
      <!-- 活动名称 -->
      <el-table-column label="活动名称" align="">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>

      <!-- 申请预算金额 -->
      <el-table-column
        align=""
        label="申请预算金额"
      >
        <template slot-scope="{row}">
          <span style="color:rgb(185, 24, 24);">
            ₱ {{ row.applicationBudget|formatMoney }}
          </span>
        </template>
      </el-table-column>
      <!-- 申请人 -->
      <el-table-column
        align=""
        label="申请人"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.applicantName }}</span>
        </template>
      </el-table-column>
      <!-- 申请时间 -->
      <el-table-column
        align=""
        label="申请时间"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.applicantTime }}</span>
        </template>
      </el-table-column>
      <!-- 审核状态 -->
      <el-table-column
        align=""
        label="审核状态"
      >
        <template slot-scope="{row:{status}}">
          <span v-show="status == 1 || status == 2" style="color:rgb(125, 125, 125)">待审核</span>
          <span v-show="status == 4" style="color:rgb(8, 195, 29)">已通过</span>
          <span v-show="status == 3 || status == 5" style="color:rgb(202, 7, 7)">已拒绝</span>
        </template>
      </el-table-column>
      <!-- 一级审核人/审核时间 -->
      <el-table-column
        align=""
        label="一级审核人/审核时间"
        width="160"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.oneAuditorName }}</p>
          <p>{{ scope.row.oneAuditorTime }}</p>
        </template>
      </el-table-column>
      <!-- 二级审核人/审核时间 -->
      <el-table-column
        align=""
        label="二级审核人/审核时间"
        width="160"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.twoAuditorName }}</p>
          <p>{{ scope.row.twoAuditorTime }}</p>
        </template>
      </el-table-column>
      <!-- 凭证单 -->
      <el-table-column
        align="center"
        label="凭证单"
      >
        <template slot-scope="{row}">
          <el-image
            style="width: 50px; height: 50px"
            :src="ossPath(row.certificate)"
            :preview-src-list="[ossPath(row.certificate)]"
            fit="cover"
          >
            <div slot="error" />
          </el-image>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px"
      :current-page="params.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="params.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="params.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <detail ref="detail" :by-status="4" :refush-status="5" :show.sync="show" @submit="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLastMonth } from '@/utils/util'
import detail from './components/detail'

export default {
  name: 'MerchList',
  components: { detail },
  data: function() {
    return {
      // 详情
      show: false,

      total: 0,
      params: {
        page: 1,
        limit: 10,
        total: 0
      },
      // 表头搜索条件
      listQuery: {
        time: '',
        name: '', // 活动名称
        type: '' // 活动类型
      },
      type: {
        1: '平台折扣活动',
        2: '随机红包活动',
        3: '充值随机红包活动',
        4: '兑汇随机红包活动'
      },
      // 表格数据部分
      listLoading: false, // 表格加载提示
      list: [],

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
  computed: {
  },
  watch: {
  },
  mounted() {
    this.getList()
  },
  activated() {
  },
  methods: {
    getLastMonth,
    // 获取列表
    getList() {
      var p = {}
      // 只取有值
      for (const key in this.params) {
        if (this.params.hasOwnProperty(key)) {
          const e = this.params[key]
          if (e) {
            p[key] = e
          }
        }
      }
      this.listLoading = true
      this.$api
        .get('/api/sys/activity/budget/detailed/list', p)
        .then((res) => {
          this.list = res.list
          this.params.total = res.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },

    // 搜索
    search(name) {
      // 表头点击搜索
      if (name === 'content') {
        var { time } = this.listQuery
        if (time) {
          this.listQuery.startTime = time[0]
          this.listQuery.endTime = time[1]
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        this.params = { ...this.params, ...this.listQuery }
      }
      this.params.page = 1
      this.getList()
    },

    // 详情
    detailMerch(row) {
      this.show = true
      this.$refs.detail.setData(row)
    },
    // 重置
    reset() {
      this.listQuery = {
        time: '',
        name: '', // 活动名称
        type: '' // 活动类型
      }
    },
    // 表格方法
    handleSizeChange(val) {
      this.params.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.link.red{
  color: #FF0000;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
