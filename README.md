# 前端面试刷题系统（FE Interview Quiz）

一个**纯前端**的前端面试复习 / 刷题系统，题库内容基于本项目 `../docs/` 目录下的全部 Markdown 面试知识文档整理生成。

## 快速开始

```bash
npm install
npm run dev       # 开发模式（默认 http://localhost:5173）
npm run build     # 生产构建（tsc 类型检查 + vite build）
npm run preview   # 预览生产构建产物（http://localhost:4173）
npm run lint      # ESLint 检查
```

> 无后端、无数据库。题库是构建进前端的静态数据；用户的做题记录、收藏、错题、面试报告全部保存在浏览器 `localStorage` 中，刷新不丢失。

## 功能总览

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `#/` | 总览统计、知识分类卡片（题数/完成/正确率）、快速开始、最近做题记录 |
| 题库 | `#/bank` | 按分类/二级分类/题型/难度/完成状态筛选 + 全文搜索，顺序或随机刷题，点击任意题从该题开始 |
| 刷题 | `#/practice` | 核心答题页：单选/多选/判断自动判分，解答/代码题对照参考答案自评；解析、关键词、docs 来源；收藏、上一题/下一题、重新答题、题号导航面板、←/→ 快捷键；会话进度刷新可恢复 |
| 错题本 | `#/wrong` | 答错自动收录，支持分类筛选、单题重做、查看解析、移出/恢复；重做答对自动移出 |
| 收藏 | `#/favorites` | 收藏题目列表，可整体刷题或单题重做 |
| 统计 | `#/stats` | 总题数/已做/正确率、各分类掌握度（按正确率着色）、7 天做题柱状图、题型统计、薄弱分类建议复习 |
| 面试模式 | `#/interview` | 随机组卷（5/10/15/20 题，题型构成与知识范围可配）、计时、交卷生成报告（得分环、分类正确率、薄弱知识点、建议复习、错题重做），历史成绩保留 |

## 题库：docs → 系统的映射

| 分类 | 主要来源 docs 文档 |
|------|--------------------|
| HTML & CSS | 从零开始的前端面试题（HTML/CSS 篇）、面试问答、一些高频率考点 |
| JavaScript | 从零开始的前端面试题（JS 篇）、收集的面试知识点、前端面试八股文、知识点快速复习指南 |
| 浏览器原理 | 浏览器原理知识点、前端面试八股文 |
| 计算机网络 | 计算机网络面试题、收集的面试知识点 |
| Vue | Vue框架面试题、一些高频率考点、知识点快速复习指南 |
| React | React框架面试题、针对简历问答、农担项目所遇问题及总结 |
| 性能优化 | 前端性能优化（指南/面试题）、知识点快速复习指南 |
| 工程化 | 前端工程化面试题、收集的面试知识点、基于简历的问题 |
| 算法与数据结构 | 基础算法、知识点快速复习指南（算法题速记） |
| 业务场景题 | 问答类型面试题、一些高频率考点 |
| 项目经验 | 农担重点逻辑、项目逻辑、针对简历问答、基于简历的问题、fastapi知识点、知识点快速复习指南 |

题型分布：单选（自动判分）、多选（完全匹配判分）、判断、解答（参考答案为面试口述风格）、代码（手写题 + 参考实现）。

## 技术栈与结构

- React 18 + TypeScript + Vite
- React Router 6（Hash 路由，静态部署友好）
- Zustand（状态管理）+ 自封装 localStorage 持久化
- react-markdown + remark-gfm + rehype-highlight（Markdown 渲染、表格、代码高亮、代码复制）

```
src/
├── data/                 # 数据层（与 UI 解耦）
│   ├── categories.ts     # 11 大知识分类
│   ├── questions/*.ts    # 按分类拆分的题目数据（RawQuestion）
│   └── index.ts          # 归一化（选项自动编号 A/B/C/D）与索引
├── store/useStudyStore.ts # 记录/收藏/错题/历史/面试报告 + localStorage 持久化
├── utils/                # 判分、筛选、存储工具
├── components/
│   ├── layout/AppLayout.tsx      # 侧边栏 + 移动端顶栏
│   ├── question/QuestionCard.tsx # 万能答题卡片（5 种题型）
│   ├── question/Markdown.tsx     # Markdown + 代码高亮 + 复制按钮
│   └── common/ui.tsx             # 徽章/空状态/进度条等
└── pages/                # Home / QuestionBank / Practice / WrongBook / Favorites / Stats / Interview
```

## localStorage 键

| 键 | 内容 |
|----|------|
| `fequiz.records.v1` | 每题作答记录（判定结果、用户答案、次数、最后时间） |
| `fequiz.favorites.v1` | 收藏（题目 id → 收藏时间） |
| `fequiz.wrong-dismissed.v1` | 从错题本手动移出的题目 |
| `fequiz.history.v1` | 最近作答日志（统计与首页记录） |
| `fequiz.interview-reports.v1` | 历史面试报告 |
| `fequiz.practice-session.v1` | 当前刷题会话（刷新恢复进度） |

数据变更随时写回 `localStorage`；`resetAll` 可在需要时清空（store 内置）。
