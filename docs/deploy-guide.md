# MkDocs 站点部署指南

## 项目结构

```
mkdocs-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署工作流
├── docs/
│   ├── index.md                # 站点首页
│   ├── txt1.md                 # 示例文章
│   └── deploy-guide.md         # 本部署指南
├── .gitignore                  # Git 忽略规则
├── mkdocs.yml                  # MkDocs 站点配置
└── requirements.txt            # Python 依赖
```

---

## 配置文件详解

### mkdocs.yml — 站点核心配置

```yaml
site_name: Ueui的文档站
site_url: https://gh3406286420.github.io/mkdocs-site
theme:
  name: material
  language: zh
  palette:
    - scheme: default
      primary: black
      accent: black
      toggle:
        icon: material/brightness-7
        name: 切换到深色模式
    - scheme: slate
      primary: black
      accent: black
      toggle:
        icon: material/brightness-4
        name: 切换到浅色模式

nav:
  - 首页: index.md
  - 文章:
    - 快速开始: txt1.md

markdown_extensions:
  - toc:
      permalink: true
  - pymdownx.highlight:
      anchor_linenums: true
  - pymdownx.superfences
```

**关键说明：**
- `site_url` 必须填你实际的 GitHub Pages 地址，否则站点地图和资源路径可能出错
- `theme: material` 使用 MkDocs Material 主题

---

### .github/workflows/deploy.yml — GitHub Actions 自动部署

```yaml
name: Deploy MkDocs to GitHub Pages

on:
  push:
    branches:
      - main
      - master

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.x"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Build site
        run: mkdocs build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

**工作流程说明：**
1. 当 `push` 到 `main` 或 `master` 分支时触发
2. 检出代码 → 安装 Python → 安装依赖 → `mkdocs build` 构建
3. 使用 `peaceiris/actions-gh-pages` 将 `site/` 目录推送到 `gh-pages` 分支
4. GitHub Pages 从 `gh-pages` 分支读取并发布站点

---

### requirements.txt — Python 依赖

```
mkdocs>=1.6.0
mkdocs-material>=9.5.0
```

---

### .gitignore — 忽略规则

```
site/
.idea/
*.pyc
__pycache__/
```

---

## 部署步骤

### 第一步：初始化本地仓库并推送

```bash
git init
git add .
git commit -m "初始化 MkDocs 站点并配置 GitHub Actions 自动部署"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 第二步：配置 GitHub Pages

1. 打开 GitHub 仓库 → **Settings** → **Pages**
2. **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 `gh-pages` → `/ (root)` → **Save**

> 如果 Branch 下拉菜单里没有 `gh-pages`，等待 Actions 工作流第一次运行完成后再刷新页面。

### 第三步：验证部署

访问 `https://你的用户名.github.io/你的仓库名/` 查看站点。

---

## 日常使用

### 添加新文章

1. 在 `docs/` 目录下创建新的 `.md` 文件
2. 在 `mkdocs.yml` 的 `nav` 中添加对应的导航条目
3. 提交并推送：

```bash
git add .
git commit -m "添加新文章"
git push
```

推送后 GitHub Actions 会自动构建并部署。

### 本地预览

```bash
pip install -r requirements.txt
mkdocs serve
```

然后浏览器访问 `http://127.0.0.1:8000` 即可实时预览。

---

## 常见问题

### Q: Pages 页面显示 "404"？

- 检查 `gh-pages` 分支是否存在且包含内容
- 检查 Settings → Pages 中 Branch 是否选对了 `gh-pages`
- 等待 Actions 工作流完成（约 1-2 分钟）

### Q: Actions 工作流运行失败？

- 检查 `.github/workflows/deploy.yml` 格式是否正确（YAML 对缩进敏感）
- 检查 `requirements.txt` 中的包名是否正确
- 查看 Actions 运行日志中的具体错误信息

### Q: 站点样式没有加载？

- 确保 `mkdocs.yml` 中的 `site_url` 设置正确
- 如果使用自定义域名，确保域名已正确配置
