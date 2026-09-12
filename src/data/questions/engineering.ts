import type { RawQuestion } from '../../types'

/**
 * 工程化题库
 * 来源：docs/前端工程化面试题.md、docs/收集的面试知识点.md、
 *       docs/问答类型面试题.md、docs/基于简历的问题.md、docs/农担项目所遇问题及总结.md
 */
export const engineeringQuestions: RawQuestion[] = [
  // ============ Git ============
  {
    id: 'en-001',
    type: 'essay',
    diff: 'easy',
    sub: 'Git',
    q: 'Git 和 SVN 的区别是什么？git pull 和 git fetch 的区别？',
    ans: `**面试回答：**

**Git vs SVN**：
- SVN 是**集中式**版本控制：只有一个中央仓库，必须联网提交，单点故障风险；
- Git 是**分布式**：每个开发者本地都有**完整仓库历史**，可以离线提交、本地分支操作，push 时再同步到远程；分支轻量、切换快。

**git pull vs git fetch**：
- \`git fetch\`：只把远程仓库的**最新提交拉到本地远程分支**（origin/xx），**不合并**到当前分支，可以先查看差异再决定；
- \`git pull\` = \`git fetch + git merge\`（或配置为 rebase），拉下来**直接合并**，遇到冲突当场处理。

**rebase vs merge**：merge 保留分叉历史、产生合并提交；rebase 把当前分支提交“搬到”目标分支末尾，历史线性整洁，但会改写提交，**不要对已推送到公共分支的提交 rebase**。`,
    ana: '加分句：团队协作我会先 fetch 看差异，再用 rebase 保持提交历史线性。',
    keys: ['分布式', 'fetch 不合并', 'rebase 线性历史'],
    src: '前端工程化面试题.md',
  },
  {
    id: 'en-002',
    type: 'essay',
    diff: 'medium',
    sub: 'Git',
    q: 'git cherry-pick 是干什么的？什么场景会用到？',
    ans: `**面试回答：**\`git cherry-pick <commit>\` 把**指定的某个（或某段）提交**摘取应用到当前分支，生成新的提交。

**常见使用场景**：
1. 在错误分支上开发了功能，把提交摘到正确分支；
2. bug 修复提交需要同步到多个发布分支，不想整个分支合并；
3. 只想要某个功能分支中的部分提交。

**常用操作**：
\`\`\`bash
git cherry-pick <commitHash>          # 应用单个提交
git cherry-pick <hash1> <hash2>       # 按顺序应用多个
git cherry-pick A..B                  # 应用 (A, B] 区间，不含 A
git cherry-pick A^..B                 # 应用 [A, B]，包含 A
git cherry-pick --continue            # 解决冲突后继续
git cherry-pick --abort               # 取消，回到操作前状态
git cherry-pick -n <hash>             # 只应用更改不自动提交
\`\`\`

**项目经验**：农担项目中我用 cherry-pick 把一个分支的修复同步到另一个集成分支，解决冲突后用 --continue 继续；--abort 可以完全放弃恢复原状。`,
    ana: '这是 docs/农担项目所遇问题及总结.md 中记录的实际使用经验，带场景回答最自然。',
    keys: ['摘取提交', '多分支同步', '--abort 回退'],
    src: '农担项目所遇问题及总结.md',
  },
  {
    id: 'en-003',
    type: 'essay',
    diff: 'medium',
    sub: 'Git',
    q: 'Monorepo 主要解决了什么问题？Monorepo 和 git 子模块有什么区别？',
    ans: `**面试回答：**

**Monorepo**：多个项目/包放在**同一个仓库**中管理（pnpm workspace、Turborepo、Nx）。

**解决的问题**：
1. **跨项目共享代码**：公共组件、工具库改动一处，所有项目即时受益，不需要发 npm 包再各处升级；
2. **原子提交**：一个 PR 可以同时修改多个相关项目，版本一致性有保障；
3. **统一工程配置**：lint、构建、CI 规范统一；
4. 依赖去重与提升，减少磁盘与安装成本。

**Monorepo vs git 子模块**：
- **git submodule** 是把其他仓库作为引用嵌入，各仓库**独立版本、独立提交**，主仓库只记录指针；更新子模块要单独操作，协作成本高、容易忘记更新导致版本漂移；
- **Monorepo 所有代码在同一个仓库同一份历史**，没有指针同步问题，但仓库体积大、权限控制粗（不能按目录设权限）、CI 需要增量构建优化。

**选型**：需要强一致共享、团队协作紧密 → Monorepo；需要独立发布、权限隔离 → 多仓库 + 子模块/包管理。`,
    ana: '对比核心：同一份历史 vs 独立仓库指针引用。',
    keys: ['原子提交', 'pnpm workspace', '子模块指针'],
    src: '问答类型面试题.md',
  },

  // ============ Webpack ============
  {
    id: 'en-004',
    type: 'essay',
    diff: 'medium',
    sub: 'Webpack',
    q: 'Webpack 的构建流程是怎样的？Loader 和 Plugin 有什么不同？',
    ans: `**面试回答：**

**Webpack 构建流程**：
1. **初始化**：读取配置（webpack.config.js + CLI 合并），创建 Compiler 对象，注册所有内置插件，触发 environment/afterEnvironment 钩子；
2. **开始编译**：run 被调用，创建 Compilation，从 **entry 入口**开始；
3. **编译模块**：调用对应 **Loader** 转换每个模块内容 → 生成 AST（babel-parse/acorn），找出依赖，**递归处理**形成依赖图（module/chunk）；
4. **封装产物**：根据依赖图把模块组合成 chunk，再转换成 bundle 输出到 output 目录；
5. 全程通过 **Tapable 钩子**广播事件（emit、done 等），插件在各阶段介入。

**Loader vs Plugin**：
- **Loader**：**文件转换器**，把非 JS 模块（TS、CSS、图片、SVG）转换为 Webpack 能处理的模块，运行在模块编译阶段，是**单一职责的纯转换函数**（test + use 配置，从右往左/从下往上执行）；
- **Plugin**：**基于 Tapable 的事件机制**介入**整个构建生命周期**，能拿到 compiler/compilation 实例做全局性处理：打包优化、资源压缩（TerserPlugin）、生成 HTML（HtmlWebpackPlugin）、环境变量注入、清空目录等。

一句话：**Loader 处理“一个文件”，Plugin 处理“整个构建过程”**。`,
    ana: '常见 Loader：babel-loader、ts-loader、css-loader、style-loader、sass-loader、file/asset、vue-loader。常见 Plugin：HtmlWebpackPlugin、MiniCssExtractPlugin、DefinePlugin、BundleAnalyzerPlugin。',
    keys: ['依赖图', 'Loader 转换', 'Plugin 生命周期', 'Tapable'],
    src: '前端工程化面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'en-005',
    type: 'essay',
    diff: 'medium',
    sub: 'Webpack',
    q: 'bundle、chunk、module 分别是什么？怎么配置单页和多页应用？',
    ans: `**面试回答：**

- **module**：一切被 Webpack 处理的**模块**（JS 文件、CSS、图片，loader 处理后的产物），是最小处理单元；
- **chunk**：Webpack 内部**打包过程的中间产物**——按入口/拆分策略组合的一组 module，分为 initial（入口）、async（异步 import）、runtime chunk；
- **bundle**：构建最终**输出的文件**，通常一个 chunk 对应一个 bundle（也可以拆分/合并）。

关系：module 组成 chunk，chunk 输出成 bundle。

**单页应用（SPA）**：entry 只有一个入口，路由由前端处理：
\`\`\`js
module.exports = {
  entry: './src/index.js',
  output: { filename: 'bundle.js', path: path.resolve(__dirname, 'dist') },
}
\`\`\`

**多页应用（MPA）**：entry 配置多个入口，配合 HtmlWebpackPlugin 生成多个 HTML：
\`\`\`js
entry: { index: './src/index.js', admin: './src/admin.js' },
output: { filename: '[name].bundle.js' },
plugins: [new HtmlWebpackPlugin({ template: 'index.html', chunks: ['index'] })]
\`\`\``,
    ana: 'chunk 是过程产物、bundle 是输出产物，这个区分是关键。',
    keys: ['module/chunk/bundle', '多 entry', 'HtmlWebpackPlugin'],
    src: '前端工程化面试题.md',
  },
  {
    id: 'en-006',
    type: 'essay',
    diff: 'medium',
    sub: 'Webpack',
    q: '如何提高 Webpack 的构建速度？如何减少打包体积、优化前端性能？',
    ans: `**面试回答：**分三个目标：

**1. 构建速度**：
- **持久化缓存**（cache: { type: 'filesystem' }），二次构建大幅提速；
- **缩小处理范围**：include/exclude 排除 node_modules，resolve.alias、resolve.extensions 精简；
- **多进程**：thread-loader 并行处理；
- 开发环境关闭不必要的优化、用 esbuild/swc 替代 babel；
- 用 speed-measure-webpack-plugin 定位慢在哪。

**2. 打包体积**：
- **Tree Shaking**：剔除未使用代码（依赖 ES6 静态模块）；
- **代码分割**：splitChunks 抽离公共依赖、路由懒加载；
- 第三方库**按需引入**（lodash-es、组件库自动导入）；
- webpack-bundle-analyzer 分析大依赖；
- 图片压缩、CSS 提取与压缩（MiniCssExtractPlugin）。

**3. 运行性能**：
- hash 文件名 + 长期强缓存，公共库抽独立 chunk 利用浏览器缓存；
- 按需 polyfill（@babel/preset-env + useBuiltIns）；
- CDN 外链大依赖。`,
    ana: 'Tree Shaking 原理（docs 八股文第五幕）：依赖 ES6 静态 import/export → 编译期标记未使用 export → 压缩阶段由 Terser 删除。',
    keys: ['持久化缓存', 'Tree Shaking', 'splitChunks', 'bundle-analyzer'],
    src: '前端工程化面试题.md / 前端性能优化面试题.md / 前端面试八股文.md / 基于简历的问题.md',
  },
  {
    id: 'en-007',
    type: 'essay',
    diff: 'medium',
    sub: 'Webpack',
    q: 'Webpack 热更新（HMR）的实现原理是什么？',
    ans: `**面试回答：**HMR 让模块变化时**不刷新整个页面**、只替换变更模块并保留应用状态。

**流程**：
1. **启动时**：Webpack 开启 watch 模式监听文件变化；dev server（webpack-dev-server）与浏览器通过 **WebSocket** 保持长连接；
2. **文件变化**：Webpack 增量编译，生成变更模块的 **hash 和补丁文件（manifest + update chunk）**，通过 WebSocket 推送 hash 给浏览器；
3. **浏览器请求补丁**：客户端比对 hash 不一致后，通过 JSONP/AJAX 拉取 manifest 与更新 chunk；
4. **模块替换**：HMR runtime 判断模块是否有 \`module.hot.accept\` 注册的处理逻辑——有则执行回调替换旧模块、局部重新渲染；没有则**向上冒泡**到引用方，一路冒到入口还处理不了就整页刷新；
5. 状态保留：React 通过 react-refresh 保留组件 state。

**与 Vite HMR 的区别**：Webpack 需要把相关模块**重新打包**成补丁；Vite 利用原生 ESM，**只让浏览器重新请求变更的单个模块**，毫秒级生效。`,
    ana: '三个角色：webpack watch 编译、WebSocket 通知、HMR runtime 替换。module.hot.accept 是替换入口。',
    keys: ['WebSocket 通知', 'hash 补丁', 'module.hot.accept'],
    src: '前端工程化面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'en-008',
    type: 'essay',
    diff: 'medium',
    sub: 'Vite',
    q: 'Vite 相比 Webpack 有什么优势？两者的热更新有什么区别？',
    ans: `**面试回答：**

**Vite 的优势（核心在开发体验）**：
1. **开发阶段免打包**：基于浏览器**原生 ESM** 按需加载——启动时只启动 dev server，请求到哪个模块才编译哪个（esbuild 预构建依赖），冷启动秒级；
   - Webpack 则要先从入口**分析整个依赖图并完整打包**，项目越大启动越慢；
2. **HMR 快**：只更新变更模块，浏览器直接重新 import，与项目规模解耦；
3. 生产构建基于 **Rollup**，产物质量高；配置简单，内置 TS、CSS 预处理、Vue/React 插件。

**两者的热更新区别**：
- **Webpack**：文件变化 → 重新打包受影响的 chunk → 生成 hash 补丁 → WebSocket 通知 → 浏览器拉补丁替换。项目越大，**增量打包时间越长**；
- **Vite**：文件变化 → 直接**让浏览器重新请求该模块**（加时间戳 query 破坏缓存），esbuild 处理，**速度与项目规模基本无关**。

**局限**：开发与生产行为有差异（Rollup 打包 vs 原生 ESM）、生态插件成熟度、老浏览器兼容需要额外处理。`,
    ana: '一句话总结：Vite 把“打包”从启动路径上拿掉了，开发时按需编译。',
    keys: ['原生 ESM', 'esbuild 预构建', '按需编译'],
    src: '收集的面试知识点.md / 基于简历的问题.md',
  },
  {
    id: 'en-009',
    type: 'essay',
    diff: 'easy',
    sub: 'Babel 与编译',
    q: 'Babel 的原理是什么？编写一个 Loader 的思路是什么？',
    ans: `**面试回答：**

**Babel 原理**（编译器三部曲）：
1. **解析（Parse）**：词法分析 + 语法分析，把源码转成**抽象语法树 AST**（@babel/parser）；
2. **转换（Transform）**：遍历 AST，应用插件做转换——语法降级（箭头函数→普通函数）、补齐 API（polyfill）、JSX 转换（React.createElement）；
3. **生成（Generate）**：把新 AST 转回目标代码字符串（@babel/generator）。

**编写 Loader 的思路**：Loader 本质是**接收文件内容、返回处理后内容**的函数：
\`\`\`js
module.exports = function (source) {
  // this 指向 loader 上下文：this.query 拿配置、this.async() 处理异步
  return source.replace(/console\\.log\\(.*?\\);?/g, '')
}
\`\`\`
要点：处理单一文件类型（职责单一）、链式组合（从右到左）、支持异步（this.async + callback）、可以通过 pitch 阶段拦截。

**编写 Plugin 的思路**：导出带 apply(compiler) 的类/函数，通过 \`compiler.hooks.xxx.tap(name, callback)\` 订阅生命周期钩子（如 emit 前修改产物、done 输出统计），操作 compilation 资源。`,
    ana: 'Babel 与 AST 是“编译前端”的基础：宏插件（babel-plugin-macros）、ESLint 都基于 AST。',
    keys: ['AST', 'parse/transform/generate', 'loader 函数式', 'plugin 钩子'],
    src: '前端工程化面试题.md',
  },
  {
    id: 'en-010',
    type: 'essay',
    diff: 'easy',
    sub: 'npm 与包管理',
    q: 'npm 是什么？dependencies、devDependencies、peerDependencies 有什么区别？npm install 的过程是怎样的？',
    ans: `**面试回答：**

- **npm**：Node.js 的**包管理工具**（Node 是 JS 运行时，npm 是配套的包管理器），负责依赖安装、版本解析、脚本执行；
- **dependencies**：**运行时依赖**，生产环境也需要（react、axios）；
- **devDependencies**：**开发/构建依赖**（vite、eslint、typescript），上线不需要；
- **peerDependencies**：**宿主依赖声明**——插件类包声明“我需要宿主项目提供某依赖”，避免重复安装多个实例（如组件库声明 peer react，确保用的是宿主的 React）。

**npm install 过程**：
1. 读取 package.json 和 lock 文件；
2. 构建/校验**依赖树**（解决版本冲突、扁平化去重）；
3. 检查本地缓存（缓存命中则直接解压）；
4. 从 registry 下载缺失包并**校验完整性**（integrity hash）；
5. 写入 node_modules、执行生命周期脚本（preinstall/postinstall）；
6. 更新 package-lock.json 锁定版本。

package-lock.json 的意义：锁定依赖树的确切版本和下载地址，保证团队和 CI 环境安装结果一致。`,
    ana: 'registry 是包的远程仓库，npx 可以临时执行包而不安装。',
    keys: ['运行时 vs 开发依赖', 'peerDependencies', 'lock 文件'],
    src: '知识点快速复习指南.md',
  },
  {
    id: 'en-011',
    type: 'essay',
    diff: 'medium',
    sub: '工程化综合',
    q: '项目构建越来越慢、打包体积越来越大，你会怎么分析和优化？',
    ans: `**面试回答：**先定位再优化，分两个方向：

**一、定位**
- 构建慢：构建日志、speed-measure-webpack-plugin 看是 Loader 慢、依赖解析慢还是插件耗时长；
- 体积大：**webpack-bundle-analyzer** 分析产物构成，看哪些依赖占比大、有没有重复打包。

**二、构建速度优化**
1. 开启**持久化缓存**，增量构建；
2. 合理配置 include/exclude，Loader 不扫 node_modules；
3. alias 与 resolve.extensions 收敛，减少解析搜索；
4. 多进程（thread-loader）、升级工具链（Vite/esbuild/swc）。

**三、产物体积优化**
1. bundle-analyzer 找大依赖 → 替换轻量库、按需引入；
2. **代码分割**：路由懒加载、splitChunks 抽公共依赖；
3. 确保 **Tree Shaking** 生效（ESM 引入、sideEffects 配置）；
4. 公共依赖抽独立 chunk 利用浏览器缓存；
5. 图片压缩、开启 gzip/brotli。

**Vite 项目**：开发慢通常和**依赖预构建**有关（检查 optimizeDeps 配置）；生产基于 Rollup，优化思路同上。整体原则：**先定位是构建慢还是产物大，再用对应手段，不盲目加配置**。`,
    ana: '这是 docs/基于简历的问题.md 的“构建打包优化”原题，结构化答法直接可用。',
    keys: ['定位先行', '持久化缓存', 'bundle-analyzer', 'Tree Shaking'],
    src: '基于简历的问题.md',
  },
  {
    id: 'en-012',
    type: 'judge',
    diff: 'easy',
    sub: 'Webpack',
    q: 'Loader 运行在模块编译阶段负责文件转换，Plugin 基于 Tapable 钩子机制可以介入 Webpack 整个构建生命周期。',
    ans: true,
    ana: 'Loader 是转换器（如 babel-loader 把 TS/JSX 转 JS），按配置链式从右向左执行；Plugin 通过 compiler.hooks / compilation.hooks 订阅事件，可以做压缩、生成 HTML、注入环境变量、产物分析等全局工作。',
    keys: ['Loader 转换', 'Plugin 钩子'],
    src: '前端工程化面试题.md / 知识点快速复习指南.md',
  },

  {
    id: 'en-013',
    type: 'multiple',
    diff: 'medium',
    sub: 'Webpack',
    q: '要让 **Tree Shaking** 有效剔除未使用代码，下列哪些条件/做法是需要的？（多选）',
    opts: [
      '使用 ES6 模块（import / export）而非 CommonJS',
      '生产模式或开启代码压缩（Terser）',
      '正确配置 sideEffects 标记无副作用文件',
      '把公共库用 require 动态引入以方便分析',
    ],
    ans: ['A', 'B', 'C'],
    ana: 'Tree Shaking 依赖 ES6 模块的**静态结构**（编译期可分析依赖），CommonJS 的 require 是运行时动态加载无法静态分析；编译阶段 Webpack 标记未使用的 export，**压缩阶段由 Terser 安全删除**；package.json 的 sideEffects 告诉打包器哪些文件有副作用（如 CSS、polyfill）不能被误删。用 require 动态引入恰恰会让 Tree Shaking 失效。',
    keys: ['ESM 静态分析', '标记 + 压缩删除', 'sideEffects'],
    src: '前端面试八股文.md / 前端工程化面试题.md',
  },
  {
    id: 'en-014',
    type: 'essay',
    diff: 'medium',
    sub: 'CI/CD',
    q: '前端项目的 CI/CD 流程通常包含哪些阶段？如何保证发布质量？',
    ans: `**面试回答：**前端 CI/CD 一般从代码提交触发，经过依赖安装、代码检查、类型检查、单元测试、构建、产物上传和部署发布几个阶段。

**典型流程**：
1. PR 阶段跑 lint、typecheck、test，阻止明显问题合并；
2. main 或 release 分支合并后执行生产构建，生成带 hash 的静态资源；
3. 上传静态资源到 CDN 或制作为 Docker 镜像；
4. 先发布静态资源，再发布 HTML，避免新 HTML 引用不到资源；
5. 灰度或分批发布，观察错误率、接口成功率、核心性能指标；
6. 保留上一版本产物，出现问题可以快速回滚。

**质量保障**：锁定依赖版本、环境变量分环境管理、构建产物可追溯（commit/version）、发布后自动冒烟和监控告警。`,
    ana: 'CI/CD 题重点是“自动化流水线 + 发布顺序 + 可回滚”，不是只会 npm run build。',
    keys: ['lint/typecheck/test', '先资源后 HTML', '灰度发布', '回滚'],
    src: '前端工程化面试题.md',
  },
  {
    id: 'en-015',
    type: 'single',
    diff: 'medium',
    sub: 'npm 与包管理',
    q: 'package-lock.json、pnpm-lock.yaml 这类 lock 文件最核心的作用是什么？',
    opts: [
      '记录依赖树的精确版本和完整性信息，保证安装结果可复现',
      '让项目不再需要 package.json',
      '自动修复所有安全漏洞',
      '只在浏览器运行时读取',
    ],
    ans: 'A',
    ana: 'lock 文件锁定直接依赖和间接依赖的具体版本、下载地址和 integrity hash，保证团队成员、CI、生产构建拿到一致的依赖树。它不能替代 package.json，也不能自动解决所有漏洞。',
    keys: ['lock 文件', '可复现安装', '依赖树', 'integrity'],
    src: '前端工程化面试题.md',
  },
  {
    id: 'en-016',
    type: 'essay',
    diff: 'medium',
    sub: '环境配置',
    q: '前端项目中环境变量应该如何管理？有哪些安全边界？',
    ans: `**面试回答：**前端环境变量通常按开发、测试、预发、生产拆分，例如 .env.development、.env.production，用于配置 API baseURL、CDN 地址、埋点开关、构建模式等。Vite 中只有带 VITE_ 前缀的变量会暴露给客户端，Webpack 通常通过 DefinePlugin 注入。

**注意点**：
1. 前端环境变量最终会进入构建产物，不能放数据库密码、服务端密钥、AccessKey Secret 等真正敏感信息；
2. 不同环境配置要有明确来源，避免本地配置混入生产构建；
3. CI/CD 中通过受控变量注入，构建产物记录版本号和环境；
4. 接口权限和密钥校验必须在服务端完成，前端只能保存公开配置或短期 token。

一句话：前端环境变量用于控制构建和运行入口，不是秘密存储。`,
    ana: '安全边界是本题关键：凡是打进前端包里的内容，都可以被用户看到。',
    keys: ['.env', 'VITE_ 前缀', 'DefinePlugin', '不能存密钥'],
    src: '前端工程化面试题.md',
  },
]
