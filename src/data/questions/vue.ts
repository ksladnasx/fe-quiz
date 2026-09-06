import type { RawQuestion } from '../../types'

/**
 * Vue 题库
 * 来源：docs/Vue框架面试题.md、docs/一些高频率考点.md、
 *       docs/收集的面试知识点.md、docs/知识点快速复习指南.md、docs/前端面试八股文.md
 */
export const vueQuestions: RawQuestion[] = [
  // ============ Vue 基础与响应式 ============
  {
    id: 'vue-001',
    type: 'essay',
    diff: 'medium',
    sub: '响应式原理',
    q: '说一下 Vue 的基本原理和双向数据绑定的实现。',
    ans: `**面试回答：**

**Vue 的基本原理**：Vue 是一套**响应式驱动的渐进式框架**。核心是一个**观察者模式**的闭环：

1. **数据劫持**：初始化时对 data 递归遍历，用 Object.defineProperty（Vue2）/ Proxy（Vue3）把每个属性转成 getter/setter；
2. **依赖收集**：组件渲染时，渲染 Watcher 读取数据触发 **getter**，把当前 Watcher 收集到该属性的依赖（Dep）中；
3. **派发更新**：数据变化触发 **setter**，通知 Dep 中收集的所有 Watcher，执行组件的更新（重新渲染 + Diff）。

**双向数据绑定（v-model）**：由两部分组成——
- 数据 → 视图：响应式系统 + 模板编译，数据变化自动更新 DOM；
- 视图 → 数据：监听表单元素的 input/change 事件，把用户输入赋回数据。

所以 v-model 本质是\`:value + @input\` 的**语法糖**（自定义组件上是 modelValue prop + update:modelValue 事件）。`,
    ana: '答题闭环：劫持 → 收集依赖 → 派发更新。v-model 是语法糖是必答点。',
    keys: ['defineProperty/Proxy', '依赖收集', '派发更新', 'v-model 语法糖'],
    src: 'Vue框架面试题.md',
  },
  {
    id: 'vue-002',
    type: 'essay',
    diff: 'medium',
    sub: '响应式原理',
    q: 'Vue2 使用 Object.defineProperty 做数据劫持有什么缺点？Vue3 为什么要换 Proxy？',
    ans: `**面试回答：**

**Object.defineProperty 的缺点**：
1. **无法监听新增/删除属性**：劫持在初始化时完成，后续新加属性没有 getter/setter，所以需要 \`Vue.set / Vue.delete\`；
2. **无法监听数组下标和 length 变化**：Vue2 通过**重写数组原型方法**（push/pop/splice 等 7 个）曲线实现监听，直接 \`arr[0] = x\` 或 \`arr.length = 0\` 依然无效；
3. **需要递归遍历初始化**：深层对象要一次性递归劫持，初始化开销大；
4. 只能劫持已知属性，扩展性差。

**Proxy 的优势**：
1. **代理整个对象**：拦截 get/set/deleteProperty/has/ownKeys 等 13 种操作，新增、删除属性和数组变化都能自动感知；
2. **惰性代理**：访问到深层属性时才代理（性能更好，初始化更快）；
3. 原生支持 Map/Set/WeakMap/WeakSet；
4. Vue3 配合 Reflect 保证 getter/setter 中 this 指向正确。

**一句话**：Proxy 从“劫持属性”升级为“代理对象”，监听覆盖更完整、性能更好、扩展性更强。`,
    ana: 'Vue3 ref 的 .value 设计原因可追问：基本类型无法被 Proxy 代理，需要容器对象包裹。',
    keys: ['Vue.set', '数组重写方法', 'Proxy 13 种拦截', '惰性代理'],
    src: 'Vue框架面试题.md / 前端面试八股文.md / 一些高频率考点.md',
  },
  {
    id: 'vue-003',
    type: 'single',
    diff: 'medium',
    sub: '响应式原理',
    q: 'Vue3 中给 reactive 对象新增一个属性，视图会自动更新吗？换成 Vue2 呢？',
    opts: [
      '都会自动更新',
      'Vue3 会更新（Proxy 代理整个对象），Vue2 不会（需要 Vue.set 或替换整个对象）',
      'Vue3 不会，Vue2 会',
      '都不会，必须手动 $forceUpdate',
    ],
    ans: 'B',
    ana: 'Vue2 的 defineProperty 在初始化后无法感知新增属性，需要 Vue.set(target, key, value)（内部调用 defineReactive 并手动触发依赖通知）或用新对象替换。Vue3 的 Proxy 在 set 拦截器中天然处理新增/删除属性，直接赋值即响应。',
    keys: ['Proxy 新增属性', 'Vue.set 原理'],
    src: 'Vue框架面试题.md / 一些高频率考点.md',
  },
  {
    id: 'vue-004',
    type: 'essay',
    diff: 'medium',
    sub: '响应式原理',
    q: 'Vue3 的 ref 和 reactive 有什么区别？分别的使用场景？',
    ans: `**面试回答：**

- **reactive**：接收对象/数组，返回 **Proxy 代理对象**。不能用于基本类型；**不能整体替换引用**（替换后失去响应式）；解构会丢失响应性（要用 toRefs）；
- **ref**：创建一个带 \`value\` 属性的**包装对象**，可以包装**任何类型**（包括基本类型和对象）；在脚本中通过 \`.value\` 读写，在模板中自动解包。

**为什么 ref 需要 .value**：基本类型（number/string）没有属性可被 Proxy 代理，只能通过容器对象统一拦截读写。

**使用场景**：响应式**原始值**（计数、开关、字符串状态）必须用 ref；响应式**复杂对象**优先 reactive，语法更简洁。实际项目中很多团队会统一风格，比如全部用 ref，避免心智负担。

**computed/watch/nextTick**：computed 有缓存、依赖变化才重算；watch 显式监听数据执行副作用；nextTick 在下次 DOM 更新循环结束后执行回调，用于“改数据后读 DOM”。`,
    ana: 'Vue2/3 对比表格（响应式/组织方式/性能/TS 支持）是知识点快速复习指南的推荐答法。',
    keys: ['ref 包装对象', 'reactive 代理', '.value 原因', 'toRefs'],
    src: '前端面试八股文.md / 知识点快速复习指南.md',
  },
  {
    id: 'vue-005',
    type: 'essay',
    diff: 'easy',
    sub: 'Vue 基础',
    q: 'MVVM、MVC、MVP 的区别是什么？',
    ans: `**面试回答：**

- **MVC**：Model（数据）- View（视图）- Controller（逻辑中转）。用户操作由 Controller 处理，更新 Model 后手动同步 View。前后端分离前的前端框架（jQuery 时代）多属此类，视图和数据要手动同步；
- **MVP**：Presenter 替代 Controller，负责从 Model 取数据并**手动调用** View 的接口更新视图，View 与 Model 完全解耦，但 Presenter 容易臃肿；
- **MVVM**：Model-View-**ViewModel**，核心是**数据双向绑定**：ViewModel 监听 Model 变化自动更新 View，监听 View 输入自动更新 Model，开发者只需关心数据。

**MVVM 的优缺点**：优点是低耦合、可复用、自动同步，开发效率高；缺点是调试成本高（数据驱动的 Bug 定位链路长）、大项目中 View 状态绑定过多会导致性能和可读性问题。

Vue 就是 MVVM 思想的典型实现：Vue 实例充当 ViewModel。`,
    ana: '关键词：MVVM 的 V 与 VM 自动绑定，MVC/MVP 需要手动同步视图。',
    keys: ['ViewModel', '双向绑定', '低耦合'],
    src: 'Vue框架面试题.md',
  },
  {
    id: 'vue-006',
    type: 'essay',
    diff: 'easy',
    sub: 'Vue 基础',
    q: 'computed 和 watch、methods 分别有什么区别？',
    ans: `**面试回答：**

- **computed（计算属性）**：基于**依赖的响应式数据**计算，有**缓存**——依赖不变时多次访问返回缓存结果，不重复计算。适合模板中展示的派生数据（如全名、过滤后的列表、合计金额）；
- **watch（侦听器）**：监听指定数据**执行副作用**，无缓存概念，可以执行异步操作、请求接口、深度监听（deep）、立即执行（immediate）。适合“数据变化后做某事”（如路由参数变化重新请求）；
- **methods**：每次调用都执行，无缓存。适合事件处理函数和不需要缓存的计算。

**选型口诀**：模板派生值用 computed；变化后要干副作用的事用 watch；事件回调用 methods。computed 的 getter 必须是同步纯函数。`,
    ana: 'Vue3 中 computed/setUp 中 watchEffect（自动追踪依赖、立即执行）与 watch（显式依赖）的区别也是延伸点。',
    keys: ['computed 缓存', 'watch 副作用', 'watchEffect'],
    src: 'Vue框架面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'vue-007',
    type: 'essay',
    diff: 'medium',
    sub: 'Vue 基础',
    q: 'Vue2 和 Vue3 有哪些区别？',
    ans: `**面试回答：**按维度对比：

| 维度 | Vue 2 | Vue 3 |
|------|-------|-------|
| 响应式 | Object.defineProperty 劫持属性 | Proxy 代理整个对象 |
| 数组/新增属性 | 有监听限制，需要 Vue.set | 天然支持 |
| 组织方式 | Options API（data/methods/watch 分散） | Composition API（setup，逻辑按功能组合） |
| 逻辑复用 | mixin（命名冲突、来源不清晰） | 组合式函数（hooks），复用清晰 |
| 性能 | 组件粒度更新 | 编译优化：静态提升、PatchFlag、区块树，更新更精细 |
| TypeScript | 支持成本较高 | 源码 TS 重写，类型推导友好 |
| 新特性 | - | Fragment、Teleport、Suspense、多个 v-model |

**Composition API 的价值**：同一功能的响应式数据、计算属性、方法写在一起，逻辑复用从 mixin 变成函数调用，避免了命名冲突和“跳来跳去找代码”的问题。`,
    ana: '静态提升（static hoisting）、patchFlag（标记动态节点）是编译优化的细节加分点。',
    keys: ['Proxy', 'Composition API', '静态提升', 'Fragment'],
    src: '一些高频率考点.md / 知识点快速复习指南.md / 收集的面试知识点.md',
  },
  {
    id: 'vue-008',
    type: 'essay',
    diff: 'medium',
    sub: 'Vue 基础',
    q: 'v-if 和 v-show 有什么区别？v-if 和 v-for 同时使用时哪个优先级高？',
    ans: `**面试回答：**

**v-if vs v-show**：
- **v-if**：**真正创建/销毁**组件与 DOM，切换开销大；惰性——初始条件为假时不渲染；适合**低频切换**且初始可能不显示的场景；
- **v-show**：只切换 \`display: none\`，DOM 始终渲染，初始渲染开销大但**切换开销小**；适合**高频切换**（如 Tab 面板、悬浮提示）；
- v-if 可以配合 template 使用并带动 v-else/v-else-if；v-show 不能用在 template 上。

**v-if 与 v-for 优先级**：**Vue2 中 v-for 优先级更高**（v-for 的每一项都会执行 v-if 判断，浪费性能）；**Vue3 中 v-if 优先级更高**（v-if 里无法访问 v-for 的变量，混用会报错）。**两个版本都不建议同时用在同一元素上**：正确做法是先用 computed 过滤数据，或者把 v-if 提到外层 template。`,
    ana: 'v-for + v-if 的正确写法（computed 过滤）是“如果同时出现，应如何优化”的答案。',
    keys: ['创建销毁 vs display', 'Vue2 v-for 优先', 'Vue3 v-if 优先'],
    src: 'Vue框架面试题.md / 知识点快速复习指南.md',
  },

  // ============ 模板 / 组件 ============
  {
    id: 'vue-009',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: 'slot 是什么？作用域插槽的原理是什么？',
    ans: `**面试回答：**slot（插槽）是 Vue 实现**内容分发**的机制，让父组件向子组件指定位置传入模板内容，子组件保留结构、父组件决定内容。

**三类插槽**：
1. **默认插槽**：\`<slot>\` 占位，父组件内容填入；
2. **具名插槽**：\`<slot name="header">\` + \`<template #header>\`，多位置分发；
3. **作用域插槽**：子组件把内部数据通过 \`<slot :item="item">\` 传出来，父组件用 \`#default="{ item }"\` 接收，实现“**内容在父组件定义，数据来自子组件**”。

**原理**：插槽内容会被编译成函数（scoped slot 是返回 vNode 的函数），存放在子组件实例的 $slots 中；子组件渲染时调用对应函数并传入作用域数据。组件复用时不同实例可以渲染完全不同的插槽内容。

使用场景：表格列自定义渲染、卡片组件底部操作区、列表项模板。`,
    ana: '作用域插槽一句话：数据 child 提供，样式 parent 决定。',
    keys: ['内容分发', '具名插槽', '作用域插槽', '编译成函数'],
    src: 'Vue框架面试题.md',
  },
  {
    id: 'vue-010',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: 'keep-alive 是什么？缓存的是什么？相关的生命周期有哪些？',
    ans: `**面试回答：**keep-alive 是 Vue 的**内置抽象组件**，用于缓存组件实例，避免切换时重复创建销毁，保留组件状态。

**缓存的是什么**：不是 DOM，而是**组件实例（vnode + 组件状态）**——数据、计算属性、DOM 状态都保留。实现上用缓存 Map 以组件的 key/组件名为 key 存 vnode，命中缓存时直接复用，配合 LRU 策略（include/exclude/max 控制缓存范围和上限）。

**生命周期**：被 keep-alive 包裹的组件激活/停用时触发 \`activated\` / \`deactivated\`，代替反复的 mounted/unmounted。Vue Router 中配合同一路由组件缓存列表页状态。

**注意点**：
1. 缓存的状态可能不是最新的，需要在 activated 中刷新数据；
2. include/exclude 用组件 name 匹配；
3. 过度缓存会占用内存，只缓存列表页这类有状态页面。`,
    ana: 'LRU 缓存淘汰策略（最多 max 个，淘汰最久未访问）是实现层的加分细节。',
    keys: ['组件实例缓存', 'activated/deactivated', 'include/exclude', 'LRU'],
    src: 'Vue框架面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'vue-011',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: '$nextTick 的原理和作用是什么？data 中对象新增属性会发生什么？',
    ans: `**面试回答：**

**$nextTick**：
- **作用**：在**下次 DOM 更新循环结束之后**执行回调，常用于“修改数据后需要读取/操作更新后的 DOM”的场景（读取尺寸、聚焦输入框、初始化图表）；
- **原理**：Vue 的 DOM 更新是**异步批量**的——数据变化后 Watcher 不会立即渲染，而是把更新推入队列，在 nextTick 的回调时机统一执行（微任务 Promise.then，降级方案 setImmediate/MessageChannel/setTimeout）。$nextTick 就是把回调插到这个更新队列之后，保证 DOM 已更新。

**data 中给对象新增属性**（Vue2）：新增属性没有 getter/setter，**不会触发视图更新**。解决方式：\`Vue.set(obj, key, value)\`、\`this.$forceUpdate()\`（强制重渲染，不推荐）、或预先在 data 中声明所有属性 / 整体替换对象。Vue3 的 Proxy 天然支持新增属性。`,
    ana: 'nextTick 回答闭环：异步批量更新（性能）→ nextTick 保证时序。',
    keys: ['异步批量更新', '微任务', 'Vue.set'],
    src: 'Vue框架面试题.md',
  },
  {
    id: 'vue-012',
    type: 'essay',
    diff: 'medium',
    sub: '组件基础',
    q: '为什么组件的 data 必须是一个函数？子组件可以直接修改父组件的数据吗？',
    ans: `**面试回答：**

**data 为什么是函数**：组件是**可复用**的实例。如果 data 是对象，所有实例会**共享同一个对象引用**，一个实例修改数据会影响所有实例（类似引用类型的赋值）。写成函数，每次创建组件时返回一个**全新的独立数据副本**，实例间互不影响。根实例只创建一次，所以可以用对象。

**子组件能否直接改父组件数据**：不能。Vue 的数据流是**单向的**（props 向下、事件向上），直接修改 props 会破坏数据流向、让状态变化难以追踪，Vue 也会警告。正确做法：
1. 子组件通过 \`$emit\` 事件让父组件修改；
2. Vue3 的 v-model 双向绑定（modelValue + update:modelValue）；
3. 对象/数组类型的 props 内容变化可以“生效”，但那是修改了父组件的数据源，不是修改 props 本身，属于反模式；
4. props 传引用类型时子组件“能改内容但不能改引用”，同样不建议。`,
    ana: '追问 extend：Vue.extend 创建组件构造器时同样依赖 data 函数保证独立状态。',
    keys: ['实例隔离', '单向数据流', '$emit'],
    src: 'Vue框架面试题.md',
  },

  // ============ 生命周期 ============
  {
    id: 'vue-013',
    type: 'essay',
    diff: 'easy',
    sub: '生命周期',
    q: '说一下 Vue 的生命周期，created 和 mounted 的区别是什么？请求一般发在哪个阶段？',
    ans: `**面试回答：**

**Vue3 组合式 API 的顺序**：
\`setup\` → \`onBeforeMount\` → \`onMounted\` → \`onBeforeUpdate\` → \`onUpdated\` → \`onBeforeUnmount\` → \`onUnmounted\`

（对应 Vue2 的 beforeCreate/created/beforeMount/mounted/beforeUpdate/updated/beforeDestroy/destroyed）

**created vs mounted**：
- **created**：实例创建完成，**data/methods 可用，DOM 还没渲染**；
- **mounted**：**DOM 已挂载**，可以访问 $el、初始化依赖 DOM 的第三方库（图表、编辑器）。

**请求时机**：一般放在 **created（或 setup）**——更早拿到数据减少等待，且 SSR 场景只有 created 支持；如果请求结果需要依赖 DOM（如基于容器尺寸绘图）或需要 $nextTick 后操作，则放 mounted。**不要在 updated 里发请求或改数据**，容易触发循环更新。

**onUnmounted 必须清理**：定时器、事件监听、SSE/WebSocket 连接、Observer 实例。`,
    ana: '父子组件生命周期顺序：父 beforeMount → 子 mounted → 父 mounted（挂载阶段子组件先完成）。',
    keys: ['created 无 DOM', 'mounted 可操作 DOM', 'onUnmounted 清理'],
    src: 'Vue框架面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'vue-014',
    type: 'single',
    diff: 'medium',
    sub: '生命周期',
    q: 'Vue 中父组件渲染包含子组件时，mounted 的执行顺序是？',
    opts: [
      '父组件 mounted 先于子组件 mounted',
      '子组件 mounted 先于父组件 mounted',
      '同时执行',
      '随机顺序',
    ],
    ans: 'B',
    ana: '挂载阶段顺序为：父 created → 父 beforeMount → 子 created → 子 beforeMount → 子 mounted → **父 mounted**。父组件的 mounted 要等所有子组件挂载完成才触发。销毁阶段相反：父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted。',
    keys: ['子先挂载完成', '父 mounted 收尾'],
    src: 'Vue框架面试题.md',
  },

  // ============ 组件通信 ============
  {
    id: 'vue-015',
    type: 'essay',
    diff: 'easy',
    sub: '组件通信',
    q: 'Vue 组件之间有哪些通信方式？分别适用什么场景？',
    ans: `**面试回答：**按关系分类：

1. **父子**：父传子用 **props**；子传父用 **$emit** 事件；父访问子用 **ref / $refs**；子访问父用 **$parent**；
2. **跨层级（祖孙）**：**provide / inject**（祖先 provide，后代 inject），适合主题、国际化等；深层嵌套避免 props 逐层传递（props drilling）；
3. **任意组件（全局）**：**Pinia / Vuex** 状态管理，适合共享的业务状态；
4. **兄弟组件**：状态提升到共同父组件，或直接用 Pinia；
5. **事件总线 EventBus**（$emit/$on 的 mitt）：只适合**少量、明确的跨组件通知**，不要替代正常状态管理，事件多了难以追踪；
6. **$attrs / $listeners**（Vue3 合并为 $attrs）：透传未声明的属性与事件，封装二次包装组件常用；
7. v-model：父子双向绑定的语法糖。

**原则**：props/emit 是首选，跨层用 provide/inject，全局共享用 Pinia，避免滥用总线导致数据流混乱。`,
    ana: 'Vue3 移除了 $children 和 $on/$off（EventBus 需用 mitt）。',
    keys: ['props/$emit', 'provide/inject', 'Pinia', '$attrs 透传'],
    src: 'Vue框架面试题.md / 问答类型面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'vue-016',
    type: 'single',
    diff: 'medium',
    sub: '组件通信',
    q: '在祖先组件 provide 了主题数据，深层子孙组件最合适的接收方式是？',
    opts: [
      '每层组件都用 props 逐层传递',
      'inject 注入祖先 provide 的数据',
      '用 $children 遍历查找',
      '把主题写到 window 上',
    ],
    ans: 'B',
    ana: 'provide/inject 就是解决跨层级依赖注入的：祖先 provide 数据/方法，任意后代 inject 直接获取，避免 props drilling。注意 provide 的响应式要传 ref/computed（Vue3），且它更适合“低频变更的全局配置”，不是替代状态管理。',
    keys: ['provide/inject', '依赖注入', 'props drilling'],
    src: 'Vue框架面试题.md',
  },

  // ============ Vue Router ============
  {
    id: 'vue-017',
    type: 'essay',
    diff: 'medium',
    sub: 'Vue Router',
    q: '路由的 hash 模式和 history 模式有什么区别？history 模式刷新需要服务端配置什么？',
    ans: `**面试回答：**

**hash 模式**：
- URL 带 \`#\`，如 \`/#/user?id=1\`；
- 原理：监听 \`hashchange\` 事件，hash 变化**不会向服务器发请求**；
- 优点：**刷新无需服务端配置**、部署简单；缺点：URL 不美观、SEO 弱（锚点语义冲突）。

**history 模式**：
- URL 自然无 #，基于 **History API**（pushState/replaceState）+ \`popstate\` 事件；
- 刷新或直接访问非根路径时浏览器会**向服务器请求该路径**，服务器没有对应文件就 404——所以需要服务端把所有路由回退到 index.html：
\`\`\`nginx
location / {
  try_files $uri /index.html;
}
\`\`\`

**$route vs $router**：$router 是路由器实例（push/replace/back，编程式导航）；$route 是当前路由信息对象（params/query/path/meta）。

**params vs query**：params 配合动态路由 /user/:id，刷新可能丢失（不写进 path 时）；query 是 ?key=value，保留在 URL 中。`,
    ana: '动态权限路由追问：登录拿权限 → 过滤路由表 → router.addRoute 动态注册 → 首次跳转处理 → 退出时重置。',
    keys: ['hashchange', 'pushState', 'try_files', '$route/$router'],
    src: 'Vue框架面试题.md / 问答类型面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'vue-018',
    type: 'essay',
    diff: 'medium',
    sub: 'Vue Router',
    q: 'Vue Router 有哪些导航守卫？路由懒加载怎么实现？',
    ans: `**面试回答：**

**导航守卫分三类**：
1. **全局**：\`beforeEach\`（鉴权、登录校验、动态路由注册）、\`beforeResolve\`、\`afterEach\`（设置页面标题、埋点）；
2. **路由独享**：路由配置里的 \`beforeEnter\`；
3. **组件内**：\`beforeRouteEnter\`（beforeEnter 之前调用，此时实例未创建，要通过 next 回调访问 this）、\`beforeRouteUpdate\`（同组件路由参数变化）、\`beforeRouteLeave\`（离开确认，如未保存表单）。

**守卫与生命周期关系**：完整顺序是 beforeEach → beforeEnter → 组件内守卫 → 全局 beforeResolve → 导航确认 → afterEach → 组件 beforeCreate/created → beforeMount → beforeRouteEnter 的 next 回调 → mounted。

**路由懒加载**：把组件写成动态 import，构建时自动代码分割成独立 chunk，进入路由才加载：
\`\`\`js
const routes = [
  { path: '/about', component: () => import('../views/About.vue') },
]
\`\`\`
配合 webpackChunkName 注释可以命名分包。这是首屏加载优化的标准手段。`,
    ana: 'beforeRouteEnter 中访问实例用 next(vm => {...})，因为组件创建前调用。',
    keys: ['beforeEach 鉴权', 'beforeRouteUpdate', '动态 import 分包'],
    src: 'Vue框架面试题.md',
  },

  // ============ Vuex / Pinia ============
  {
    id: 'vue-019',
    type: 'essay',
    diff: 'medium',
    sub: '状态管理',
    q: '说一下 Vuex 的原理和核心属性。action 和 mutation 的区别是什么？为什么 mutation 不能做异步操作？',
    ans: `**面试回答：**

**Vuex 原理**：Vuex 利用 Vue 实例的响应式系统，把 state 作为**响应式数据**集中存储在 Store 中，组件通过 computed 读取（依赖收集），通过 dispatch/commit 修改（统一入口），保证状态变化可追踪。插件 devtools 通过订阅 mutation 记录状态快照实现时间旅行调试。

**五个核心属性**：
- **state**：单一状态树；**getters**：派生计算（类似 computed，有缓存）；
- **mutations**：**同步**修改 state 的唯一入口；**actions**：提交 mutation，可包含**异步**操作；
- **modules**：模块化拆分（命名空间 namespaced）。

**action vs mutation**：mutation 直接改 state 且必须同步；action 处理异步/业务逻辑后 commit mutation。devtools 只能快照同步 mutation，**异步放在 mutation 里会让状态变化时机不可追踪、devtools 无法记录**，所以 mutation 必须同步。

**Vuex vs localStorage**：Vuex 是内存中的响应式运行时状态（刷新丢失），localStorage 是持久化存储（无响应式）；两者配合可实现状态持久化。

**Vuex vs Pinia**：Pinia 更轻、天然 TS 支持、无 mutation（action 直接改）、支持组合式写法，是 Vue3 官方推荐。`,
    ana: 'Redux 和 Vuex 共同思想：单一数据源、状态可预测、集中管理。区别：Redux 单向数据流更严格、中间件生态（thunk/saga）、immutable。',
    keys: ['单一状态树', '同步 mutation', 'devtools 快照', 'Pinia 对比'],
    src: 'Vue框架面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'vue-020',
    type: 'essay',
    diff: 'easy',
    sub: 'Vue 基础',
    q: '对 SPA 单页应用的理解？优缺点是什么？',
    ans: `**面试回答：**SPA（Single Page Application）只有一张 HTML 页面，跳转时**不重新请求整页**，由前端路由切换视图、按需加载 JS。

**优点**：
1. 用户体验好，页面切换无刷新、流畅；
2. 前后端职责分离，后端只提供 API；
3. 组件化开发、状态共享方便；
4. 可以做过渡动画、局部更新。

**缺点**：
1. **首屏加载慢**：首次要加载整包 JS/CSS（可用路由懒加载、代码分割缓解）；
2. **SEO 不友好**：内容靠 JS 渲染，爬虫抓取困难（可用 SSR/预渲染解决）；
3. 前进后退路由管理复杂（需要 History API / hash 方案）；
4. 对 JS 质量要求高，容易内存泄漏（切换页面时要清理副作用）。

与之相对的 MPA 多页应用每次跳转都重新请求整页，首屏快、SEO 好，但体验割裂。`,
    ana: 'SPA 缺点要紧跟对应解法：懒加载/分包 → 首屏慢；SSR/预渲染 → SEO。',
    keys: ['无刷新切换', '首屏慢', 'SEO 弱', 'SSR'],
    src: 'Vue框架面试题.md',
  },

  // ============ 虚拟 DOM ============
  {
    id: 'vue-021',
    type: 'essay',
    diff: 'medium',
    sub: '虚拟 DOM 与 Diff',
    q: '对虚拟 DOM 的理解？虚拟 DOM 一定比直接操作真实 DOM 性能好吗？',
    ans: `**面试回答：**

**虚拟 DOM**：用 JS 对象描述真实 DOM 结构（标签、属性、子节点、key），如 \`{ tag: "div", props: {...}, children: [...] }\`。

**解析过程**：模板编译 → render 函数 → 生成虚拟 DOM 树 → 数据变化时生成**新树** → **Diff 算法**对比新旧两棵树的最小差异 → **patch** 只更新变化的真实 DOM。

**为什么引入虚拟 DOM**：
1. **减少手动 DOM 操作**，声明式开发；
2. **批量、最小化更新**，避免频繁回流重绘；
3. **跨平台**：虚拟 DOM 是 JS 对象，可以渲染到 Web DOM、SSR 字符串、原生组件（React Native、Weex）；
4. 提供组件化抽象的基础。

**性能是否一定更好**：**不一定**。虚拟 DOM 有生成和 Diff 的 JS 计算开销；直接手写精准的 DOM 操作理论上更快。虚拟 DOM 的价值在于**在可维护性和性能之间取得平衡**：它保证“不写手动优化的前提下也足够快”（中上水平），把开发者从精细 DOM 操作中解放出来。内容大量变化、无法预知更新位置的场景，虚拟 DOM 优势明显。`,
    ana: '标准答案：虚拟 DOM 性能不是最快，是“保底不差”，同时换来声明式与跨平台。',
    keys: ['JS 对象描述 DOM', 'Diff + patch', '跨平台', '保底性能'],
    src: 'Vue框架面试题.md / React框架面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'vue-022',
    type: 'essay',
    diff: 'hard',
    sub: '虚拟 DOM 与 Diff',
    q: 'Vue 的 Diff 算法是如何工作的？有哪些核心优化策略？为什么不建议用 index 作为 key？',
    ans: `**面试回答：**

**Diff 的工作方式**：
1. 只做**同层级比较**，不跨层对比（跨层移动视为删除+重建）；
2. 新旧节点标签或 key 不同，直接**替换**整棵子树；
3. 相同节点则复用，对比 props 更新，再递归比较子节点。

**Vue2 的双端 Diff**：维护新旧列表的**头尾四个指针**，每次循环从“旧头新头、旧尾新尾、旧头新尾、旧尾新头”四种匹配尝试，找到可复用节点就移动指针，都不匹配再按 key 查找。减少节点移动次数。

**Vue3 的快速 Diff**：预处理——先从头同步比较相同前缀、从尾同步比较相同后缀，中间部分基于**最长递增子序列（LIS）**计算最少 DOM 移动。

**key 的作用与 index 的问题**：key 是节点的**唯一身份标识**，帮助 Diff 正确判断“复用还是重建”。
用 **index 作 key** 的问题：列表插入、删除、排序后，同一 index 对应的**数据变了**，Vue 会误以为“节点没变只是内容变”，导致：
1. 不必要的更新（性能浪费）；
2. **状态错位**：输入框内容、选中态、组件内部状态串到别的数据上；
3. 带过渡动画时移动错误。

正确做法：用数据的唯一 id 作 key。`,
    ana: 'Vue2 双端 Diff（四指针）与 Vue3 LIS 是核心区分点；index key 的“状态错位”要举例（输入框）。',
    keys: ['同层比较', '双端 Diff', '最长递增子序列', 'key 唯一标识'],
    src: 'Vue框架面试题.md / 问答类型面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'vue-023',
    type: 'essay',
    diff: 'medium',
    sub: 'Vue 性能优化',
    q: '常见的 Vue 性能优化方法有哪些？',
    ans: `**面试回答：**分三层：

**编译/加载层**：
1. **路由懒加载**：动态 import 分包，减小首屏包体；
2. 组件异步加载：defineAsyncComponent / React.lazy 对应能力；
3. 开启 Tree Shaking、按需引入组件库（Element Plus 自动导入）；
4. 骨架屏提升感知速度。

**运行时层**：
1. **v-for 必须加唯一 key**（不用 index）；
2. **v-show 替代 v-if**（频繁切换场景）；
3. **computed 缓存**替代方法调用；
4. 长列表用**虚拟滚动**（vue-virtual-scroller），避免大量 DOM；
5. **shallowRef/shallowReactive** 优化大对象深层响应（如大数据表格）；
6. 第三方库实例（图表、编辑器）避免被 reactive 深层代理（markRaw/shallowRef）；
7. 事件、定时器在 unmount 时清理，防止内存泄漏；
8. 图片懒加载、防抖节流。

**工程层**：开启 gzip/brotli、CDN、HTTP 缓存、keep-alive 缓存页面组件、按需 polyfill。`,
    ana: 'shallowRef 与 markRaw 是 Vue3 特有加分项；提到“服务端分页、整表深层响应”能体现表格优化经验。',
    keys: ['路由懒加载', '虚拟滚动', 'shallowRef', 'keep-alive'],
    src: 'Vue框架面试题.md / 前端性能优化.md',
  },
  {
    id: 'vue-024',
    type: 'judge',
    diff: 'medium',
    sub: '组件基础',
    q: 'Vue 的 template 会被编译成 render 函数，运行时通过执行 render 函数生成虚拟 DOM，这个过程在 Vue3 的 SFC 预编译下通常在构建阶段完成。',
    ans: true,
    ana: 'Vue 模板编译流程：template → AST（parse）→ 优化标记静态节点/patchFlag（transform）→ render 函数（generate）。使用 vue-loader/vite plugin 的 SFC 在**构建时预编译**，运行时只需要包含 render 的版本（runtime-only 更小更快）；通过完整版或运行时编译 template 则在浏览器里编译。',
    keys: ['AST', 'render 函数', '预编译', 'runtime-only'],
    src: 'Vue框架面试题.md',
  },
  {
    id: 'vue-025',
    type: 'essay',
    diff: 'medium',
    sub: 'Vue 基础',
    q: '如何保存页面的当前状态？简述 mixin 的覆盖逻辑。',
    ans: `**面试回答：**

**保存页面状态的方式**：
1. **keep-alive**：缓存组件实例，最直接；
2. **路由离开前存入 Pinia/Vuex**，返回时恢复；
3. **localStorage/sessionStorage** 持久化筛选条件、表单草稿（刷新也能恢复）；
4. 路由 query 参数保存列表状态（分页、筛选可分享、可回退）；
5. vuex-persistedstate 等插件自动持久化。

**mixin 的覆盖逻辑**：
- **数据对象**：递归合并，**组件自身 data 优先**（覆盖 mixin 中同名）；
- **生命周期钩子**：**合并为数组，mixin 的钩子先执行**，组件的后执行；
- **methods/components/指令**等对象选项：**组件的同名覆盖 mixin**；
- 问题：命名冲突、来源不清晰、隐式依赖——所以 Vue3 推荐用**组合式函数**替代 mixin。`,
    ana: 'mixin 钩子先于组件钩子执行是易错点；组合式函数的“显式导入 + 命名空间隔离”是替代方案。',
    keys: ['keep-alive', 'query 持久化', 'mixin 合并策略', '组合式函数'],
    src: 'Vue框架面试题.md',
  },

  {
    id: 'vue-026',
    type: 'multiple',
    diff: 'easy',
    sub: '组件通信',
    q: '下列哪些是 Vue 组件间的**常用通信方式**？（多选）',
    opts: ['props / $emit', 'provide / inject', 'Pinia 状态管理', 'useReducer + Context'],
    ans: ['A', 'B', 'C'],
    ana: 'Vue 通信方式：props/$emit（父子）、provide/inject（跨层级）、Pinia/Vuex（全局）、ref/$refs、$parent/$children（Vue2）、$attrs 透传、v-model 语法糖、事件总线（mitt，慎用）。useReducer + Context 是 **React** 的方案，不是 Vue 的。原则：props/emit 首选，跨层用 provide/inject，全局共享用 Pinia。',
    keys: ['props/$emit', 'provide/inject', 'Pinia'],
    src: 'Vue框架面试题.md / 知识点快速复习指南.md',
  },
  {
    id: 'vue-027',
    type: 'multiple',
    diff: 'medium',
    sub: 'Vue 基础',
    q: '下列哪些属于 **Vue3 的更新内容**？（多选）',
    opts: ['Composition API（组合式 API）', '响应式改用 Proxy', '支持 Fragment（多根节点）', '新增 mixin 机制'],
    ans: ['A', 'B', 'C'],
    ana: 'Vue3：Composition API（逻辑按功能组合、复用从 mixin 变成组合式函数）、Proxy 响应式（监听新增/删除属性和数组变化）、Fragment 多根节点、Teleport、Suspense、更好的 TS 支持、编译优化（静态提升、PatchFlag）。**mixin 是 Vue2 就有的机制**，Vue3 反而推荐用组合式函数替代它。',
    keys: ['Composition API', 'Proxy', 'Fragment'],
    src: '一些高频率考点.md / 收集的面试知识点.md',
  },
]
