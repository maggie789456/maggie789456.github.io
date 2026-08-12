# Maggie789456 商品优化工作台 V1

这是一个可直接部署到 `maggie789456.github.io` 的纯 HTML/CSS/JavaScript 第一版。

## V1 已实现

- 首页 Dashboard，作为后续所有功能入口
- 标题优化
- 衬衫 / 夹克外套切换
- 通用 / Amazon / SHEIN / Temu 平台切换
- 读取用户 Excel 转换后的 319 条关键词 JSON
- 按 `title_rules.json` 的优先级组合标题
- 标题健康度评分
- 标题诊断
- 关键词库搜索、维度筛选、分页
- 本地历史记录
- 图片优化预留入口

## 文件结构

```text
maggie789456.github.io/
├── index.html
├── style.css
├── script.js
├── README.md
└── data/
    ├── keyword_library.json
    ├── title_rules.json
    ├── image_rules.json
    └── product_optimizer_config.json
```

## GitHub 上传

### 方法 A：网页上传

在 GitHub 仓库中：

1. `Add file`
2. `Upload files`
3. 上传 `index.html`
4. 上传 `style.css`
5. 上传 `script.js`
6. 上传 `README.md`
7. 新建 `data` 文件夹并上传 4 个 JSON
8. `Commit changes`

### 方法 B：Git

如果已经把项目下载到电脑：

```bash
git clone https://github.com/maggie789456/maggie789456.github.io.git
cd maggie789456.github.io

# 把本项目全部文件复制到这个目录

git add .
git commit -m "feat: launch product optimizer v1"
git push origin main
```

## 开启 GitHub Pages

进入仓库：

`Settings → Pages`

在 `Build and deployment` 中：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

保存后访问：

`https://maggie789456.github.io/`

首次部署可能需要一点时间。

## 注意

本版本的“生成标题”是前端规则引擎，不调用外部 AI API。这样可以先把产品流程跑通。

下一阶段可以把 `generateTitle()` 替换成自己的 AI API 接口，例如：

```text
浏览器
  ↓
/api/title
  ↓
你的后端
  ↓
AI模型
  ↓
规则校验
  ↓
返回标题
```

不要把 AI API Key 直接写在 `script.js` 中。

## 下一阶段建议

1. 增加真正 AI 标题生成
2. 增加夹克专属标题优先级表
3. 增加平台规则后台
4. 增加关键词管理后台
5. 增加图片优化
6. 增加商家登录与历史云端保存
