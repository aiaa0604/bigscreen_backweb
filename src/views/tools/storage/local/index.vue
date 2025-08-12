<template>
  <div class="app-container" style="padding: 8px;">
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入内容模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission">
        <el-button
          slot="left"
          v-permission="['admin','storage:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-upload"
          @click="crud.toAdd"
        >上传
        </el-button>
      </crudOperation>
    </div>
    
    <!-- 表单组件 -->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.add ? '文件上传' : '编辑文件'" width="500px">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-form-item label="文件名">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        
        <el-form-item v-if="crud.status.add" label="上传">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :action="fileUploadApi + '?name=' + form.name"
          >
            <div class="eladmin-upload"><i class="el-icon-upload" /> 添加文件</div>
            <div slot="tip" class="el-upload__tip">可上传任意格式文件，CSV文件将自动过滤空白列，且不超过100M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
        <el-button v-else :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    
    <!-- 表格渲染 -->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="文件名">
        <template slot-scope="scope">
          <el-popover
            :content="'file/' + scope.row.type + '/' + scope.row.realName"
            placement="top-start"
            title="路径"
            width="200"
            trigger="hover"
          >
            <a
              slot="reference"
              :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
              class="el-link--primary"
              style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
              target="_blank"
            >
              {{ scope.row.name }}
            </a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="预览图">
        <template slot-scope="{row}">
          <el-image
            :src=" baseApi + '/file/' + row.type + '/' + row.realName"
            :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.realName]"
            fit="contain"
            lazy
            class="el-avatar"
          >
            <div slot="error">
              <i class="el-icon-document" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="suffix" label="文件类型" />
      <el-table-column prop="type" label="类别" />
      <el-table-column prop="size" label="大小" />
      <el-table-column prop="operate" label="操作人" />
      <el-table-column prop="createTime" label="创建日期" />
    </el-table>
    
    <!-- 分页组件 -->
    <pagination />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import crudFile from '@/api/tools/localStorage'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Papa from 'papaparse'

