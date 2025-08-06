<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-date-picker
          v-model="query.statDate"
          type="date"
          placeholder="选择统计日期"
          value-format="yyyy-MM-dd"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select v-model="query.statYear" clearable placeholder="选择年份" class="filter-item" style="width: 120px">
          <el-option
            v-for="item in yearOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select v-model="query.statQuarter" clearable placeholder="选择季度" class="filter-item" style="width: 120px">
          <el-option
            v-for="item in quarterOptions"
            :key="item"
            :label="`第${item}季度`"
            :value="item"
          />
        </el-select>
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetQuery">重置</el-button>
      </div>
      <crudOperation :permission="permission" :crud="crud" />
    </div>
    
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="统计日期" prop="statDate">
          <el-date-picker
            v-model="form.statDate"
            type="date"
            style="width: 370px;"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="统计年份" prop="statYear">
          <el-input-number v-model="form.statYear" :min="2000" :max="2100" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="统计季度" prop="statQuarter">
          <el-input-number v-model="form.statQuarter" :min="1" :max="4" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="成功数量" prop="successCount">
          <el-input-number v-model="form.successCount" :min="0" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="可疑数量" prop="suspiciousCount">
          <el-input-number v-model="form.suspiciousCount" :min="0" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="尝试数量" prop="attemptCount">
          <el-input-number v-model="form.attemptCount" :min="0" style="width: 370px;" />
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
      <el-table-column prop="statDate" label="统计日期" width="120px" />
      <el-table-column label="统计年份" width="100px">
        <template slot-scope="scope">
          {{ scope.row.statYear || extractYear(scope.row.statDate) }}
        </template>
      </el-table-column>
      <el-table-column label="统计季度" width="100px">
        <template slot-scope="scope">
          第{{ scope.row.statQuarter || extractQuarter(scope.row.statDate) }}季度
        </template>
      </el-table-column>
      <el-table-column prop="successCount" label="成功数量" />
      <el-table-column prop="suspiciousCount" label="可疑数量" />
      <el-table-column prop="attemptCount" label="尝试数量" />
      <el-table-column prop="createdAt" label="创建时间" width="150px">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="150px">
        <template slot-scope="scope">
          {{ parseTime(scope.row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin','alarm:edit','alarm:del'])" label="操作" width="150px" align="center">
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
import crudAlarm from '@/api/stat/alarm'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { parseTime } from '@/utils/index'

// 获取当前年份
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

const defaultForm = { 
  id: null, 
  statDate: new Date().toISOString().split('T')[0], 
  statYear: currentYear,
  statQuarter: Math.floor(new Date().getMonth() / 3) + 1,
  successCount: 0, 
  suspiciousCount: 0, 
  attemptCount: 0
}

export default {
  name: 'AlarmStat',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ 
      title: '告警统计', 
      url: 'api/stat/alarm', 
      crudMethod: { ...crudAlarm },
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
        add: ['admin', 'alarm:add'],
        edit: ['admin', 'alarm:edit'],
        del: ['admin', 'alarm:del']
      },
      rules: {
        statDate: [
          { required: true, message: '请选择统计日期', trigger: 'blur' }
        ],
        statYear: [
          { required: true, message: '请输入统计年份', trigger: 'blur' },
          { type: 'number', message: '年份必须为数字', trigger: 'blur' }
        ],
        statQuarter: [
          { required: true, message: '请输入统计季度', trigger: 'blur' },
          { type: 'number', message: '季度必须为数字', trigger: 'blur' }
        ]
      },
      yearOptions: years,
      quarterOptions: [1, 2, 3, 4],
      // 查询参数
      query: {
        statDate: '',
        statYear: null,
        statQuarter: null
      },
      // 实际用于筛选的参数
      filterParams: {
        statDate: '',
        statYear: null,
        statQuarter: null
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
      
      // 统计日期筛选
      if (this.filterParams.statDate) {
        result = result.filter(item => 
          item.statDate && item.statDate.includes(this.filterParams.statDate)
        );
      }
      
      // 统计年份筛选
      if (this.filterParams.statYear) {
        const filterYear = Number(this.filterParams.statYear);
        result = result.filter(item => {
          const itemYear = item.statYear || this.extractYear(item.statDate);
          return Number(itemYear) === filterYear;
        });
      }
      
      // 统计季度筛选
      if (this.filterParams.statQuarter) {
        const filterQuarter = Number(this.filterParams.statQuarter);
        result = result.filter(item => {
          const itemQuarter = item.statQuarter || this.extractQuarter(item.statDate);
          return Number(itemQuarter) === filterQuarter;
        });
      }
      
      return result;
    }
  },
  created() {
    // 确保crud.data初始化为空数组
    if (!this.crud.data) {
      this.crud.data = [];
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
      this.query.statDate = '';
      this.query.statYear = null;
      this.query.statQuarter = null;
      // 重置筛选参数
      this.filterParams = JSON.parse(JSON.stringify(this.query));
      // 禁用筛选，显示全部数据
      this.isFiltering = false;
      // 更新视图
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    // 从日期中提取年份
    extractYear(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.getFullYear();
    },
    // 从日期中提取季度
    extractQuarter(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return Math.floor(date.getMonth() / 3) + 1;
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