<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" @tab-click="tabClick">
    <el-tab-pane label="CSV导入" name="import">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>CSV文件导入</span>
        </div>
         <!-- 文件上传区域 -->
         <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :before-upload="beforeUpload"
          :file-list="fileList"
          accept=".csv"
          :limit="1"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传csv文件，且不超过10MB</div>
        </el-upload>
        <!-- 默认展示的按钮区域 -->
        <div class="default-actions">
                     <el-button type="primary" icon="el-icon-view" @click="previewFile" :loading="previewLoading" :disabled="!selectedFile">
            预览数据
          </el-button>
          <el-button type="success" icon="el-icon-upload" @click="importData" :loading="importLoading" :disabled="!previewData.length || !targetTable">
            导入数据
          </el-button>
          <el-button type="warning" icon="el-icon-delete" @click="clearFile">
            清除文件
          </el-button>
          <el-button type="info" icon="el-icon-download" @click="downloadTemplate" :disabled="!targetTable">
            下载示例数据
          </el-button>
        </div>

        <!-- 导入到表的下拉栏 -->
        <div class="table-select-section">
          <el-form :inline="true" label-width="100px">
            <el-form-item label="导入到表">
              <el-select v-model="targetTable" placeholder="请选择目标表" style="width: 300px;" @change="handleTableChange">
                <el-option 
                  v-for="table in filteredTables" 
                  :key="table.value" 
                  :label="table.label" 
                  :value="table.value" 
                />
                <el-option label="新建表..." value="__new__" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>

       

        <!-- 文件信息显示 -->
        <div v-if="selectedFile" class="file-info">
          <el-alert
            :title="`已选择文件: ${selectedFile.name}`"
            type="success"
            :closable="false"
            show-icon
          />
        </div>

        <!-- 新建表弹窗 -->
        <el-dialog title="新建表" :visible.sync="showCreateTable" width="600px">
          <el-form label-width="80px">
            <el-form-item label="表名">
              <el-input v-model="newTableName" placeholder="请输入新表名" />
            </el-form-item>
            <el-table :data="columns" border style="width: 100%;">
              <el-table-column prop="name" label="字段名" />
              <el-table-column prop="type" label="类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.type" placeholder="请选择类型" style="width: 120px;">
                    <el-option label="字符串" value="varchar(255)" />
                    <el-option label="整数" value="int" />
                    <el-option label="浮点数" value="float" />
                    <el-option label="日期" value="datetime" />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showCreateTable = false">取消</el-button>
            <el-button type="primary" @click="createTable">创建</el-button>
          </div>
        </el-dialog>

        <!-- 预览数据表格 -->
        <div v-if="previewData.length > 0" class="preview-section">
          <h3>数据预览 (显示前10行)</h3>
          <el-table
            :data="previewData"
            border
            style="width: 100%"
            max-height="400"
          >
            <el-table-column
              v-for="(header, index) in tableHeaders"
              :key="index"
              :prop="header"
              :label="header"
              min-width="120"
            />
          </el-table>
          <div class="preview-stats">
            <el-tag type="info">总行数: {{ totalRows }}</el-tag>
            <el-tag type="success">预览行数: {{ previewData.length }}</el-tag>
          </div>
        </div>

        <!-- 导入结果 -->
        <div v-if="importResult" class="import-result">
          <el-alert
            :title="importResult.success ? '导入成功' : '导入失败'"
            :type="importResult.success ? 'success' : 'error'"
            :description="importResult.message"
            show-icon
          />
        </div>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="使用说明" name="help">
      <div>
        <blockquote class="my-blockquote">CSV文件格式要求</blockquote>
        <pre class="my-code">
# 支持标准CSV格式，文件编码建议使用UTF-8
# 第一行必须包含列标题（字段名）
# 数据行之间用逗号分隔
# 如果字段值包含逗号，请用双引号包围
# 文件大小不超过10MB</pre>
        <blockquote class="my-blockquote">导入流程</blockquote>
        <pre class="my-code">