const defaultForm = { id: null, name: '' }
export default {
  components: { pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '文件', url: 'api/localStorage', crudMethod: { ...crudFile }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      delAllLoading: false,
      loading: false,
      headers: { 'Authorization': getToken() },
      permission: {
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      },
      processedCsvData: null
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadApi'
    ])
  },
  created() {
    this.crud.optShow.add = false
  },
  methods: {
    async upload() {
      try {
        // 获取上传的文件
        const uploadFiles = this.$refs.upload?.uploadFiles || []
        if (uploadFiles.length === 0) {
          this.$message.warning('请选择文件后再上传')
          return
        }
        const file = uploadFiles[0]

        // 安全检查：确保crud.data存在且是数组
        if (!Array.isArray(this.crud.data)) {
          this.processFileUpload(file)
          return
        }

        // 检查文件是否已导入（更健壮的实现）
        const fileSizeKB = (file.size / 1024).toFixed(2)
        const isDuplicate = this.crud.data.some(item => {
          // 检查项目是否有效
          if (!item || typeof item !== 'object') return false
          // 比较文件名和大小
          return item.name === file.name && 
                 item.size && 
                 item.size.includes(fileSizeKB)
        })

        if (isDuplicate) {
          // 重复文件提醒
          this.$confirm(`文件 "${file.name}" 已存在，是否继续上传?`, '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.processFileUpload(file)
          }).catch(() => {
            this.$message.info('已取消上传')
          })
        } else {
          // 新文件直接处理
          this.processFileUpload(file)
        }
      } catch (error) {
        console.error('上传处理出错:', error)
        this.$message.error('处理上传时发生错误，请重试')
        this.loading = false
      }
    },

    processFileUpload(file) {
      try {
        this.loading = true
        
        // 检查是否为CSV文件
        const isCsv = file.name.toLowerCase().endsWith('.csv') || 
                     file.type === 'text/csv'

        if (isCsv) {
          const reader = new FileReader()
          
          reader.onload = (e) => {
            try {
              // 解析CSV
              const result = Papa.parse(e.target.result, {
                header: true,
                skipEmptyLines: true,
                error: (err) => {
                  console.error('CSV解析错误:', err)
                  this.$message.error(`CSV解析错误: ${err.message}`)
                  this.loading = false
                }
              })

              // 检查解析结果
              if (!result || !result.data || result.data.length === 0) {
                this.$message.warning('CSV文件中没有有效数据')
                this.loading = false
                return
              }

              // 过滤空白列
              const rawHeaders = Object.keys(result.data[0] || {})
              const validHeaders = rawHeaders.filter(header => 
                typeof header === 'string' && header.trim() !== ''
              )

              if (validHeaders.length === 0) {
                this.$message.error('CSV文件没有有效列')
                this.loading = false
                return
              }

              // 处理数据行
              this.processedCsvData = result.data.map(row => {
                const filteredRow = {}
                validHeaders.forEach(header => {
                  filteredRow[header] = row[header] !== undefined ? row[header] : ''
                })
                return filteredRow
              })

              this.$message.success(`CSV解析成功，共${this.processedCsvData.length}行数据，已过滤空白列`)
              this.submitProcessedCsv()
            } catch (error) {
              console.error('CSV处理出错:', error)
              this.$message.error(`处理CSV失败: ${error.message || '未知错误'}`)
              this.loading = false
            }
          }

          reader.onerror = () => {
            this.$message.error('文件读取失败，请检查文件是否损坏')
            this.loading = false
          }

          reader.readAsText(file)
        } else {
          // 非CSV文件直接上传
          this.$refs.upload.submit()
        }
      } catch (error) {
        console.error('文件处理出错:', error)
        this.$message.error('文件处理时发生错误，请重试')
        this.loading = false
      }
    },

    submitProcessedCsv() {
      try {
        if (!this.processedCsvData) {
          this.$message.error('没有可提交的CSV数据')
          this.loading = false
          return
        }

        const formData = new FormData()
        const csvContent = Papa.unparse(this.processedCsvData)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        formData.append('file', blob, this.form.name || 'processed.csv')
        
        // 调用上传API
        crudFile.upload(formData, { ...this.headers })
          .then(response => {
            this.handleSuccess(response)
          })
          .catch(error => {
            this.handleError(error)
          })
      } catch (error) {
        console.error('提交CSV数据出错:', error)
        this.$message.error('提交数据时发生错误，请重试')
        this.loading = false
      }
    },

    beforeUpload(file) {
      try {
        // 大小限制检查
        const maxSizeMB = 100
        const isLtMaxSize = file.size / 1024 / 1024 < maxSizeMB
        
        if (!isLtMaxSize) {
          this.$message.error(`上传文件大小不能超过 ${maxSizeMB}MB!`)
          return false
        }
        
        // 设置文件名
        this.form.name = file.name
        return true
      } catch (error) {
        console.error('文件上传前检查出错:', error)
        this.$message.error('文件检查失败，请重试')
        return false
      }
    },

    handleSuccess(response) {
      try {
        this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.$refs.upload?.clearFiles()
        this.processedCsvData = null
        this.crud.status.add = CRUD.STATUS.NORMAL
        this.crud.resetForm()
        this.crud.toQuery()
      } catch (error) {
        console.error('处理成功回调出错:', error)
      } finally {
        this.loading = false
      }
    },

    handleError(error) {
      try {
        let errorMessage = '上传失败'
        if (error && error.message) {
          try {
            const errorObj = JSON.parse(error.message)
            errorMessage = errorObj.message || errorMessage
          } catch (e) {
            errorMessage = error.message
          }
        }
        this.$notify({
          title: errorMessage,
          type: 'error',
          duration: 2500
        })
      } catch (err) {
        console.error('处理错误回调出错:', err)
        this.$notify({
          title: '上传失败',
          type: 'error',
          duration: 2500
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
 ::v-deep .el-image__error, .el-image__placeholder{
    background: none;
  }
 ::v-deep .el-image-viewer__wrapper{
    top: 55px;
  }
</style>
