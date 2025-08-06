<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-date-picker
          v-model="query.foundTime"
          type="datetime"
          placeholder="选择发现时间"
          value-format="yyyy-MM-ddTHH:mm:ss"
          style="width: 200px;"
          class="filter-item"
        />
        <el-input-number v-model="query.highRiskCount" placeholder="高风险数量" style="width: 150px;" class="filter-item" :min="0" />
        <el-input-number v-model="query.mediumRiskCount" placeholder="中风险数量" style="width: 150px;" class="filter-item" :min="0" />
        <el-input-number v-model="query.lowRiskCount" placeholder="低风险数量" style="width: 150px;" class="filter-item" :min="0" />
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetQuery">重置</el-button>
      </div>
      <crudOperation :permission="permission" :crud="crud" />
    </div>
    
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="发现时间" prop="foundTime">
          <el-date-picker
            v-model="form.foundTime"
            type="datetime"
            style="width: 370px;"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="高风险数量" prop="highRiskCount">
          <el-input-number v-model="form.highRiskCount" :min="0" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="中风险数量" prop="mediumRiskCount">
          <el-input-number v-model="form.mediumRiskCount" :min="0" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="低风险数量" prop="lowRiskCount">
          <el-input-number v-model="form.lowRiskCount" :min="0" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="tableData" highlight-current-row stripe style="width: 100%" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80px" />
      <el-table-column prop="foundTime" label="发现时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.foundTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="highRiskCount" label="高风险数量" width="120">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.highRiskCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="mediumRiskCount" label="中风险数量" width="120">
        <template slot-scope="scope">
          <el-tag type="warning">{{ scope.row.mediumRiskCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lowRiskCount" label="低风险数量" width="120">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.lowRiskCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin','vulnStat:edit','vulnStat:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :crud="crud"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :crud="crud" />
  </div>
</template>

<script>
import crudVulnStat from '@/api/stat/vulnStat'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { parseTime } from '@/utils/index'

const defaultForm = { 
  id: null,
  foundTime: new Date().toISOString().split('.')[0],
  highRiskCount: 0,
  mediumRiskCount: 0,
  lowRiskCount: 0
}

export default {
  name: 'VulnerabilityStat',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ 
      title: '漏洞统计',
      url: 'api/stat/vuln-stat',
      sort: 'foundTime,desc',
      crudMethod: { ...crudVulnStat },
      optShow: {
        add: true,
        edit: true,
        del: true,
        download: false
      }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'vulnStat:add'],
        edit: ['admin', 'vulnStat:edit'],
        del: ['admin', 'vulnStat:del']
      },
      rules: {
        foundTime: [
          { required: true, message: '请选择发现时间', trigger: 'change' }
        ],
        highRiskCount: [
          { required: true, message: '请输入高风险数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字', trigger: 'blur' }
        ],
        mediumRiskCount: [
          { required: true, message: '请输入中风险数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字', trigger: 'blur' }
        ],
        lowRiskCount: [
          { required: true, message: '请输入低风险数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字', trigger: 'blur' }
        ]
      },
      // 查询参数
      query: {
        foundTime: null,
        highRiskCount: null,
        mediumRiskCount: null,
        lowRiskCount: null
      },
      // 实际用于筛选的参数
      filterParams: {
        foundTime: null,
        highRiskCount: null,
        mediumRiskCount: null,
        lowRiskCount: null
      },
      // 是否启用筛选
      isFiltering: false
    }
  },
  computed: {
    // 表格数据
    tableData() {
      // 如果未启用筛选，直接返回原始数据
      if (!this.isFiltering) {
        return this.crud.data || [];
      }
      
      // 启用筛选时，进行数据过滤
      if (!this.crud.data) return [];
      
      let result = [...this.crud.data];
      
      // 发现时间筛选
      if (this.filterParams.foundTime) {
        result = result.filter(item => 
          item.foundTime && item.foundTime.includes(this.filterParams.foundTime)
        );
      }
      
      // 高风险数量筛选
      if (this.filterParams.highRiskCount !== null) {
        result = result.filter(item => 
          item.highRiskCount === this.filterParams.highRiskCount
        );
      }
      
      // 中风险数量筛选
      if (this.filterParams.mediumRiskCount !== null) {
        result = result.filter(item => 
          item.mediumRiskCount === this.filterParams.mediumRiskCount
        );
      }
      
      // 低风险数量筛选
      if (this.filterParams.lowRiskCount !== null) {
        result = result.filter(item => 
          item.lowRiskCount === this.filterParams.lowRiskCount
        );
      }
      
      return result;
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      // 将当前查询参数复制到筛选参数
      this.filterParams = JSON.parse(JSON.stringify(this.query));
      // 启用筛选
      this.isFiltering = true;
      // 添加调试日志
      console.log('搜索参数:', this.filterParams);
      // 强制表格重新渲染
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    // 重置查询条件
    resetQuery() {
      // 重置查询参数
      this.query.foundTime = null;
      this.query.highRiskCount = null;
      this.query.mediumRiskCount = null;
      this.query.lowRiskCount = null;
      // 重置筛选参数
      this.filterParams = JSON.parse(JSON.stringify(this.query));
      // 禁用筛选，显示全部数据
      this.isFiltering = false;
      // 更新视图
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    // 权限检查
    checkPer(permissions) {
      if (permissions && permissions instanceof Array && permissions.length > 0) {
        const roles = this.$store.getters && this.$store.getters.roles
        const permissionRoles = permissions
        return roles.some(role => {
          return permissionRoles.includes(role)
        })
      } else {
        return false
      }
    },
    // 格式化时间
    parseTime
  }
}
</script>

<style scoped>
.date-item {
  display: inline-block;
  margin-right: 8px;
}
</style> 