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

### 5. 更新最高优先款式
这是独立页面，主页不会被图片数量影响。

图片放：
- `assets/priority/shirt/`
- `assets/priority/jacket/`

然后在 `data/priority_items.json` 增加一条记录。页面按 `addedAt` 新到旧、同日按 `sort` 大到小排列。

推荐文件名：`shirt-004.jpg`、`jacket-004.jpg`。

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
