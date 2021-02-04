<template>
  <!-- 审核 -->
    <audit-dialog
      title="工资审核"
      :show.sync="auditShow"
      :by-code="byStatus"
      :refuse-code="refuseStatus"
      @submit="auditSubmit"
      next
      nextByText="立刻交易"
      nextRefuseText="再等等"
      @next="auditNext"
    > 
      <!-- 审核框slot -->
      <div class="auditDialogText">
        请确认该收款人
        <span style="color:red;">9CashID</span>
        及
        <span style="color:red;">转账金额</span>
        是否正确!
      </div>
      <!-- 下一步提示框slot -->
      <div slot="next" class="auditDialogText">
        交易申请已审核通过
        </br>
        是否立刻进行交易?
      </div>
    </audit-dialog>
</template>

<script>
import AuditDialog from '@/components/AuditDialog'
export default {
  components: {
    AuditDialog,
    
  },
  data(){
    return {
      // 审核弹窗部分
      byStatus: 1,
      refuseStatus: 2,
      auditShow: false,
      rowId: '', // 单行id
    }
  },
  methods:{
    // 开始转账 （审核完下一步）
    auditNext(){
      //todo
    },
    // 审核
    audit(id) {
      this.statisticsId = id
      this.auditShow = true
      // this.$refs.form.clearValidate()
    },
    // 审核提交
    auditSubmit({ resolve, reject, data }) {
      var url = data.status == this.byStatus
        ? '/apiEnterprise/etp/salary/transfer/checkAllBy'
        : '/apiEnterprise/etp/salary/transfer/checkAllRefuse'
      this.$api.form(url, {
        statisticsId: this.statisticsId,
        auditReason: data.auditReason
      }).then(res => {
        resolve()
        this.getList()
        this.$message.success('审核成功')
          this.$message({ type: 'success', message: '转账成功', customClass: 'cash-message', offset: screen.height / 2.5 })
      }).catch(e => {
        console.error(e)
        reject()
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.auditDialogText{
  font-size:1rem;
  text-align:center;
  height:150px;
  padding:30px 0 0 0;
}
</style>