<template>
  <el-form-item
    label="9CashID："
  >
    <el-select
      v-model="temp.wtUserId"
      placeholder="请选择 ID / 昵称"
      no-data-text="暂无该ID"
      filterable
      :filter-method="idSearch"
      reserve-keyword
      clearable
      style="width: 280px"
      @visible-change="wtUserIdVisibleChange"
    >
      <div v-infinite-scroll="wtLazyLoad" :infinite-scroll-delay="200">
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="`${item.id} / ${item.nickname}`"
          :value="item.id"
        />
        <div
          v-show="id_loading"
          style="
            font-size: 14px;
            padding: 0 20px;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #606266;
            height: 34px;
            line-height: 34px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
          "
        >
          加载中...
        </div>
      </div>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  data() {
    return{
      temp:{
        wtUserId:''
      },
      // 9CashId加载提示
      user_params: {
        page: 1,
        limit: 20,
        idOrName: ''
      },
      userList: [], // 展示用
      id_loading: false,
      TimeId: -1,
      is_bottom: false,
      user_ver: 1,
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList(type, ver) {
      var param = this.user_params;
      this.id_loading = true;
      var chache_list = await this.$store.dispatch(
        "getList",
        `${param.page}.${param.limit}.${param.idOrName}`
      );
      // 读缓存
      if (chache_list) {
        this.id_loading = false;
        if (this.user_ver == ver) {
          if (type === 1) {
            this.userList = chache_list;
          } else {
            this.userList = this.userList.concat(chache_list);
          }
        }
        return;
      }
      this.$api.get("/api/ct/employee/info/wtUserList", param).then((res) => {
        if (this.user_ver == ver) {
          if (type === 1) {
            this.userList = res.list;
          } else {
            this.userList = this.userList.concat(res.list);
          }
        }
        // 写入缓存
        this.$store.commit("SET_LIST", {
          param: `${param.page}.${param.limit}.${param.idOrName}`,
          list: res.list,
        });
        // 到底
        if (res.list.length < this.user_params.limit) {
          this.is_bottom = true;
        }
        this.id_loading = false;
      });
    },
    // 9CashID搜索
    idSearch(query) {
      this.user_params.idOrName = query;
      clearTimeout(this.TimeId);
      this.TimeId = setTimeout(() => {
        this.is_bottom = false;
        this.getUserList(1, ++this.user_ver);
      }, 500);
    },
    // 9Cash员工懒加载
    wtLazyLoad() {
      if (this.id_loading || this.is_bottom) return;
      this.user_params.page += 1;
      this.getUserList(2, ++this.user_ver);
    },
    // id搜索失去焦点
    wtUserIdVisibleChange(show) {
      this.user_params.page = 1;
      this.user_params.idOrName = "";
      this.is_bottom = false;
      this.getUserList(1, ++this.user_ver);
    },
  },
};
</script>

<style>
</style>