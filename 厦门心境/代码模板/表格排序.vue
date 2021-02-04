<el-table
   @sort-change="tableSearch"
>
  <el-table-tiem
      prop="eptidsort"
      sortable="custom"
    >
        

        // 表格排序
    tableSearch({ column, prop, order }) {
      // order 值: ascending descending
      this.params.optimesort = ''
      this.params.audittimesort = ''
      this.params.eptidsort = ''
      if (order) {
        var a = order === 'ascending' ? 'asc' : 'desc'
        this.params[prop] = a
      }
      this.getList()
    },

    tableSearch({ column, prop, order }) {
      // order 值: ascending descending
      this.params.sortname = ''
      this.params.sortvalue = ''
      if (order) {
        var a = order === 'ascending' ? 'asc' : 'desc'
        this.params.sortname = prop
        this.params.sortvalue = a
      }
      this.getList()
    },