import type { RawQuestion } from '../../types'

/**
 * 浏览器原理题库
 * 来源：docs/浏览器原理知识点.md、docs/一些高频率考点.md、
 *       docs/前端面试八股文.md、docs/收集的面试知识点.md
 */
export const browserQuestions: RawQuestion[] = [
  // ============ 进程与线程 ============
  {
    id: 'br-001',
    type: 'essay',
    diff: 'easy',
    sub: '进程与线程',
    q: '进程和线程的概念与区别是什么？浏览器渲染进程有哪些线程？',
    ans: `**面试回答：**

- **进程**：操作系统**资源分配**的最小单位，拥有独立的内存空间；
- **线程**：CPU **调度执行**的最小单位，同一进程内的多个线程**共享进程的内存空间**，一个线程崩溃可能导致整个进程崩溃。

**区别**：进程间相互隔离、通信成本高（IPC）；线程间共享数据、切换开销小，但需要处理并发安全。

**浏览器是多进程架构**（Chrome）：每个标签页一个渲染进程、浏览器主进程、GPU 进程、网络进程、插件进程等，一个页面崩溃不影响其他标签页。

**渲染进程的主要线程**：
1. **GUI 渲染线程**：解析 HTML/CSS、布局绘制；
2. **JS 引擎线程**（如 V8）：执行 JS，与 GUI 线程**互斥**——JS 执行时页面渲染会暂停；
3. **事件触发线程**：维护事件队列（宏任务队列）；
4. **定时器线程**：管理 setTimeout/setInterval 计时；
5. **异步 HTTP 请求线程**：处理网络请求回调。`,
    ana: 'JS 引擎线程与 GUI 线程互斥是“长任务阻塞渲染”的底层原因，可以衔接性能优化。',
    keys: ['资源分配 vs 调度执行', '多进程浏览器', 'GUI 与 JS 线程互斥'],
    src: '浏览器原理知识点.md',
  },
  {
    id: 'br-002',
    type: 'essay',
    diff: 'medium',
    sub: '浏览器组成',
    q: '从输入 URL 到页面展示，中间发生了什么？',
    ans: `**面试回答：**这是贯穿网络与渲染的综合题，按流程回答：

**一、网络阶段**
1. **URL 解析**：浏览器解析协议、域名、端口、路径；
2. **缓存检查**：HTML 命中有效强缓存则直接使用本地资源；
3. **DNS 解析**：把域名解析成 IP（浏览器缓存 → 系统缓存 → hosts → 本地 DNS → 递归查询）；
4. **建立 TCP 连接**：三次握手确认双方收发能力；
5. **TLS 握手**（HTTPS）：验证证书、协商加密算法、生成会话密钥；
6. **发送 HTTP 请求**，服务端处理后返回响应。

**二、渲染阶段**
1. **构建 DOM 树**：HTML 解析器把字节流转换为 DOM 树；
2. **构建 CSSOM 树**：解析 CSS 生成规则树；
3. **构建渲染树**：合并 DOM 和 CSSOM，排除 display:none 等不可见节点；
4. **Layout（回流）**：计算每个节点的几何信息（位置、大小）；
5. **Paint（重绘）**：把样式绘制成图层内容；
6. **Composite（合成）**：各图层合成，交给 GPU 显示到屏幕。

**面试速答版**：浏览器先解析 URL 和缓存，然后 DNS 找 IP，TCP 建连接，HTTPS 再做 TLS 握手；拿到 HTML 后构建 DOM，CSS 构建 CSSOM，两者合成渲染树；接着 Layout 计算位置尺寸，Paint 绘制像素，最后 Composite 合成图层显示。`,
    ana: 'docs 面试八股文第二幕原题。追问点：重排/重绘如何优化（合并 DOM 操作、脱离文档流、transform/opacity GPU 加速）。',
    keys: ['DNS', '三次握手', 'TLS 握手', '渲染树', 'Layout/Paint/Composite'],
    src: '前端面试八股文.md / 知识点快速复习指南.md / 计算机网络面试题.md',
  },
  {
    id: 'br-003',
    type: 'essay',
    diff: 'medium',
    sub: '渲染原理',
    q: '浏览器的渲染过程中，遇到 JS 和 CSS 会怎么处理？什么情况会阻塞渲染？',
    ans: `**面试回答：**

**JS 的处理**：
- 普通 \`<script>\` **阻塞 HTML 解析**：因为 JS 可能修改 DOM（document.write 等），浏览器必须等脚本下载并执行完才继续解析；
- 优化：\`defer\`（并行下载、DOM 解析后按序执行）、\`async\`（并行下载、下载完立即执行）、脚本放 body 底部、按需动态加载。

**CSS 的处理**：
- CSS **不阻塞 HTML 解析**（DOM 可以继续构建），但**阻塞渲染**：CSSOM 没准备好，浏览器无法确定最终样式，宁可白屏也不闪烁；
- CSS 也可能阻塞后续 JS 执行（JS 可能读取样式）。

**阻塞渲染的常见来源**：
1. 同步 script 标签；
2. 关键 CSS 未加载；
3. 首屏大图（影响 LCP）；
4. Web 字体加载慢（文字不可见）；
5. 大量 DOM 节点；
6. 主线程长任务。

**关键渲染路径优化**：压缩内联关键 CSS、非关键样式异步加载、defer/async 脚本、减少 DOM 复杂度。`,
    ana: '记忆：JS 阻塞解析、CSS 阻塞渲染。预解析（preload scanner）会提前发现资源并行下载。',
    keys: ['JS 阻塞解析', 'CSS 阻塞渲染', 'defer/async', '关键渲染路径'],
    src: '浏览器原理知识点.md / 知识点快速复习指南.md',
  },
  {
    id: 'br-004',
    type: 'essay',
    diff: 'easy',
    sub: '缓存',
    q: '说一下浏览器缓存机制：强缓存和协商缓存的区别，以及项目中常见的缓存策略。',
    ans: `**面试回答：**浏览器缓存分为两类，按顺序生效：

**1. 强缓存**：命中时**不发请求**，直接读本地缓存（返回 200 from disk/memory cache）。
- \`Cache-Control: max-age=31536000\`：相对时间，优先级高；
- \`Expires\`：HTTP/1.0 的绝对时间，客户端时间不准会失效。

**2. 协商缓存**：强缓存过期后，浏览器带上资源标识询问服务器资源是否变化：
- \`ETag / If-None-Match\`：基于内容/版本生成的唯一标识，精度高；
- \`Last-Modified / If-Modified-Since\`：基于最后修改时间，精度到秒；
- 未变化返回 **304**（不返回正文，浏览器继续用本地缓存）；变化则返回新资源 + **200**。两者同时存在时一般优先 ETag。

**项目常见策略**：
- \`index.html\`：**短缓存或不强缓存**（入口文件要尽快拿到最新资源地址）；
- 带 hash 文件名的 JS/CSS/图片：**长期强缓存**（内容变 → 文件名变 → 缓存自动失效）。

**面试关键句**：缓存不是为了“永远不请求”，而是在“更新及时性”和“加载速度”之间做平衡。`,
    ana: '刷新行为差异可补充：F5 会跳过强缓存带 If-Modified-Since/If-None-Match；Ctrl+F5 强制刷新连协商缓存也跳过；地址栏回车则正常走完整缓存链。',
    keys: ['强缓存不发请求', 'ETag/Last-Modified', '304', 'hash 文件名'],
    src: '浏览器原理知识点.md / 知识点快速复习指南.md',
  },
  {
    id: 'br-005',
    type: 'single',
    diff: 'medium',
    sub: '缓存',
    q: '点击刷新按钮（F5）、按 Ctrl+F5、地址栏回车，三者对缓存的处理正确的是？',
    opts: [
      'F5 正常走完整缓存；Ctrl+F5 跳过强缓存；地址栏回车正常走完整缓存',
      'F5 跳过所有缓存；Ctrl+F5 只跳过强缓存；地址栏回车跳过协商缓存',
      '三者都正常使用全部缓存',
      '三者都跳过所有缓存',
    ],
    ans: 'A',
    ana: '地址栏回车：正常走完整缓存链（强缓存 → 协商缓存）。F5 刷新：浏览器会跳过强缓存，带上协商缓存头（If-Modified-Since / If-None-Match）去验证。Ctrl+F5 强制刷新：跳过所有缓存，重新完整拉取资源。',
    keys: ['F5 跳强缓存', 'Ctrl+F5 全跳过', '地址栏回车正常缓存'],
    src: '浏览器原理知识点.md',
  },
  {
    id: 'br-006',
    type: 'essay',
    diff: 'easy',
    sub: '本地存储',
    q: 'Cookie、localStorage、sessionStorage、IndexedDB 有什么区别？各自的使用场景？',
    ans: `**面试回答：**

| 维度 | Cookie | localStorage | sessionStorage | IndexedDB |
|------|--------|--------------|----------------|-----------|
| 容量 | ~4KB | 5~10MB | 5~10MB | 几乎无限（数百 MB+） |
| 生命周期 | 可设过期时间 | 永久，手动清除 | 当前会话（标签页关闭） | 永久 |
| 随请求发送 | 每次自动携带 | 不发送 | 不发送 | 不发送 |
| API | document.cookie | 同步 API | 同步 API | 异步事务型 |

**使用场景**：
- **Cookie**：服务端需要的信息（登录态 token、CSRF Token）；配合 HttpOnly、Secure、SameSite 防护；
- **localStorage**：非敏感的用户配置、主题偏好、token（需权衡 XSS 风险）；
- **sessionStorage**：一次性会话数据（如表单草稿、列表筛选状态）；
- **IndexedDB**：大量结构化数据、离线应用数据缓存（配合 Service Worker）。

存储安全提醒：任何本地存储都可能被用户或 XSS 脚本读取，敏感数据不要明文存放。`,
    ana: '对比四件套是 docs 收集的高频题，表格化记忆。登录态保存在“收集的面试知识点.md”有双 Token 方案。',
    keys: ['4KB vs 5MB', '自动携带', '会话级', 'IndexedDB 事务型'],
    src: '浏览器原理知识点.md / 一些高频率考点.md / 收集的面试知识点.md',
  },
  {
    id: 'br-007',
    type: 'essay',
    diff: 'medium',
    sub: '同源策略',
    q: '什么是同源策略？跨域有哪些解决方案？CORS 的简单请求和预检请求是怎么回事？',
    ans: `**面试回答：**

**同源策略**：浏览器最核心的安全策略，要求协议、域名、端口**三者完全相同**才算同源。限制跨源的：Cookie/Storage 读取、DOM 访问、Ajax 响应读取。目的是隔离不同来源的数据，防止恶意网站窃取信息。

**跨域解决方案**：
1. **CORS**（主流）：服务端设置 \`Access-Control-Allow-Origin\` 等响应头授权跨域；
2. **代理**：开发用 Vite/Webpack devServer proxy，生产用 **Nginx 反向代理**，同源转发请求；
3. **JSONP**：利用 script 标签不受同源限制，只支持 GET，已基本淘汰；
4. **postMessage**：window 间跨域通信（iframe、多窗口）；
5. WebSocket：建立连接后不受同源策略限制。

**CORS 两类请求**：
- **简单请求**：GET/POST/HEAD，且 Content-Type 为 text/plain、multipart/form-data、application/x-www-form-urlencoded 等受限条件下，浏览器直接发送，服务端返回允许头即可；
- **复杂请求**：如带自定义头、Content-Type: application/json，浏览器先发 **OPTIONS 预检请求**，询问服务端是否允许（Allow-Methods/Headers/Origin），通过后才发送正式请求。预检结果有缓存（Access-Control-Max-Age）。`,
    ana: '面试常追问“为什么有预检”：让服务器有机会确认是否接受非常规跨域请求，保护老服务器不被副作用请求打挂。',
    keys: ['协议/域名/端口', 'CORS 响应头', 'OPTIONS 预检', 'Nginx 代理'],
    src: '浏览器原理知识点.md / 收集的面试知识点.md',
  },
  {
    id: 'br-008',
    type: 'essay',
    diff: 'medium',
    sub: '浏览器安全',
    q: '什么是 XSS 攻击？如何防御？',
    ans: `**面试回答：**XSS（Cross-Site Scripting，跨站脚本攻击）指攻击者向页面注入恶意脚本，在用户浏览时**在用户浏览器中执行**，窃取 Cookie/Token、篡改页面、发起伪造请求。

**类型**：
1. **存储型**：恶意脚本存入数据库（如评论区），所有访问者中招，危害最大；
2. **反射型**：脚本藏在 URL 参数中，服务端“反射”回页面执行，需诱导点击链接；
3. **DOM 型**：纯前端漏洞，如 \`innerHTML\` 直接插入未净化的 URL 参数内容。

**防御**：
1. **输出转义**：渲染用户输入时转义 HTML 实体（& < > " '），React/Vue 默认转义，慎用 dangerouslySetInnerHTML / v-html；
2. **输入过滤与富文本白名单**：限制可用标签和属性；
3. **CSP**（Content-Security-Policy）：限制脚本来源；
4. **HttpOnly Cookie**：脚本无法读取 Cookie；
5. 前后端都做：前端防护可被绕过，服务端存储前也要净化。`,
    ana: '与 CSRF 区分：XSS 是“注入代码执行”，CSRF 是“借用身份发请求”。XSS 危害更大也可辅助 CSRF。',
    keys: ['存储/反射/DOM 型', 'innerHTML 转义', 'CSP', 'HttpOnly'],
    src: '浏览器原理知识点.md / 收集的面试知识点.md',
  },
  {
    id: 'br-009',
    type: 'essay',
    diff: 'medium',
    sub: '浏览器安全',
    q: '什么是 CSRF 攻击？如何防御？',
    ans: `**面试回答：**CSRF（Cross-Site Request Forgery，跨站请求伪造）指攻击者**借助用户已有的登录身份**，在第三方网站诱导浏览器向目标站点发送伪造请求。因为浏览器会自动携带目标站点的 Cookie，服务端会误以为是用户本人操作。

**特点**：攻击者拿不到数据（受同源策略限制读不到响应），只能“冒用”请求；典型如诱导点击 → 自动提交转账/改邮箱表单。

**防御**：
1. **CSRF Token**：服务端下发随机 Token，请求时在参数/头中携带并校验，第三方站点拿不到；
2. **SameSite Cookie**：设置 SameSite=Lax/Strict，限制跨站请求携带 Cookie（现代浏览器默认 Lax）；
3. **校验 Origin / Referer**：请求头来源不合法则拒绝；
4. 敏感操作二次确认（验证码、密码）；
5. 不用 GET 做写操作。`,
    ana: '一句话对比：XSS 破坏“脚本执行隔离”，CSRF 破坏“请求来源可信”。',
    keys: ['伪造请求', 'SameSite', 'CSRF Token', 'Origin 校验'],
    src: '浏览器原理知识点.md / 收集的面试知识点.md',
  },
  {
    id: 'br-010',
    type: 'essay',
    diff: 'easy',
    sub: '浏览器事件机制',
    q: '同步和异步的区别是什么？什么是执行栈？Node 中的 Event Loop 和浏览器有什么区别？',
    ans: `**面试回答：**

**同步 vs 异步**：同步任务在主线程上排队顺序执行，后一个等前一个；异步任务不进入主线程，而是进入任务队列，只有任务队列通知主线程“可以执行了”才会进入主线程执行。

**执行栈（调用栈）**：存放函数调用的栈结构，函数调用压栈、返回出栈。栈空间有限，**递归过深会栈溢出**（Stack Overflow）。

**Node 与浏览器 Event Loop 区别**：
1. Node 的宏任务队列**分阶段**：timers → pending callbacks → poll → check（setImmediate）→ close，每阶段处理该阶段的回调；
2. **微任务执行时机不同**：浏览器是“每执行一个宏任务后清空微任务”；Node（11+ 后已对齐浏览器，但 process.nextTick 优先级最高，在每阶段切换时执行 nextTick 队列再执行 Promise 微任务）；
3. Node 特有 API：\`process.nextTick\`（特殊微任务，优先于 Promise）、\`setImmediate\`（check 阶段宏任务）。

面试时先说明运行环境差异，避免绝对化表述。`,
    ana: 'process.nextTick > Promise.then 的执行优先级是 Node 部分的核心考点。',
    keys: ['任务队列', '调用栈', '分阶段循环', 'process.nextTick'],
    src: '浏览器原理知识点.md',
  },
  {
    id: 'br-011',
    type: 'essay',
    diff: 'medium',
    sub: '多标签页通信',
    q: '如何实现浏览器内多个标签页之间的通信？',
    ans: `**面试回答：**同源标签页间通信的常见方案：

1. **BroadcastChannel**：现代首选。同源标签页加入同一频道，\`postMessage\` 广播、\`onmessage\` 接收，实时性好、API 简单、不需要轮询。我在项目里用它做 SSE 连接复用的标签页间通信；
2. **localStorage + storage 事件**：一个页面写入，其他页面监听 \`storage\` 事件。注意 **storage 事件不会通知当前写入的页面**，实时性和性能一般，本质是“数据同步”而非消息通道；
3. **SharedWorker**：独立 Worker 进程持有连接/状态，多页面通过 port 通信；缺点是生命周期管理复杂，兼容性略差；
4. **WebSocket / 服务端中转**：跨域、跨浏览器也能通信，但需要服务端配合；
5. **Cookie + setInterval 轮询**：古老方案，实时性差，不推荐。

选型建议：同源实时通信选 BroadcastChannel；需要持久化共享状态用 localStorage；连接复用等复杂场景可组合（我项目就是 BroadcastChannel + localStorage 的 activeTabs 选举）。`,
    ana: 'storage 事件“不通知自己”是易错点；BroadcastChannel 只支持同源。',
    keys: ['BroadcastChannel', 'storage 事件', 'SharedWorker'],
    src: '浏览器原理知识点.md / 针对简历问答.md',
  },
  {
    id: 'br-012',
    type: 'essay',
    diff: 'medium',
    sub: 'Service Worker / PWA',
    q: '对 Service Worker 的理解？它和 HTML5 离线存储（AppCache）有何不同？',
    ans: `**面试回答：**

**Service Worker** 是运行在浏览器**后台独立线程**的脚本，充当网页与网络之间的**代理服务器**，核心能力：

1. **拦截网络请求**：可以自定义缓存策略（Cache First、Network First、Stale-While-Revalidate 等），是 PWA 离线可用的基础；
2. **离线缓存**：配合 Cache Storage API 缓存静态资源；
3. **消息推送**、后台同步；
4. 生命周期：install → waiting → activate，**必须 HTTPS**（localhost 除外）。

**与 AppCache（HTML5 离线存储）的区别**：AppCache 通过 manifest 文件声明缓存，灵活性差、缓存更新逻辑反直觉、坑多，已被废弃；Service Worker 用 JS 编程控制缓存，策略完全自定义，是它的替代品。

**使用注意**：SW 线程不能操作 DOM；作用域由文件路径决定；更新需要重新注册并刷新。`,
    ana: '可补充Workbox：Google 提供的 SW 工具库，模板化缓存策略。',
    keys: ['后台线程代理', '拦截请求', 'PWA 离线', '必须 HTTPS'],
    src: '浏览器原理知识点.md / 从零开始的前端面试题.md',
  },
  {
    id: 'br-013',
    type: 'essay',
    diff: 'medium',
    sub: '渲染原理',
    q: '如何优化关键渲染路径？回流和重绘如何避免？',
    ans: `**面试回答：**

**关键渲染路径**指浏览器从收到 HTML 到首次渲染出内容的流程（DOM → CSSOM → 渲染树 → Layout → Paint）。优化方向：

1. **减少关键资源数量**：内联关键 CSS、非关键 CSS 异步加载、JS 用 defer/async；
2. **减小关键资源体积**：压缩、按需加载；
3. **缩短关键渲染路径长度**：减少层级依赖，首屏内容尽早返回。

**回流（重排）**：元素几何属性（宽高、位置）变化触发布局重算，**开销大**；一个元素变化可能影响父元素、兄弟甚至整页。
**重绘**：只改外观（颜色、背景、阴影），不触发布局，开销较小。**回流必然引发重绘**。

**避免手段**：
1. **批量修改 DOM**：使用 DocumentFragment、修改 className、或把元素脱离文档流再改；
2. **读写分离**：先统一读取 offsetWidth/getBoundingClientRect 等布局信息，再统一修改样式，避免“读-写-读”强制同步布局；
3. 动画用 **transform/opacity**（只走合成，跳过布局绘制），复杂动画元素 position: absolute/fixed 脱离文档流；
4. \`will-change\` 提升合成层（不要滥用，图层过多内存压力大）；
5. 大列表用**虚拟滚动**。`,
    ana: 'docs 前端八股文第二幕追问原文：合并 DOM 操作（DocumentFragment）、脱离文档流、GPU 加速三板斧。',
    keys: ['关键渲染路径', '读写分离', 'DocumentFragment', 'transform 合成'],
    src: '前端面试八股文.md / 浏览器原理知识点.md / 前端性能优化面试题.md',
  },
  {
    id: 'br-014',
    type: 'single',
    diff: 'medium',
    sub: '渲染原理',
    q: 'documentFragment 与直接操作 DOM 相比，主要优势是什么？',
    opts: [
      '在内存中批量构建节点，最后一次性插入文档，减少回流次数',
      '可以突破 DOM 数量上限',
      '渲染速度永久性提升 10 倍',
      '可以替代虚拟 DOM 实现响应式',
    ],
    ans: 'A',
    ana: 'DocumentFragment 是轻量级文档片段，不在真实文档中。把大量节点先挂到 fragment 上（这些操作不触发回流），最后一次性 appendChild 到文档，只触发一次回流重绘，性能远好于循环里逐个插入 DOM。它不是虚拟 DOM，也没有响应式能力。',
    keys: ['内存文档片段', '批量插入', '减少回流'],
    src: '前端性能优化面试题.md',
  },
  {
    id: 'br-015',
    type: 'judge',
    diff: 'easy',
    sub: '本地存储',
    q: 'IndexedDB 支持存储大量结构化数据，提供基于事务的异步 API，适合离线应用和大数据量缓存场景。',
    ans: true,
    ana: 'IndexedDB 特点：键值对存储、支持索引与事务（transaction）、API 异步不阻塞主线程、存储空间大（通常可达数百 MB 至磁盘配额）、同源限制。它弥补了 localStorage 只适合小量字符串数据的不足。',
    keys: ['事务', '异步 API', '大容量', '同源限制'],
    src: '浏览器原理知识点.md / 一些高频率考点.md',
  },
  {
    id: 'br-016',
    type: 'essay',
    diff: 'medium',
    sub: '正向代理与反向代理',
    q: '正向代理和反向代理的区别是什么？Nginx 在前端项目中的常见用法有哪些？',
    ans: `**面试回答：**

- **正向代理**：代理**客户端**。服务器不知道真实客户端是谁，客户端主动配置代理（如 VPN、科学上网）；特点是“代理客户端、隐藏客户端”；
- **反向代理**：代理**服务端**。客户端无感知，以为自己在访问真实服务器，实际由代理转发（如 Nginx）。用于负载均衡、缓存、安全隔离；特点是“代理服务端、隐藏服务端”。

**Nginx 在前端的常见用法**（结合项目）：
1. **静态资源托管**：托管打包产物，gzip 压缩、缓存配置；
2. **反向代理接口**：把 /api 转发到后端服务，解决跨域与环境配置问题；
3. **SPA 路由回退**：history 模式刷新 404 问题，\`location / { try_files $uri /index.html; }\`；
4. **负载均衡**：多实例分流；
5. HTTPS 配置、限流等。`,
    ana: 'try_files 是前端部署必知配置，可衔接 Docker + Nginx 部署经验。',
    keys: ['代理客户端 vs 代理服务端', 'try_files', '反向代理跨域'],
    src: '浏览器原理知识点.md / 针对简历问答.md',
  },

  {
    id: 'br-017',
    type: 'multiple',
    diff: 'medium',
    sub: '渲染原理',
    q: '下列哪些方式可以创建 **BFC**（块级格式化上下文）？（多选）',
    opts: ['overflow: hidden / auto', 'position: absolute / fixed', 'display: inline', 'float 不为 none / display: flow-root'],
    ans: ['A', 'B', 'D'],
    ana: '常见触发条件：根元素、float 非 none、position: absolute/fixed、display: inline-block/flex/grid/flow-root、overflow 非 visible。display: inline 只是行内显示，不创建 BFC。BFC 常用于清除浮动、防止 margin 折叠、实现自适应两栏布局；现代推荐 display: flow-root（语义就是创建 BFC，无副作用）。',
    keys: ['BFC 触发条件', 'flow-root', '清除浮动'],
    src: '一些高频率考点.md / 面试问答.md',
  },
  {
    id: 'br-018',
    type: 'multiple',
    diff: 'medium',
    sub: '缓存',
    q: '下列属于**强缓存**控制的响应头/机制有哪些？（多选）',
    opts: ['Cache-Control: max-age', 'Expires', 'ETag / If-None-Match', 'Last-Modified / If-Modified-Since'],
    ans: ['A', 'B'],
    ana: '强缓存：Cache-Control: max-age=xxx（相对时间，优先级高）和 Expires（HTTP/1.0 绝对时间，客户端时钟不准会失效），命中时不发请求。ETag/If-None-Match 和 Last-Modified/If-Modified-Since 是**协商缓存**的标识对：强缓存过期后浏览器带上它们询问服务器，未变化返回 304。项目常见策略：index.html 短缓存，带 hash 的静态资源长期强缓存。',
    keys: ['强缓存 vs 协商缓存', 'Cache-Control 优先', '304'],
    src: '知识点快速复习指南.md / 浏览器原理知识点.md',
  },
  {
    id: 'br-019',
    type: 'essay',
    diff: 'medium',
    sub: '资源加载',
    q: 'preload、prefetch、dns-prefetch 和 preconnect 有什么区别？',
    ans: `**面试回答：**这些都是资源加载提示，但优先级和目标不同：

1. **preload**：预加载当前页面马上要用的关键资源，优先级高，如首屏字体、LCP 图片、关键 JS。必须资源确实会用，否则浪费带宽；
2. **prefetch**：空闲时预取未来可能访问页面的资源，优先级低，如下一页路由 chunk；
3. **dns-prefetch**：提前做 DNS 解析，只解决域名到 IP 的查询耗时；
4. **preconnect**：提前完成 DNS、TCP 握手、TLS 握手，适合即将访问的第三方域名，如 CDN、字体域名。

**选择**：当前页关键资源用 preload；未来页资源用 prefetch；第三方域名访问前可用 dns-prefetch/preconnect。preconnect 成本更高，域名不多且确定会访问时再用。`,
    ana: 'preload 当前页高优先级，prefetch 未来页低优先级；preconnect 比 dns-prefetch 做得更多也更贵。',
    keys: ['preload 当前页', 'prefetch 未来页', 'dns-prefetch', 'preconnect'],
    src: '浏览器资源加载高频题',
  },
  {
    id: 'br-020',
    type: 'single',
    diff: 'medium',
    sub: '浏览器安全',
    q: 'Cookie 的 SameSite=Lax 主要能降低哪类攻击风险？',
    opts: ['XSS 脚本注入', 'CSRF 跨站请求伪造', 'SQL 注入', 'DNS 污染'],
    ans: 'B',
    ana: 'SameSite 用于限制第三方站点发起请求时是否携带 Cookie。Lax 在大多数跨站子请求中不携带 Cookie，可以降低 CSRF 风险；Strict 更严格；None 表示允许跨站携带，但必须同时设置 Secure。XSS 的核心防护是输出转义、CSP、HttpOnly 等。',
    keys: ['SameSite', 'CSRF', 'Lax', 'Secure'],
    src: '浏览器安全高频题',
  },
  {
    id: 'br-021',
    type: 'essay',
    diff: 'medium',
    sub: '渲染原理',
    q: 'DOMContentLoaded 和 load 事件有什么区别？它们分别在什么时候触发？',
    ans: `**面试回答：**

- **DOMContentLoaded**：HTML 文档被完整解析，DOM 树构建完成后触发；不需要等待图片、视频等外部资源加载完成；但会受到 defer 脚本、阻塞脚本和 CSS 对脚本执行的影响；
- **load**：页面所有资源都加载完成后触发，包括图片、样式、字体、iframe 等，通常比 DOMContentLoaded 晚。

**使用场景**：只需要操作 DOM 结构时监听 DOMContentLoaded；需要依赖图片尺寸、字体或 iframe 等资源完全加载时再用 load。

**补充**：defer 脚本会在 DOM 解析完成后、DOMContentLoaded 之前按顺序执行；async 脚本下载完立即执行，执行时机不确定。`,
    ana: 'DOMContentLoaded 关注 DOM 就绪，load 关注所有资源就绪。defer 与 DOMContentLoaded 的关系是常见追问。',
    keys: ['DOM 解析完成', '所有资源加载完成', 'defer 脚本', 'async 时机'],
    src: '浏览器渲染高频题',
  },
]
