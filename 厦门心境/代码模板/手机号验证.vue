<template>
  <div 
    prop="phone" 
    :rules="[{ validator: phoneTest, trigger: 'blur' }]"
  >

              <el-row class="select">
                <el-col :span="10">
                  <el-form-item
                    prop="countryCode"
                    :rules="[{validator:countryCodeTest, trigger: 'change' }]"
                  >
                    <el-select
                      v-model="form.countryCode"
                      style="width:90%"
                      :disabled="!!form.auditId"
                      clearable
                      placeholder="国家"
                      @change="()=>{$refs.form.validateField('phone')}"
                    >
                      <el-option
                        v-for="(item,key) in areaCode"
                        :key="key"
                        :label="`+${key} (${item})`"
                        :value="key"
                      />
                    </el-select>
                  </el-form-item>

                </el-col>
                <el-col :span="14">
                  <el-form-item
                    prop="phone"
                    :rules="[{validator:phoneTest, trigger: 'blur' }]"
                  >
                    <el-input
                      v-model="form.phone"
                      :disabled="!!form.auditId"
                      style="width:100%"
                      placeholder="联系电话"
                      maxlength="11"
                      @input="input_number('form.phone')"
                    />
                  </el-form-item>

                </el-col>

              </el-row>
  </div>
</template>

<script>
export default {
  methods:{
    // 自定义电话选择验证
    countryCodeTest(rule, value, callback) {
      if (!this.form.countryCode) {
        callback(new Error('请选择区号'))
      } else {
        callback()
      }
    },
    //
    phoneTest(rule, value, callback) {
      if (value) {
        callback(this.$phoneCheck(this.form.countryCode, value))
        // callback()
      } else {
        callback(new Error('请输入联系电话'))
      }
    },
  }
};
</script>

<style>
</style>