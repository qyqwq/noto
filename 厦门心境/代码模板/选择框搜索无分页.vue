<template>
  <el-form-item label="所属网点：" prop="netId">
    <el-select
      v-model="rowData.netId"
      no-data-text="暂无网点"
      class="region_select"
      filterable
      placeholder="请选择"
      :filter-method="netSearch"
      :loading="loading"
      @visible-change="netVisibleChange"
    >
      <el-option
        v-for="item in netList"
        :key="item.id"
        :label="`${item.name} / ${item.id}`"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  data() {
    return {
      rowData: {
        netId: "", // 网点id
      },
      //搜索框需要参数
      loading: false, // 加载提示
      netList: [], // 展示用
      netList_cache: [], // 备份
    };
  },
  mounted() {
    // 获取网点列表
    this.getnetList_cache();
  },
  methods: {
    // 弹窗关闭
    detail_close() {
      // 还原备份
      this.netList = this.netList_cache;
    },
    // 列表
    getnetList_cache(query) {
      var p = Object.assign(this.netParams, query);
      this.loading = true;
      this.$api.get("/api/ct/network/dot/list", { p }).then((res) => {
        this.netList_cache = res.list;
        this.netList = res.list;
        this.loading = false;
      });
    },
    // 搜索
    netSearch(query) {
      if (query) {
        this.netList = this.netList_cache.filter((e) => {
          const s = e.name + "/" + e.id;
          return s.indexOf(query) >= 0;
        });
      } else {
        this.netList = this.netList_cache;
      }
    },
    // 失去焦点
    netVisibleChange() {
      this.netList = this.netList_cache;
    },
  },
};
</script>

<style>
</style>