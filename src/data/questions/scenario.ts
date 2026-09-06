import type { RawQuestion } from '../../types'

/**
 * 业务场景题库
 * 来源：docs/问答类型面试题.md、docs/一些高频率考点.md、
 *       docs/收集的面试知识点.md、docs/农担项目所遇问题及总结.md
 */
export const scenarioQuestions: RawQuestion[] = [
  {
    id: 'sc-001',
    type: 'essay',
    diff: 'medium',
    sub: '大文件上传',
    q: '大文件上传怎么做？分片、断点续传、并发控制的完整方案是什么？',
    ans: `**面试回答：**按“背景 → 方案 → 难点 → 结果”组织：

**背景**：SQL 大文件（几百 MB）单次上传时间长，一旦失败整个文件重来，稳定性差。

**方案**：
1. **分片上传**：前端把大文件按固定大小（如 5MB）切片，每个分片带上 fileId/fileHash/chunkIndex/chunkHash 信息；
2. **并发上传**：限制并发数（3~6 起步，按带宽和服务端限流调整），失败重试，支持暂停和取消（AbortController）；
3. **断点续传**：客户端生成稳定文件标识（文件名+大小+最后修改时间的 hash 或内容 hash），上传前先问服务端**已上传了哪些分片**，只补传缺失部分；
4. **服务端合并**：分片校验后记录，全部完成时**按 chunkIndex 排序合并**，合并后校验完整性；
5. **进度计算**：已完成分片字节数 / 文件总字节数（不是简单按分片数量算，除非分片完全等大）；
6. **Web Worker** 计算大文件 MD5，避免阻塞主线程。

**难点**：
- 分片大小权衡：太小请求数爆炸，太大失败重试代价高，按网络与服务端限制压测决定；
- 状态一致性：区分文件整体状态和每个分片状态，半数失败时保留成功的、只重试失败分片；
- 同一文件切片下标必须稳定：固定 chunkSize、按顺序计算 start/end、传输 chunkIndex。

**结果**：上传成功率与断网续传能力显著提升，用户中断后无需重传。`,
    ana: '这是 docs 反复强调的重点项目素材（知识点快速复习指南 + 问答类型面试题 + 基于简历的问题）。',
    keys: ['分片 + chunkIndex', '断点续传询问缺失分片', '并发 3~6', 'Web Worker 算 MD5'],
    src: '问答类型面试题.md / 知识点快速复习指南.md / 一些高频率考点.md',
  },
  {
    id: 'sc-002',
    type: 'essay',
    diff: 'medium',
    sub: '并发与限流',
    q: 'QPS 达到峰值时，前端有哪些应对手段？',
    ans: `**面试回答：**前端能在“请求发起侧”做的治理，四个方向：

1. **请求限流**：限制同时进行的请求数（并发控制/请求队列），完成一个再放行下一个；高频触发用**防抖节流**降低发起频率；
2. **请求合并**：把短时间内的多个同类请求合并成一个批量请求（如 100ms 内的多次搜索合并、批量上报合并），减少请求数；
3. **请求缓存**：相同参数的请求结果缓存/去重（Map 以参数为 key，进行中的请求共享同一个 Promise），避免重复消耗；
4. **任务队列**：非实时任务（日志上报、图片处理）进入队列异步分批执行，削峰填谷。

**配合服务端**：接口限流（429 状态码识别）、CDN 静态化、服务端缓存。前端拿到 429 要做**退避重试**（指数退避），避免雪崩式重试。

**总结**：前端治理的本质是**削峰**——把瞬时大量请求变成可控的稳态流量，真正的容量问题必须靠服务端扩容和架构优化。`,
    ana: '限流、合并、缓存、队列四个词是 docs 的原文框架。',
    keys: ['并发控制', '请求合并', '指数退避', '削峰'],
    src: '问答类型面试题.md',
  },
  {
    id: 'sc-003',
    type: 'essay',
    diff: 'medium',
    sub: '多标签页通信',
    q: '详细说说 BroadcastChannel 的运行逻辑（主从选举、心跳、异常恢复）。',
    ans: `**面试回答：**（这是我简历的核心亮点，按完整链路讲）

**目标**：数据上云平台用 SSE 推送监控数据，HTTP/1.1 下浏览器同域只有 **6 个长连接**，用户开多个标签页会导致新页面请求阻塞、图表不更新。方案：**保证任意时刻只有一个标签页持有 SSE 连接**，其他标签页通过 BroadcastChannel 获取数据。

**运行逻辑**：
1. **注册**：新标签页打开时给自己分配 tabId，注册到 localStorage 的 activeTabs；
2. **选举**：所有标签页按 tabId 排序，**tabId 最小者当 Master**（确定性选举），Master 把 instanceId 写入 masterKey 公示，其余标签页通过 BroadcastChannel 和 storage 事件感知——第一次打开的页面通常成为 Master；
3. **分工**：Master 持有 SSE 连接，收到推送后**统一广播**（消息带 serverId、pageId），各子标签页按自己订阅的标识过滤，避免无效渲染和串扰；BroadcastChannel 负责实时通信（选主、转发消息、心跳），activeTabs 负责成员感知；
4. **正常关闭**：Master 关闭触发 beforeunload，广播 master-disconnected 并清除 masterKey，其他标签页立即重新选举；
5. **异常恢复**：浏览器崩溃/断电时 unload 不执行，靠**心跳**——从标签页每 30 秒 ping，Master 回 pong，5 秒没收到 pong 就发起重新选举；
6. **后台标签页节流**：浏览器对后台页定时器降频，可能被误判失活清理；被清理的页面切回时会重新注册（非抢占式，现任 Master 不受影响）。

**为什么不用 localStorage 通信**：storage 事件**不通知当前页面**、实时性和性能一般；BroadcastChannel 原生支持同源多页实时通信，且只需修改 SSE 总配置文件，侵入小。

**评价**：解决了 90% 的问题；剩余风险是后台标签页被限速误判失活、localStorage 非原子操作有极小概率脑裂（选举结果确定性使其概率很低）。`,
    ana: 'docs 针对简历问答 + 项目逻辑两处原文的整合，几乎原文可背。亮点话术：只改一个 SSE 配置文件。',
    keys: ['tabId 选举', '心跳 ping/pong', '非抢占式', 'serverId/pageId 过滤'],
    src: '针对简历问答.md / 项目逻辑.md',
  },
  {
    id: 'sc-004',
    type: 'essay',
    diff: 'medium',
    sub: '组件设计',
    q: '什么场景下需要封装组件？封装组件的判断标准是什么？',
    ans: `**面试回答：**

**什么时候封装**（满足任一即可考虑）：
1. **多处复用**且交互规则一致；
2. 业务逻辑复杂，单页维护成本高；
3. 需要**统一样式、行为、校验和错误处理**；
4. 需要沉淀为团队**公共能力**。

**封装前的设计清单**：输入（props）、输出（事件/回调）、默认值、插槽/children、受控或非受控模式、异常状态、可扩展点。

**我的实践**（高分回答）：
1. 封装时遵循**高内聚、低耦合、可配置化**：和业务强相关的部分抽离出去，props 控制展示，emit/回调暴露事件，插槽/render props 提供扩展；
2. 智能体平台工作流节点类型很多，如果每种节点写一个表单组件维护成本高——我抽象了**配置驱动的动态渲染机制**：节点类型、字段类型、校验规则统一放到配置对象，组件按配置生成表单项，新增节点只加配置；
3. 组件分层：**基础组件只管 UI 和交互，不处理接口请求**；业务组件负责数据组合和状态管理；复杂场景提供公共 hooks；
4. 避免为了复用而**过度抽象**——只有稳定的“字段+类型+默认值+校验”才配置化，复杂联动就组件化。`,
    ana: '通用部分配置化、特殊部分组件化——这是 docs 中出现两次的核心原则。',
    keys: ['高内聚低耦合', '配置驱动', '插槽扩展', '避免过度抽象'],
    src: '一些高频率考点.md / 问答类型面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'sc-005',
    type: 'essay',
    diff: 'medium',
    sub: '组件设计',
    q: '举一个你封装的最有复用价值的组件例子：它解决了什么重复问题？如何设计的？',
    ans: `**面试回答：**（以 Error Boundary 为例，docs 原题答案）

**背景与重复问题**：农担智能体平台模块很多（构建、模型、知识库、系统、用户管理、召回测试等）。之前某个模块内部渲染异常会直接**整页白屏**——确实遇到过用户反馈某些页面白屏且本地难复现，排查发现是用户 Chrome 的**翻译插件修改 DOM** 导致 React 渲染异常。

**解决目标**：统一处理“局部模块异常导致全局白屏”，避免每个页面都写异常兜底逻辑。

**设计**：外部只需要 \`<ErrorBoundary><BusinessModule /></ErrorBoundary>\` 包住需要保护的模块，核心用 children 接收业务内容（因为它主要包在路由文件/关键模块外层）：

\`\`\`tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true } // 子组件渲染异常时切换到兜底 UI
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info) // 记录错误，便于定位渲染链路
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <div>当前模块出现异常</div>
          <button onClick={() => window.location.reload()}>重新加载</button>
        </div>
      )
    }
    return this.props.children
  }
}
\`\`\`

**价值**：路由级统一包裹后，某个模块异常时页面不整体崩溃，用户可重载或去其他功能——每个业务模块不需要自己实现异常兜底。解决的是**平台级**重复问题。`,
    ana: '组件封装题模板：重复问题 → 设计（Props/内部逻辑）→ 复用价值。必须用 class 实现（依赖生命周期）。',
    keys: ['getDerivedStateFromError', 'componentDidCatch', '路由级包裹'],
    src: '项目逻辑.md / 针对简历问答.md / 农担项目所遇问题及总结.md',
  },
  {
    id: 'sc-006',
    type: 'essay',
    diff: 'medium',
    sub: '错误监控',
    q: '前端错误监控系统怎么设计？如果让你设计一个日志上报 SDK，模块如何划分、上报策略怎么定？',
    ans: `**面试回答：**

**错误分类**：
1. **JS 运行时错误**：window.onerror / window.addEventListener('error') 捕获；
2. **Promise 未捕获异常**：unhandledrejection 事件；
3. **资源加载错误**：error 事件捕获阶段监听（img/script/link）；
4. **接口错误**：拦截 axios/fetch 统一上报状态码与耗时；
5. **React 特有**：ErrorBoundary 的 componentDidCatch / getDerivedStateFromError。

**SDK 模块划分**（面试官要求讲思路）：
1. **采集层**：注册各类监听，标准化错误对象（错误信息、堆栈、组件树、userAgent、页面 URL）；
2. **上下文层**：用户行为面包屑（点击、路由变化）、性能数据（web-vitals：LCP/INP/CLS）、请求记录，用于还原现场；
3. **缓冲队列层**：内存队列 + 定时/定量刷出；
4. **上报层**：sendBeacon（页面卸载也不丢）优先，降级 fetch/image；失败重试与本地暂存；
5. **配置层**：采样率、开关、环境区分、忽略规则（如过滤插件噪音）。

**上报策略**：
- **定量 + 定时**：队列满 N 条或超过 T 秒批量上报；
- **重要错误立即上报**；错误聚合（相同错误指纹合并计数，避免重复轰炸）；
- **采样**：普通日志抽样上报，错误不抽样；
- **页面卸载**用 sendBeacon 保证不丢。

**还原现场**：配合 sourcemap 还原压缩堆栈、版本号关联发布记录。`,
    ana: '“采集-上下文-缓冲-上报-配置”五层划分 + 采样/聚合/sendBeacon 三策略，是满分结构。',
    keys: ['unhandledrejection', '面包屑', 'sendBeacon', '错误聚合'],
    src: '问答类型面试题.md / 针对简历问答.md',
  },
  {
    id: 'sc-007',
    type: 'essay',
    diff: 'medium',
    sub: '移动端',
    q: '移动端适配有哪些方案？有哪些常见坑点？',
    ans: `**面试回答：**

**方案对比**：
1. **rem 方案**：JS 或 CSS 动态设置根字号（如屏宽/10），postcss-pxtorem 编译时把 px 转 rem，实现等比缩放；
2. **vw 方案**：直接用 vw 单位（1vw = 视口宽 1%），无需 JS；
3. **媒体查询 + flex/grid**：断点式布局，适合内容型响应式页面；
4. **大屏看板**：固定设计稿尺寸 + transform: scale 整体缩放（注意弹层坐标系）。

**常见坑点**：
1. **1px 边框问题**：高 DPR 屏 1px 物理像素太粗——用 transform: scale(0.5) 伪元素或 border-image；
2. **点击 300ms 延迟**：历史上浏览器等待双击缩放，设置 viewport meta（width=device-width）后已基本消除，或用 fastclick（已过时）；
3. **软键盘遮挡/顶起页面**：iOS 输入框 focus 后 fixed 定位错乱，用交互后 blur 处理或监听键盘高度；
4. **iOS 安全区域**：底部横条遮挡，用 \`env(safe-area-inset-bottom)\`；
5. **禁止缩放与滚动穿透**：弹层滚动穿透用 body overflow: hidden 或 overscroll-behavior；
6. **图片模糊**：按 DPR 提供 @2x/@3x 图或用矢量 SVG；
7. **后台标签页节流**：定时器降频影响心跳/轮询类逻辑（我在 BroadcastChannel 方案里就遇到过）。`,
    ana: 'viewport meta（禁止缩放 user-scalable=no 的取舍）、安全区域、1px 是三大经典坑。',
    keys: ['postcss-pxtorem', '1px 方案', 'safe-area-inset', 'DPR'],
    src: '问答类型面试题.md / 一些高频率考点.md',
  },
  {
    id: 'sc-008',
    type: 'essay',
    diff: 'medium',
    sub: '页面截图',
    q: '前端如何实现页面截图功能？技术方案怎么选？',
    ans: `**面试回答：**（docs 问答类型面试题原题，按背景/方案对比/落地设计/避坑讲）

**背景与痛点**：需要把页面（如报表、工作流画布）保存为图片分享，后端截图服务成本高且样式还原难。

**方案对比**：
1. **html2canvas**：把 DOM 解析后用 Canvas 绘制，纯前端、无依赖服务；缺点是 CSS 支持不完整（部分 box-shadow/filter/伪元素问题）、跨域图片需要 CORS 配置，复杂页面保真度有限；
2. **dom-to-image / modern-screenshot**：把 DOM 序列化为 SVG foreignObject 再转图片，对 CSS 支持更好，但同样受跨域资源限制；
3. **浏览器原生**：\`getDisplayMedia\`（屏幕捕获，需要用户授权，适合录制/共享而非自动截图）；
4. **服务端渲染截图**（Puppeteer/Playwright）：还原度最高，但需要后端资源、无法拿到登录后的本地状态。

**落地设计（通用截图工具协议）**：封装统一的 capture 工具：传入目标容器 ref + 配置（scale、背景色、排除元素、字体处理），内部完成克隆节点 → 过滤隐藏元素 → 资源转 base64 → 渲染 canvas → 导出 blob/png，对外暴露 promise 化 API 和错误回调，业务方一行调用。

**避坑**：跨域图片必须服务端允许 CORS 且 useCORS: true；canvas 尺寸过大移动端会白屏（分块或限制 scale）；字体加载完成前截图会缺字（document.fonts.ready 之后再截）。`,
    ana: '方案对比的核心维度：还原度、依赖、成本。html2canvas 的 CSS 支持局限是必答点。',
    keys: ['html2canvas', 'foreignObject', 'CORS', 'document.fonts.ready'],
    src: '问答类型面试题.md',
  },
  {
    id: 'sc-009',
    type: 'essay',
    diff: 'easy',
    sub: '访问端识别',
    q: '前端如何识别访问端（PC/移动/小程序）？识别后如何选择渲染策略？',
    ans: `**面试回答：**

**识别方式**：
1. **User-Agent**：解析 UA 判断设备类型、浏览器内核（navigator.userAgent）；UA 可伪造、信息有限，但是最通用方案；
2. **特性检测**：判断 'ontouchstart'、pointer: coarse 媒体查询等能力差异；
3. **视口尺寸**：window.innerWidth / matchMedia 断点；
4. **服务端识别（SSR 场景）**：根据请求头 UA 在服务端决定渲染版本，避免首屏闪烁；
5. **容器环境检测**：微信/小程序 JSBridge 特征（window.wx 等）。

**框架中使用**：识别结果挂到全局（Provider/Provide inject），跨组件共享设备信息，配合响应式断点切换布局。

**渲染策略选择**：
- 同一套代码响应式适配（主流，维护成本低）；
- 移动端单独的移动版页面/路由（交互差异大时）；
- UA 分流到不同域名（m.example.com），注意 SEO 的 alternate 标注。

**注意**：识别结果可能变化（旋转、缩放窗口），不要只在 mounted 判断一次。`,
    ana: 'UA 识别 + 特性检测组合，识别结果要可响应更新。',
    keys: ['User-Agent', '特性检测', 'SSR 识别'],
    src: '问答类型面试题.md',
  },
  {
    id: 'sc-010',
    type: 'essay',
    diff: 'easy',
    sub: '交互模式',
    q: '上拉加载和下拉刷新的实现逻辑是什么？',
    ans: `**面试回答：**

**上拉加载（无限滚动）**：
1. 监听滚动：容器 scrollTop + 可视高度 接近 scrollHeight 时触发（设置提前量如 200px）；
2. 加载下一页数据（带 loading 状态防重复触发），追加到列表；
3. 没有更多数据时关闭加载并显示提示；
4. 优化：**IntersectionObserver 监听底部哨兵元素**进入视口再触发，比滚动事件计算性能更好；配合防抖节流；新数据用唯一 key 渲染。

**下拉刷新**：
1. 监听 touchstart/touchmove/touchend（或容器 scrollTop === 0 时的拖拽）；
2. 顶部下拉时展示刷新动画（跟随手指位移，带阻尼），超过阈值后松手触发刷新；
3. 刷新完成后回弹动画并重置列表（通常回到第一页）；
4. 移动端组件库一般内置（ vant 的 PullRefresh），原理一致。

**注意点**：加载中状态锁、数据去重（防重复插入）、列表大时配合虚拟滚动。`,
    ana: '上拉 = 滚动触底加载下一页；下拉 = 顶部拖拽刷新第一页。',
    keys: ['scrollTop 触底', '哨兵元素', 'touch 事件阈值'],
    src: '问答类型面试题.md',
  },
  {
    id: 'sc-011',
    type: 'essay',
    diff: 'medium',
    sub: '降级与兜底',
    q: '静态资源加载失败的场景怎么做降级处理？',
    ans: `**面试回答：**（docs 问答原题）

**背景**：CDN 故障、域名被墙、版本发布瞬间等导致 JS/CSS 加载失败，页面白屏。

**降级方案**：
1. **多 CDN 备源重试**：script/link 的 onerror 回调里切换备用域名重新加载（动态创建 script 标签换 src）；
2. **本地兜底**：关键资源同域备份一份，CDN 失败后加载本地版本；
3. **上报与监控**：失败立即上报，触发告警；根据错误量自动切源；
4. **JS 加载失败的整页降级**：入口脚本 onerror 时展示静态兜底页/提示刷新；
5. **非关键资源失败**直接忽略或占位（埋点脚本、评论组件）；
6. **版本发布策略**：HTML 与静态资源发布顺序控制（先资源后 HTML）、保留上一个版本的资源文件，避免老 HTML 引用已删除资源。

**接口降级**配合：非核心接口失败不阻塞主流程，用缓存数据/默认值占位。`,
    ana: '“先资源后 HTML 发布 + 保留旧版本资源”是工程实践加分点。',
    keys: ['onerror 换源', '本地兜底', '发布顺序'],
    src: '问答类型面试题.md',
  },
  {
    id: 'sc-012',
    type: 'essay',
    diff: 'medium',
    sub: '大数处理',
    q: '后端返回的 ID 超过 Number 安全整数范围（大数处理）怎么解决？',
    ans: `**面试回答：**

**问题背景**：JavaScript 的 Number 是 IEEE 754 双精度，安全整数范围是 **Number.MAX_SAFE_INTEGER（2^53 - 1）**。后端（Java Long、数据库 bigint）生成的雪花 ID 超过这个范围，JSON 反序列化后**末尾精度丢失**（如 9007199254740993 变 9007199254740992），导致查询、比对错乱。

**解决方案**：
1. **后端序列化时把大数转字符串**（Long → String，Jackson 注解或全局配置）——最推荐，从源头解决；
2. 前端**用正则重写 JSON.parse**：解析前把长数字段加引号转字符串（如 json-bigint 库）；
3. 用 **BigInt** 类型接收（JSON.stringify 原生不支持 BigInt，需自定义序列化）；
4. axios 拦截器 transformResponse 配合 json-bigint 解析。

**注意**：BigInt 不能与 Number 直接混合运算、不能 JSON.stringify；比较时统一类型。大数计算场景（金额）用 decimal 类库。`,
    ana: '根因是 JSON.parse 的 Number 精度；治本是后端转字符串，治标是前端解析层拦截。',
    keys: ['2^53-1', 'Long 转 String', 'json-bigint'],
    src: '问答类型面试题.md',
  },
  {
    id: 'sc-013',
    type: 'essay',
    diff: 'easy',
    sub: '权限设计',
    q: '动态路由及鉴权怎么实现？菜单、路由、按钮、数据四层权限分别指什么？',
    ans: `**面试回答：**

**RBAC 四层权限**：
1. **菜单权限**：是否显示导航入口；
2. **路由权限**：是否允许进入页面（防 URL 直达）；
3. **按钮权限**：是否显示新增/编辑/删除等操作；
4. **数据权限**：接口返回哪些数据范围（如只看本部门）。

**前端动态路由流程**（Vue Router + Pinia 为例）：
1. 登录获取 Token 与用户权限列表；
2. 本地维护全量路由表，每条路由打 meta.permission 标记；
3. 用权限列表**递归过滤**路由表（getPrivateRouter(permissions)），生成该角色可见的路由树和菜单；
4. \`router.addRoute()\` 动态注册；
5. 处理**首次导航时序**（守卫中确保动态路由已注册后再放行，否则白屏/404）；
6. **退出登录时重置**动态路由和权限状态。

**关键原则**：前端权限只负责“体验和导航控制”，**真正的安全边界必须在后端**（接口鉴权、数据权限校验）——前端隐藏按钮挡不住直接调接口。

**实践问题**（我的项目）：用户有菜单权限但无数据权限时调接口 403，我们调整校验链路让“有菜单无数据权限”返回空结果而非异常，保证三层权限行为一致。`,
    ana: '四层权限模型 + addRoute 时序 + 后端兜底三句话是标准答案。',
    keys: ['meta.permission', 'router.addRoute', '后端兜底'],
    src: '问答类型面试题.md / 知识点快速复习指南.md / 基于简历的问题.md',
  },
  {
    id: 'sc-014',
    type: 'essay',
    diff: 'medium',
    sub: '鉴权与 Token',
    q: 'JWT 的概念与组成是什么？双 Token 机制如何设计？',
    ans: `**面试回答：**

**JWT 概念**：用于前后端分离的身份认证。用户登录后，后端校验账号密码，用服务端密钥签发 JWT（包含用户 ID、过期时间等），前端存起来，之后每次请求在 Authorization 头携带。**优势**：服务端无需像 Session 一样保存登录状态，Token 自带身份信息，靠签名防篡改。

**JWT 组成（三段式）**：
1. **Header**：类型与签名算法（JWT、HS256）——“说明怎么签”；
2. **Payload**：用户信息（用户 ID、过期时间 exp）——“存信息”；
3. **Signature**：用密钥对 Header+Payload 签名——“保证未被篡改”。
三部分用 . 连接，Base64Url 编码（**注意 Payload 只是编码不是加密**，不能放敏感明文）。

**过期校验**：exp 写在 Token 里，后端解析时比较当前时间，过期返回 **401**，前端引导重新登录。

**双 Token 机制**：
- **Access Token**：访问业务接口，有效期**短**（10 分钟~1 小时），泄露风险低；
- **Refresh Token**：专门用来换取新 Access Token，有效期**长**（几天~几十天），后端通常存 Redis/数据库以便注销和强制下线；
- 流程：Access 过期 → 拦截器捕获 401 → 用 Refresh Token 调刷新接口 → 换新 Access 并**重放原请求** → Refresh 也过期才跳登录页。`,
    ana: '拦截器里的“401 → 静默刷新 → 重放请求”是前端实现的加分细节。',
    keys: ['Header/Payload/Signature', 'exp 字段', '静默刷新重放'],
    src: '一些高频率考点.md / 收集的面试知识点.md',
  },
  {
    id: 'sc-015',
    type: 'essay',
    diff: 'medium',
    sub: '联调与排查',
    q: '前后端联调最常见的问题是什么？你怎么排查线上问题？',
    ans: `**面试回答：**

**联调常见问题**：
1. **字段不一致**（命名、大小写）与**数据结构变化**（分页结构、数组层级）；
2. **类型错误**：数字变字符串、大数精度丢失；
3. **空值问题**：后端返回 \`{ list: null }\`，前端直接 list.map 页面崩溃。

**我的规范**：
- TS 类型约束接口返回结构；
- 默认值处理（list ?? []）、接口数据校验；
- 把 Mock 与真实接口的差异**收敛在接口封装层**，不在页面散落兼容逻辑；
- 重点回归查询、重置、分页、刷新流程（切换真实接口后最容易出问题的地方）。

**线上问题排查步骤**：
1. **复现问题**（确认环境：设备/浏览器/账号/版本）；
2. **看控制台**：JS 报错、资源加载失败；
3. **看 Network**：接口状态码、响应内容、耗时；
4. **定位接口/状态**：接口问题转后端（带请求 ID），数据问题查渲染逻辑；
5. 复杂问题结合 **Chrome Performance、React/Vue DevTools、Network Timing、日志埋点**分析；
6. 修复后补充监控告警，防止同类问题无感知。`,
    ana: '排查万能链：复现 → 控制台 → Network → 定位接口/状态 → 渲染逻辑（docs 原文）。',
    keys: ['字段不一致', 'list ?? []', '复现 → 控制台 → Network'],
    src: '针对简历问答.md / 项目逻辑.md',
  },
  {
    id: 'sc-016',
    type: 'essay',
    diff: 'medium',
    sub: '部署',
    q: 'Docker 和 Nginx 在前端部署中实际怎么用？完整流程是什么？',
    ans: `**面试回答：**

**Nginx 的作用**：
1. **静态资源托管**：托管构建产物，开启 gzip 压缩、缓存头；
2. **history 路由回退**：\`location / { try_files $uri /index.html; }\`，否则刷新 404；
3. **反向代理**：/api 转发到后端服务，统一入口、解决跨域；
4. 负载均衡、HTTPS 证书配置。

**Docker 的作用**：把前端产物 + Nginx 配置打进镜像，保证环境一致性，任何机器 docker run 即可运行，不需要单独配 Node 环境。

**完整部署流程**（以涉诈数据平台 Demo 为例）：
1. **本地构建**：npm run build 产出 dist 静态资源；
2. **编写 Dockerfile**：基于 nginx 镜像，COPY dist 到 nginx 默认目录，COPY nginx.conf；\`\`\`dockerfile\nFROM nginx:alpine\nCOPY dist/ /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\n\`\`\`；
3. **构建镜像**：docker build -t fe-app .；
4. **启动容器**：docker run -d -p 8080:80 fe-app，映射端口；
5. **内网验证**：访问地址检查页面、静态资源路径、接口代理是否正常。

**经验**：静态资源 404 多为路径 base 配置问题；history 路由刷新 404 记得 try_files。`,
    ana: 'Dockerfile 三行核心 + try_files 是最低配置记忆点。',
    keys: ['try_files', 'nginx:alpine', '环境一致性'],
    src: '针对简历问答.md / 基于简历的问题.md',
  },
  {
    id: 'sc-017',
    type: 'essay',
    diff: 'easy',
    sub: '技术选型',
    q: '技术方案选型的评分矩阵中，如何确定评估维度的权重分配？',
    ans: `**面试回答：**（docs 问答原题）

**常见评估维度**：功能匹配度、性能、可维护性、团队熟悉度、社区生态与活跃度、学习成本、迁移/退出成本、安全合规。

**权重确定方法**：
1. **从业务目标倒推**：先明确这次选型要解决的核心问题——如果核心诉求是“快速交付”，可维护性与团队熟悉度权重调高；如果是“长期平台演进”，生态与可扩展性权重调高；
2. **与团队共识**：权重不是个人拍板，组织评审让相关方（开发、运维、产品）对维度的重要性打分，收敛分歧；
3. **区分一票否决项**：安全合规、许可证等硬性约束不进加权，直接作为门槛条件；
4. **敏感性验证**：对权重做小幅调整看结论是否翻转，结论不稳健说明需要补充数据或保留多方案。

**落地**：每个维度按 1~5 打分 × 权重求和得出综合分，同时记录“不可量化因素”（如团队意愿），最终给出推荐 + 备选方案 + 回退路径。`,
    ana: '答题亮点：一票否决项不参与加权 + 权重敏感性检验，体现方法论而不是背概念。',
    keys: ['业务倒推权重', '一票否决项', '敏感性验证'],
    src: '问答类型面试题.md',
  },
  {
    id: 'sc-018',
    type: 'judge',
    diff: 'medium',
    sub: '多标签页通信',
    q: 'localStorage 的 storage 事件会在所有标签页（包括执行写入的当前标签页）中触发。',
    ans: false,
    ana: 'storage 事件只在**其他同源标签页**触发，**当前执行写入的页面不会收到**——这也是我在项目中选择 BroadcastChannel 做标签页实时通信的原因之一（BroadcastChannel 的 postMessage 不广播给发送者自身，但同频道其他页面实时收到，且不依赖序列化轮询）。',
    keys: ['storage 不通知自己', 'BroadcastChannel 实时'],
    src: '针对简历问答.md',
  },

  {
    id: 'sc-019',
    type: 'multiple',
    diff: 'medium',
    sub: '大文件上传',
    q: '大文件分片上传方案中，下列哪些是**保证稳定性与一致性的关键要素**？（多选）',
    opts: [
      '每个分片携带 fileId / chunkIndex / chunkHash 等标识',
      '并发上传并限制最大并发数（3~6 起步）',
      '断点续传：上传前询问服务端已成功的分片，只补传缺失部分',
      '任何一个分片失败就放弃整个文件并全部重传',
    ],
    ans: ['A', 'B', 'C'],
    ana: '分片上传要素：分片标识（fileId/fileHash/chunkIndex/chunkHash）用于服务端校验与合并排序；并发限制 + 失败重试 + 暂停/取消（AbortController）；断点续传靠稳定文件标识询问已传分片；合并时按 chunkIndex 排序并校验完整性。**全部重传是反面做法**——应保留成功分片、只重试失败分片；进度按已传字节数/总字节数计算，MD5 计算放 Web Worker。',
    keys: ['分片标识', '断点续传', '只重试失败分片'],
    src: '问答类型面试题.md / 知识点快速复习指南.md',
  },
]
