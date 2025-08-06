<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.assetIp"
        placeholder="请输入IP地址"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.systemName"
        placeholder="请输入系统名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.organizationName"
        placeholder="请输入所属单位"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-refresh"
        @click="handleReset"
      >
        重置
      </el-button>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operations">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-button
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        :disabled="multipleSelection.length === 0"
        @click="handleDelete"
      >
        批量删除
      </el-button>
      <el-button
        class="filter-item"
        type="success"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在加载..."
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.assetIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.assetPort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统名称" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.systemName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属单位" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.organizationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.updatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <!-- 表单对话框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="IP地址" prop="assetIp">
          <el-input
            v-model="temp.assetIp"
            placeholder="请输入IP地址"
            :disabled="dialogStatus === 'update'"
          />
        </el-form-item>
        <el-form-item label="端口" prop="assetPort">
          <el-input-number
            v-model="temp.assetPort"
            :min="0"
            :max="65535"
            placeholder="请输入端口号"
            :disabled="dialogStatus === 'update'"
          />
        </el-form-item>
        <el-form-item label="系统名称" prop="systemName">
          <el-input
            v-model="temp.systemName"
            placeholder="请输入系统名称"
          />
        </el-form-item>
        <el-form-item label="所属单位" prop="organizationName">
          <el-input
            v-model="temp.organizationName"
            placeholder="请输入所属单位"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudAssetList from '@/api/asset-list'
import Pagination from '@/components/Pagination'

export default {
  name: 'AssetList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        assetIp: undefined,
        systemName: undefined,
        organizationName: undefined,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      },
      multipleSelection: [],
      temp: {
        id: undefined,
        assetIp: '',
        assetPort: 0,
        systemName: '',
        organizationName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑资产',
        create: '新增资产'
      },
      rules: {
        assetIp: [
          { required: true, message: 'IP地址不能为空', trigger: 'blur' },
          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: '请输入正确的IP地址格式', trigger: 'blur' }
        ],
        assetPort: [
          { required: true, message: '端口不能为空', trigger: 'blur' },
          { type: 'number', min: 0, max: 65535, message: '端口号必须在0-65535之间', trigger: 'blur' }
        ],
        systemName: [
          { required: true, message: '系统名称不能为空', trigger: 'blur' }
        ],
        organizationName: [
          { required: true, message: '所属单位不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      crudAssetList.getList(this.listQuery).then(response => {
        this.list = response.content
        this.total = response.totalElements
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        size: 10,
        assetIp: undefined,
        systemName: undefined,
        organizationName: undefined,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      }
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        assetIp: '',
        assetPort: 0,
        systemName: '',
        organizationName: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 检查IP和端口组合是否已存在
          crudAssetList.exists(this.temp.assetIp, this.temp.assetPort).then(response => {
            if (response) {
              this.$message.error('该IP和端口组合已存在')
              return
            }
            // 创建资产
            crudAssetList.add(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          crudAssetList.edit(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      const ids = row.id ? [row.id] : this.multipleSelection.map(item => item.id)
      this.$confirm('确认删除选中的资产?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (ids.length === 1) {
          crudAssetList.del(ids).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        } else {
          crudAssetList.delAll(ids).then(() => {
            this.$notify({
              title: '成功',
              message: '批量删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownload() {
      crudAssetList.download().then(response => {
        const blob = new Blob([response])
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '资产列表.xlsx'
        link.click()
        window.URL.revokeObjectURL(link.href)
      })
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}

.filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}

.table-operations {
  margin-bottom: 16px;
}
</style>