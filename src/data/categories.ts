import type { Category } from '../types'

/**
 * 知识分类 —— 依据 docs/面试知识目录索引.md 的知识体系整理。
 * 二级分类不在此硬编码，由各题目数据的 sub 字段汇总生成，保证单一数据源。
 */
export const categories: Category[] = [
  {
    id: 'html-css',
    name: 'HTML & CSS',
    color: '#e8590c',
    description: '语义化、盒模型、BFC、Flex/Grid 布局、移动端适配等三件套基础',
    sources: ['从零开始的前端面试题.md', '面试问答.md', '一些高频率考点.md'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    color: '#b8860b',
    description: '数据类型、原型与闭包、this、异步与事件循环、DOM 与事件委托',
    sources: ['从零开始的前端面试题.md', '收集的面试知识点.md', '面试问答.md'],
  },
  {
    id: 'browser',
    name: '浏览器原理',
    color: '#1971c2',
    description: '进程线程、渲染原理、缓存、本地存储、同源策略、事件循环、GC 与安全',
    sources: ['浏览器原理知识点.md', '一些高频率考点.md'],
  },
  {
    id: 'network',
    name: '计算机网络',
    color: '#5f3dc4',
    description: 'HTTP/HTTPS、状态码、DNS、TCP/UDP、WebSocket 与 SSE',
    sources: ['计算机网络面试题.md', '收集的面试知识点.md'],
  },
  {
    id: 'vue',
    name: 'Vue',
    color: '#2f9e44',
    description: '响应式原理、生命周期、组件通信、Vue Router、Vuex/Pinia、虚拟 DOM',
    sources: ['Vue框架面试题.md', '一些高频率考点.md', '知识点快速复习指南.md'],
  },
  {
    id: 'react',
    name: 'React',
    color: '#0c8599',
    description: '组件模型、setState、Hooks、Fiber、Diff、Redux 与状态管理',
    sources: ['React框架面试题.md', '收集的面试知识点.md', '针对简历问答.md'],
  },
  {
    id: 'performance',
    name: '性能优化',
    color: '#e03131',
    description: '性能指标、首屏加载、懒加载、虚拟列表、回流重绘、图片与资源优化',
    sources: ['前端性能优化.md', '前端性能优化面试题.md', '知识点快速复习指南.md'],
  },
  {
    id: 'engineering',
    name: '工程化',
    color: '#f08c00',
    description: 'Git、Webpack、Vite、Babel、Tree Shaking、npm 与 Monorepo',
    sources: ['前端工程化面试题.md', '收集的面试知识点.md', '基于简历的问题.md'],
  },
  {
    id: 'algorithm',
    name: '算法与数据结构',
    color: '#7048e8',
    description: '数组、链表、树、图、动态规划、回溯、贪心与高频手写题',
    sources: ['基础算法.md', '知识点快速复习指南.md'],
  },
  {
    id: 'scenario',
    name: '业务场景题',
    color: '#0c8599',
    description: '大文件上传、并发控制、多标签页通信、错误监控、组件封装等场景设计',
    sources: ['问答类型面试题.md', '一些高频率考点.md'],
  },
  {
    id: 'project',
    name: '项目经验',
    color: '#862e9c',
    description: '农担智能体平台、慢 SQL 分析系统、BroadcastChannel、RBAC、FastAPI 与简历问答',
    sources: ['农担重点逻辑.md', '项目逻辑.md', '针对简历问答.md', '基于简历的问题.md', 'fastapi知识点.md'],
  },
]

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
)
