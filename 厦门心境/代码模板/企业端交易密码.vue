<template>
  <!-- 
      isExpenditure 
      是否是支出型交易  支出型交易才有短信验证
      true时有短信验证  默认false
  -->
    <!-- 交易密码弹窗 -->
    <pay-pwd
      v-model="tranpwd"
      :show.sync="tranpwdShow"
      @close="tranpwdClose"
      @submit="tranpwdSubmit"
      isExpenditure
    >
      <!-- 提示语 -->
      <div slot="body_top">
      </div>
    </pay-pwd>
</template>

<script>
import payPwd from '@/views/financialManage/components/payPwd'
export default {
  components: { payPwd },
  data(){
    return {
      //交易密码部分
      tranpwd:'',
      tranpwdShow:false,
    }
  },
  methods:{
    // 交易密码提交
    tranpwdSubmit(resolve, reject) {
      if (this.tranpwd.length < 6) {
        this.$message.error('请输入6位交易密码')
        reject()
      } else {
        //todo
        resolve()
      }
    },
    // 交易密码弹窗关闭
    tranpwdClose() {
      
    },
  }
}
</script>

<style>

</style>