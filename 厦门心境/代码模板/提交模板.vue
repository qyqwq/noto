<script>
var lang = {
  zh:{
    ts: '提示',
    qd: '确定',
    qx: '取消',
    tjz: '提交中...',
    zzcg: '转账成功！'
  }
}
export default {
  methods:{
    submit(){
      var m = ''
      //成功动作
      var success_action = ()=> {
        this.$message({
          type: 'success',
          message: this.lang.zzcg
        })
        this.dia_show = false
        this.getList()
      }
      this.$confirm(m, this.lang.ts, {
        confirmButtonText: this.lang.qd,
        cancelButtonText: this.lang.qx,
        type: 'warning',
        beforeClose: (action, instance, done) => {
          var a = () => {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = this.lang.qd
          }
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = this.lang.tjz
            this.$api.form('/apiEnterprise/etp/salary/transfer/moneysend', {
              id: data.id
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
    s2(){
      /* 取有值的键值对出来
        var p = {}
      for (const key in this.params) {
        if (this.params.hasOwnProperty(key)) {
          const e = this.params[key]
          if (e && key != 'totalCount') {
            p[key] = e
          }
        }
      }
      */

      var m = '确认审核通过吗'
      //成功动作
      var success_action = ()=> {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.dia_show = false
        this.getList()
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
            this.$api.form('/api/etp/vip/recharge/by', {
              id: this.rowData.id
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
    },//action
    aaaaa(){
      var m = this.$t('submitButton.msg')
      //成功动作
      var success_action = ()=> {
        this.$message({
          type: 'success',
          message: this.$t('submitButton.czcg')
        })
        this.dia_show = false
        this.getList()
      }
      this.$confirm(m, this.$t('submitButton.ts'), {
        confirmButtonText: this.$t('submitButton.qd'),
        cancelButtonText: this.$t('submitButton.qx'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          var a = () => {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = this.$t('submitButton.qd')
          }
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = this.$t('submitButton.tjz')
            this.$api.form('/apiEnterprise/etp/salary/transfer/moneysend', {
              id: data.id
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
      })//action


    }
  }
}
</script>>