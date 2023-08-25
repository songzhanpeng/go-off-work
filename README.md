# 下班提醒插件（go-off-work）

这是你的扩展 "下班提醒插件（go-off-work）" 的 README 文件。

## 功能

该插件可以在状态栏中显示距离下班还有多少时间，并在下班时间到达时提醒你。

## 需求

无特殊需求或依赖项。

## 扩展设置

该扩展支持以下设置：

- `goOffWork.hour`：设置下班的小时数。
- `goOffWork.minute`：设置下班的分钟数。
- `goOffWork.notificationMessage`设置右下角通知信息
- `goOffWork.getOffMessage`设置到时间提示信息

你可以通过修改这些设置来自定义下班时间。

## 使用方法

在 Visual Studio Code 中，你可以按下 `Ctrl+Shift+P`（或 `Cmd+Shift+P`）来打开命令面板，然后输入 "设置下班时间" 并选择它，即可修改下班时间。

## 发布说明

### 0.0.1

初始发布，提供基本的下班提醒功能。

### 0.0.2

修复扩展加载后不显示时间问题

### 0.0.3

支持命令  `设置下班时间` 时间函数补零

### 0.0.4

新增插件 logo 用的是 崩坏星穹铁道 青雀角色头像

### 0.0.5

新增 单元测试，优化 不停创建 statusBar 导致的闪屏问题

### 0.0.6

新增 支持通知自定义 `notificationMessage` 消息自定义  `getOffMessage`

### 0.0.7

修复了一下，输入的时间限制 小时只能 `00 - 23` 分钟只能 `00 - 59`

---

## 遵循扩展准则

确保你已阅读扩展准则，并遵循最佳实践来创建你的扩展。

- [扩展准则](https://code.visualstudio.com/api/references/extension-guidelines)

**尽情享受！**
