# AGENTS.md

本文档为 AI Agent 提供项目上下文，帮助理解和操作此课程网站项目。

## 项目概述

这是一个教学课件网站项目，当前维护两个版本：

### MkDocs 版本（主分支 master）

- 仓库：`courses-wiki`
- 部署：<https://anjingcuc.github.io/courses-wiki/>
- 技术栈：MkDocs + reveal.js + ECharts Tree

### React 版本（独立仓库）

- 仓库：`courses-react`
- 部署：<https://anjingcuc.github.io/courses-react/>
- 技术栈：Next.js 14 + React 19 + Tailwind CSS

## 课程清单

| 课程代码 | 课程名称 | 章节数 |
|---------|---------|-------|
| aissop | 智能系统安全运维与实践 | 11 |
| python | Python 程序设计 | 15 |
| web | 网页设计与制作 | 13 |
| online-publishing | 在线出版 | 9 |
| apdms | 数字媒体安全应用与实践 | 4 |
| wps | AI-WPS 辅助办公 | 1 |
| substitute | 临时代课 | 2 |

## React 版本目录结构

```
courses-wiki-react/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 首页
│   │   ├── courses/            # 课程页面
│   │   │   └── [course]/       # 动态路由：课程详情和章节
│   │   └── slides/             # 幻灯片全屏页面
│   ├── components/
│   │   ├── slides/             # 幻灯片相关组件
│   │   │   ├── SlideContainer.tsx
│   │   │   ├── SlideRenderer.tsx
│   │   │   └── CodeBlock.tsx
│   │   └── course/             # 课程相关组件
│   │       ├── ChapterGrid.tsx
│   │       └── ChapterList.tsx (已废弃)
│   └── lib/
│       ├── courses.ts          # 课程数据配置
│       └── slideParser.ts      # 幻灯片解析器
├── content/
│   └── slides/                 # 课程内容（slide.txt）
├── public/
│   ├── img/                    # 图片资源
│   └── courses/                # 课程资源（视频、PDF等）
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## 构建与部署

### 本地开发

```bash
cd /srv/home/anjing/courses-wiki-react
pnpm install
pnpm dev
```

### 构建

```bash
pnpm build
```

### CI/CD 流程

推送到 main 分支后，GitHub Actions 自动执行：

1. 安装依赖（pnpm）
2. 构建静态站点
3. 部署到 gh-pages 分支

### Git 配置

React 版本使用多个远程仓库：

- `origin`: 指向 `courses-wiki`（用于同步）
- `react`: 指向 `courses-react`（部署目标）

```bash
# 推送到 React 仓库
git push react HEAD:main
```

## 关键配置

### next.config.js

```javascript
const nextConfig = {
  output: 'export',
  basePath: '/courses-react',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

### 课程顺序配置

在 `src/lib/courses.ts` 中调整 `courses` 数组顺序即可改变首页显示顺序。

## 注意事项

1. **静态导出限制**：使用 `output: 'export'` 时，所有页面必须在构建时预渲染
2. **路径处理**：图片使用 `/img/`，代码会自动添加 basePath
3. **大文件管理**：使用 Git LFS 管理 `.zip`, `.mp4`, `.exe`, `.whl` 文件
4. **本地测试**：推送前务必运行 `pnpm build` 确保构建通过

## 技术演进历史

- **思维导图**: ECharts Tree → React Flow (已移除)
- **状态管理**: 无（纯 React state）
- **包管理**: pnpm
