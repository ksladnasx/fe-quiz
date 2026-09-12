import type { RawQuestion } from '../../types'

/**
 * React 题库
 * 来源：docs/React框架面试题.md、docs/针对简历问答.md、
 *       docs/收集的面试知识点.md、docs/农担项目所遇问题及总结.md、docs/前端面试八股文.md
 */
export const reactQuestions: RawQuestion[] = [
  // ============ 组件基础 ============
  {
    id: 'ra-001',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: '说一下 React 的事件机制。React 的事件和原生 HTML 事件有什么不同？',
    ans: `**面试回答：**React 自己实现了一套**合成事件（SyntheticEvent）**系统：

1. **事件委托**：React 17+ 把所有事件统一**委托到 root 容器**（16 及以前委托到 document），子组件的事件不会真的绑定在每个 DOM 上，统一由容器监听分发；
2. **分发过程**：DOM 原生事件冒泡到 root 后，React 根据事件目标沿组件树模拟捕获/冒泡阶段，找到对应的事件处理器执行；
3. **合成事件对象**：事件回调收到的是 React 包装的 SyntheticEvent，抹平浏览器差异，具有跨浏览器一致性（部分属性是惰性的，异步使用需要 persist()）；
4. 与原生事件的差异：**e.stopPropagation() 只阻止合成事件的传播**，不阻止原生监听器的执行（在 document 上绑原生监听仍能收到）；事件名采用小驼峰（onClick），传的是**函数引用**而不是字符串。

**为什么这么做**：统一管理减少监听器数量（性能）、抹平兼容性、为 Fiber 优先级调度提供基础。`,
    ana: 'React 17 的变化：事件委托从 document 移到 root 容器，避免多 React 版本共存时冲突。',
    keys: ['合成事件', '事件委托到 root', 'SyntheticEvent'],
    src: 'React框架面试题.md',
  },
  {
    id: 'ra-002',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: 'React 高阶组件（HOC）、Render Props 和 Hooks 有什么区别？为什么要不断迭代？',
    ans: `**面试回答：**三者都是 React 解决**逻辑复用**的方案：

1. **HOC**：高阶组件是一个**接收组件返回新组件**的函数（装饰器模式），把公共逻辑（权限、埋点、数据注入）包在外面。缺点：props 命名冲突、多层嵌套“套娃”、来源不直观；
2. **Render Props**：组件接收一个**函数 prop**，把状态作为参数回调给调用方渲染（如旧版 react-router、react-spring）。优点是数据来源清晰；缺点是嵌套深时形成回调地狱、 JSX 冗长；
3. **Hooks**：在**函数组件内部**以 use 函数复用状态逻辑（自定义 Hook），无嵌套、无命名冲突、与组件天然同生命周期，是目前的最终形态。

**为什么不断迭代**：前两者的本质问题是**复用逻辑必须改变组件结构**（包一层或传函数），而 Hooks 把“逻辑复用”和“组件结构”解耦了，同一个逻辑可以自由组合，代码扁平直观。HOC 还在用于跨组件切面场景（如 withErrorBoundary），但常规复用首选自定义 Hook。`,
    ana: 'HOC 运用的设计模式：装饰器模式。可在 project 分类里结合 ErrorBoundary 组件封装延伸。',
    keys: ['逻辑复用', 'props 冲突', '自定义 Hook', '装饰器模式'],
    src: 'React框架面试题.md',
  },
  {
    id: 'ra-003',
    type: 'essay',
    diff: 'hard',
    sub: 'Fiber 架构',
    q: '对 React Fiber 的理解？它解决了什么问题？',
    ans: `**面试回答：**Fiber 是 React 16 引入的**新的协调（Reconciler）架构**。

**解决的问题**：旧架构的 Diff 是**递归同步**的，组件树很大时一次性协调不可中断，长时间占用主线程，导致动画掉帧、输入卡顿（长时间任务阻塞渲染）。

**Fiber 的做法**：
1. **可中断的渲染**：把组件树的协调任务拆成一个个**Fiber 节点单元**，用链表（child/sibling/return）组织，通过**requestIdleCallback 思想 / Scheduler 时间切片**逐单元执行，每执行一小段就检查是否有更高优先级的工作，让出主线程；
2. **优先级调度**：不同更新有不同优先级（用户输入 > 过渡更新），高优先级任务可以打断低优先级渲染（并发特性基础）；
3. **双缓冲 Fiber 树**：current 树（屏幕显示）与 workInProgress 树（内存构建）交替，提交阶段一次性切换；
4. 渲染阶段可中断（commit 阶段同步不可中断），为 Suspense、并发渲染（useTransition、useDeferredValue）铺路。

**一句话**：Fiber 把“一次不可打断的大渲染”变成“可调度、可中断的小任务”，让 React 能兼顾复杂渲染与交互流畅。`,
    ana: '时间切片 + 优先级 + 双缓冲三个关键词。commit 阶段不可中断是易错点。',
    keys: ['可中断渲染', '时间切片', '优先级调度', '双缓冲'],
    src: 'React框架面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'ra-004',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: '类组件与函数组件有什么异同？React 声明组件有哪几种方法？',
    ans: `**面试回答：**

**声明组件的方式**：函数组件（主流）、class 组件（extends React.Component / PureComponent）、已被淘汰的 createClass（ReactDOM.createFactory 时代的 API）。

**异同**：
1. **心智模型**：函数组件是“**渲染快照**”——每次渲染捕获当时的 props/state，UI 是那次数据快照的结果；class 组件实例常驻，this 可变，读到的可能是最新值；
2. **状态与生命周期**：class 有生命周期方法；函数组件靠 **Hooks**（useState/useEffect）实现同等能力；
3. **性能**：函数组件可以用 memo 浅比较 props 跳过渲染；PureComponent 是 class 的对应物；
4. **this 问题**：class 组件要处理事件处理器的 this 绑定；函数组件没有 this；
5. **未来趋势**：Hooks 支持逻辑复用、更贴合 TS，函数组件是官方推荐方向。

为什么 Hooks 比 class 好（docs 针对简历问答原题）：class 组件存在 **this 指向问题、生命周期逻辑分散、复用困难（只能 HOC/Render Props）**；Hooks 的函数式写法更简洁、逻辑按功能聚合、复用更方便，更适合 TS 和项目维护。`,
    ana: '“渲染快照”概念可举闭包陷阱例子：setTimeout 中读到的 state 是当次渲染的值。',
    keys: ['渲染快照', 'this 绑定', 'PureComponent', 'Hooks 复用'],
    src: 'React框架面试题.md / 针对简历问答.md',
  },
  {
    id: 'ra-005',
    type: 'single',
    diff: 'medium',
    sub: '组件基础',
    q: 'React.Component 和 React.PureComponent 的区别是什么？',
    opts: [
      'PureComponent 内置了 shouldComponentUpdate 的浅比较实现',
      'PureComponent 会深度比较 props 和 state',
      'Component 更新更快',
      'PureComponent 不能配合 redux 使用',
    ],
    ans: 'A',
    ana: 'PureComponent 自动实现了 **shouldComponentUpdate 中的浅比较**：props/state 的第一层引用不变就跳过重新渲染。注意是**浅比较**——嵌套对象的内部变化检测不到，所以更新嵌套数据必须返回新对象（不可变更新）。函数组件的对应能力是 React.memo。使用不当可能因“引用相同但内容变了”造成 UI 不更新。',
    keys: ['浅比较', 'shouldComponentUpdate', 'React.memo'],
    src: 'React框架面试题.md',
  },
  {
    id: 'ra-006',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: 'Fragment 是什么？Portals（插槽）的使用场景是什么？forwardRef 有什么作用？',
    ans: `**面试回答：**

**Fragment**：让组件返回**多个子元素而不添加多余 DOM 节点**。\`<React.Fragment>\` 或短语法 \`<>\`。使用场景：表格行包裹（不能有额外 div）、列表分组、减少 DOM 层级。区别：短语法不能加 key，需要 key（如列表渲染）时用 \`<React.Fragment key={id}>\`。

**Portals**：\`ReactDOM.createPortal(child, domNode)\` 把子组件渲染到**父组件 DOM 层级之外**的指定节点。事件冒泡仍按 React 组件树传递。使用场景：Modal 弹窗、Tooltip、下拉菜单——避免被父级的 overflow: hidden、z-index 限制。

**forwardRef**：函数组件默认**不能接收 ref**，forwardRef 创建的组件可以把 ref **转发到内部 DOM 元素或子组件**。泛型 \`forwardRef<T, P>\`：T 是 ref 指向的元素类型（如 SVGSVGElement、HTMLDivElement），P 是 props 类型。项目里的 SVG 图标组件就是用 forwardRef 封装的，外部可以通过 ref.current 拿到 svg DOM 做 getBBox、动画等操作，同时用 className 灵活控制样式。`,
    ana: 'React 19 已支持函数组件直接接收 ref 作为 prop（无需 forwardRef），面试可提及。',
    keys: ['无额外 DOM', 'createPortal', 'ref 转发', 'SVGSVGElement'],
    src: 'React框架面试题.md / 农担项目所遇问题及总结.md',
  },
  {
    id: 'ra-007',
    type: 'essay',
    diff: 'easy',
    sub: '组件基础',
    q: 'React 中什么是受控组件和非受控组件？',
    ans: `**面试回答：**

- **受控组件**：表单元素的值由 **React state 驱动**（\`value={state}\` + \`onChange\` 更新 state），组件状态是唯一数据源，每次输入都走“输入 → setState → 重渲染”的循环。优点：数据可校验、可联动、可提交前统一处理；
- **非受控组件**：表单数据由 **DOM 自己管理**，React 不干预，需要时通过 **ref** 读取（\`ref.current.value\`）。适合简单表单或文件输入（file input 只能非受控）。

**选择**：需要校验、联动、受控展示时用受控；性能敏感的超大表单或依赖默认行为时可用非受控。第三方组件库通常同时支持两种模式。`,
    ana: 'file input 必须非受控是常见追问点。',
    keys: ['state 驱动', 'ref 读取', 'file input 非受控'],
    src: 'React框架面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'ra-008',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: '对 React Context 的理解？为什么 React 并不推荐优先使用 Context？',
    ans: `**面试回答：**

**Context**：提供一种**跨组件层级传递数据**的方式，避免 props 逐层透传（props drilling）。创建 \`createContext(defaultValue)\`，上层 Provider 提供 value，任意下层 useContext 读取；value 变化会让所有消费组件重新渲染。

**为什么不推荐优先使用**：
1. **更新粒度问题**：Provider 的 value 变化，**所有消费该 Context 的组件都会重新渲染**，即使它们只用到其中一小部分数据。高频更新的状态放进 Context 会引发大范围重渲染；
2. **耦合度**：组件隐式依赖上层 Context，复用性下降；
3. React 的组件模型更适合显式 props 传递，Context 应该是**低频全局数据**的方案（主题、语言、当前登录用户）。

**实际选型**（docs 针对简历问答）：服务端数据用 React Query；客户端全局状态用 Zustand/Redux；**Context 只用于主题、国际化、用户信息这类更新频率很低的状态**。`,
    ana: 'useContext 选择器优化（use-context-selector 库）或拆分 Context 可以缓解重渲染问题。',
    keys: ['props drilling', '消费组件全量重渲染', '低频全局数据'],
    src: 'React框架面试题.md / 针对简历问答.md',
  },

  // ============ State 与更新机制 ============
  {
    id: 'ra-009',
    type: 'essay',
    diff: 'medium',
    sub: 'State 管理',
    q: 'React 的 setState 是同步还是异步的？setState 之后发生了什么？',
    ans: `**面试回答：**

**表象**：React 18 之前，在合成事件和生命周期里 setState 是“异步”的（批处理，调用后不能立刻拿到最新值）；在 setTimeout、原生事件里是“同步”的（每次触发渲染）。**React 18 起 createRoot 开启自动批处理**，所有场景（包括 setTimeout、Promise.then、原生事件）都会批量合并更新。

**本质**：setState 从来不是“异步 API”，而是**批量合并更新**：React 为了性能把同一轮的多次 setState 合并成一次渲染，update 会被放入更新队列，在当前“批次”结束后统一处理。

**setState 之后发生了什么**：
1. 将 update 插入 fiber 的更新队列，标记该 fiber 需要更新；
2. 调度器安排一次重新渲染（可被批处理合并）；
3. render 阶段：函数组件重新执行，得到新虚拟 DOM，协调 Diff；
4. commit 阶段：把变更提交到真实 DOM，随后执行 useEffect 等副作用。

**获取最新值**：setState 的第二个参数回调（class）；函数式更新 \`setCount(c => c + 1)\`（避免基于旧值计算）；或在 useEffect 中监听变化。`,
    ana: 'useState 异步更新 + 不能立刻拿到最新值是 docs 收集的知识点中单独列出的高频题。',
    keys: ['批处理', '自动批处理 React18', '函数式更新'],
    src: 'React框架面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'ra-010',
    type: 'essay',
    diff: 'easy',
    sub: 'State 管理',
    q: 'React 组件的 state 和 props 有什么区别？props 为什么是只读的？',
    ans: `**面试回答：**

**区别**：
- **props**：父组件传入的**只读数据**，组件不能修改，数据流自上而下；
- **state**：组件**内部私有可变**的状态，必须通过 setState/useState 的 setter 修改，修改会触发重新渲染。

**props 为什么只读**：
1. **单向数据流**原则：数据从父到子单向流动，子组件改 props 会让数据来源不可追踪，状态管理混乱；
2. **纯函数理念**：组件应该是“props → UI”的纯函数，修改入参破坏可预测性；
3. 需要变更时，应该通过**回调通知父组件**修改数据源（状态提升）。

另外注意：直接修改 state（this.state.x = 1 / state.x = 1）不会触发渲染，且 PureComponent/memo 的浅比较会失效，必须整体替换为新对象。`,
    ana: 'props 只读 + 单向数据流 + 状态提升三个词串起来回答。',
    keys: ['props 只读', '单向数据流', 'setState 替换对象'],
    src: 'React框架面试题.md',
  },
  {
    id: 'ra-011',
    type: 'essay',
    diff: 'easy',
    sub: 'State 管理',
    q: 'React 中如何避免不必要的 render？',
    ans: `**面试回答：**从几个层面回答：

1. **组件级**：函数组件用 **React.memo** 包裹（props 浅比较），class 用 PureComponent / shouldComponentUpdate；
2. **props 稳定化**：
   - 匿名函数每次渲染都是新引用，会**破坏 memo 的浅比较**——用 **useCallback** 缓存函数；
   - 对象/数组 props 用 **useMemo** 缓存引用；
3. **状态下沉与粒度拆分**：把 state 放到真正需要它的组件附近，避免父组件的小状态变化引发整棵子树渲染；一个 state 里包含多个不相关数据时拆开（引用变化会导致依赖其他字段的 memo 也失效）；
4. **Context 拆分**：高频变化的数据不要放低频 Context；
5. **列表 key 稳定**：不要用 index 作 key 导致错误复用与多余渲染；
6. **虚拟列表**：大量列表只渲染可视区。

我的项目实践：智能体平台知识库卡片频繁重绘，我用“组件拆分 + 状态粒度细化 + useCallback”组合优化，明显减少卡顿。`,
    ana: '匿名函数破坏 memo 浅比较是 docs 针对简历问答里的原话，结合项目讲最加分。',
    keys: ['React.memo', 'useCallback/useMemo', '状态下沉'],
    src: 'React框架面试题.md / 针对简历问答.md',
  },

  // ============ 生命周期与 Hooks ============
  {
    id: 'ra-012',
    type: 'essay',
    diff: 'medium',
    sub: '生命周期',
    q: 'React 16 之后的生命周期有哪些？废弃了哪些生命周期？为什么？',
    ans: `**面试回答：**

**React 16.3+ 的生命周期（挂载）**：
constructor → getDerivedStateFromProps → render → componentDidMount

**更新**：getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate

**卸载**：componentWillUnmount；**错误处理**：getDerivedStateFromError + componentDidCatch。

**废弃**：componentWillMount、componentWillReceiveProps、componentWillUpdate（可用 UNSAFE_ 前缀继续用到 17）。

**废弃原因**：它们在 Fiber 的**可中断渲染阶段**执行——如果渲染被打断重启，这些方法可能**被调用多次**，导致副作用重复执行（如请求发两次、订阅重复），语义不安全。替代品：
- componentWillMount → constructor 或 componentDidMount；
- componentWillReceiveProps → **getDerivedStateFromProps**（props 变化派生 state）；
- componentWillUpdate → **getSnapshotBeforeUpdate**（更新前读取 DOM 快照）。`,
    ana: '关键词：可中断渲染导致旧生命周期可能重复调用。函数组件没有生命周期概念，用 useEffect 模拟。',
    keys: ['getDerivedStateFromProps', 'getSnapshotBeforeUpdate', 'UNSAFE_'],
    src: 'React框架面试题.md',
  },
  {
    id: 'ra-013',
    type: 'essay',
    diff: 'medium',
    sub: 'Hooks',
    q: '对 React Hooks 的理解？为什么不能在循环、条件或嵌套函数中调用 Hook？',
    ans: `**面试回答：**

**Hooks 理解**：Hooks 是让**函数组件拥有状态和副作用等能力**的功能函数（useState/useEffect/useRef/useMemo 等）。实现原理上，React 按调用顺序为每个 Hook 在 Fiber 节点上分配一个“记忆单元格”（**单向链表**），渲染时按序读取。

**为什么必须在顶层调用**：React 依赖 **Hook 的调用顺序**来正确关联每次渲染的 state。如果在条件/循环中调用，两次渲染的 Hook 数量和顺序会错位，后续 Hook 会读到前面 Hook 的状态，导致 bug（React 也会直接报错提示）。

**使用规则（铁律）**：
1. 只在最顶层调用 Hook；
2. 只在 React 函数组件或自定义 Hook 中调用。

**Hooks 解决的问题**：class 的逻辑分散（一个功能拆在多个生命周期）、复用困难（HOC/Render Props 嵌套）、this 心智负担。

**useEffect vs useLayoutEffect**：
- **useEffect**：**异步**执行，浏览器完成布局与绘制**之后**执行，不阻塞渲染，适合数据请求、订阅；
- **useLayoutEffect**：**同步**执行，DOM 变更后、浏览器**绘制之前**执行，会阻塞绘制，适合需要**同步读取布局或调整样式**避免闪烁的场景（测量元素、动画初始位置）。`,
    ana: '“记忆单元格链表 + 调用顺序”是原理核心。useLayoutEffect 会阻塞绘制是关键差异。',
    keys: ['调用顺序', 'Hook 链表', 'useLayoutEffect 同步'],
    src: '前端面试八股文.md / React框架面试题.md',
  },
  {
    id: 'ra-014',
    type: 'essay',
    diff: 'medium',
    sub: 'Hooks',
    q: 'useEffect 为什么会死循环？React Hooks 和生命周期的关系是什么？',
    ans: `**面试回答：**

**useEffect 死循环**：useEffect 依赖变化就会重新执行，如果 **effect 内部又修改了它依赖的数据**，就会无限循环：

\`\`\`js
// 依赖 count，内部又改 count → 执行 → 更新 → 再执行……
useEffect(() => {
  setCount(count + 1)
}, [count])
\`\`\`

**本质**：依赖更新 → effect 执行 → 触发更新 → 再触发 effect 的闭环。修复方式：修正依赖（用函数式更新去掉多余依赖）、把派生值用 useMemo 计算、或用事件驱动替代。

**Hooks 与生命周期的对应关系**：
- \`useEffect(fn, [])\` ≈ componentDidMount（挂载后执行一次，但“闭包捕获首帧值”，可加清理函数模拟 componentWillUnmount）；
- \`useEffect(fn, [deps])\` ≈ componentDidUpdate（但首次也会执行，且逻辑上是“依赖变化后”）；
- \`useEffect 返回的清理函数\` ≈ componentWillUnmount；
- **没有完全等价**的对应：Hooks 的心智模型是“**同步状态与副作用**”，不是生命周期——同一个 useEffect 可以同时覆盖挂载和更新两种情形。`,
    ana: '强调心智模型差异是加分点：不要把 useEffect 当成三个生命周期拼起来用。',
    keys: ['依赖闭环', '清理函数', '心智模型'],
    src: '针对简历问答.md / React框架面试题.md',
  },
  {
    id: 'ra-015',
    type: 'single',
    diff: 'medium',
    sub: 'Hooks',
    q: '为什么 useState 要使用数组而不是对象返回？',
    opts: [
      '数组解构可以自由命名变量，多次调用不冲突；对象解构必须使用固定属性名',
      '数组性能比对象更好',
      '对象不能存储函数',
      '这是历史遗留设计，没有原因',
    ],
    ans: 'A',
    ana: '数组解构允许开发者**自行命名**：`const [count, setCount] = useState(0)`、`const [name, setName] = useState("")`——同一个组件可以多次使用且互不冲突。如果返回对象 `{ state, setState }`，解构时每个 useState 的属性名都相同，必须手动重命名，写法繁琐且容易冲突。',
    keys: ['数组解构自由命名', '多次调用'],
    src: 'React框架面试题.md',
  },
  {
    id: 'ra-016',
    type: 'essay',
    diff: 'medium',
    sub: 'Hooks',
    q: 'React Hooks 在平时开发中有哪些需要注意的问题和常见坑？',
    ans: `**面试回答：**

1. **闭包陷阱**：setTimeout/事件回调里读到的 state 是**当次渲染的快照**——用函数式更新 \`setCount(c => c + 1)\` 或 useRef 保存最新值；
2. **依赖数组**：漏依赖导致读到旧值（可用 exhaustive-deps 插件检查）；对象/数组依赖每次渲染引用都变，导致 effect 反复执行——用 useMemo/useCallback 稳定引用；
3. **死循环**：effect 内部更新自己依赖的数据；
4. **清理副作用**：订阅、定时器、**SSE/WebSocket 连接**必须在清理函数中关闭，防止泄漏和重复连接（我项目里 SSE 重复展示就是连接未正确关闭导致）；
5. **不要滥用 useMemo/useCallback**：本身有比较和缓存成本，只在传递给 memo 子组件或作为依赖时使用；
6. **自定义 Hook 复用逻辑**：把“状态 + 操作”封装成 useXxx，而不是复制粘贴；
7. **并发安全**：React 18 严格模式开发环境会**双重执行 effect**，验证清理逻辑正确性，不要在 effect 里写不可重复执行的副作用。`,
    ana: '结合项目讲第 4 点（useRef 管理 SSE 连接生命周期、唯一标识去重）最加分。',
    keys: ['闭包快照', 'exhaustive-deps', '清理函数', '严格模式双执行'],
    src: '收集的面试知识点.md / 针对简历问答.md / React框架面试题.md',
  },

  // ============ 组件通信与状态管理 ============
  {
    id: 'ra-017',
    type: 'essay',
    diff: 'easy',
    sub: '组件通信',
    q: 'React 父子、跨级、非嵌套组件分别怎么通信？',
    ans: `**面试回答：**

**父子**：
- 父 → 子：**props**（数据、回调函数）；
- 子 → 父：调用父组件传入的**回调函数**（onChange、onSubmit），或子组件用 forwardRef 暴露实例方法；
- refs：ref + useImperativeHandle 暴露指定方法。

**跨级（祖孙）**：
- **Context**：避免 props 层层透传，适合主题、用户信息等；
- 逐层 props（props drilling，层数少时最直观）；
- 组合组件模式（把子组件作为 props 传入，如 Tabs + Tab.Item）。

**非嵌套（兄弟/任意）**：
- **状态提升**到最近公共父组件（React 官方推荐）；
- **全局状态管理**：Redux / Zustand / Jotai；
- 事件通知： mitt 之类的 EventEmitter（慎用，破坏数据流可追踪性）；
- URL/路由参数传递页面间状态。

**解决 props 层级过深**：优先考虑组件拆分是否合理（组件树太深往往是设计问题），再选 Context 或状态库。`,
    ana: 'Redux 解决的问题：跨页面共享且关联复杂的全局状态、单向数据流可追踪、DevTools 时间旅行。',
    keys: ['props/回调', 'Context', '状态提升', 'Redux/Zustand'],
    src: 'React框架面试题.md',
  },
  {
    id: 'ra-018',
    type: 'essay',
    diff: 'hard',
    sub: '状态管理',
    q: '对 Redux 的理解？它的工作流程是怎样的？中间件是怎么拿到 store 和 action 的？',
    ans: `**面试回答：**

**Redux 解决什么问题**：复杂应用中多组件共享状态混乱、修改来源不可追踪。Redux 用**单一 store + 单向数据流**让状态变化可预测、可追踪（DevTools 时间旅行）。

**三大原则**：单一数据源；state 只读（只能通过 dispatch action 触发）；**纯函数 reducer** 修改状态（reducer: (state, action) => newState）。

**工作流程**：
View 派发 action → **middleware**（处理异步等副作用）→ reducer 计算新 state → store 更新并通知 → **connect/useSelector 订阅**的组件重新渲染。

**中间件原理**：applyMiddleware 对 **dispatch 做柯里化增强**。中间件签名是 \`store => next => action => result\`：
- 第一层拿到 store（getState/dispatch）；
- 第二层 next 是被包装前的 dispatch（链式传递）；
- 第三层处理 action，异步中间件（thunk）可以把 action 做成函数，等待请求完成再 dispatch 普通 action。

**异步处理**：thunk（简单，函数 action）、saga（基于 generator，适合复杂流程）、RTK Query（数据请求层）。

**为什么项目用 Redux 而不是 Context/useReducer**（docs 原题）：Context 高频更新引发大范围重渲染、修改路径不清晰；Redux 单向数据流可追踪 + DevTools，适合复杂后台。重新选型则会用 React Query（服务端数据）+ Zustand（客户端状态）。`,
    ana: 'connect 的作用：把 store 的 state 映射为 props、订阅变化、注入 dispatch。',
    keys: ['单一数据源', '纯函数 reducer', '柯里化中间件', 'thunk'],
    src: 'React框架面试题.md / 针对简历问答.md',
  },
  {
    id: 'ra-019',
    type: 'essay',
    diff: 'easy',
    sub: '状态管理',
    q: 'React 的状态提升是什么？使用场景有哪些？',
    ans: `**面试回答：**状态提升是把多个组件**共享的状态移动到它们最近的共同父组件**，父组件通过 props 下发状态、通过回调函数接收修改，子组件变成“受控”的展示组件。

**典型场景**：
1. 两个兄弟组件依赖同一份数据（如搜索框输入 + 结果列表过滤）；
2. 表单与提交按钮分离；
3. Tabs 与内容面板联动；
4. 温度/长度转换这类“同源多视图”。

**好处**：单一数据源，状态变化可预测；**坏处/边界**：提升过度会导致父组件臃肿、props drilling，因此更上层的共享状态交给 Context 或 Redux/Zustand。原则：**就近共享用提升，跨页面/跨模块共享用状态库**。`,
    ana: '状态提升是“React 双向数据流模拟”的基础：input value + onChange。',
    keys: ['共同父组件', '受控组件', 'props drilling 边界'],
    src: 'React框架面试题.md',
  },

  // ============ 路由 ============
  {
    id: 'ra-020',
    type: 'essay',
    diff: 'medium',
    sub: '路由',
    q: 'React Router 的实现原理是什么？有几种路由模式？Link 和 a 标签的区别？',
    ans: `**面试回答：**

**实现原理**：
- **BrowserRouter（history 模式）**：基于 HTML5 **History API**（pushState/replaceState）改变 URL 但不刷新页面，监听 **popstate** 事件响应前进后退；刷新时需要服务端把所有路径回退到 index.html；
- **HashRouter（hash 模式）**：URL 用 # 表示路径，监听 **hashchange**，无需服务端配置；
- Router 内部用 **Context** 把 location/history 提供给组件树，Route 组件根据路径匹配渲染对应组件。

**Link 和 a 的区别**：a 标签点击会**重新加载整个页面**（重新请求 HTML、丢失状态）；Link 拦截点击事件，用 pushState 更新 URL 并通知 Router 切换组件，**不重新加载页面**、保留应用状态。需要跳出应用（外链、下载）时才用 a。

**动态路由与鉴权**（docs 问答类型面试题）：React Router 用 useParams 获取动态参数；鉴权通过包装 Route 组件（校验 token/权限，无权限重定向 403 或登录页），配合后端返回的权限表动态生成路由配置。`,
    ana: 'v6 的变化：Routes 替代 Switch、useNavigate 替代 useHistory、嵌套路由 Outlet。',
    keys: ['pushState/popstate', 'HashRouter', 'Link 拦截点击'],
    src: 'React框架面试题.md / 问答类型面试题.md',
  },

  // ============ 虚拟 DOM 与 Diff ============
  {
    id: 'ra-021',
    type: 'essay',
    diff: 'medium',
    sub: '虚拟 DOM 与 Diff',
    q: 'React 的 Diff 算法原理是什么？React 与 Vue 的 Diff 有什么不同？React 为什么需要 key？',
    ans: `**面试回答：**

**React Diff 的三大前提策略**：
1. **同层级比较**：跨层移动视为删除 + 重建；
2. **不同类型组件 → 替换**整棵子树；
3. **同类型节点**：复用 DOM，只更新变化的 props，然后递归比较 children；子节点列表用 **key 标记**匹配。

**子列表 Diff（React 旧版双向遍历）**：用 key 建立旧节点映射，从左往右遍历新列表，能复用就移动（右侧集中插入位置），否则标记删除/插入。React 18+ 引入了**基于 Fiber 的可恢复 Diff**，支持中断。

**React 与 Vue 的 Diff 区别**：
- React 单向从左到右遍历；**Vue2 是双端 Diff**（头尾四指针），**Vue3 用快速 Diff + 最长递增子序列**，尽量减少 DOM 移动；
- Vue 有编译时优化（静态提升、PatchFlag 标记动态内容），Diff 时跳过静态节点；React 主要靠运行时（React Compiler 才引入编译优化）；
- 更新粒度不同：Vue 数据变化精确知道哪个组件依赖它；React 默认**从状态所在组件向整棵子树重新渲染**，靠 memo/useMemo 手动优化。

**为什么需要 key**：key 是列表节点的**唯一标识**，Diff 时靠它判断“复用还是重建”。没有 key 时 React 默认按**位置索引**复用——插入、删除、排序后节点错位，导致输入框内容串位、组件内部状态异常、不必要的重渲染。`,
    ana: '三段式：React 策略 → 与 Vue 对比 → key 的意义，正好是 docs 三个独立问题的合并答法。',
    keys: ['同层比较', '双端 Diff vs 单向', 'key 唯一标识', '更新粒度'],
    src: 'React框架面试题.md / 收集的面试知识点.md / 针对简历问答.md',
  },
  {
    id: 'ra-022',
    type: 'single',
    diff: 'medium',
    sub: '虚拟 DOM 与 Diff',
    q: '列表渲染时，为什么循环中不建议用数组索引做 key？',
    opts: [
      'index 作 key 性能一定最差',
      '插入、删除、排序后 index 与数据的对应关系会错位，导致状态错乱和不必要重渲染',
      'index 不是数字类型',
      'React 不允许数字 key',
    ],
    ans: 'B',
    ana: 'key 的意义是“稳定标识同一份数据”。列表顺序变化时 index 无法保持数据与节点的对应：比如删除第一项后，原来的第二项内容现在 index 为 0，React 会认为“key=0 的节点还在”，只更新内容而不重建——组件内部状态（输入框、滚动位置、勾选状态）就会**错位**到别的数据上。列表纯静态展示且不重排时 index 可以接受，但只要涉及增删排序就应该用唯一 id。',
    keys: ['稳定标识', '状态错位', '唯一 id'],
    src: '收集的面试知识点.md',
  },

  // ============ 其他 ============
  {
    id: 'ra-023',
    type: 'essay',
    diff: 'medium',
    sub: '其他',
    q: 'React 数据持久化有什么实践？页面刷新时怎样保留数据？',
    ans: `**面试回答：**常见方案按场景选择：

1. **localStorage/sessionStorage**：token、用户偏好、筛选条件。配合状态库的 persist 中间件（redux-persist、zustand persist）自动同步；
2. **URL（路由参数）**：列表页分页、筛选状态放到 query，刷新、分享、回退都能恢复，可追踪性最好；
3. **服务端**：真正需要跨设备的数据存数据库，登录后拉取；
4. **React Query 缓存**：服务端数据在客户端缓存 + staleTime 控制，本质是“刷新后重新请求 + 请求间去重”。

**注意事项**：持久化数据要有**版本控制**（key 带版本号或校验逻辑），防止旧结构导致报错；敏感信息（token）放 localStorage 有 XSS 风险，可配合 HttpOnly Cookie。项目实战：我在智能体平台处理过“localStorage 缓存的模型已被后台删除”的问题，方案是初始化时用后端最新模型列表**校验本地缓存有效性**，失效则清除并回退到第一个可用模型。`,
    ana: '模型缓存校验是 docs/基于简历的问题.md 的原题，能自然带出项目。',
    keys: ['persist 中间件', 'URL 状态', '缓存校验'],
    src: 'React框架面试题.md / 基于简历的问题.md',
  },
  {
    id: 'ra-024',
    type: 'essay',
    diff: 'medium',
    sub: '其他',
    q: '对 React SSR 的理解？React 的设计理念是什么？',
    ans: `**面试回答：**

**SSR（服务端渲染）**：在服务端把 React 组件渲染成 **HTML 字符串**直接返回，浏览器先显示静态内容，再“注水（hydration）”让页面具备交互能力。

**解决什么**：
1. **首屏更快**：用户直接看到 HTML，不用等 JS 下载执行完；
2. **SEO**：爬虫直接抓到完整内容。

**代价与注意**：服务端计算压力、生命周期限制（只有 render 和部分钩子可用，useEffect 不在服务端执行）、需要处理 window/document 的环境判断、 hydration 不一致问题。同构框架：Next.js（App Router 引入 RSC 服务端组件）。

**React 的设计理念**（docs 原题）：
1. **UI = f(state)**：视图是状态的函数，声明式描述“应该长什么样”而不是命令式操作 DOM；
2. **组件化**：一切皆组件，组合优于继承；
3. **单向数据流**；
4. **最小 API 面与生态演进**：核心保持稳定，把能力交给社区（路由、状态管理）；
5. React 18 的并发理念：渲染可中断，交互优先。`,
    ana: 'SSR 回答要提“注水 hydration”，理念回答抓 UI=f(state) 与组件化两点即可。',
    keys: ['服务端渲染 HTML', 'hydration', 'UI = f(state)'],
    src: 'React框架面试题.md',
  },
  {
    id: 'ra-025',
    type: 'code',
    diff: 'medium',
    sub: 'Hooks',
    q: 'React 中如何在组件卸载或路由切换时正确清理定时器和订阅？写出一个自定义 Hook useInterval 的实现。',
    ans: `\`\`\`jsx
import { useEffect, useRef } from 'react'

function useInterval(callback, delay) {
  const savedCallback = useRef(callback)

  // 每次渲染更新回调引用，避免闭包读到旧 state
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay == null) return
    const id = setInterval(() => savedCallback.current(), delay)
    // 清理函数：卸载或 delay 变化前执行，防止泄漏与重复定时器
    return () => clearInterval(id)
  }, [delay])
}

// 使用
function Timer() {
  const [seconds, setSeconds] = useState(0)
  useInterval(() => setSeconds((s) => s + 1), 1000)
  return <div>Seconds: {seconds}</div>
}
\`\`\`

**要点**：
1. 清理函数（return 的函数）在**卸载和下次 effect 执行前**都会运行；
2. 用 ref 保存最新回调解决闭包陷阱；
3. 项目中的 SSE/WebSocket/事件监听同理：useRef 保存连接引用、卸载时主动 close、建立前先判断已有连接，避免重复连接导致消息重复展示。`,
    ana: 'useInterval 的 ref 模式（useEffectEvent 的前身）是经典面试代码题。',
    keys: ['清理函数', 'useRef 保存回调', 'SSE 生命周期'],
    src: '农担项目所遇问题及总结.md / 基于简历的问题.md',
  },

  {
    id: 'ra-026',
    type: 'multiple',
    diff: 'medium',
    sub: 'Hooks',
    q: '下列哪些符合 **React Hooks 的使用规则**？（多选）',
    opts: [
      '只在函数组件或自定义 Hook 的最顶层调用',
      '可以在 if 条件中按需调用 useState',
      '自定义 Hook 必须以 use 开头命名',
      '可以在 useEffect 的清理函数中再调用 useState',
    ],
    ans: ['A', 'C'],
    ana: 'Hooks 铁律：①只在最顶层调用——不能在循环、条件或嵌套函数中调用，因为 React 依赖调用顺序关联每次渲染的 state（内部是 Hook 链表）；②只在 React 函数组件或自定义 Hook 中调用。useEffect 清理函数只是普通回调，不应在其中再调用 Hook。自定义 Hook 以 use 开头是命名约定，也是 lint 识别 Hook 的依据。',
    keys: ['调用顺序', 'Hook 链表', '只在顶层'],
    src: '前端面试八股文.md / React框架面试题.md',
  },
  {
    id: 'ra-027',
    type: 'multiple',
    diff: 'hard',
    sub: '生命周期',
    q: '下列哪些是 React 16.3+ 引入或保留的**安全生命周期**？（多选）',
    opts: ['getDerivedStateFromProps', 'getSnapshotBeforeUpdate', 'componentWillReceiveProps', 'componentDidCatch'],
    ans: ['A', 'B', 'D'],
    ana: 'React 16.3 引入 getDerivedStateFromProps（props 变化派生 state）和 getSnapshotBeforeUpdate（更新前读 DOM 快照）；16.6 增加 componentDidCatch（错误边界，配套 getDerivedStateFromError）。**componentWillReceiveProps 被废弃**——它在 Fiber 可中断渲染阶段可能被调用多次，副作用不安全，替代方案就是 getDerivedStateFromProps。',
    keys: ['废弃的生命周期', 'getDerivedStateFromProps', 'Fiber 不安全'],
    src: 'React框架面试题.md',
  },
  {
    id: 'ra-028',
    type: 'essay',
    diff: 'medium',
    sub: 'Hooks',
    q: 'useMemo 和 useCallback 有什么区别？为什么不建议无脑使用？',
    ans: `**面试回答：**

**useMemo**：缓存一个计算结果，依赖不变时返回上次的值，适合开销较大的派生计算，或稳定对象/数组引用；
**useCallback**：缓存一个函数引用，本质上等价于 "useMemo(() => fn, deps)"，常用于把回调传给 React.memo 子组件，避免每次父组件渲染都生成新函数引用。

**使用场景**：子组件用了 React.memo 且依赖 props 浅比较时，稳定函数/对象引用才有价值；或者计算确实昂贵，缓存能减少重复计算。

**不建议无脑使用**：useMemo/useCallback 本身也有依赖比较和缓存维护成本，代码还会更复杂。普通轻量计算、没有传给 memo 子组件的函数，直接写通常更清晰。`,
    ana: '关键是说明“配合 memo 或昂贵计算才有意义”，不是看到函数就包 useCallback。',
    keys: ['缓存计算结果', '缓存函数引用', 'React.memo', '依赖比较成本'],
    src: 'React Hooks 高频题',
  },
  {
    id: 'ra-029',
    type: 'single',
    diff: 'medium',
    sub: 'Hooks',
    q: 'useRef 修改 ref.current 后，React 默认会发生什么？',
    opts: [
      '立即触发组件重新渲染',
      '不会触发重新渲染，但当前值会在多次渲染之间保持',
      '会清空组件 state',
      '只能在 class 组件中使用',
    ],
    ans: 'B',
    ana: 'useRef 返回稳定对象 `{ current }`，修改 current 不会触发渲染，但这个对象会在组件生命周期内保持同一引用。它适合保存 DOM 引用、定时器 ID、WebSocket/SSE 实例、最新回调等不直接参与 UI 展示的数据。参与视图展示的数据应使用 state。',
    keys: ['不触发渲染', '稳定引用', '保存实例'],
    src: 'React Hooks 高频题',
  },
  {
    id: 'ra-030',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: 'React Error Boundary 能捕获哪些错误？有哪些捕获不到？',
    ans: `**面试回答：**Error Boundary 是 React 的错误边界组件，用 class 组件实现，核心生命周期是 "getDerivedStateFromError" 和 "componentDidCatch"。

**能捕获**：子组件在渲染阶段、生命周期方法、构造函数中抛出的错误。捕获后可以展示兜底 UI，并在 componentDidCatch 中上报错误信息。

**捕获不到**：事件处理函数中的错误、异步回调（setTimeout、Promise）里的错误、服务端渲染错误、Error Boundary 自己内部抛出的错误。这些需要 try/catch、window.onerror、unhandledrejection 或请求层拦截器配合处理。

**实践建议**：一般在路由级或关键业务模块外层包裹 Error Boundary，做到局部模块异常不拖垮整个应用。`,
    ana: 'Error Boundary 只兜 React 渲染链路，不是所有 JS 异常的万能捕获器。',
    keys: ['getDerivedStateFromError', 'componentDidCatch', '渲染错误', '异步错误捕获不到'],
    src: 'React 稳定性高频题',
  },
]
