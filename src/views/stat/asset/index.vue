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
        />
        <el-input-number v-model="query.networkDevice" placeholder="网络设备数量" style="width: 150px;" class="filter-item" :min="0" />
        <el-input-number v-model="query.securityDevice" placeholder="安全设备数量" style="width: 150px;" class="filter-item" :min="0" />
        <el-input-number v-model="query.host" placeholder="主机数量" style="width: 150px;" class="filter-item" :min="0" />
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetQuery">重置</el-button>
      </div>
      <crudOperation :permission="permission" :crud="crud" />
    </div>
    
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="700px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
        <el-form-item label="统计日期" prop="statDate">
          <el-date-picker
            v-model="form.statDate"
            type="date"
            style="width: 550px;"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="网络设备" prop="networkDevice">
              <el-input-number v-model="form.networkDevice" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全设备" prop="securityDevice">
              <el-input-number v-model="form.securityDevice" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="域名" prop="domainName">
              <el-input-number v-model="form.domainName" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中间件" prop="middleware">
              <el-input-number v-model="form.middleware" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务" prop="service">
              <el-input-number v-model="form.service" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用" prop="application">
              <el-input-number v-model="form.application" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="网站" prop="website">
              <el-input-number v-model="form.website" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="虚拟设备" prop="virtualDevice">
              <el-input-number v-model="form.virtualDevice" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="端口" prop="port">
              <el-input-number v-model="form.port" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主机" prop="host">
              <el-input-number v-model="form.host" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据库" prop="databaseCount">
              <el-input-number v-model="form.databaseCount" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作系统" prop="osCount">
              <el-input-number v-model="form.osCount" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
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
      <el-table-column prop="statDate" label="统计日期" width="120" />
      <el-table-column prop="networkDevice" label="网络设备" width="100">
        <template slot-scope="scope">
          <el-tag type="primary">{{ scope.row.networkDevice }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="securityDevice" label="安全设备" width="100">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.securityDevice }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="domainName" label="域名" width="80">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.domainName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="middleware" label="中间件" width="80">
        <template slot-scope="scope">
          <el-tag type="warning">{{ scope.row.middleware }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="service" label="服务" width="80">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.service }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="application" label="应用" width="80">
        <template slot-scope="scope">
          <el-tag type="primary">{{ scope.row.application }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="website" label="网站" width="80">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.website }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="virtualDevice" label="虚拟设备" width="100">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.virtualDevice }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="port" label="端口" width="80">
        <template slot-scope="scope">
          <el-tag type="warning">{{ scope.row.port }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="host" label="主机" width="80">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.host }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="databaseCount" label="数据库" width="80">
        <template slot-scope="scope">
          <el-tag type="primary">{{ scope.row.databaseCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="osCount" label="操作系统" width="100">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.osCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPer(['admin','asset:edit','asset:del'])" label="操作" width="150px" align="center">
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
import crudAsset from '@/api/stat/asset'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { parseTime } from '@/utils/index'

const defaultForm = { 
  id: null,
  statDate: new Date().toISOString().split('T')[0],
  networkDevice: 0,
  securityDevice: 0,
  domainName: 0,
  middleware: 0,
  service: 0,
  application: 0,
  website: 0,
  virtualDevice: 0,
  port: 0,
  host: 0,
  databaseCount: 0,
  osCount: 0
}

export default {
  name: 'AssetStat',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({ 
      title: '资产统计',
      url: 'api/stat/asset',
      sort: 'statDate,desc',
      crudMethod: { ...crudAsset },
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
        add: ['admin', 'asset:add'],
        edit: ['admin', 'asset:edit'],
        del: ['admin', 'asset:del']
      },
      rules: {
        statDate: [
          { required: true, message: '请选择统计日期', trigger: 'change' }
        ]
      },
      // 查询参数
      query: {
        statDate: null,
        networkDevice: null,
        securityDevice: null,
        host: null
      },
      // 实际用于筛选的参数
      filterParams: {
        statDate: null,
        networkDevice: null,
        securityDevice: null,
        host: null
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
      
      // 网络设备数量筛选
      if (this.filterParams.networkDevice !== null) {
        result = result.filter(item => 
          item.networkDevice === this.filterParams.networkDevice
        );
      }
      
      // 安全设备数量筛选
      if (this.filterParams.securityDevice !== null) {
        result = result.filter(item => 
          item.securityDevice === this.filterParams.securityDevice
        );
      }
      
      // 主机数量筛选
      if (this.filterParams.host !== null) {
        result = result.filter(item => 
          item.host === this.filterParams.host
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
      this.query.statDate = null;
      this.query.networkDevice = null;
      this.query.securityDevice = null;
      this.query.host = null;
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