1. 选择目标表类型（支持的表类型见对照表）
2. 点击"下载示例数据"获取标准格式文件
3. 根据示例数据格式准备CSV文件
4. 拖拽或点击上传文件
5. 点击"预览数据"查看前10行
6. 确认格式无误后点击"导入数据"
7. 等待导入完成并查看结果</pre>
        <blockquote class="my-blockquote">支持的表类型对照</blockquote>
        <pre class="my-code">
abnormal_event_stat - 网络异常事件统计
alarm_count_stat - 报警次数
alert_region_stat - 境内外报警排名
asset_list - 资产列表
asset_stat - 资产情况
attack_flyline - 实时攻击监测
outbound_ip_stat - 外联IP统计
risk_score - 风险评分
security_event - 安全事件
vulnerability_fix_stat - 漏洞修复情况
vulnerability_record - 漏洞情况列表
vulnerability_stat - 漏洞分布情况
duty_schedule - 值班列表
device_stat - 设备总览</pre>
        <blockquote class="my-blockquote">示例数据下载</blockquote>
        <pre class="my-code">
# 选择目标表类型后，"下载示例数据"按钮将被激活
# 点击按钮可下载对应表类型的标准格式示例文件
# 示例文件包含正确的字段结构和示例数据
# 可根据示例文件格式准备实际导入数据</pre>
        <blockquote class="my-blockquote">注意事项</blockquote>
        <pre class="my-code">
# 确保CSV文件格式正确
# 检查数据编码（建议UTF-8）
# 大文件建议分批导入
# 导入前请备份重要数据
# 选择正确的目标表类型
# 建议先下载示例数据了解格式要求</pre>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Papa from 'papaparse'
import { getAllTables, createTable as apiCreateTable, importCsv as apiImportCsv } from '@/api/tools/csvImport'

