<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" class="filter-container">
      <el-form-item label="">
        <el-select
            v-model="listQuery.status"
            size="mini"
            class="table-select"
            clearable
            placeholder="状态"
            @change="search"
          >
            <el-option
              v-for="(i,k) in status"
              :key="k"
              :label="i.name"
              :value="k"
            />
          </el-select>
      </el-form-item>
      <el-form-item>
        <router-link to="/merchant/mdAdd">
          <el-button
            type="primary"
          >商户开户</el-button>
        </router-link>
      </el-form-item>
      <el-form-item>
        <div class="filter-msg">
          共
          <span class="red medium">{{ }}</span>&nbsp;家商户，&nbsp;
          商户待审（<span class="red medium">{{ }}</span>）&nbsp;
          已拒绝（<span class="red medium">{{ }}</span>）&nbsp;
        </div>
      </el-form-item>
      <el-form-item label="开户时间">
        <el-date-picker
          v-model="listQuery.khsj"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00','23:59:59']"
          :picker-options="pickerOptions"
          :default-value="getLastMonth()"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model="listQuery.cityName"
          placeholder="城市/地区"
          class="content"
          clearable
          style="width:180px"
          maxlength="60"
        />
      </el-form-item>
      <el-form-item label>
        <el-input
          v-model="listQuery.shopName"
          placeholder="商户名称/ID"
          class="content"
          clearable
        />
      </el-form-item>
      <el-form-item label>
        <el-input
          v-model="listQuery.staffName"
          placeholder="商务人员/ID"

          class="content"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="listLoading"
          type="primary"

          icon="el-icon-search"
          @click="search('content')"
        >搜索</el-button>
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
      @sort-change="sortChange"
    >

      <!-- 状态 -->
      <el-table-column label="状态" class-name="status-col" width="120" align="center">
        <template slot="header" slot-scope="{ row }">
          <!-- <el-select
            v-model="params.statusId"
            size="mini"
            class="table-select"
            filterable
            clearable
            placeholder="状态"
            @change="search('statusId')"
          >
            <el-option v-for="(i, k) in status" :key="k" :label="i" :value="k" />
          </el-select> -->
        </template>
        <template slot-scope="scope">
          <el-tag v-show="scope.row.statusId == 2" type="warning" effect="dark">待审</el-tag>
          <el-tag v-show="scope.row.statusId == 1" type="danger" effect="dark">拒绝</el-tag>
          <el-tag v-show="scope.row.statusId == 0" type="success" effect="dark">通过</el-tag>
        </template>

        <template slot-scope="{row:{orderStatus}}">
          <div v-for="(s,key) in status" v-show="key == orderStatus" :key="key" :class="s.type">
            {{ s.name }}
          </div>
        </template>
      </el-table-column>

      <!-- 城市 -->
      <el-table-column
        align="center"
        label="城市"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        :label="$t('table.actions')"
        width="220"
        align="center"
        class="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">
          <!-- 详情 -->
          <el-button
            type=""
            size="small"
            @click="detail(row.id)"
          >详情</el-button>
          <!-- 编辑 -->
          <el-button
            type="primary"
            size="small"
            @click="edit(row.id)"
          >修改</el-button>

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

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLastMonth } from '@/utils/util'

export default {
  components: { },
  data: function() {
    return {

      params: {
        page: 1,
        limit: 10,
        total: 0,
      },
      // 表头搜索条件
      listQuery: {

      },
      status: {
        1: {
          name: '正常',
          type: 'success'
        },
        6: {
          name: '待审',
          type: 'warning'
        },
        7: {
          name: '拒绝',
          type: 'danger'
        }
      },
      // 表格数据部分
      listLoading: false, // 表格加载提示
      list: [],

      OSS: process.env.OSS, // oss域名

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
    if (this.$route.query.id) {
      this.detail({ id: this.$route.query.id })
    }
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
        const e = this.params[key]
        if (e) {
          p[key] = e
        }
      }
      // this.listLoading = true
      // this.$api
      //   .form('/api/sys/mer/info/list', p)
      //   .then((res) => {
      //     console.log(res)

      //     this.list = res.list
      //     this.params.total = res.total
      //     this.listLoading = false
      //   })
      //   .catch(() => {
      //     this.listLoading = false
      //   })
        // 图片预览接口重新加载
        this.$previewRefresh()
    },

    // 排序
    sortChange(data) {
      const { prop, order } = data
      console.log(data)
      if (order) {
        var a = order === 'ascending' ? 'asc' : 'desc'

        this.getList()
      }
    },
    // 搜索
    search(name) {
      // 表头点击搜索
      if (name === 'content') {
        var [startTime, endTime] = this.time || []
        this.listQuery.startTime = startTime
        this.listQuery.endTime = endTime
        this.params = { ...this.params, ...this.listQuery }
      }
      this.params.page = 1
      this.getList()
    },

    // 修改状态
    modifyStatus(row, status) {

    },

    // 编辑
    edit(id) {
      // console.log(id);
    },

    // 导出
    outExcel() {
      var tiaoguo = {
        page: 1,
        limit: 1,
        total: 1,
        khsj: 1
      }
      var url = process.env.BASE_API +
      '/api/sys/activity/money/log/excel?'
      Object.keys(this.params).forEach(e => {
        if (!tiaoguo[e]) {
          url = url + `&${e}=${this.params[e]}`
        }
      })
      window.location.href = url
    },

    // 详情
    detail(id) {

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
.info{
  color: #909399;
}
.success{
  color:#67C23A;
}
.danger{
  color: #F56C6C;
}
.close{
  color:rgb(16, 16, 16)
}
.warning{
  color: #E6A23C;
}
.primary{
  color:#409EFF;
}
</style>
