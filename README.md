### utools-fund

- 自选基金助手，数据来源于天天基金
- 支持新增删除自选基金，可填入持有份额，实时计算当天收益
- 我的自选基金页面 => ctrl + insert 跳转添加基金页，可根据拼音，中文，基金代码等搜索
- 我的自选基金页面 => ctrl + delete 删除选中的基金
- 我的自选基金页面 => 输入份额，选择基金，enter 保存并更新持有份额
- 我的自选基金页面 => 未输入份额时，enter 打开基金详情
- 基金详情 => enter 关闭， ← → 切换导航，↑ ↓ 切换基金

#### 源码

> [https://github.com/adams549659584/utools-fund](https://github.com/adams549659584/utools-fund)

#### 插件下载

> [https://github.com/adams549659584/utools-fund/releases](https://github.com/adams549659584/utools-fund/releases)

#### 使用说明

![Instructions.gif](https://s1.ax1x.com/2020/08/19/dQ8R3t.gif)

### v1.7.3

- 修复搜索接口调整导致的搜索异常
- 基金详情新增操作按钮（键盘操作未变：enter 关闭， ← → 切换导航，↑ ↓ 切换基金）

### v1.7.2

- 基金明细加上随机UA

### v1.7.1

- 海外基金NaN问题优化
- 新增基金详情 ( 未输入份额时，enter 打开基金详情，基金详情，enter 关闭， ← → 切换导航，↑ ↓ 切换基金 )

### v1.6.2

- 新增持有份额展示

### v1.6.1

- 今日总收益计算结果优化

### v1.6.0

- 新增快捷键

  > ctrl + insert 跳转添加自选基金

  > ctrl + delete 删除选中的自选基金

- 移除删除自选基金界面

### v1.5.1

- 今日收益确认无需等待持仓数量为0的基金

### v1.5.0

- 退出当前插件时，停止查询

### v1.4.2

- 去掉平台限制

### v1.4.0

- 优化导入数据

### v1.3.9

- 我的自选基金新增支持 s 前缀搜索过滤自选基金，如 s001071

### v1.3.8

- 更换使用说明 gif 链接

### v1.3.7

- 删除使用说明 gif 文件，减小打包体积

#### v1.3.6

- 持有份额防止误输入优化

#### v1.3.5

- 移除网络失败提示

#### v1.3.4

- 移除 encoding
- 修复重构导致导入 bug
- 优化无基金时删除及我的自选基金列表展示

#### v1.3.3

- 重构代码
- 我的自选基金固定前台展示时，定时(每分钟)获取最新

#### v1.3.1

- 涨幅计算调整

#### v1.3.0

- 最后净值确认增加 ✅ 标识

#### v1.2.0

- 新增大盘行情

#### v1.1.0

- 新增导入导出功能
- 直接复制导出的 fund_data.json 至 utools 即可导入
