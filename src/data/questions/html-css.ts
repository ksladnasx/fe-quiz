import type { RawQuestion } from '../../types'

/**
 * HTML & CSS 题库
 * 来源：docs/从零开始的前端面试题.md（HTML篇、CSS篇基础/页面布局）、
 *       docs/面试问答.md（HTML/CSS 部分）、docs/一些高频率考点.md（BFC）
 */
export const htmlCssQuestions: RawQuestion[] = [
  // ============ HTML ============
  {
    id: 'hc-001',
    type: 'single',
    diff: 'easy',
    sub: 'HTML 基础',
    q: '`<script src="a.js">` 与 `<link href="style.css">` 中 src 和 href 的区别是什么？',
    opts: [
      'src 表示引用资源替换当前元素内容，href 表示建立当前文档与资源的链接关系',
      'src 和 href 完全等价，只是标签习惯不同',
      'href 会阻塞解析而 src 不会',
      'src 只能用于脚本，href 只能用于样式',
    ],
    ans: 'A',
    ana: 'src（source）指向的内容会**嵌入并替换**当前元素，浏览器解析到 src 会暂停其他资源下载与处理，直到该资源加载执行完毕（如 script、img、iframe）。href（hypertext reference）只是在文档与资源之间建立**关联**，浏览器识别到 href 引用的资源会并行下载，并且不会停止对当前文档的处理（如 link、a）。',
    keys: ['src 嵌入替换', 'href 建立关联', '加载阻塞差异'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-002',
    type: 'essay',
    diff: 'easy',
    sub: 'HTML 基础',
    q: '谈谈你对 HTML 语义化的理解。',
    ans: `**面试回答：**语义化是指使用具有含义的标签来构建页面结构，比如 \`header\`、\`nav\`、\`main\`、\`article\`、\`section\`、\`footer\`，而不是全部用 div 嵌套。

主要好处有三点：

1. **代码结构更清晰**，团队协作和后期维护更容易；
2. **SEO 更友好**，搜索引擎爬虫更容易理解页面各区块的内容和权重；
3. **无障碍访问更好**，屏幕阅读器能根据标签语义准确识别页面结构，方便视障用户使用。

实际开发中我会尽量避免“一 div 到底”，在合适的位置使用语义化标签，仅在纯样式容器场景使用 div。`,
    ana: '语义化的核心是“标签本身具有含义”。可以结合 SEO、可访问性、可维护性三个维度回答，并给出常用语义化标签的例子。',
    keys: ['header/nav/main/article', 'SEO', '无障碍访问', '可维护性'],
    src: '面试问答.md / 从零开始的前端面试题.md',
  },
  {
    id: 'hc-003',
    type: 'single',
    diff: 'easy',
    sub: 'HTML 基础',
    q: '关于 DOCTYPE 的作用，下列说法正确的是？',
    opts: [
      'DOCTYPE 声明告知浏览器以哪种规范解析文档，`<!DOCTYPE html>` 让浏览器以标准模式渲染',
      'DOCTYPE 声明是 HTML5 才引入的，旧版 HTML 不需要',
      '没有 DOCTYPE 时浏览器会直接报错拒绝渲染',
      'DOCTYPE 只影响 SEO 不影响渲染',
    ],
    ans: 'A',
    ana: '`<!DOCTYPE>` 声明位于文档最前面，作用是告诉浏览器以哪种 HTML 规范解析文档。HTML5 之前需要引用很长的 DTD，HTML5 简化为 `<!DOCTYPE html>`。缺少或不正确的声明会导致浏览器进入**怪异模式（混杂模式）**，以兼容老式的方式解析渲染，盒模型等表现会和标准模式有差异。声明缺失不会报错，但会导致渲染模式差异。',
    keys: ['标准模式', '怪异模式', 'HTML5 DOCTYPE'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-004',
    type: 'essay',
    diff: 'medium',
    sub: 'HTML 基础',
    q: 'script 标签中 defer 和 async 有什么区别？',
    ans: `**面试回答：**两者都是为了解决 JS 加载执行阻塞 HTML 解析的问题，都会让脚本**异步下载**，区别在执行时机：

- **async**：下载完成后**立即执行**，多个 async 脚本的**执行顺序无法保证**，适合相互独立的脚本，比如统计脚本、广告脚本；
- **defer**：下载完成后**不立即执行**，等 HTML 解析完成后、触发 \`DOMContentLoaded\` 之前**按顺序执行**，适合有依赖关系的业务脚本。

另外普通 \`<script>\` 是同步的：下载并执行完才会继续解析 HTML，会阻塞解析；如果多个脚本之间有依赖关系，我会优先使用 defer。`,
    ana: '记忆点：async“下载完就跑，顺序不保证”；defer“排队等 HTML 解析完，顺序执行”。两者都不会阻塞 HTML 解析下载过程。',
    keys: ['async 立即执行', 'defer 按序延迟执行', 'DOMContentLoaded'],
    src: '面试问答.md / 从零开始的前端面试题.md',
  },
  {
    id: 'hc-005',
    type: 'essay',
    diff: 'easy',
    sub: 'HTML 基础',
    q: '常用的 meta 标签有哪些？分别起什么作用？',
    ans: `**面试回答：**常用的 meta 标签主要有：

1. \`<meta charset="UTF-8">\`：声明文档编码，避免乱码；
2. \`<meta name="viewport" content="width=device-width, initial-scale=1.0">\`：移动端适配基础，让布局视口等于设备宽度；
3. \`<meta http-equiv="X-UA-Compatible" content="IE=edge">\`：指定 IE 使用最新引擎渲染；
4. \`<meta name="keywords/description">\`：SEO 相关的关键词与页面描述；
5. \`<meta http-equiv="refresh" content="30">\`：定时刷新或跳转；
6. CSP 相关：\`<meta http-equiv="Content-Security-Policy">\`，用于限制资源加载，防范 XSS。

其中 viewport 和 charset 在日常项目中最常用。`,
    ana: 'viewport meta 是移动端适配必答题点：width=device-width 使布局视口等于理想视口，initial-scale 设置初始缩放。',
    keys: ['charset', 'viewport', 'SEO description', 'CSP'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-006',
    type: 'essay',
    diff: 'easy',
    sub: 'HTML 基础',
    q: 'HTML5 有哪些更新？',
    ans: `**面试回答：**HTML5 的更新可以从几类说：

1. **语义化标签**：header、nav、section、article、aside、footer 等；
2. **表单增强**：新增 input 类型（email、number、date、range 等）和属性（placeholder、required、pattern）；
3. **媒体标签**：audio、video，替代部分 Flash 场景；
4. **绘图能力**：canvas 2D 绘图、SVG 内联矢量图形；
5. **Web 存储**：localStorage、sessionStorage，以及离线应用 manifest；
6. **多线程与通信**：Web Worker、WebSocket、postMessage、BroadcastChannel 等；
7. **地理定位与设备 API**：Geolocation、拖放 API drag；
8. **新 API**：History API、requestAnimationFrame、IntersectionObserver 等。

总结来说 HTML5 让浏览器从“文档展示”走向了“应用平台”。`,
    ana: '答题框架：语义化标签 → 表单 → 媒体 → 绘图 → 存储 → 通信/线程 → 设备 API。能按类组织比罗列 API 更加分。',
    keys: ['语义化标签', 'canvas/video', 'localStorage', 'Web Worker', 'WebSocket'],
    src: '从零开始的前端面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'hc-007',
    type: 'judge',
    diff: 'easy',
    sub: 'HTML 基础',
    q: 'img 标签的 srcset 属性可以根据不同的屏幕密度和视口宽度，让浏览器选择更合适的图片资源加载。',
    ans: true,
    ana: 'srcset 定义一组候选图片及其宽度/像素密度描述（如 `srcset="a-480w.jpg 480w, a-800w.jpg 800w"`），配合 sizes 描述插槽尺寸，浏览器会根据设备像素比（DPR）和视口宽度选择最合适的资源，避免在小屏上加载过大图片，是响应式图片的核心方案。',
    keys: ['srcset', 'DPR', '响应式图片'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-008',
    type: 'essay',
    diff: 'easy',
    sub: 'HTML 基础',
    q: '行内元素、块级元素分别有哪些？空（void）元素是什么？',
    ans: `**面试回答：**

- **行内元素**：a、span、img、input、button、label、strong、em 等，默认不独占一行，宽高由内容决定（设置宽高无效，img/input 除外，它们是行内替换元素）；
- **块级元素**：div、p、h1~h6、ul/ol/li、table、section、header 等，独占一行，可设置宽高；
- **空（void）元素**：没有内容也没有闭合标签的元素，如 \`<br>\`、\`<hr>\`、\`<img>\`、\`<input>\`、\`<link>\`、\`<meta>\`。

行内元素之间如果源码中存在换行或空格，会产生空白间隙，这也是常见考点。`,
    ana: 'img、input 属于“行内替换元素”，可以设置宽高，属于易错点。void 元素重点记 br、img、input、meta、link。',
    keys: ['行内元素', '块级元素', 'void 元素', '替换元素'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-009',
    type: 'essay',
    diff: 'medium',
    sub: 'HTML5 能力',
    q: '谈一谈你对 Web Worker 的理解。',
    ans: `**面试回答：**JavaScript 是单线程的，复杂计算会阻塞主线程导致页面卡顿。Web Worker 让我们创建一个**独立于主线程的后台线程**去执行脚本，可以把大量计算交给它，完成后通过 \`postMessage\` 把结果传回主线程，避免阻塞 UI 交互。

使用要点和限制：

1. **同源限制**：worker 脚本文件必须与主线程同源；
2. **DOM 限制**：worker 线程无法操作 DOM、无法使用 window/document，本质是“不影响页面渲染安全”的设计；
3. **通信方式**：主线程与 worker 通过 \`postMessage\` / \`onmessage\` 传递消息，传对象会被结构化拷贝；
4. **典型场景**：大文件分片上传中计算文件 MD5 哈希、大量数据排序、复杂编解码计算。

我在项目里做文件分片上传时，就考虑用 Web Worker 计算大文件的哈希，避免阻塞主线程。`,
    ana: '结合项目场景（大文件 MD5 计算）回答会更加分。核心限制记三点：同源、无 DOM、消息通信。',
    keys: ['多线程', 'postMessage', '不能操作 DOM', '文件哈希计算'],
    src: '从零开始的前端面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'hc-010',
    type: 'essay',
    diff: 'medium',
    sub: 'HTML5 能力',
    q: 'iframe 有哪些优点和缺点？',
    ans: `**面试回答：**iframe 相当于在页面里嵌套了一个独立的浏览器上下文。

**优点**：
- 可以完整嵌入第三方页面（支付、广告、编辑器），与主页面样式和脚本天然隔离；
- 原型/沙箱场景便于隔离运行不受信任的代码；
- 并行加载，重构时不影响旧页面。

**缺点**：
- 会增加页面加载开销和内存占用，多个 iframe 更明显；
- **SEO 不友好**，搜索引擎对 iframe 内容的收录权重低；
- 容易产生**跨域问题**，父子页面通信受限（需 postMessage）；
- 阻塞父页面 onload 事件，移动端兼容与体验一般；
- 无法响应式自适应内容高度，需要额外处理。

现在除了第三方页面嵌入（如微前端隔离、支付 SDK），一般不会大规模使用 iframe。`,
    ana: '答题要点：本质是独立浏览器上下文 → 天然隔离是优点，也是加载开销和通信困难的根源。',
    keys: ['独立上下文', 'SEO 不友好', '跨域 postMessage', '内存占用'],
    src: '面试问答.md / 从零开始的前端面试题.md',
  },
  {
    id: 'hc-011',
    type: 'essay',
    diff: 'easy',
    sub: 'HTML5 能力',
    q: 'Canvas 和 SVG 有什么区别？',
    ans: `**面试回答：**

- **Canvas**：基于**像素**的位图绘制，通过 JS 脚本逐帧画图，不保留图形对象，放大缩放会失真；适合像素密集、大量图元的场景，比如游戏、数据可视化大屏、图片处理；
- **SVG**：基于**矢量**的 XML 描述，每个图形都是 DOM 节点，可以用 CSS 和 JS 操作，无损缩放，支持事件绑定；适合图标、图表、需要交互的图形。

性能上，图元数量非常大时 Canvas 更快（不维护 DOM）；需要频繁交互单个图形时 SVG 更方便。项目里封装 SVG 图标组件、用 ReactFlow 画工作流画布都是 SVG 方案。`,
    ana: '记忆：Canvas = 位图 + JS 绘制 + 适合大量图元；SVG = 矢量 + DOM 节点 + 适合交互与缩放。',
    keys: ['位图 vs 矢量', 'DOM 节点', '缩放失真', '事件交互'],
    src: '从零开始的前端面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'hc-012',
    type: 'judge',
    diff: 'easy',
    sub: 'HTML 基础',
    q: 'head 标签中 title 是必不可少的，title 与 h1 的区别是 title 用于网页信息展示而 h1 用于文章内容标题。',
    ans: true,
    ana: 'head 里必须有 title（文档标题，显示在浏览器标签页、收藏夹、搜索结果中，一个页面只应有一个）。title 与 h1 区别：title 面向“整个文档/浏览器/搜索引擎”，h1 面向“页面内容的顶级标题”，一页可以有多个内容区块但一般只一个 h1。类似地 b 与 strong、i 与 em 的区别也是“视觉 vs 语义”：strong/em 带有强调语义，利于 SEO 和屏幕阅读器。',
    keys: ['title 必需', 'title 面向文档', 'h1 面向内容', 'strong 语义化'],
    src: '从零开始的前端面试题.md',
  },

  // ============ CSS 基础 ============
  {
    id: 'hc-013',
    type: 'essay',
    diff: 'easy',
    sub: 'CSS 基础',
    q: '说一下 CSS 选择器及其优先级。',
    ans: `**面试回答：**优先级从高到低是：

1. \`!important\`（最高，慎用）；
2. **内联样式** style 属性；
3. **ID 选择器** \`#id\`；
4. **类选择器、属性选择器、伪类** \`.class\`、\`[type="text"]\`、\`:hover\`；
5. **标签选择器、伪元素** \`div\`、\`::before\`。

优先级可以按 (id数, 类数, 标签数) 三元组比较。优先级相同时，**后出现的样式覆盖先出现的**。继承的属性没有优先级概念，通配符 \\* 的优先级为 0。`,
    ana: '记忆口诀：important > 行内 > id > class/伪类/属性 > 标签/伪元素 > 通配符。',
    keys: ['!important', '内联样式', 'id 选择器', '后覆盖前'],
    src: '面试问答.md / 从零开始的前端面试题.md',
  },
  {
    id: 'hc-014',
    type: 'essay',
    diff: 'medium',
    sub: 'CSS 基础',
    q: 'CSS 中哪些属性可以继承？哪些不可以？',
    ans: `**面试回答：**

- **可继承**的主要是“文本相关”属性：color、font 系列（font-size、font-family、font-weight）、line-height、text-align、text-indent、letter-spacing、word-spacing、visibility、cursor 等；
- **不可继承**的主要是“盒模型与布局”属性：width、height、margin、padding、border、background、display、position、overflow、float、z-index 等。

继承的意义：文本样式继承符合直觉——给 body 设置字体颜色后所有文字默认跟随；而盒模型如果继承会破坏布局。开发中可用 \`inherit\` 强制继承，用 \`initial\` 重置为默认值。`,
    ana: '判断技巧：和“文字呈现”相关的多可继承，和“盒子占位”相关的不可继承。',
    keys: ['文本属性可继承', '盒模型不可继承', 'inherit/initial'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-015',
    type: 'essay',
    diff: 'easy',
    sub: 'CSS 基础',
    q: '隐藏元素的方法有哪些？display:none 与 visibility:hidden 有什么区别？',
    ans: `**面试回答：**常见隐藏方式：

1. \`display: none\`：彻底移出渲染树，**不占空间**，触发回流+重绘，子元素也随之不可见且无法单独显示；
2. \`visibility: hidden\`：**仍占空间**，只触发重绘，子元素可设置 \`visibility: visible\` 恢复显示；
3. \`opacity: 0\`：透明度 0 仍占位，**仍可响应事件**，可用 transition 做过渡；
4. \`position\` 移出视口 / \`transform: scale(0)\`；
5. \`clip-path\` / \`clip\` 裁剪；
6. \`z-index: -1\` 被覆盖（有局限）。

核心区别总结：**display:none 不保留空间、会回流；visibility:hidden 保留空间、只重绘、可被子元素覆盖；opacity:0 保留空间且可交互。**`,
    ana: '三者对比是高频题：空间占位、是否回流、子元素能否恢复、是否响应事件四个维度。',
    keys: ['display:none', 'visibility:hidden', 'opacity:0', '回流重绘'],
    src: '从零开始的前端面试题.md / 面试问答.md',
  },
  {
    id: 'hc-016',
    type: 'single',
    diff: 'easy',
    sub: 'CSS 基础',
    q: '关于 link 和 @import 引入 CSS 的区别，下列说法错误的是？',
    opts: [
      'link 是 HTML 标签，@import 是 CSS 语法，只能写在样式文件或 style 中',
      '@import 引入的样式会在页面加载完成后才加载，可能导致样式闪烁',
      'link 引入的 CSS 与页面并行加载，且可以通过 JS 操作 DOM 改变 link',
      '@import 的兼容性比 link 更好，性能也更高',
    ],
    ans: 'D',
    ana: 'D 是错误说法。事实是：link 是 XHTML 标签，兼容性更好，与页面**并行加载**；@import 是 CSS 提供的规则，需要等页面加载完成后再加载引用的 CSS，可能导致 FOUC（无样式闪烁），且 @import 会被当作 CSS 内的串行请求，性能更差。link 还支持 RSS、可动态创建修改，@import 不支持。',
    keys: ['link 并行加载', '@import 串行', 'FOUC'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-017',
    type: 'essay',
    diff: 'medium',
    sub: 'CSS 基础',
    q: '说一下盒模型的理解。标准盒模型和怪异（IE）盒模型的区别是什么？如何切换？',
    ans: `**面试回答：**CSS 盒模型由内到外是：content（内容）→ padding（内边距）→ border（边框）→ margin（外边距）。

- **标准盒模型**：\`box-sizing: content-box\`（默认），width/height 只包含 **content**，设置宽高后再加 padding 和 border 会让元素实际变大；
- **怪异（IE）盒模型**：\`box-sizing: border-box\`，width/height 包含 **content + padding + border**，改 padding 不会撑大盒子。

实际项目里通常全局设置 \`* { box-sizing: border-box }\`，让尺寸计算更直观。获取元素实际宽度可以用 \`getBoundingClientRect()\` 或 offsetWidth。`,
    ana: 'margin 不算在 width 计算内（无论哪种盒模型）。box-sizing 切换是必答点。',
    keys: ['content-box', 'border-box', 'box-sizing'],
    src: '从零开始的前端面试题.md / 面试问答.md',
  },
  {
    id: 'hc-018',
    type: 'essay',
    diff: 'medium',
    sub: 'CSS 基础',
    q: '什么是 BFC？触发条件有哪些？常见使用场景是什么？',
    ans: `**面试回答：**BFC（Block Formatting Context）块级格式化上下文，是一块**独立的渲染区域**，内部元素的布局不会影响外部元素。

**常见触发条件**：
- 根元素 html；
- \`float\` 不为 none；
- \`position: absolute / fixed\`；
- \`display: inline-block / flex / grid / flow-root\`；
- \`overflow: hidden / auto / scroll\`（不为 visible）。

**常见使用场景**：
1. **清除浮动**：父元素高度塌陷时给父元素创建 BFC（overflow:hidden），让浮动子元素参与高度计算；
2. **防止 margin 塌陷/折叠**：父子元素或相邻块级元素的外边距会折叠，用 BFC 隔开；
3. **多栏布局**：一侧浮动一侧 BFC，实现自适应两栏，浮动元素不会覆盖 BFC 区域。

现代开发推荐 \`display: flow-root\`，语义就是“创建 BFC”且无副作用。`,
    ana: 'BFC 三大应用：清浮动、防 margin 折叠、两栏自适应。可以补充 margin 折叠只发生在同一 BFC 的相邻块级盒子之间。',
    keys: ['独立渲染区域', 'overflow:hidden', '清除浮动', 'margin 折叠'],
    src: '一些高频率考点.md / 面试问答.md',
  },
  {
    id: 'hc-019',
    type: 'essay',
    diff: 'easy',
    sub: 'CSS 基础',
    q: '伪元素和伪类的区别是什么？',
    ans: `**面试回答：**

- **伪类**用**单冒号** \`:\`，选择的是**处于特定状态的已有元素**，比如 \`:hover\`、\`:focus\`、\`:first-child\`、\`:nth-child(n)\`、\`:not()\`；
- **伪元素**用**双冒号** \`::\`，创建的是**不在文档树中的虚拟元素**，比如 \`::before\`、\`::after\`、\`::first-line\`、\`::placeholder\`，可以像真实元素一样设置样式。

单双冒号是为了区分二者：CSS2 时代伪类伪元素都用单冒号，CSS3 规范把伪元素改为双冒号（但 ::before/::after 保留单冒号写法的兼容）。伪元素常用于清除浮动（clearfix）、图标装饰、自定义内容。`,
    ana: '一句话：伪类“筛选状态”，伪元素“创建节点”。',
    keys: ['单冒号伪类', '双冒号伪元素', 'hover/nth-child', 'before/after'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-020',
    type: 'essay',
    diff: 'medium',
    sub: 'CSS 基础',
    q: 'transition 和 animation 有什么区别？为什么动画推荐用 transform 和 opacity？',
    ans: `**面试回答：**

- **transition**：过渡动画，需要**触发条件**（状态变化，如 hover、class 切换），只有开始和结束两个状态，适合简单状态切换，不能自动循环；
- **animation**：配合 \`@keyframes\` 定义多个关键帧，**不需要触发事件**即可播放，可控制循环次数、方向、暂停（animation-play-state），适合复杂动画。

**为什么推荐 transform 和 opacity**：修改 width/height/top/left 等几何属性会触发 **Layout（回流）+ Paint（重绘）**，开销大；而 \`transform\` 和 \`opacity\` 变化通常只走 **Composite（合成）** 阶段，由合成线程/GPU 处理，**不触发布局和绘制**，性能最好。另外动画频繁的场景也可以用 requestAnimationFrame 代替 setTimeout 驱动。`,
    ana: '渲染流水线：Layout → Paint → Composite。transform/opacity 能跳过前两步直接合成。',
    keys: ['transition 触发式', 'keyframes 关键帧', '合成层', 'GPU 加速'],
    src: '从零开始的前端面试题.md / 面试问答.md',
  },
  {
    id: 'hc-021',
    type: 'judge',
    diff: 'medium',
    sub: 'CSS 基础',
    q: '修改元素位置时，使用 transform: translate 通常比使用 position 的 top/left 性能更好，因为它不触发布局计算。',
    ans: true,
    ana: 'top/left 变化会触发 Layout（回流）→ Paint → Composite 完整流程；transform 位于合成器处理的属性，只触发 Composite，由 GPU 完成，性能更好。这就是“动画优先使用 transform 和 opacity”的原因。',
    keys: ['transform 合成', 'top/left 回流', '性能优化'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-022',
    type: 'essay',
    diff: 'easy',
    sub: 'CSS 基础',
    q: 'CSS3 有哪些新特性？',
    ans: `**面试回答：**CSS3 新特性可以按模块说：

1. **选择器**：属性选择器增强、\`:nth-child()\`、\`:not()\` 等结构伪类；
2. **盒模型与布局**：border-radius、box-shadow、box-sizing；
3. **背景与边框**：多背景、background-size、border-image、渐变 linear-gradient/radial-gradient；
4. **文本效果**：text-shadow、word-wrap、@font-face 自定义字体；
5. **2D/3D 变换**：transform（translate/rotate/scale/skew）、transform-origin；
6. **过渡与动画**：transition、animation + @keyframes；
7. **新布局**：Flex 弹性布局、Grid 网格布局、多栏布局 columns；
8. **媒体查询**：@media 响应式设计基础；
9. **颜色与透明度**：rgba/hsla、opacity。

回答时挑 5~6 类说清楚即可，重点是 Flex/Grid、媒体查询、transform/transition/animation。`,
    ana: '分类记忆：选择器、盒模型视觉、变换动画、新布局、媒体查询。',
    keys: ['Flex/Grid', '媒体查询', 'transform/transition', 'border-radius'],
    src: '从零开始的前端面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'hc-023',
    type: 'essay',
    diff: 'medium',
    sub: 'CSS 基础',
    q: '单行和多行文本溢出省略怎么实现？',
    ans: `**面试回答：**

**单行溢出**：

\`\`\`css
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
\`\`\`

**多行溢出**（Webkit 内核方案，兼容性最好）：

\`\`\`css
.line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 行数 */
  overflow: hidden;
}
\`\`\`

也可以用 \`::after\` 绝对定位放省略号的兼容写法，或标准属性 \`line-clamp\`（较新）。注意多行方案要求容器高度由行高决定。`,
    ana: '单行三件套：overflow + text-overflow + white-space；多行：-webkit-box + line-clamp。',
    keys: ['text-overflow: ellipsis', '-webkit-line-clamp', 'white-space: nowrap'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-024',
    type: 'single',
    diff: 'medium',
    sub: 'CSS 基础',
    q: '以下哪个属性变化通常只触发重绘（Repaint）而不触发回流（Reflow）？',
    opts: ['width', 'font-size', 'background-color', 'top'],
    ans: 'C',
    ana: '修改元素的**外观**（color、background-color、visibility、outline、box-shadow 等）不影响几何布局，只触发重绘；而 width、font-size、top、border 等几何相关属性变化会引起回流，且回流必然伴随重绘。回流开销显著大于重绘。',
    keys: ['重绘只改外观', '回流改几何', '回流必重绘'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-025',
    type: 'essay',
    diff: 'easy',
    sub: 'CSS 基础',
    q: 'position 有哪些取值？各自相对什么定位？',
    ans: `**面试回答：**

1. \`static\`：默认值，元素在正常文档流中，top/left 等偏移无效；
2. \`relative\`：相对**自身原位置**偏移，**不脱离文档流**，原位置仍保留，常作为 absolute 子元素的定位参照；
3. \`absolute\`：相对**最近的非 static 祖先元素**定位，脱离文档流；
4. \`fixed\`：相对**浏览器视口**定位，脱离文档流，滚动不跟随（父级设置 transform/filter 会使其相对该父级定位，是常见坑）；
5. \`sticky\`：粘性定位，结合 relative 和 fixed——在阈值内按 relative，达到阈值后固定（需要 top 等阈值才有意义）。`,
    ana: '补充坑点：absolute 参照的是最近的 position 非 static 的祖先；fixed 元素祖先有 transform 时 fixed 会失效（相对 transform 祖先）。',
    keys: ['relative 不脱流', 'absolute 最近定位祖先', 'fixed 视口', 'sticky 阈值'],
    src: '面试问答.md',
  },

  // ============ CSS 布局 ============
  {
    id: 'hc-026',
    type: 'essay',
    diff: 'easy',
    sub: '布局与适配',
    q: 'px、em、rem、vw/vh 有什么区别？移动端适配一般怎么做？',
    ans: `**面试回答：**

- **px**：绝对像素单位，固定大小；
- **em**：相对**父元素（或自身）字体大小**，嵌套时会叠加计算，适合组件内间距；
- **rem**：相对**根元素 html 的 font-size**，全局统一缩放，是移动端等比缩放的主力；
- **vw/vh**：相对**视口**宽高的 1%，随窗口变化。

**移动端适配常见方案**：
1. **rem 方案**：通过 postcss-pxtorem 把 px 自动转 rem，JS 或 CSS 动态设置根字号，实现不同屏宽等比缩放；
2. **vw 方案**：直接用 vw 描述尺寸，1vw = 视口宽度 1%，无需 JS；
3. **媒体查询 + 弹性布局**：用 flex/grid 做自适应布局，媒体查询控制断点样式；
4. 实际项目通常组合使用：布局用 flex/grid，尺寸用 rem/vw，断点用媒体查询，大屏看板也可用固定设计稿尺寸 + transform: scale 方案。`,
    ana: '高频追问：flexible 原理（根字号 = 屏宽/10）、postcss-pxtorem 编译期转换、vw 无需 JS。',
    keys: ['rem 根字号', 'vw 视口', 'postcss-pxtorem', '媒体查询断点'],
    src: '面试问答.md / 一些高频率考点.md / 问答类型面试题.md',
  },
  {
    id: 'hc-027',
    type: 'essay',
    diff: 'easy',
    sub: '布局与适配',
    q: '两栏布局（左固定右自适应）怎么实现？',
    ans: `**面试回答：**常见四种方案：

\`\`\`css
/* 1. Flex（首选） */
.container { display: flex; }
.left { width: 200px; }
.right { flex: 1; }

/* 2. Grid */
.container { display: grid; grid-template-columns: 200px 1fr; }

/* 3. float + BFC */
.left { float: left; width: 200px; }
.right { overflow: hidden; } /* 创建 BFC，不与浮动元素重叠 */

/* 4. float + margin */
.left { float: left; width: 200px; }
.right { margin-left: 200px; }
\`\`\`

面试优先说 Flex/Grid，再补充 float+BFC 方案体现理解深度。右侧 \`flex: 1\` 表示 flex-grow:1、flex-shrink:1、flex-basis:0%，占满剩余空间。`,
    ana: '若右栏内容溢出导致 flex:1 失效，通常是 min-width:auto 问题，加 min-width: 0 可解。',
    keys: ['flex: 1', 'grid-template-columns', 'float + BFC'],
    src: '从零开始的前端面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'hc-028',
    type: 'essay',
    diff: 'medium',
    sub: '布局与适配',
    q: '水平垂直居中一个元素，你能说出多少种方案？',
    ans: `**面试回答：**

\`\`\`css
/* 1. Flex（首选） */
.parent { display: flex; justify-content: center; align-items: center; }

/* 2. Grid */
.parent { display: grid; place-items: center; }

/* 3. absolute + transform（子元素宽高未知） */
.child {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

/* 4. absolute + margin:auto（子元素需有宽高） */
.child {
  position: absolute;
  inset: 0;
  margin: auto;
}

/* 5. absolute + 负 margin（宽高已知） */

/* 6. 单行文本: line-height = height + text-align: center */

/* 7. table-cell */
.parent { display: table-cell; vertical-align: middle; text-align: center; }
\`\`\`

回答时先说 Flex/place-items 两个现代方案，再补充 absolute + transform 体现基础。`,
    ana: 'inset: 0 是 top/right/bottom/left: 0 的简写。',
    keys: ['flex 居中', 'place-items', 'translate(-50%,-50%)'],
    src: '从零开始的前端面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'hc-029',
    type: 'essay',
    diff: 'medium',
    sub: '布局与适配',
    q: '说一下你对 Flex 布局的理解，flex: 1 具体表示什么？',
    ans: `**面试回答：**Flex 是弹性布局，通过容器上的 \`display: flex\` 让子元素沿主轴排列，能方便实现水平/垂直居中、等分空间、自适应两栏等布局。

**容器属性**：flex-direction（主轴方向）、justify-content（主轴对齐）、align-items（交叉轴对齐）、flex-wrap（换行）、gap；
**项目属性**：flex、align-self、order。

\`flex: 1\` 是 \`flex-grow: 1; flex-shrink: 1; flex-basis: 0%\` 的缩写：
- **flex-grow: 1**：有剩余空间时放大占满；
- **flex-shrink: 1**：空间不足时允许收缩；
- **flex-basis: 0%**：不按内容分配基准，按剩余空间比例分配。

**flex: 1 失效常见原因**：父元素没有可分配空间、子元素 \`min-width: auto\` 导致无法收缩（加 \`min-width: 0\`）、固定宽度或内容溢出。`,
    ana: 'flex: auto（basis 为 auto，按内容分配）与 flex: 1（basis 为 0，等分）的区别是进阶追问点。',
    keys: ['flex-grow/shrink/basis', 'min-width: auto', '主轴与交叉轴'],
    src: '面试问答.md / 从零开始的前端面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'hc-030',
    type: 'single',
    diff: 'medium',
    sub: '布局与适配',
    q: '父元素 display:flex，子元素内容过长导致无法收缩、把容器撑开，最直接的解决方式是什么？',
    opts: [
      '给子元素设置 min-width: 0',
      '给子元素设置 flex-grow: 0',
      '给父元素设置 overflow: visible',
      '给子元素设置 width: 100%',
    ],
    ans: 'A',
    ana: 'flex 子项的默认 min-width 是 auto，即不允许收缩到比内容最小宽度更小，长文本/长列表会把子项撑开导致 flex:1 失效。设置 min-width: 0（或 overflow: hidden）允许子项收缩，配合 text-overflow: ellipsis 实现省略。',
    keys: ['min-width: auto', 'flex 收缩限制', 'ellipsis'],
    src: '知识点快速复习指南.md',
  },
  {
    id: 'hc-031',
    type: 'essay',
    diff: 'medium',
    sub: '布局与适配',
    q: '什么是高度塌陷？有哪些解决方案？',
    ans: `**面试回答：**当父元素没有设置高度、内部子元素全部浮动时，浮动元素脱离文档流，父元素无法感知子元素高度，高度变成 0，这就是高度塌陷。

**解决方案**：
1. 给父元素**创建 BFC**：\`overflow: hidden\` 或 \`display: flow-root\`（推荐，无副作用）；
2. 最后加一个空元素设置 \`clear: both\`（需要多余标签，不推荐）；
3. **伪元素 clearfix**：\`.clearfix::after { content: ""; display: block; clear: both; }\`；
4. 现代开发直接用 **flex/grid 布局**替代 float，从根源避免。

现在实际项目里 float 布局已经比较少，更多用 flex。`,
    ana: '答题顺序：现象 → 原因（浮动脱流）→ 方案（BFC/clear/伪元素/flex）。',
    keys: ['浮动脱流', 'overflow: hidden', 'clearfix 伪元素', 'flow-root'],
    src: '面试问答.md',
  },
  {
    id: 'hc-032',
    type: 'essay',
    diff: 'medium',
    sub: '布局与适配',
    q: '外层大盒子包含小盒子，小盒子设置 margin-top: 10px 会呈现什么效果？为什么？怎么解决？',
    ans: `**面试回答：**会呈现**外边距折叠（margin 塌陷）**：小盒子的 margin-top 会“穿透”父元素，表现为**父元素整体下移 10px**，而小盒子在父元素内部的位置不变。

**原因**：父子块级元素在垂直方向上相邻接触（且中间没有 border、padding、inline 内容隔开）时，上外边距会发生合并，取较大值，父元素与子元素共享同一个 margin-top。

**解决方案**（任选其一，制造隔离）：
1. 父元素创建 BFC：\`overflow: hidden\` 或 \`display: flow-root\`；
2. 父元素加 \`padding-top\` 或 \`border-top\` 隔开边界；
3. 子元素不用 margin，改用 \`padding\` 或父元素用 \`display: flex\`（flex 容器内不存在 margin 折叠）。`,
    ana: '同类问题：相邻兄弟元素 margin 也会折叠（取较大值）。flex/grid 容器内的子项不会折叠。',
    keys: ['外边距折叠', 'BFC 隔离', 'flow-root'],
    src: '问答类型面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'hc-033',
    type: 'judge',
    diff: 'easy',
    sub: '布局与适配',
    q: '响应式设计的基本原理是通过媒体查询检测不同设备屏幕尺寸，配合弹性布局和相对单位设置页面样式。',
    ans: true,
    ana: '响应式 = 媒体查询（断点）+ 弹性布局（flex/grid）+ 相对单位（rem/vw/百分比）+ max-width/min-width 边界控制。与“自适应”强调等比缩放略有差异，响应式会根据断点呈现不同布局。',
    keys: ['媒体查询', '断点', '弹性布局'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-034',
    type: 'essay',
    diff: 'easy',
    sub: 'CSS 工程化',
    q: 'CSS 预处理器和后处理器是什么？为什么要使用它们？',
    ans: `**面试回答：**

- **预处理器**：在 CSS 之上扩展编程能力，提供变量、嵌套、混合（mixin）、函数、模块化等，编译后输出原生 CSS。代表：**Sass/Scss、Less、Stylus**；
- **后处理器**：对编译产物再做处理，典型代表 **PostCSS** 及插件体系，如 autoprefixer 自动加浏览器前缀、postcss-pxtorem 做 px→rem 移动端适配、cssnano 压缩。

**为什么要用**：原生 CSS 缺少变量与复用机制，大量重复代码难维护；预处理器提升开发效率和可维护性；后处理器解决兼容性与目标环境适配，把“人写的意图”与“浏览器需要的产物”解耦。这属于 CSS 工程化的一部分。`,
    ana: '可补一句：现代项目里 CSS 变量（custom properties）也承担了部分预处理器变量的作用，且是运行时的。',
    keys: ['Sass/Less', 'PostCSS', 'autoprefixer', 'pxtorem'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-035',
    type: 'essay',
    diff: 'medium',
    sub: 'CSS 基础',
    q: 'li 与 li 之间有看不见的空白间隔是什么原因引起的？如何解决？',
    ans: `**面试回答：**行内元素（或 inline-block）标签之间，如果 HTML 源码中存在**换行、空格、制表符**，会被渲染为一个空格字符，产生约 4~8px 的空白间隙。

**解决方案**：
1. 父元素设置 \`font-size: 0\`，子元素单独设置字体大小；
2. 删除 HTML 中的换行/空格（标签紧挨书写，可读性差）；
3. 使用 HTML 注释 \`<!-- -->\` 占据空白位置；
4. **父元素设置 display: flex**，flex 子项之间不会产生空白字符问题（现代首选）；
5. 设置负 margin（不推荐，脆弱）。`,
    ana: '本质考点：HTML 空白符在行内格式化上下文中被渲染为空格。',
    keys: ['空白字符', 'font-size: 0', 'flex 布局'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'hc-036',
    type: 'essay',
    diff: 'medium',
    sub: '布局与适配',
    q: 'CSS Grid 和 Flex 布局有什么区别？分别适合什么场景？',
    ans: `**面试回答：**

- **Flex** 是一维布局，主要解决一行或一列上的空间分配与对齐问题，适合导航栏、按钮组、左右两栏、卡片内部内容排列；
- **Grid** 是二维布局，可以同时控制行和列，适合整体页面骨架、复杂仪表盘、九宫格、固定行列结构的内容区。

**核心区别**：Flex 更关注“内容如何在主轴上伸缩”；Grid 更关注“容器如何划分行列区域”。

**常用 Grid 属性**：\`grid-template-columns\`、\`grid-template-rows\`、\`gap\`、\`grid-column\`、\`grid-row\`、\`place-items\`。例如：

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
}
\`\`\`

实际项目里经常组合使用：外层大布局用 Grid，局部组件内部对齐用 Flex。`,
    ana: 'Flex 一维、Grid 二维是最重要的区分。不要把两者说成替代关系。',
    keys: ['Flex 一维', 'Grid 二维', 'grid-template-columns', '组合使用'],
    src: 'CSS 布局高频题',
  },
  {
    id: 'hc-037',
    type: 'single',
    diff: 'medium',
    sub: 'CSS 基础',
    q: '下面哪个属性最常用于创建新的层叠上下文（Stacking Context）？',
    opts: ['z-index: auto', 'position: static', 'opacity: 0.9', 'display: block'],
    ans: 'C',
    ana: 'opacity 小于 1 会创建新的层叠上下文。常见触发条件还包括：定位元素设置非 auto 的 z-index、position: fixed/sticky、transform/filter/perspective 不为 none、will-change、isolation: isolate、flex/grid 子项设置 z-index 等。层叠上下文内部的 z-index 只在本上下文内比较，不能无限压过外部元素。',
    keys: ['层叠上下文', 'opacity < 1', 'transform', 'z-index 比较范围'],
    src: 'CSS 层叠上下文高频题',
  },
  {
    id: 'hc-038',
    type: 'multiple',
    diff: 'medium',
    sub: 'HTML 基础',
    q: '关于响应式图片，下列哪些说法是正确的？（多选）',
    opts: [
      'srcset 可以提供不同宽度或像素密度的候选图片',
      'sizes 用于告诉浏览器图片在不同视口下的展示宽度',
      '首屏 LCP 图片通常应该直接懒加载以节省带宽',
      'picture 标签可以根据媒体条件或图片格式选择不同资源',
    ],
    ans: ['A', 'B', 'D'],
    ana: 'srcset 提供候选资源，sizes 告诉浏览器当前布局下图片槽位宽度，浏览器结合 DPR 和视口选择最合适的图片。picture/source 可以做格式兜底（AVIF/WebP/JPEG）或按媒体条件切图。首屏 LCP 图片不建议 lazy，否则可能推迟最大内容绘制。',
    keys: ['srcset', 'sizes', 'picture/source', 'LCP 图片不懒加载'],
    src: 'HTML 响应式图片高频题',
  },
]
