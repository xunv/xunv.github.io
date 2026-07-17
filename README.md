# 权重之下

> 行到水穷处，坐看云起时

基于 [Hexo](https://hexo.io/) + [NexT](https://theme-next.js.org/) 主题搭建的个人博客，托管于 GitHub Pages，绑定自定义域名 [iyue.top](https://iyue.top)。

## 技术栈

- **框架**：Hexo 8.x
- **主题**：hexo-theme-next 8.x
- **部署**：GitHub Actions 自动构建并发布到 GitHub Pages（推送到 `main` 分支即触发）

## 本地开发

```bash
# 安装依赖
pnpm install

# 新建文章
hexo new '文章标题'

# 本地预览（默认 http://localhost:4000）
pnpm server

# 生成静态文件
pnpm build

# 清除缓存
pnpm clean
```

## 部署

无需手动执行部署命令。将改动推送到 `main` 分支后，GitHub Actions 会自动完成构建并发布上线。

```bash
git add .
git commit -m "post: 新文章"
git push origin main
```

## 目录结构

- `source/_posts/` — 文章 Markdown 源文件
- `source/` — 页面、图片等站点资源
- `_config.yml` — Hexo 站点配置
- `_config.next.yml` — NexT 主题配置
- `.github/workflows/` — GitHub Actions 部署流程
