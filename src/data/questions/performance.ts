import type { RawQuestion } from '../../types'

/**
 * 性能优化题库
 * 来源：docs/前端性能优化.md、docs/前端性能优化面试题.md、
 *       docs/收集的面试知识点.md、docs/知识点快速复习指南.md、docs/一些高频率考点.md
 */
export const performanceQuestions: RawQuestion[] = [
  {
    id: 'pf-001',
    type: 'essay',
    diff: 'medium',
    sub: '性能指标',
    q: '前端性能指标有哪些？FCP、LCP、INP、CLS 分别衡量什么？',
    ans: `**面试回答：**核心指标（Core Web Vitals）：

1. **FCP**（First Contentful Paint，首次内容绘制）：页面第一次出现文字、图片、SVG 等内容的时间——说明“页面不是白屏了”；
2. **LCP**（Largest Contentful Paint，最大内容绘制）：首屏最大图片、标题块等内容完成绘制的时间——**最能代表用户感知的首屏速度**；
3. **INP**（Interaction to Next Paint，交互响应延迟）：点击、输入等交互从触发到页面响应的延迟，主线程长任务过多会让 INP 变差（替代了 FID）；
4. **CLS**（Cumulative Layout Shift，布局稳定性）：页面加载中元素是否突然移动——图片未设置宽高、异步插入广告/弹窗都会变差；
5. **TTFB**（Time to First Byte，首字节时间）：反映服务端响应和网络链路速度。

**数据来源要说清楚**：本地 Performance/Lighthouse 用于**定位问题**，真实用户监控（RUM）用于**验证线上效果**；简历里报数据要补充采样范围、网络条件、版本对比和分位数（P50/P75/P90），避免只报单次本地结果。

我的简历数据：LCP 从约 2.4s 优化到约 1.5s，回答时会说明是线上真实用户 P75 口径的对比。`,
    ana: '四个指标的记忆：FCP 白屏结束、LCP 首屏内容、INP 交互延迟、CLS 布局抖动。',
    keys: ['FCP/LCP/INP/CLS', 'TTFB', 'RUM vs Lighthouse'],
    src: '知识点快速复习指南.md / 收集的面试知识点.md / 一些高频率考点.md',
  },
  {
    id: 'pf-002',
    type: 'essay',
    diff: 'medium',
    sub: '首屏优化',
    q: '首屏加载性能优化你会从哪些方面入手？如果 LCP 元素是一张首屏大图怎么优化？',
    ans: `**面试回答：**遵循“**先定位，再优化**”：

**第一步定位**：Lighthouse/Performance/Network/Bundle Analyzer 分析瓶颈——慢在网络、JS 执行还是渲染。

**网络层**：
1. 代码分割：**路由懒加载**、组件异步加载，拆分主包；
2. 资源压缩：Gzip/Brotli、图片压缩与 WebP/AVIF 格式；
3. **CDN** 加速静态资源、DNS 预解析（dns-prefetch）、preload 关键资源；
4. 缓存策略：hash 文件名 + 长期强缓存，index.html 短缓存。

**执行层**：减少首屏同步 JS、低优先级逻辑延后初始化、非关键脚本 defer。

**渲染层**：减少首屏 DOM 复杂度、骨架屏提升感知。

**LCP 是图片时的抓手**：
1. 压缩体积、改用 WebP/AVIF；
2. 设置 width/height（避免 CLS）；
3. \`<link rel="preload">\` 预加载首屏图；
4. **首屏图不要懒加载**（懒加载反而推迟 LCP）；
5. LCP 是文本时：减少阻塞 CSS、字体预加载、避免首屏内容依赖过多 JS 渲染。`,
    ana: '结构化回答：定位 → 网络/执行/渲染三层 → 针对性抓手。避免“一上来就加缓存”。',
    keys: ['路由懒加载', 'Brotli', 'preload LCP 图', '先定位再优化'],
    src: '前端性能优化.md / 知识点快速复习指南.md / 收集的面试知识点.md',
  },
  {
    id: 'pf-003',
    type: 'essay',
    diff: 'easy',
    sub: 'CDN',
    q: 'CDN 的概念、原理和使用场景是什么？',
    ans: `**面试回答：**

**概念**：CDN（Content Delivery Network，内容分发网络）是把源站内容分发到**各地边缘节点**的网络，让用户从**距离最近的节点**获取资源。

**原理**：
1. 全局负载均衡：DNS 解析时根据用户地理位置、运营商，把域名解析到**最近/最空闲**的 CDN 节点（CNAME 到 CDN 调度系统）；
2. 边缘节点缓存：命中缓存直接返回；未命中则**回源**（从源站/上级节点拉取），并缓存下来供后续用户使用。

**作用**：缩短物理传输距离、分担源站压力、抗流量峰值，同时节省带宽成本。

**使用场景**：静态资源（JS/CSS/图片/字体）、视频点播与直播、软件下载包。前端项目常把构建产物（带 hash 的静态文件）上传 CDN，HTML 里引用 CDN 地址。

**注意事项**：缓存刷新策略、版本化文件名、回源风暴控制。`,
    ana: '关键词链：CNAME 调度 → 边缘节点 → 命中/回源。',
    keys: ['边缘节点', 'DNS/CNAME 调度', '回源', '负载均衡'],
    src: '前端性能优化面试题.md',
  },
  {
    id: 'pf-004',
    type: 'essay',
    diff: 'medium',
    sub: '懒加载',
    q: '懒加载的原理是什么？和预加载有什么区别？图片懒加载有哪些实现方案？',
    ans: `**面试回答：**

**懒加载**：延迟加载**当前不需要**的资源，进入可视区域时才加载。**原理**：img 初始 src 为空或占位图，把真实地址放在 data-src；监听滚动（或用 IntersectionObserver），判断元素 \`getBoundingClientRect().top\` 与视口的关系，进入视口时把 data-src 赋给 src 触发加载。

**懒加载 vs 预加载**：懒加载**按需**加载节省带宽（图片列表、路由分包）；预加载是**提前**加载马上要用的资源（preload/prefetch），牺牲带宽换体验（首屏 LCP 图、下一页资源）。

**图片懒加载方案对比**（docs 问答原题）：
1. \`loading="lazy"\`：原生 HTML 属性，一行代码，兼容性已很好，首选；
2. **IntersectionObserver**：异步观察交叉状态，不阻塞主线程，性能好于滚动监听，可控制 rootMargin 提前量；
3. **滚动事件 + 手动计算**：最原始，需要节流，容易引起布局抖动，不推荐；
4. 第三方库（lazysizes 等）：功能全面，适合复杂占位/淡入效果。

**其他懒加载**：路由懒加载（动态 import）、组件异步加载、虚拟列表本质也是“只渲染可视区”。`,
    ana: '方案对比题答法：先说原生属性（默认答案），再按性能和灵活度排 IntersectionObserver。',
    keys: ['IntersectionObserver', 'loading=lazy', 'data-src', 'preload 反向'],
    src: '前端性能优化面试题.md / 问答类型面试题.md',
  },
  {
    id: 'pf-005',
    type: 'essay',
    diff: 'medium',
    sub: '渲染优化',
    q: '大量数据一次性渲染导致卡顿，你会怎么优化？虚拟列表的实现原理是什么？',
    ans: `**面试回答：**

**问题本质**：一次性创建几万条 DOM 节点，样式计算、布局、绘制的开销巨大，主线程长时间阻塞。

**优化方案**：
1. **虚拟列表（虚拟滚动）**——核心方案：
   - 只渲染**可视区域**内的条目（可视区 + 上下缓冲区，比如前后各 5 条）；
   - 容器固定高度，内部放一个**撑开总高度的占位元素**（总高度 = 总条数 × 行高），保证滚动条正确；
   - 监听滚动，用 \`scrollTop / 行高\` 计算**起始索引**，动态替换渲染的数据切片，再用 \`transform: translateY(偏移量)\` 把内容定位到正确位置；
   - 不可定高时可先渲染再测量或预估行高，滚动中修正；
2. **分页加载/上拉加载**：从数据源头减少一次性请求量；
3. **时间分片**：requestAnimationFrame 分批插入（大数据但必须全渲染时）；
4. **Web Worker** 处理数据计算，主线程只负责渲染。

**项目结合**：智能体平台的复杂表格用“服务端分页 + 列配置稳定 + 按需渲染 + 筛选输入防抖”，避免整表深层响应式更新。`,
    ana: '虚拟列表三板斧：占位撑高、scrollTop 算索引、transform 定位。不定高场景的处理是深挖点。',
    keys: ['可视区渲染', 'scrollTop 索引', 'transform 偏移', '不定高'],
    src: '前端性能优化.md / 一些高频率考点.md / 收集的面试知识点.md',
  },
  {
    id: 'pf-006',
    type: 'essay',
    diff: 'medium',
    sub: '回流重绘',
    q: '回流与重绘的概念、触发条件和规避方法？documentFragment 是什么？',
    ans: `**面试回答：**

**概念**：
- **回流（Reflow/重排）**：元素**几何属性**（宽高、位置、字体）变化，浏览器重新计算布局。一个元素变化可能影响父、兄弟甚至整页，开销大；
- **重绘（Repaint）**：只改变**外观**（color、background、visibility、box-shadow），不影响布局。回流必然引发重绘，重绘不一定回流。

**触发回流的操作**：增删 DOM、改 width/height/margin/position、改字体、窗口 resize、**读取 offsetWidth/offsetHeight/getBoundingClientRect 等布局属性**（强制同步布局）。

**规避方法**：
1. 批量修改：DocumentFragment、改 className、cssText 一次写入；
2. **读写分离**：先统一读布局信息，再统一写样式，避免读写交替强制回流；
3. 动画用 **transform/opacity**（只走合成），复杂动画元素 position: absolute/fixed 脱离文档流；
4. \`will-change\` 适度提升合成层；
5. 虚拟列表减少 DOM 总量。

**DocumentFragment**：轻量文档片段，不在真实 DOM 树中。把节点先挂到 fragment（这些操作不触发回流），最后一次性 appendChild，只触发一次回流。`,
    ana: '“读布局属性也会触发回流”（强制同步布局）是很多人忽略的点。',
    keys: ['几何 vs 外观', '强制同步布局', 'transform 合成', 'DocumentFragment'],
    src: '前端性能优化面试题.md / 浏览器原理知识点.md',
  },
  {
    id: 'pf-007',
    type: 'essay',
    diff: 'easy',
    sub: '图片优化',
    q: '如何对项目中的图片进行优化？常见的图片格式及使用场景？',
    ans: `**面试回答：**

**图片优化手段**：
1. **格式选择**：WebP/AVIF 替代 JPEG/PNG（同质量体积小 25%~50%），提供兜底格式；
2. **响应式图片**：srcset + sizes 让浏览器按 DPR 和视口选择合适尺寸；
3. **懒加载**：loading="lazy" 或 IntersectionObserver（首屏图除外，避免拖慢 LCP）；
4. **压缩与尺寸**：构建压缩、按显示尺寸请求（不要 1000px 图显示 100px）；
5. **雪碧图 CSS Sprites**：合并小图标减少请求（HTTP/2 下必要性降低，可改用 SVG symbol 雪碧图）；
6. 首屏关键图 preload、CDN 分发、设置宽高防 CLS。

**格式场景**：
- **JPEG**：色彩丰富的照片，有损压缩；
- **PNG**：需要透明的图片、图标，无损；
- **GIF**：简单动图；
- **WebP/AVIF**：现代首选，兼容性差的场景提供降级；
- **SVG**：图标、Logo 等矢量图形，可缩放、可交互；
- **base64 内联**：极小图标减少请求，但会让 CSS 体积变大。`,
    ana: '渐进式加载（progressive JPEG 先模糊后清晰）是补充亮点。',
    keys: ['WebP/AVIF', 'srcset', '雪碧图', '首屏图不懒加载'],
    src: '前端性能优化面试题.md / 从零开始的前端面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'pf-008',
    type: 'essay',
    diff: 'medium',
    sub: '框架层优化',
    q: 'Vue 和 React 各自有哪些框架层面的性能优化手段？',
    ans: `**面试回答：**

**Vue 通用优化**：路由懒加载、图片优化、防抖节流、CDN + Gzip（与框架无关）。

**Vue 特有**：
1. **v-for 必须加 key**；
2. 频繁切换用 **v-show** 替代 v-if；
3. **computed 缓存**替代方法调用；
4. 组件异步加载（defineAsyncComponent）；
5. **shallowRef** 优化大对象（避免深层响应式代理开销），第三方实例 markRaw。

**React 特有**：
1. **React.memo** 避免子组件无效渲染；
2. **useCallback + useMemo** 缓存函数与对象引用（配合 memo 才有意义）；
3. **React.lazy + Suspense** 组件按需加载；
4. 避免内联对象/函数 props（破坏 memo）；
5. 用 **Fragment** 减少 DOM 层级；
6. useTransition/useDeferredValue 让低优先级更新不阻塞交互。

**工具检测**：Chrome Performance 看长任务、React DevTools Profiler 看组件渲染耗时、Vue DevTools 性能面板、Lighthouse 综合评分。

**实战优先级**（docs 前端性能优化.md）：先解决“包太大”（懒加载/拆包），再解决“渲染太多”（memo/缓存），最后才是微优化。`,
    ana: '框架优化题的关键是“和 memo 配合才有意义”这种因果表述，比罗列 API 高一档。',
    keys: ['React.memo', 'shallowRef', 'React.lazy', 'Profiler'],
    src: '前端性能优化.md',
  },
  {
    id: 'pf-009',
    type: 'single',
    diff: 'easy',
    sub: '性能指标',
    q: '以下哪个操作最容易导致 CLS（累积布局偏移）变差？',
    opts: [
      '图片未设置宽高，加载完成后撑开下方内容',
      '使用 system-ui 字体',
      '开启 gzip 压缩',
      '使用 CSS Grid 布局',
    ],
    ans: 'A',
    ana: 'CLS 衡量页面加载过程中元素是否突然移动。图片没有设置 width/height 时，浏览器无法预留空间，图片加载完成后内容整体下移，产生布局偏移。解决方案：设置宽高或 aspect-ratio、占位骨架屏、避免异步插入弹窗/广告到文档流中。',
    keys: ['CLS', 'width/height 预留', 'aspect-ratio'],
    src: '知识点快速复习指南.md',
  },
  {
    id: 'pf-010',
    type: 'essay',
    diff: 'medium',
    sub: '综合场景',
    q: '高访问量页面的前端优化手段有哪些？',
    ans: `**面试回答：**从资源加载、请求控制、渲染性能三方面：

**资源方面**：
1. **CDN** 分发静态资源，就近访问；
2. 缓存策略：hash 文件名 + 强缓存（Cache-Control 长过期）；
3. 代码压缩（JS/CSS minify、gzip/brotli）、Tree Shaking 减少体积；
4. 按需加载/懒加载减少首屏资源。

**请求方面**：
1. **接口缓存**与防重复请求（相同参数合并/去重）；
2. **防抖节流**降低高频触发（搜索、滚动）；
3. 请求合并（batch）减少请求数；
4. 静态化：内容型页面 SSR/SSG/预渲染，减少实时计算；
5. 降级预案：非核心接口失败不阻塞主流程。

**渲染方面**：
1. **虚拟列表**、分页加载减少 DOM 数量；
2. 组件懒加载、防重复渲染（memo/computed）；
3. 大图片优化、Web Worker 处理计算。

结合项目：数据上云平台多标签页监控场景，我用 BroadcastChannel 把 N 个 SSE 连接复用为 1 个，也是“降低资源消耗”的典型手段。`,
    ana: '三段式（资源/请求/渲染）+ 项目案例收尾。',
    keys: ['CDN + 强缓存', '请求合并', '虚拟列表', 'SSG'],
    src: '一些高频率考点.md / 收集的面试知识点.md',
  },
  {
    id: 'pf-011',
    type: 'essay',
    diff: 'hard',
    sub: '监控排查',
    q: '用户反馈页面白屏，你怎么排查？页面首屏慢，排查路径是什么？',
    ans: `**面试回答：**

**白屏排查**：
1. **复现**：确认设备/浏览器/账号环境，是否可稳定复现；
2. **看控制台**：JS 报错（脚本异常、资源 404）、接口报错；
3. **看 Network**：入口 JS/CSS 是否加载失败（CDN 故障、缓存污染、域名问题）、接口响应；
4. **定位层次**：资源加载失败 → 部署/CDN 问题；JS 运行时异常 → 渲染逻辑/兼容性问题（如浏览器插件改 DOM）；接口异常 → 后端问题；
5. **兜底验证**：是否有 ErrorBoundary 兜底、Sentry 之类的监控是否捕获到错误。

**预防**：路由级 ErrorBoundary（我的项目实践：翻译插件修改 DOM 导致渲染异常白屏，封装 ErrorBoundary 后局部可恢复）、错误监控上报、灰度发布。

**首屏慢排查路径**：
1. **Network** 看 DNS、连接、请求、下载耗时——判断慢在网络还是资源体积；
2. **Performance** 看主线程长任务、Layout/Paint、脚本执行耗时；
3. **Lighthouse** 看 LCP/CLS/INP 指标与建议；
4. **Coverage/Bundle Analyzer** 看未使用代码和包体积；
5. 对应优化：网络慢 → CDN/压缩/缓存；JS 慢 → 拆包/延后初始化；渲染慢 → 减少 DOM/虚拟列表。`,
    ana: '排查题的万能结构：复现 → 控制台 → Network → 定位层次 → 预防手段。',
    keys: ['复现问题', 'Network 定位', 'ErrorBoundary 兜底', 'Lighthouse'],
    src: '问答类型面试题.md / 针对简历问答.md / 知识点快速复习指南.md',
  },
  {
    id: 'pf-012',
    type: 'judge',
    diff: 'easy',
    sub: '渲染优化',
    q: 'requestAnimationFrame 会把回调安排在浏览器下一次重绘之前执行，因此用它驱动动画比 setTimeout 更贴合渲染节奏。',
    ans: true,
    ana: 'rAF 与浏览器渲染帧同步（通常 60fps，每 16.7ms 一帧），动画不会掉帧错拍；页面不可见时自动暂停，省电省性能。setTimeout 不与渲染对齐，间隔不准还可能在页面后台继续执行（被节流）。',
    keys: ['rAF 重绘前', '16.7ms 帧', '后台自动暂停'],
    src: '从零开始的前端面试题.md / 前端性能优化面试题.md',
  },

  {
    id: 'pf-013',
    type: 'multiple',
    diff: 'medium',
    sub: '性能指标',
    q: '下列哪些属于 Google Core Web Vitals **核心性能指标**？（多选）',
    opts: ['LCP（最大内容绘制）', 'INP（交互响应延迟）', 'CLS（布局稳定性）', 'TTFB（首字节时间）'],
    ans: ['A', 'B', 'C'],
    ana: 'Core Web Vitals 三大核心指标：**LCP**（首屏感知速度）、**INP**（交互响应延迟，替代了 FID）、**CLS**（布局稳定性）。TTFB（首字节时间）是重要的辅助指标但不属于核心三件套；FCP（首次内容绘制）也是常用辅助指标，说明白屏结束。补充口径：报数据要说明来源（Lighthouse 定位 vs 真实用户监控验证）和分位数（P75）。',
    keys: ['LCP/INP/CLS', 'TTFB 辅助', 'P75 口径'],
    src: '知识点快速复习指南.md',
  },
  {
    id: 'pf-014',
    type: 'multiple',
    diff: 'medium',
    sub: '渲染优化',
    q: '下列哪些手段可以**避免回流（Reflow）**或降低其开销？（多选）',
    opts: [
      '动画使用 transform / opacity 代替 top / left',
      '用 DocumentFragment 批量插入 DOM',
      '循环里交替读取 offsetWidth 再改样式',
      '动画元素设置 position: absolute / fixed 脱离文档流',
    ],
    ans: ['A', 'B', 'D'],
    ana: 'transform/opacity 只走合成阶段跳过布局绘制；DocumentFragment 在内存中组装节点、一次性插入只触发一次回流；动画元素脱离文档流能缩小重排影响范围。**循环里读写交替**（改样式→读 offsetWidth→再改）会造成强制同步布局，是典型的反面做法——正确做法是读写分离：先统一读布局信息，再统一写。',
    keys: ['transform 合成', 'DocumentFragment', '读写分离'],
    src: '前端性能优化面试题.md / 浏览器原理知识点.md',
  },
  {
    id: 'pf-015',
    type: 'essay',
    diff: 'medium',
    sub: '运行时性能',
    q: '什么是 Long Task？它会影响哪些性能指标？前端如何拆分长任务？',
    ans: `**面试回答：**Long Task 指主线程上连续执行超过 50ms 的任务。它会阻塞用户输入、样式计算、布局和绘制，导致页面点击没有响应，直接影响 INP，也可能间接影响 LCP 和动画流畅度。

**常见来源**：大包同步执行、大量 JSON 解析、大数组计算、一次性渲染大量 DOM、复杂递归或循环、第三方脚本初始化。

**优化方式**：
1. 代码分割和延迟初始化，减少首屏同步 JS；
2. 大任务拆成小块，用 requestIdleCallback、setTimeout、scheduler 或 requestAnimationFrame 分批执行；
3. 纯计算放到 Web Worker，主线程只接收结果并渲染；
4. 列表渲染用虚拟列表或分页；
5. 用 Chrome Performance 看 Main Thread 中的长任务和调用栈，再针对热点优化。`,
    ana: 'Long Task 的关键不是背 50ms，而是说明它占用主线程并影响交互响应。',
    keys: ['Long Task', '主线程阻塞', 'INP', 'Web Worker', '任务切片'],
    src: '前端性能优化面试题.md',
  },
  {
    id: 'pf-016',
    type: 'single',
    diff: 'medium',
    sub: '首屏优化',
    q: '首屏最大内容是一张关键图片时，下面哪个做法通常不合适？',
    opts: [
      '为图片设置 width/height 或 aspect-ratio',
      '对关键图片使用 preload 或 fetchpriority="high"',
      '给首屏关键图片统一添加 loading="lazy"',
      '使用 WebP/AVIF 并提供合理兜底',
    ],
    ans: 'C',
    ana: '首屏 LCP 图片如果懒加载，会推迟浏览器发现和下载资源，通常会让 LCP 变差。关键图片应尽早暴露给浏览器，并设置尺寸避免 CLS。',
    keys: ['LCP 图片', 'preload', 'fetchpriority', '首屏图不懒加载'],
    src: '前端性能优化.md',
  },
  {
    id: 'pf-017',
    type: 'essay',
    diff: 'medium',
    sub: '字体优化',
    q: 'Web 字体加载会带来哪些性能问题？如何优化字体加载体验？',
    ans: `**面试回答：**Web 字体可能带来三类问题：字体文件体积大导致首屏变慢；字体加载期间文字不可见或样式突变；字体替换时字形宽度变化引起 CLS。

**优化手段**：
1. 只引入需要的字重、字符集，中文字体尽量子集化；
2. 关键字体用 preload，并设置正确的 as="font"、type 和 crossorigin；
3. 使用 font-display: swap/optional，避免文字长期不可见；
4. 选择尺寸接近的 fallback 字体，降低字体切换带来的布局偏移；
5. 字体文件放 CDN 并设置长期缓存。

如果是后台系统，优先使用系统字体栈，通常比引入大体积自定义字体更稳。`,
    ana: '字体优化要同时考虑加载速度、可见性和 CLS，不能只说 preload。',
    keys: ['font-display', 'preload font', '字体子集化', 'CLS'],
    src: '前端性能优化.md',
  },
]