export default {
  name: 'CsvImport',
  data() {
    return {
      activeName: 'import',
      fileList: [],
      selectedFile: null,
      previewData: [],
      tableHeaders: [],
      totalRows: 0,
      previewLoading: false,
      importLoading: false,
      importResult: null,
      uploadFormData: null,
      tables: [],
      targetTable: '',
      showCreateTable: false,
      newTableName: '',
      columns: [],
      // 对照表配置
      tableMapping: {
        'abnormal_event_stat': '网络异常事件统计',
        'alarm_count_stat': '报警次数',
        'alert_region_stat': '境内外报警排名',
        'asset_list': '资产列表',
        'asset_stat': '资产情况',
        'attack_flyline': '实时攻击监测',
        'outbound_ip_stat': '外联IP统计',
        'risk_score': '风险评分',
        'security_event': '安全事件',
        'vulnerability_fix_stat': '漏洞修复情况',
        'vulnerability_record': '漏洞情况列表',
        'vulnerability_stat': '漏洞分布情况',
        'duty_schedule': '值班列表',
        'device_stat': '设备总览'
      }
    }
  },
  computed: {
    // 根据对照表筛选的表单选项
    filteredTables() {
      return Object.entries(this.tableMapping).map(([key, value]) => ({
        value: key,
        label: value
      }))
    }
  },
  mounted() {
    this.getTables()
  },
  methods: {
    tabClick(name) {},
    // 获取所有表名（后端API实现）
    getTables() {
      getAllTables().then(res => {
        this.tables = Array.isArray(res.data) ? res.data : res.data.tables || []
      }).catch(() => {
        this.tables = []
      })
    },
    // 文件选择处理
    handleFileChange(file) {
      this.selectedFile = file.raw
      this.previewData = []
      this.tableHeaders = []
      this.totalRows = 0
      this.importResult = null
      this.targetTable = ''
      // 准备上传数据
      this.uploadFormData = new FormData()
      this.uploadFormData.append('file', file.raw)
    },
    // 上传前验证
    beforeUpload(file) {
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv')
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isCSV) {
        this.$message.error('只能上传CSV文件!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('文件大小不能超过10MB!')
        return false
      }
      return false // 阻止自动上传
    },
    // 选择表变化
    handleTableChange(val) {
      if (val === '__new__') {
        this.newTableName = ''
        this.columns = this.tableHeaders.map(h => ({ name: h, type: 'varchar(255)' }))
        this.showCreateTable = true
      }
    },
    // 新建表
    createTable() {
      if (!this.newTableName) {
        this.$message.error('请输入表名')
        return
      }
      if (!this.columns.every(col => col.type)) {
        this.$message.error('请为所有字段选择类型')
        return
      }
      // 确保columns结构正确
      const columns = this.columns.map(col => ({
        name: col.name,
        type: col.type
      }))
      apiCreateTable({
        tableName: this.newTableName,
        columns: columns
      }).then(() => {
        this.getTables()
        this.targetTable = this.newTableName
        this.showCreateTable = false
        this.$message.success('新建表成功')
      }).catch(() => {
        this.$message.error('新建表失败')
      })
    },
    // 预览文件数据
    previewFile() {
      if (!this.selectedFile) {
        this.$message.warning('请先选择文件')
        return
      }
      this.previewLoading = true
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const csv = e.target.result
          const results = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            preview: 10 // 只预览前10行
          })
          if (results.errors.length > 0) {
            this.$message.error('CSV文件格式错误，请检查文件内容')
            return
          }
          this.tableHeaders = results.meta.fields || []
          this.previewData = results.data
          this.totalRows = results.data.length
          this.$message.success('文件预览成功')
        } catch (error) {
          this.$message.error('文件解析失败: ' + error.message)
        } finally {
          this.previewLoading = false
        }
      }
      reader.onerror = () => {
        this.$message.error('文件读取失败')
        this.previewLoading = false
      }
      reader.readAsText(this.selectedFile)
    },
    // 导入数据（后端API实现）
    importData() {
      if (!this.selectedFile || this.previewData.length === 0 || !this.targetTable) {
        this.$message.warning('请先选择并预览文件，并选择目标表')
        return
      }
      this.importLoading = true
      
      // 根据对照表获取实际表名
      const actualTableName = this.targetTable
      
      apiImportCsv({
        tableName: actualTableName,
        data: this.previewData,
        fileName: this.selectedFile.name
      }).then(response => {
        this.importResult = {
          success: true,
          message: `成功导入 ${response.data && response.data.importedCount ? response.data.importedCount : this.previewData.length} 条数据到表 ${this.tableMapping[actualTableName] || actualTableName}`
        }
        this.$message.success('数据导入成功')
        this.clearFile()
      }).catch(error => {
        this.importResult = {
          success: false,
          message: error.message || '导入失败，请检查文件格式'
        }
        this.$message.error('导入失败: ' + (error.message || '未知错误'))
      }).finally(() => {
        this.importLoading = false
      })
    },
    // 清除文件
    clearFile() {
      this.selectedFile = null
      this.fileList = []
      this.previewData = []
      this.tableHeaders = []
      this.totalRows = 0
      this.importResult = null
      this.uploadFormData = null
      this.targetTable = ''
    },
    // 下载示例数据
    downloadTemplate() {
      if (!this.targetTable) {
        this.$message.warning('请先选择目标表')
        return
      }
      
      // 检查是否有对应的示例数据文件
      const fileName = `${this.targetTable}.csv`
      
      // 创建下载链接
      const link = document.createElement('a')
      link.href = `/${fileName}`
      link.download = fileName
      link.target = '_blank'
      
      // 添加到DOM并触发下载
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      this.$message.success(`示例数据下载成功: ${this.tableMapping[this.targetTable] || this.targetTable}`)
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}
.default-actions {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.default-actions .el-button {
  margin-right: 10px;
}
.file-info {
  margin-top: 20px;
}
.file-actions {
  margin-top: 15px;
}
.file-actions .el-button {
  margin-right: 10px;
}
.table-select-section {
  margin: 20px 0 10px 0;
}
.preview-section {
  margin-top: 30px;
}
.preview-section h3 {
  margin-bottom: 15px;
  color: #303133;
}
.preview-stats {
  margin-top: 15px;
}
.preview-stats .el-tag {
  margin-right: 10px;
}
.import-result {
  margin-top: 20px;
}
.upload-demo {
  width: 100%;
}
.template-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.template-tip {
  margin-left: 10px;
  color: #606266;
  font-size: 14px;
}
.my-blockquote {
  margin: 0 0 10px;
  padding: 0 0 0 10px;
  border-left: 4px solid #ddd;
  color: #666;
  font-size: 14px;
}
.my-code {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: #333;
}
</style> 