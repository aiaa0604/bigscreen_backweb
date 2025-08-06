# 菜单显示问题调试指南

## 调试步骤

### 1. 检查浏览器网络请求
1. 打开浏览器开发者工具 (F12)
2. 切换到 "Network" 标签
3. 刷新页面
4. 查找 `/api/menus/build` 请求
5. 查看响应内容，确认是否包含CSV导入菜单

### 2. 检查菜单配置
在浏览器控制台执行以下代码检查菜单数据：

```javascript
// 检查菜单数据
console.log('菜单数据:', this.$store.state.permission.sidebarRouters)

// 检查路由数据
console.log('路由数据:', this.$store.state.permission.routers)
```

### 3. 常见问题排查

#### 问题1：菜单配置错误
**症状**：菜单管理中有配置，但前端不显示
**解决**：
- 确认路由地址：`/tools/csvImport`
- 确认组件路径：`tools/csvImport/index`
- 确认上级菜单：系统工具

#### 问题2：权限问题
**症状**：菜单存在但点击无反应
**解决**：
- 检查角色权限分配
- 确认菜单权限已勾选

#### 问题3：缓存问题
**症状**：配置正确但页面不更新
**解决**：
- 清除浏览器缓存
- 重新登录系统
- 强制刷新页面 (Ctrl+F5)

### 4. 手动测试路由
在浏览器地址栏直接访问：
```
http://localhost:8016/#/tools/csvImport
```

如果能正常访问，说明页面没问题，只是菜单配置有问题。

### 5. 检查控制台错误
查看浏览器控制台是否有JavaScript错误：
- 网络请求错误
- 组件加载错误
- 权限验证错误

## 临时解决方案

如果菜单配置有问题，可以临时在路由中添加：

```javascript
// 在 src/router/routers.js 中添加
{
  path: '/tools/csvImport',
  component: Layout,
  children: [
    {
      path: '',
      component: (resolve) => require(['@/views/tools/csvImport'], resolve),
      name: 'CsvImport',
      meta: { title: 'CSV导入', icon: 'upload' }
    }
  ]
}
```

## 联系支持

如果以上步骤都无法解决问题，请提供：
1. 后端菜单配置截图
2. 浏览器网络请求截图
3. 控制台错误信息 