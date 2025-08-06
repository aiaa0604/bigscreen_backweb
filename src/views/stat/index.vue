<template>
  <div class="app-container">
    <div class="el-card">
      <div class="el-card__header">
        <h3>大屏统计数据管理</h3>
        <p class="subtitle">选择要管理的数据模块</p>
      </div>
      <div class="el-card__body">
        <!-- 第一行 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/attackFlyline')">
              <div slot="header">
                <span>攻击飞线管理</span>
              </div>
              <div class="card-content">
                <i class="el-icon-link card-icon"></i>
                <p>管理攻击飞线数据</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/alarm')">
              <div slot="header">
                <span>告警统计</span>
              </div>
              <div class="card-content">
                <i class="el-icon-bell card-icon"></i>
                <p>管理告警统计数据</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/vulnRecord')">
              <div slot="header">
                <span>漏洞记录</span>
              </div>
              <div class="card-content">
                <i class="el-icon-warning card-icon"></i>
                <p>管理漏洞记录数据</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/duty')">
              <div slot="header">
                <span>值班安排</span>
              </div>
              <div class="card-content">
                <i class="el-icon-user card-icon"></i>
                <p>管理值班安排数据</p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/abnormal')">
              <div slot="header">
                <span>异常事件统计</span>
              </div>
              <div class="card-content">
                <i class="el-icon-error card-icon"></i>
                <p>管理异常事件数据</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/event')">
              <div slot="header">
                <span>安全事件</span>
              </div>
              <div class="card-content">
                <i class="el-icon-warning-outline card-icon"></i>
                <p>管理安全事件数据</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/asset')">
              <div slot="header">
                <span>资产统计</span>
              </div>
              <div class="card-content">
                <i class="el-icon-coin card-icon"></i>
                <p>管理资产统计数据</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/region')">
              <div slot="header">
                <span>区域统计</span>
              </div>
              <div class="card-content">
                <i class="el-icon-location card-icon"></i>
                <p>管理区域统计数据</p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/asset-list')">
              <div slot="header">
                <span>资产列表</span>
              </div>
              <div class="card-content">
                <i class="el-icon-document card-icon"></i>
                <p>管理资产列表数据</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/risk')">
              <div slot="header">
                <span>风险评分</span>
              </div>
              <div class="card-content">
                <i class="el-icon-data-analysis card-icon"></i>
                <p>管理系统风险评分</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/vulnStat')">
              <div slot="header">
                <span>漏洞统计</span>
              </div>
              <div class="card-content">
                <i class="el-icon-pie-chart card-icon"></i>
                <p>管理漏洞统计数据</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/vulnFix')">
              <div slot="header">
                <span>漏洞修复</span>
              </div>
              <div class="card-content">
                <i class="el-icon-check card-icon"></i>
                <p>管理漏洞修复数据</p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/outboundIp')">
              <div slot="header">
                <span>出站IP统计</span>
              </div>
              <div class="card-content">
                <i class="el-icon-connection card-icon"></i>
                <p>管理出站IP数据</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" @click.native="goToPage('/stat/device')">
              <div slot="header">
                <span>设备状态</span>
              </div>
              <div class="card-content">
                <i class="el-icon-monitor card-icon"></i>
                <p>管理设备状态数据</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatIndex',
  methods: {
    goToPage(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-content {
  text-align: center;
  padding: 10px 0;
}

.card-icon {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 10px;
}

.card-content p {
  margin: 10px 0 0 0;
  color: #606266;
  font-size: 14px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
  margin: 5px 0 0 0;
}

.el-card__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 4px 4px 0 0;
}

.el-card__header h3 {
  margin: 0;
  color: white;
}

.el-card__header .subtitle {
  color: rgba(255, 255, 255, 0.8);
}
</style>