# GitHub Showcase Handoff

## 当前决定

- 暂不接入 Vercel，也不处理正式部署。
- 在个人主页保留一个轻量 GitHub 展示板块，并增加独立的 `#/github` 创作档案页。
- Signal 作为主页与 GitHub 页面的主展示项目；独立页面依次策展 Signal、Interactive Lab、KOL Screening 和 Xuan。
- 展示数据保存在网站仓库内，不在浏览器端调用 GitHub API，避免限流、跨域和离线预览问题。
- Finance Daily 暂不进入公开展示，直到完成无历史记录的脱敏 Demo。

## 已实现结构

- `src/data/githubFeatured.js`
  - GitHub 账号、仓库总数和主页 Featured repository。
  - 与主页主包一起加载，保持数据轻量。
- `src/data/githubShowcase.js`
  - 独立 GitHub 页面使用的完整策展列表。
  - 每个仓库的中英文文案、状态、指标、标签、站内案例和线上体验入口。
- `src/App.jsx`
  - `HomeGithubShowcase` 主页板块。
  - `#/github` 的导航入口与懒加载路由。
  - GitHub 外链统一使用新窗口打开。
- `src/routes/GithubRoute.jsx`
  - GitHub 创作档案页、项目类型筛选和 Lab 互动作品入口。

## 上线前隐私检查

Finance Daily 的公开入口已从主站源码移除。后续只有在独立 Demo 仓库满足以下条件时再恢复：

- 使用全新 Git 历史；
- 只包含示例配置、模拟数据和脱敏指标；
- 不包含本机路径、真实金额、旧报告、凭证或可反推资产规模的数据。

## 后续维护

- 主页主项目变化时，更新 `src/data/githubFeatured.js`。
- 新增或修改策展仓库时，更新 `src/data/githubShowcase.js`，无需改页面组件。
- `publicRepoCount` 是策展时的快照，不是运行时 GitHub API 数据；有明显变化时手动更新。
- 未来如果需要自动同步，可在构建前生成一份脱敏 JSON，再由网站读取；当前阶段不需要引入跨仓库自动化。

## 发布状态

- 主站仍保持本地验证状态。
- Finance Daily 未进入公开展示。
- 正式 push 与部署前继续执行 lint、build、响应式检查和隐私扫描。
