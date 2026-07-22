# 权重之下

> 行到水穷处，坐看云起时

基于 [Hexo](https://hexo.io/) + [warmpaper](https://github.com/finch-xu/hexo-theme-warmpaper) 主题搭建的个人博客，托管于 GitHub Pages，绑定自定义域名 [iyue.top](https://iyue.top)。

## 技术栈

- **框架**：Hexo 8.x
- **主题**：[warmpaper](https://github.com/finch-xu/hexo-theme-warmpaper)（以 git submodule 挂在 `themes/warmpaper`）
- **部署**：GitHub Actions 自动构建并发布到 GitHub Pages（推送到 `main` 分支即触发）

## 本地开发

```bash
# 克隆时请带上子模块（否则 themes/warmpaper 为空）
git clone --recurse-submodules <repo-url>

# 若已克隆但主题目录为空，补拉子模块
git submodule update --init --recursive

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

无需手动执行部署命令。将改动推送到 `main` 分支后，GitHub Actions 会自动完成构建并发布上线（workflow 已配置 `submodules: recursive`，会自动拉取主题）。

```bash
git add .
git commit -m "post: 新文章"
git push origin main
```

## 主题配置与更新

主题的个性化配置（菜单、头像、简介、评论等）统一写在博客根目录的 [`_config.warmpaper.yml`](_config.warmpaper.yml)，它会**覆盖**主题自带的 `themes/warmpaper/_config.yml`。因此**不要直接修改子模块里的配置文件**，改根目录的覆盖文件即可，这样主题更新时永不冲突。

### 更新主题到官方最新版

```bash
# 1. 一键把子模块更新到官方远程最新
git submodule update --remote themes/warmpaper

# 2. 提交父仓库锁定的主题版本（SHA 指针）变化
git add themes/warmpaper
git commit -m "chore: 升级 warmpaper 主题到最新版"

# 3. 推送触发自动部署
git push origin main
```

> 说明：父仓库只记录主题的某个 commit（SHA 指针），主题作者更新后不会自动跟进，需手动执行上面的更新命令。因配置已迁到根目录覆盖文件，更新过程不会冲突。

## 目录结构

- `source/_posts/` — 文章 Markdown 源文件
- `source/` — 页面、图片等站点资源
- `_config.yml` — Hexo 站点配置
- `_config.warmpaper.yml` — warmpaper 主题配置（覆盖子模块自带配置）
- `themes/warmpaper/` — warmpaper 主题（git submodule）
- `.gitmodules` — 子模块声明（主题仓库地址与挂载路径）
- `.github/workflows/` — GitHub Actions 部署流程
