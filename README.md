# 麦杞岐（maggie.xie）对接服务站 V2

这是在 `maggie_site_v1_1_update` 基础上优化的 GitHub Pages 静态网站版本。

## 页面结构

- `index.html`：首页、类目指引、标题优化
- `visual.html`：视觉优化（AI指令）入口
- `image-optimization.html`：图片优化中心（独立页面）
- `ai-prompts.html`：AI 指令 + 参考图片独立页面
- `reference.html`：需求款式参考独立页面，衬衫/夹克外套上下纵向展示
- `priority.html`：最高优先款式独立图片集合页
- `notices.html`：全部通知页面

## 后续最常改的文件

### 1. 每周更新热搜词 / 通知
只改：`data/notices.json`

建议新增一条记录，不需要改 HTML/JS。首页会自动读取最新日期；首页只展示两条一行播报，点击进入 `notices.html` 看全部。

### 2. 更新类目
只改：`data/category_guide.json`

每一条至少包含：`id / category / tag / season / path`。
可用 `category`：`衬衫`、`夹克外套`、`户外套装`、`其他类目`。
删除一条记录即可从网页隐藏。

### 3. 更新 AI 指令
只改：`data/ai_prompts.json`，并把图片上传到 `assets/visual/`。

图片路径示例：`assets/visual/shirt-visual-example.png`

### 4. 更新需求款式参考
把 PPT 转成 PDF 后上传到：`assets/reference/`
然后只修改：`data/reference_pdfs.json`

网页会按“衬衫 / 夹克外套”两个组纵向排列，不需要修改 HTML。

### 5. 更新最高优先款式（V2.1 新方式）

页面只读取一个固定文件：`data/priority-styles.xlsx`。

**后续新增 / 删除款式，只修改这一个 Excel 并上传覆盖即可。不要修改 Excel 的列名。**

必须保留以下原有列：
`任务id / 站点id / 区域 / 类目 / 站内叶子类目名称 / 站内叶子类目ID / 行业id / 行业链接 / 行业图片url / 提需时间 / 最后反馈时间`

网页映射：
- `区域` → 欧区 / 美区 / 拉美分区
- `类目` → 外套夹克 / 衬衫两个大板块（夹克外套优先）
- `站内叶子类目名称` → 推荐类目路径，可复制
- `行业id` → 款式编号，可复制
- `行业图片url` → 款式图片
- `提需时间` → 更新时间，并按最新优先排序

网页不会显示其他列，但这些列可以继续保留，Excel 原结构不需要改变。

页面采用一个长页面：左侧导航点击欧区、美区、拉美会滚动到对应图片区域，所有图片始终保留在同一页面；图片支持点击放大、左右切换、ESC关闭，并提供“搜索识别图片同款”跳转。


## GitHub 更新原则

如果你当前仓库的线上版本就是这个项目，直接在 GitHub 的 `main` 分支更新即可。

最简单的方法：
1. 打开仓库的 `main` 分支。
2. 点击 `Add file` → `Upload files`。
3. 把本项目中需要更新的文件拖进去。
4. GitHub 如果提示同名文件，选择覆盖/替换。
5. 点击 `Commit changes`。
6. 等待 GitHub Pages 自动部署。

不要把整个 zip 文件上传到仓库根目录。应该把 zip 里面的文件夹和文件上传到对应路径。

## 声明

本网页所有功能只提供建议，不负任何法律责任，所有资源来源于互联网。图片仅供参考，不可侵权。如果有功能更新需求请联系麦杞岐（maggie.xie）
