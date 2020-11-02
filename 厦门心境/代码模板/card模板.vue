<template>
  <div class="content">
    <el-row>
      <!-- 员工新增/修改 -->
      <el-col :span="24" class="col1">
        <div class="card">
          <div class="title">
            <span class="blue" />
            {{ lang.title }}
          </div>
          <div class="body">
            
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getLanguage } from '@/lang/index'
var lang = {
  zh: {
    title: '员工新增/修改'
  }
}
export default {
  data: function() {
    return {
      lang: lang[getLanguage()] // 语言

    }
  },
  watch: {
    // 语言
    '$i18n.locale': function() {
      this.lang = lang[this.$i18n.locale]
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  background-color: #f2f2f2;
  position: absolute;
  width: 100%;
  height: 100%;
}
.col1{
  padding: 10px;
  .card{
    background-color: white;
    border-radius: 5px;
    .title{
      height: 60px;
      display: flex;
      align-items: center;
      border: 1px solid #F2F2F2;
      border-width: 0 0 1px 0;
      .blue{
        margin: 0 20px 0 0;
        background-color: #009AFF;
        height: 20px;
        width: 3px;
      }
    }
    .body{
      padding: 20px;
      .neirong{
        .col{
          line-height: 40px;
        }
        .left{
          color: #666666;
        }
        .right_2{
          text-align: right;
        }
      }
    }
  }
}
.col2{

}
</style>
