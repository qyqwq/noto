<template>
  <el-dialog
    title="预算审核"
    :visible.sync="show"
    width="700px"
    :before-close="handleClose"
  >
    <div>
      <div class="title">
        {{ data.name }}({{ type[data.type] }})
      </div>
    </div>
    <el-form ref="form" class="form" label-width="180px">
      <el-row class="">
        <el-col :span="12" class="col">
          <el-form-item label="活动预算：">
            ₱ {{ data.allocatedBudget | formatMoney }}
          </el-form-item>
        </el-col>

        <el-col :span="12" class="col">
          <el-form-item label="已使用预算：">
            ₱ {{ data.usedBudget | formatMoney }}
          </el-form-item>
        </el-col>

        <el-col :span="12" class="col">
          <el-form-item label="未使用预算：">
            ₱ {{ data.notUsedBudget | formatMoney }}
          </el-form-item>
        </el-col>

        <el-col :span="12" class="col">
          <el-form-item label="申请预算金额：" style="color:rgba(202, 7, 7, 1)">
            ₱ {{ data.applicationBudget | formatMoney }}
          </el-form-item>
        </el-col>
        <!-- 平台活动 -->
        <el-col v-if="data.type == 1" :span="24" class="col">
          <el-form-item label="折扣设置：">
            {{ data.discountRatio.discount |formatMoney(0) }} %
          </el-form-item>
        </el-col>
        <!-- 消费红包 -->
        <div v-if="data.type == 2">
          <el-col :span="12" class="col">
            <el-form-item label="最低消费金额：">
              ₱ {{ data.discountRatio.minAmount |formatMoney(2) }}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col">
            <el-form-item label="每日开出红包次数：">
              {{ data.discountRatio.maxFrequency |formatMoney(0) }}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col">
            <el-form-item label="前7天随机金额区间：">
              ₱ {{ data.discountRatio.oneSection.begin |formatMoney(0) }} 至 ₱ {{ data.discountRatio.oneSection.end |formatMoney(0) }}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col">
            <el-form-item label="7到15天随机金额区间：">
              ₱ {{ data.discountRatio.twoSection.begin |formatMoney(0) }} 至 ₱ {{ data.discountRatio.twoSection.end |formatMoney(0) }}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="col">
            <el-form-item label="15天后随机金额区间：">
              ₱ {{ data.discountRatio.threeSection.begin |formatMoney(0) }} 至 ₱ {{ data.discountRatio.threeSection.end |formatMoney(0) }}
            </el-form-item>
          </el-col>
        </div>
        <!-- 充值活动 -->
        <div v-if="data.type == 3 || data.type == 4">
          <el-col :span="12" class="col">
            <el-form-item :label="data.type == 3?'最低充值金额：':'最低兑汇用户卖出金额：'">
              ₱ {{ data.discountRatio.minAmount |formatMoney(2) }}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="col">
            <el-form-item label="活动期开出红包次数：">
              {{ data.discountRatio.maxFrequency |formatMoney(0) }}
            </el-form-item>
          </el-col>

          <el-col :span="24" class="col">
            <el-form-item label="随机金额区间：">
              ₱ {{ data.discountRatio.oneSection.begin |formatMoney(0) }} 至 ₱ {{ data.discountRatio.oneSection.end |formatMoney(0) }}
            </el-form-item>
          </el-col>
        </div>

        <el-col :span="24">
          <el-form-item label="凭证：">
            <el-image
              v-if="data.certificate"
              style="width: 150px; height: 150px"
              :src="ossPath(data.certificate)"
              preview="0"
              fit="cover"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div style="text-align:center">
        <el-button type="primary" @click="submit(byStatus)">审核通过</el-button>
        <el-button type="danger" @click="submit(refushStatus)">审核拒绝</el-button>
        <el-button @click="$emit('update:show',false)">返回</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    byStatus: {
      type: Number,
      default: 2
    },
    refushStatus: {
      type: Number,
      default: 3
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: {},
      type: {
        1: '平台折扣活动',
        2: '消费随机红包活动',
        3: '充值随机红包活动',
        4: '兑汇随机红包活动'
      }
    }
  },
  methods: {
    setData(data) {
      // 获取活动信息
      this.$api.get('/api/sys/activity/detail', {
        id: data.activityId
      }).then(res => {
        var { allocatedBudget, usedBudget, notUsedBudget, discountRatio } = res
        data.discountRatio = JSON.parse(discountRatio)
        this.data = { allocatedBudget, usedBudget, notUsedBudget, ...data }
        // 图片预览接口重新加载
        this.$previewRefresh()
      })
    },
    // byStatus.通过 refushStatus.拒绝
    submit(type) {
      var m = type == this.byStatus ? '确认审核通过吗？' : '确认审核拒绝吗？'
      // 成功动作
      var success_action = () => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.handleClose()
        this.$emit('submit')
      }
      this.$confirm(m, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          var a = () => {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
          }
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '提交中...'
            this.$api.post('/api/sys/activity/budget/detailed/update', {
              id: this.data.id,
              status: type
            })
              .then((res) => {
                success_action()
                a()
                done()
              })
              .catch(() => {
                a()
              })
          } else {
            done()
          }
        }
      })
    },
    handleClose() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
    color: black;
    margin: 0 0 10px 0;
}
.col{
  margin: 0 0 -20px 0;
}
</style>
