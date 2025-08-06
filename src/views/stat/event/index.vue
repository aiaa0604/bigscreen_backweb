<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.content" clearable placeholder="事件内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.systemName" clearable placeholder="系统名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.ipAddress" clearable placeholder="IP地址" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.source" clearable placeholder="事件来源" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.status" clearable placeholder="处理状态" style="width: 120px;" class="filter-item">
          <el-option label="未处理" value="unhandled" />
          <el-option label="处理中" value="processing" />
          <el-option label="已处理" value="handled" />
          <el-option label="已关闭" value="closed" />
        </el-select>
        <date-range-picker v-model="query.eventTime" class="date-item" />
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetQuery">重置</el-button>
      </div>
      <crudOperation :permission="permission" :crud="crud" />
    </div>
    
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="事件内容" prop="content">
          <el-input v-model="form.content" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="系统名称" prop="systemName">
          <el-input v-model="form.systemName" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input v-model="form.ipAddress" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="事件来源" prop="source">
          <el-input v-model="form.source" style="width: 450px;" />
        </el-form-item>
        <el-form-item label="处理状态" prop="status">
          <el-select v-model="form.status" style="width: 450px;">
            <el-option label="未处理" value="unhandled" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="handled" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件时间" prop="eventTime">
          <el-date-picker
            v-model="form.eventTime"
            type="datetime"
            style="width: 450px;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
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
      <el-table-column prop="content" label="事件内容" />
      <el-table-column prop="systemName" label="系统名称" />
      <el-table-column prop="ipAddress" label="IP地址" />
      <el-table-column prop="source" label="事件来源" />
      <el-table-column prop="status" label="处理状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="eventTime" label="事件时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.eventTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin','event:edit','event:del'])" label="操作" width="150px" align="center">
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
import crudEvent from '@/api/stat/event'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import { parseTime } from '@/utils/index'

const defaultForm = { 
  id: null,
  content: null,
  systemName: null,
  ipAddress: null,
  source: null,
  status: 'unhandled',
  eventTime: new Date().toISOString().split('.')[0]
}

export default {
  name: 'SecurityEvent',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ 
      title: '安全事件',
      url: 'api/stat/event',
      sort: 'eventTime,desc',
      crudMethod: { ...crudEvent },
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
        add: ['admin', 'event:add'],
        edit: ['admin', 'event:edit'],
        del: ['admin', 'event:del']
      },
      rules: {
        content: [
          { required: true, message: '请输入事件内容', trigger: 'blur' }
        ],
        systemName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' }
        ],
        ipAddress: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请输入事件来源', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择处理状态', trigger: 'change' }
        ],
        eventTime: [
          { required: true, message: '请选择事件时间', trigger: 'change' }
        ]
      },
      // 查询参数
      query: {
        content: '',
        systemName: '',
        ipAddress: '',
        source: '',
        status: null,
        eventTime: null
      },
      // 实际用于筛选的参数
      filterParams: {
        content: '',
        systemName: '',
        ipAddress: '',
        source: '',
        status: null,
        eventTime: null
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
      
      // 事件内容筛选
      if (this.filterParams.content) {
        result = result.filter(item => 
          item.content && item.content.toLowerCase().includes(this.filterParams.content.toLowerCase())
        );
      }
      
      // 系统名称筛选
      if (this.filterParams.systemName) {
        result = result.filter(item => 
          item.systemName && item.systemName.toLowerCase().includes(this.filterParams.systemName.toLowerCase())
        );
      }
      
      // IP地址筛选
      if (this.filterParams.ipAddress) {
        result = result.filter(item => 
          item.ipAddress && item.ipAddress.toLowerCase().includes(this.filterParams.ipAddress.toLowerCase())
        );
      }
      
      // 事件来源筛选
      if (this.filterParams.source) {
        result = result.filter(item => 
          item.source && item.source.toLowerCase().includes(this.filterParams.source.toLowerCase())
        );
      }
      
      // 处理状态筛选
      if (this.filterParams.status) {
        result = result.filter(item => item.status === this.filterParams.status);
      }
      
      // 事件时间范围筛选
      if (this.filterParams.eventTime && Array.isArray(this.filterParams.eventTime) && this.filterParams.eventTime.length === 2) {
        const startTime = new Date(this.filterParams.eventTime[0]).getTime();
        const endTime = new Date(this.filterParams.eventTime[1]).getTime();
        result = result.filter(item => {
          const eventTime = new Date(item.eventTime).getTime();
          return eventTime >= startTime && eventTime <= endTime;
        });
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
      this.query.content = '';
      this.query.systemName = '';
      this.query.ipAddress = '';
      this.query.source = '';
      this.query.status = null;
      this.query.eventTime = null;
      // 重置筛选参数
      this.filterParams = JSON.parse(JSON.stringify(this.query));
      // 禁用筛选，显示全部数据
      this.isFiltering = false;
      // 更新视图
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    // 获取状态对应的标签类型
    getStatusType(status) {
      const types = {
        unhandled: 'info',
        processing: 'warning',
        handled: 'success',
        closed: 'success'
      };
      return types[status] || 'info';
    },
    // 获取状态显示文本
    getStatusText(status) {
      const texts = {
        unhandled: '未处理',
        processing: '处理中',
        handled: '已处理',
        closed: '已关闭'
      };
      return texts[status] || status;
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