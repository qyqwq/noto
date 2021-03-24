<template>
  <div class="greyContent content">
    <div class="body">
      <div class="title">增加预算</div>
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="120px">

        <el-form-item label="活动名称：" required>
          {{ data.name }}
        </el-form-item>
        <el-form-item label="活动预算：" required>
          ₱ {{ data.allocatedBudget | formatMoney }}
        </el-form-item>
        <el-form-item label="已使用预算：" required>
          ₱ {{ data.usedBudget | formatMoney }}
        </el-form-item>
        <el-form-item label="未使用预算：" required>
          ₱ {{ data.notUsedBudget | formatMoney }}
        </el-form-item>

        <el-form-item label="增加金额：" prop="applicationBudget">
          <el-input
            v-model="form.applicationBudget"
            style="max-width:300px"
            maxlength="10"
            @focus="moneyFocus(form,'applicationBudget')"
            @blur="moneyBlur(form,'applicationBudget')"
          >
            <template slot="prepend">₱</template>
          </el-input>
        </el-form-item>
        <el-form-item label="凭证：" prop="certificate">
          <imgUpload v-model="form.certificate" title="上传凭证图片" />
        </el-form-item>
        <div style="text-align:center">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="$router.back(-1)">返回</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import imgUpload from '@/views/audit/imgUpload'
export default {
  components: {
    imgUpload
  },
  data() {
    return {
      form: {
        applicationBudget: '0.00',
        certificate: ''
      },
      loading: false,
      data: {},
      rules: {
        applicationBudget: [
          { required: true, message: '请填写金额', trigger: 'blur' }
        ],
        certificate: [
          { required: true, message: '请上传凭证' }
        ]
      }
    }
  },
  watch: {
    'form.certificate': {
      handler(newName, oldName) {
        this.$refs.form.validateField('certificate')
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.$api.get('/api/sys/activity/detail', {
        id: this.$route.query.id
      }).then(res => {
        this.data = res
      })
    } else {
      this.$message.error('参数错误')
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(v => {
        if (!v) return
        var { applicationBudget, certificate } = this.form
        if (applicationBudget == 0) {
          this.$message.error('预算金额需大于0')
          return
        }
        this.loading = true
        this.$api.post('/api/sys/activity/budget/detailed/add', {
          activityId: this.data.id,
          applicationBudget: applicationBudget.replace(/,/g, ''),
          certificate
        }).then(res => {
          this.loading = false
          this.$message.success('申请成功')
          this.$router.back(-1)
        }).catch(e => {
          this.loading = false
        })
      })
    },
    // 金额失去焦点
    moneyBlur(object, name, num) {
      var m = object[name] && parseFloat(object[name]) || 0
      // 首先是大于0
      if (m < 0) {
        m -= m
      }
      object[name] = this.formatMoney(m, num)
    },
    // 金额焦点
    moneyFocus(object, name) {
      object[name] = (object[name] + '').replace(/,/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  text-align: center;
}
.body{
  margin: 10vh 0 0;
}
.title{
  font-size: 2rem;
}
.form{
  margin: 50px auto 0;
  background-color: white;
  padding: 25px;
  max-width: 600px;
  text-align: left;
}
</style>
