<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.regionName" clearable placeholder="区域名称" style="width: 150px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.regionType" clearable placeholder="区域类型" style="width: 120px;" class="filter-item">
          <el-option label="国内" value="domestic" />
          <el-option label="国外" value="foreign" />
        </el-select>
        <el-input-number v-model="query.alertCount" placeholder="报警数量" style="width: 150px;" class="filter-item" :min="0" />
        <el-date-picker
          v-model="query.statDate"
          type="date"
          placeholder="选择统计日期"
          value-format="yyyy-MM-dd"
          style="width: 200px;"
          class="filter-item"
        />
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetQuery">重置</el-button>
      </div>
      <crudOperation :permission="permission" :crud="crud" />
    </div>
    
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="区域名称" prop="regionName">
          <el-input v-model="form.regionName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="区域类型" prop="regionType">
          <el-select v-model="form.regionType" style="width: 370px;">
            <el-option label="国内" value="domestic" />
            <el-option label="国外" value="foreign" />
          </el-select>
        </el-form-item>
        <el-form-item label="报警数量" prop="alertCount">
          <el-input-number v-model="form.alertCount" :min="0" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="统计日期" prop="statDate">
          <el-date-picker
            v-model="form.statDate"
            type="date"
            style="width: 370px;"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
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
      <el-table-column prop="regionName" label="区域名称" />
      <el-table-column prop="regionType" label="区域类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="getRegionTypeType(scope.row.regionType)">{{ getRegionTypeText(scope.row.regionType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="alertCount" label="报警数量" width="100">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.alertCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="statDate" label="统计日期" width="120" />
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin','region:edit','region:del'])" label="操作" width="150px" align="center">
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
import crudRegion from '@/api/stat/region'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { parseTime } from '@/utils/index'

const defaultForm = { 
  id: null,
  regionName: null,
  regionType: 'domestic',
  alertCount: 0,
  statDate: new Date().toISOString().split('T')[0]
}

export default {
  name: 'AlertRegionStat',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ 
      title: '区域报警统计',
      url: 'api/stat/region',
      sort: 'statDate,desc',
      crudMethod: { ...crudRegion },
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
        add: ['admin', 'region:add'],
        edit: ['admin', 'region:edit'],
        del: ['admin', 'region:del']
      },
      rules: {
        regionName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        regionType: [
          { required: true, message: '请选择区域类型', trigger: 'change' }
        ],
        alertCount: [
          { required: true, message: '请输入报警数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字', trigger: 'blur' }
        ],
        statDate: [
          { required: true, message: '请选择统计日期', trigger: 'change' }
        ]
      },
      // 查询参数
      query: {
        regionName: '',
        regionType: null,
        alertCount: null,
        statDate: null
      },
      // 实际用于筛选的参数
      filterParams: {
        regionName: '',
        regionType: null,
        alertCount: null,
        statDate: null
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
      
      // 区域名称筛选
      if (this.filterParams.regionName) {
        result = result.filter(item => 
          item.regionName && item.regionName.toLowerCase().includes(this.filterParams.regionName.toLowerCase())
        );
      }
      
      // 区域类型筛选
      if (this.filterParams.regionType) {
        result = result.filter(item => item.regionType === this.filterParams.regionType);
      }
      
      // 报警数量筛选
      if (this.filterParams.alertCount !== null) {
        result = result.filter(item => 
          item.alertCount === this.filterParams.alertCount
        );
      }
      
      // 统计日期筛选
      if (this.filterParams.statDate) {
        result = result.filter(item => 
          item.statDate && item.statDate.includes(this.filterParams.statDate)
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
      this.query.regionName = '';
      this.query.regionType = null;
      this.query.alertCount = null;
      this.query.statDate = null;
      // 重置筛选参数
      this.filterParams = JSON.parse(JSON.stringify(this.query));
      // 禁用筛选，显示全部数据
      this.isFiltering = false;
      // 更新视图
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    // 获取区域类型对应的标签类型
    getRegionTypeType(type) {
      const types = {
        'domestic': 'success',
        'foreign': 'warning'
      };
      return types[type] || 'info';
    },
    // 获取区域类型显示文本
    getRegionTypeText(type) {
      const texts = {
        'domestic': '国内',
        'foreign': '国外'
      };
      return texts[type] || type;
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