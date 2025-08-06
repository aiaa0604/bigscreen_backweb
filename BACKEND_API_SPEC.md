# CSV导入后端API接口规范

## 接口概述

CSV导入功能需要以下后端API接口支持：

### 1. 上传CSV文件
```http
POST /api/csv/upload
Content-Type: multipart/form-data
```

**请求参数：**
- `file`: CSV文件（multipart/form-data）

**响应格式：**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileName": "example.csv",
    "fileSize": 1024,
    "uploadTime": "2024-01-01 12:00:00"
  }
}
```

### 2. 预览CSV数据
```http
POST /api/csv/preview
Content-Type: application/json
```

**请求参数：**
```json
{
  "fileName": "example.csv",
  "previewRows": 10
}
```

**响应格式：**
```json
{
  "code": 200,
  "message": "预览成功",
  "data": {
    "headers": ["姓名", "年龄", "邮箱", "部门", "职位"],
    "previewData": [
      {
        "姓名": "张三",
        "年龄": "25",
        "邮箱": "zhangsan@example.com",
        "部门": "技术部",
        "职位": "开发工程师"
      }
    ],
    "totalRows": 100
  }
}
```

### 3. 导入CSV数据
```http
POST /api/csv/import
Content-Type: application/json
```

**请求参数：**
```json
{
  "fileName": "example.csv",
  "importType": "user", // 导入类型
  "validateOnly": false // 是否仅验证
}
```

**响应格式：**
```json
{
  "code": 200,
  "message": "导入成功",
  "data": {
    "importedCount": 100,
    "failedCount": 0,
    "errors": [],
    "importTime": "2024-01-01 12:00:00"
  }
}
```

### 4. 获取导入历史
```http
GET /api/csv/history?page=1&size=10
```

**响应格式：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "content": [
      {
        "id": 1,
        "fileName": "example.csv",
        "importType": "user",
        "importedCount": 100,
        "failedCount": 0,
        "importTime": "2024-01-01 12:00:00",
        "status": "SUCCESS"
      }
    ],
    "totalElements": 50,
    "totalPages": 5
  }
}
```

### 5. 下载CSV模板
```http
GET /api/csv/template
```

**响应格式：**
- Content-Type: text/csv
- 文件内容：CSV格式的模板数据

## 错误处理

### 常见错误码
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 权限不足
- `404`: 接口不存在
- `500`: 服务器内部错误

### 错误响应格式
```json
{
  "code": 400,
  "message": "文件格式不支持",
  "data": null
}
```

## 实现建议

### 1. 文件上传处理
```java
@PostMapping("/upload")
public ResponseEntity<ApiResponse> uploadCsv(@RequestParam("file") MultipartFile file) {
    // 1. 验证文件格式
    // 2. 验证文件大小
    // 3. 保存文件到临时目录
    // 4. 返回文件信息
}
```

### 2. CSV解析
```java
// 使用Apache Commons CSV或OpenCSV
public List<Map<String, String>> parseCsv(File file) {
    // 解析CSV文件
    // 返回数据列表
}
```

### 3. 数据验证
```java
public ValidationResult validateData(List<Map<String, String>> data) {
    // 验证数据格式
    // 验证必填字段
    // 验证数据有效性
}
```

### 4. 数据导入
```java
@PostMapping("/import")
public ResponseEntity<ApiResponse> importCsv(@RequestBody ImportRequest request) {
    // 1. 读取CSV文件
    // 2. 解析数据
    // 3. 验证数据
    // 4. 导入数据库
    // 5. 返回导入结果
}
```

## 数据库设计

### 导入历史表
```sql
CREATE TABLE csv_import_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_name VARCHAR(255) NOT NULL,
    import_type VARCHAR(50) NOT NULL,
    imported_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    import_time DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    created_by VARCHAR(50),
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 安全考虑

1. **文件上传安全**
   - 限制文件大小
   - 验证文件类型
   - 扫描恶意文件

2. **数据验证**
   - 防止SQL注入
   - 验证数据格式
   - 限制导入数量

3. **权限控制**
   - 验证用户权限
   - 记录操作日志
   - 限制访问频率

## 性能优化

1. **大文件处理**
   - 分块读取
   - 异步处理
   - 进度反馈

2. **数据库优化**
   - 批量插入
   - 事务管理
   - 索引优化

## 测试建议

1. **单元测试**
   - 文件解析测试
   - 数据验证测试
   - 导入逻辑测试

2. **集成测试**
   - 完整导入流程测试
   - 错误处理测试
   - 性能测试

## 部署说明

1. **配置文件**
   - 文件上传路径配置
   - 文件大小限制配置
   - 数据库连接配置

2. **监控告警**
   - 导入失败告警
   - 性能监控
   - 错误日志监控 