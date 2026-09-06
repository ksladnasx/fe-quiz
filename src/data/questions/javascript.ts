import type { RawQuestion } from '../../types'

/**
 * JavaScript 题库
 * 来源：docs/从零开始的前端面试题.md（JavaScript 数据类型/ES6/基础）、
 *       docs/收集的面试知识点.md、docs/面试问答.md、docs/前端面试八股文.md、
 *       docs/一些高频率考点.md、docs/问答类型面试题.md
 */
export const javascriptQuestions: RawQuestion[] = [
  // ============ 数据类型 ============
  {
    id: 'js-001',
    type: 'single',
    diff: 'easy',
    sub: '数据类型',
    q: 'JavaScript 中以下哪个属于基本（原始）数据类型？',
    opts: ['Object', 'Array', 'Symbol', 'Function'],
    ans: 'C',
    ana: 'JS 基本数据类型有 7 种：**Undefined、Null、Boolean、Number、String、Symbol（ES6 新增）、BigInt（ES2020 新增）**。Object 是引用类型，Array、Function、Date、RegExp 等都属于 Object 的子类型。可用 typeof 检测：基本类型中除 null 外都能正确返回；函数返回 "function"，其余对象返回 "object"。',
    keys: ['7 种基本类型', 'Symbol/BigInt', '引用类型'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'js-002',
    type: 'essay',
    diff: 'easy',
    sub: '数据类型',
    q: 'JavaScript 有哪些数据类型？它们的区别是什么？',
    ans: `**面试回答：**分为两大类：

- **基本类型（7 种）**：Undefined、Null、Boolean、Number、String、Symbol、BigInt。存储在**栈**中，按**值**访问，赋值时是值的拷贝；
- **引用类型**：Object（包括 Array、Function、Date、RegExp、Map、Set 等）。存储在**堆**中，变量保存的是**引用地址**，赋值时拷贝的是地址，两个变量会指向同一个对象。

区别的本质是：基本类型的值不可变且比较按值；引用类型可变、比较按引用地址。`,
    ana: '可追问 typeof null === "object"（历史遗留 bug，Java 式值类型标记），判断数组用 Array.isArray。',
    keys: ['栈与堆', '值访问 vs 引用访问', 'Symbol/BigInt'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'js-003',
    type: 'essay',
    diff: 'medium',
    sub: '数据类型',
    q: '数据类型检测的方式有哪些？各自的特点和局限是什么？',
    ans: `**面试回答：**

1. **typeof**：返回类型字符串。能区分基本类型（除 null 外）和 function；但 \`typeof null === "object"\`（历史 bug），对象和数组都返回 "object"；
2. **instanceof**：检测对象是否是某构造函数的实例，基于**原型链**查找。能区分数组、日期等对象类型，但**无法检测基本类型**，且跨 iframe 等多全局环境会失准；
3. **Object.prototype.toString.call()**：最通用准确，返回 \`[object Array]\`、\`[object Null]\` 等，基本类型和内置对象都能正确检测；
4. **Array.isArray()**：判断数组的专用可靠方法；
5. **constructor**：可判断构造函数来源，但 null/undefined 没有 constructor，且构造函数被改写后会失准。

面试一般按“typeof → instanceof → toString.call”的演进顺序回答。`,
    ana: 'instanceof 手写实现是高频追问：沿 Object.getPrototypeOf 向上查找是否等于构造函数的 prototype。',
    keys: ['typeof null 是 object', '原型链检测', 'toString.call'],
    src: '从零开始的前端面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'js-004',
    type: 'essay',
    diff: 'medium',
    sub: '数据类型',
    q: 'null 和 undefined 有什么区别？为什么 0.1 + 0.2 !== 0.3？',
    ans: `**面试回答：**

**null 与 undefined**：
- \`undefined\` 表示“**未定义**”：变量声明未赋值、函数无返回值、对象不存在的属性、函数参数未传，都是 undefined；
- \`null\` 表示“**空值**”，是一个有意的空对象引用，常用于主动清空引用（如释放对象）、DOM 查询不到时返回 null；
- \`null == undefined\` 为 true（宽松相等特殊规则），\`null === undefined\` 为 false；typeof null 是 "object"（历史遗留），typeof undefined 是 "undefined"。

**0.1 + 0.2 !== 0.3**：JS 的 Number 采用 **IEEE 754 双精度浮点数（64 位）**存储，二进制无法精确表示 0.1 和 0.2 这样的十进制小数，相加产生精度误差。解决方式：
- \`(0.1 + 0.2).toFixed(2)\`（注意 toFixed 返回字符串）；
- \`Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON\`；
- 需要精确计算用整数字化（乘以 10^n）或 decimal.js 这类库。`,
    ana: '两个经典题合并作答。EPSILON 是 Number 的最小精度，用于浮点比较。',
    keys: ['未定义 vs 空值', 'IEEE 754', 'Number.EPSILON'],
    src: '从零开始的前端面试题.md / 面试问答.md',
  },
  {
    id: 'js-005',
    type: 'judge',
    diff: 'easy',
    sub: '数据类型',
    q: 'typeof NaN 的结果是 "number"，且 NaN 与任何值（包括自身）都不相等。',
    ans: true,
    ana: 'NaN 全称 Not a Number 但类型是 number；NaN === NaN 为 false，这是 IEEE 754 规范定义。判断 NaN 要用 **Number.isNaN()**（只对真正的 NaN 返回 true），而全局 isNaN() 会先做隐式转换（如 isNaN("abc") 为 true），两者区别是高频考点。',
    keys: ['typeof NaN', 'Number.isNaN', 'isNaN 隐式转换'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'js-006',
    type: 'essay',
    diff: 'medium',
    sub: '数据类型',
    q: 'Object.is() 与 ==、=== 的区别是什么？',
    ans: `**面试回答：**

- \`==\`：宽松相等，比较前会进行**隐式类型转换**，如 \`"1" == 1\` 为 true，规则复杂易出错，开发中不推荐；
- \`===\`：严格相等，类型不同直接 false；但有两个特例：\`NaN === NaN\` 为 false、\`+0 === -0\` 为 true；
- \`Object.is()\`：在 === 基础上修正了两个特例：\`Object.is(NaN, NaN)\` 为 **true**、\`Object.is(+0, -0)\` 为 **false**，行为更符合“同值相等”的直觉。

React 里对比依赖数组的 Object.is 语义、Vue3 响应式中判断值是否变化都用到了类似逻辑。`,
    ana: '记忆：Object.is 修了 === 的两个边界：NaN 相等、±0 不等。',
    keys: ['隐式转换', 'NaN 不等于自身', '+0 与 -0'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'js-007',
    type: 'essay',
    diff: 'medium',
    sub: '数据类型',
    q: 'Object.assign 和扩展运算符是深拷贝还是浅拷贝？两者的区别是什么？深拷贝怎么做？',
    ans: `**面试回答：**两者都是**浅拷贝**：只复制对象第一层的属性值，如果属性值是引用类型，复制的是引用地址，嵌套对象仍然共享。

**区别**：
- \`Object.assign(target, ...sources)\` 会把源对象属性合并到 target 上，**target 本身被修改**并返回；
- 扩展运算符 \`{ ...obj }\` 创建**新对象**返回，不修改原对象；后者语法更简洁，还能拷贝 Symbol 属性（两者都能拷贝可枚举属性）。

**深拷贝方案**：
1. \`JSON.parse(JSON.stringify(obj))\`：简单但有明显缺陷——丢失 **undefined、函数、Symbol**；\`Date\` 变字符串；**循环引用直接报错**；NaN/Infinity 变 null；丢失原型；
2. \`structuredClone(obj)\`：浏览器原生，支持循环引用和大部分内置类型，但**不能拷贝函数**；
3. **递归实现**：根据数据类型选择拷贝策略，用 **WeakMap 记录已访问对象**解决循环引用，这是面试推荐的手写方案；
4. 生产可用 lodash 的 \`cloneDeep\`。`,
    ana: '答出 JSON 方案的缺陷清单 + WeakMap 解决循环引用的思路，基本满分。',
    keys: ['浅拷贝', 'JSON.stringify 缺陷', 'WeakMap 循环引用', 'structuredClone'],
    src: '从零开始的前端面试题.md / 知识点快速复习指南.md / 面试问答.md',
  },
  {
    id: 'js-008',
    type: 'essay',
    diff: 'easy',
    sub: '数据类型',
    q: '数组去重有哪些方法？如何判断数组方法会不会改变原数组？',
    ans: `**面试回答：**

**去重**：
1. \`[...new Set(arr)]\`：最简洁，适合基本类型数组；
2. \`Array.from(new Set(arr))\`：等价写法；
3. \`filter + indexOf\`：\`arr.filter((item, i) => arr.indexOf(item) === i)\`；
4. 对象数组按字段去重：用 **Map** 以业务字段为 key 记录。

**会改变原数组的方法（7 个）**：push、pop、shift、unshift、splice、sort、reverse（以及 ES6 的 copyWithin、fill）；
**不改变原数组**：slice、concat、map、filter、forEach、find、findIndex、some、every、join、flat、includes 等。

记忆点：sort 默认按**字符串 Unicode 码位**排序，数字排序要传比较器 \`(a, b) => a - b\`。`,
    ana: '“哪些方法改变原数组”是 docs 中专门整理的高频题，7 个改变原数组的方法要记牢。',
    keys: ['new Set', 'splice 改变原数组', 'sort 比较器'],
    src: '知识点快速复习指南.md / 问答类型面试题.md',
  },

  // ============ ES6 ============
  {
    id: 'js-009',
    type: 'essay',
    diff: 'easy',
    sub: 'ES6',
    q: 'let、const、var 的区别是什么？',
    ans: `**面试回答：**主要区别在四点：

1. **作用域**：var 只有函数作用域；let/const 有**块级作用域**（{} 内有效）；
2. **变量提升**：var 声明会提升并初始化为 undefined；let/const 也会提升创建，但**不会初始化**，声明前访问进入**暂时性死区（TDZ）**，直接报 ReferenceError；
3. **重复声明**：var 可以重复声明，let/const 同一作用域不允许；
4. **const**：声明时必须初始化，且**引用不可重新赋值**——但对象/数组**内容仍可修改**（如 const obj 的属性），真正不可变要用 Object.freeze（浅冻结）。

另外 var 在全局声明会挂到 window 上，let/const 不会。`,
    ana: 'const 对象属性可以修改是易错点：const 约束的是“绑定引用”而非“值”。',
    keys: ['块级作用域', '暂时性死区', 'const 引用不可变'],
    src: '从零开始的前端面试题.md / 面试问答.md',
  },
  {
    id: 'js-010',
    type: 'essay',
    diff: 'easy',
    sub: 'ES6',
    q: '箭头函数与普通函数的区别有哪些？',
    ans: `**面试回答：**

1. **this**：箭头函数**没有自己的 this**，捕获**定义时外层作用域**的 this 且不可改变（call/apply/bind 无法修改）；
2. **不能作为构造函数**：没有 [[Construct]] 内部方法和 **prototype** 属性，\`new\` 调用直接报错；
3. **没有 arguments**：可用 rest 参数 \`(...args)\` 替代；
4. **不能用作 Generator**：没有 yield 能力；
5. **语法差异**：单表达式可省略 return，永远匿名。

**适用**：需要继承外层 this 的回调（如 setTimeout、数组方法）；
**不适用**：对象方法（this 指向会丢失）、原型方法、需要动态 this 的 DOM 事件处理（需要事件.currentTarget 时）。`,
    ana: '“new 一个箭头函数会怎样”——报错，因为箭头函数没有 prototype 和内部 [[Construct]]。',
    keys: ['词法 this', '无 prototype', '不能 new', 'rest 参数'],
    src: '从零开始的前端面试题.md / 面试问答.md',
  },
  {
    id: 'js-011',
    type: 'single',
    diff: 'medium',
    sub: 'ES6',
    q: '```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 1000);\n}\n```\n输出结果是什么？',
    opts: [
      '1 2 3（间隔 1 秒依次输出）',
      '3 3 3（约 1 秒后输出三个 3）',
      '1 2 3（立即输出）',
      '3 3 3（立即输出）',
    ],
    ans: 'B',
    ana: 'var 声明的 i 是全局作用域内的同一个变量，循环结束后 i 为 3，三个回调共享它。setTimeout 的回调是宏任务，约 1 秒后依次入队执行，输出 3 3 3。把 var 换成 **let**（每次迭代创建新的块级绑定）即可输出 0 1 2；也可以用 IIFE 传参捕获。',
    keys: ['var 共享绑定', 'let 块级作用域', '宏任务时机'],
    src: '从零开始的前端面试题.md / 一些高频率考点.md',
  },
  {
    id: 'js-012',
    type: 'essay',
    diff: 'easy',
    sub: 'ES6',
    q: 'ES6 模块与 CommonJS 模块有什么异同？',
    ans: `**面试回答：**主要区别：

1. **加载时机**：CommonJS 是运行时**动态加载**（require 是普通函数调用）；ES6 模块是**编译时确定依赖关系**的静态结构，import/export 必须在顶层；
2. **输出方式**：CommonJS 输出的是**值的拷贝**（模块加载后内部变化不影响外部已获取的值）；ES6 输出的是**值的引用**（动态只读绑定，内部变化会反映到导入方）；
3. **this 指向**：CommonJS 顶层 this 指向当前模块；ES6 模块顶层 this 是 undefined；
4. **其他**：CommonJS 同步加载，主要用于 Node；ES6 支持按需编译、Tree Shaking（静态分析剔除未使用代码）、异步加载 import()。

Tree Shaking 依赖 ES6 模块的静态性，这也是工程化面试的衔接点。`,
    ana: '值拷贝 vs 值引用 + 静态 vs 动态是核心，Tree Shaking 是常见延伸。',
    keys: ['静态 vs 动态', '值引用', 'Tree Shaking'],
    src: '从零开始的前端面试题.md / 前端面试八股文.md',
  },
  {
    id: 'js-013',
    type: 'essay',
    diff: 'easy',
    sub: 'ES6',
    q: '扩展运算符和解构赋值分别有什么作用？使用场景举例。',
    ans: `**面试回答：**

**扩展运算符（...）**：
- 数组/对象展开合并：\`[...arr1, ...arr2]\`、\`{ ...defaults, ...options }\`（常用于对象浅拷贝与默认值合并）；
- 函数调用展开：\`Math.max(...nums)\`；
- rest 参数收集：\`function fn(a, ...rest)\`；
- 可迭代对象转数组，如 \`[...document.querySelectorAll("div")]\`。

**解构赋值**：
- 数组解构按位置、对象解构按属性名，可设置默认值 \`const { name = "anon" } = user\`；
- 重命名 \`const { name: userName } = user\`；
- **嵌套解构**提取深层数据：\`const { data: { list } } = res\`；
- 交换变量、函数多返回值、函数参数默认值解构。

React 函数组件 \`const { value, onChange } = props\`、Redux 的 \`...state\` 不可变更新都是典型场景。`,
    ana: '扩展运算符是浅拷贝——嵌套对象仍然共享引用，这点容易被追问。',
    keys: ['浅拷贝合并', 'rest 参数', '嵌套解构'],
    src: '从零开始的前端面试题.md',
  },

  // ============ 原型 / 作用域 / 闭包 / this ============
  {
    id: 'js-014',
    type: 'essay',
    diff: 'medium',
    sub: '原型与原型链',
    q: '谈谈你对原型和原型链的理解。',
    ans: `**面试回答：**JavaScript 是基于**原型继承**的语言。

- 每个函数都有一个 \`prototype\`（显式原型）属性，指向一个对象，**作为该构造函数创建的实例的原型**；
- 每个对象都有一个 \`__proto__\`（隐式原型，规范访问方式是 \`Object.getPrototypeOf\`），指向**创建它的构造函数的 prototype**；
- 访问对象属性时，先找**自身属性**，找不到就沿 \`__proto__\` 向上查找，直到 \`Object.prototype\`，再往上就是 **null**，查找结束——这条链就是**原型链**。

**作用**：实现属性和方法的继承与共享，所有实例共享原型上的方法（节省内存）。instanceof 的原理就是检查构造函数的 prototype 是否出现在对象的原型链上。

需要注意直接修改 \`obj.__proto__\` 性能差，推荐 \`Object.create(proto)\` 或 class 语法。`,
    ana: '画图答题：fn.prototype ← __proto__ — obj；链终点 Object.prototype.__proto__ === null。',
    keys: ['prototype/__proto__', '属性查找', 'Object.prototype', 'instanceof 原理'],
    src: '面试问答.md / 从零开始的前端面试题.md',
  },
  {
    id: 'js-015',
    type: 'essay',
    diff: 'medium',
    sub: '闭包',
    q: '什么是闭包？有什么作用和使用场景？闭包有什么问题？',
    ans: `**面试回答：**闭包是指**函数能够访问其定义时所在作用域中的变量**，即使这个函数在该作用域之外执行——外部函数执行结束后，其作用域内的变量因为被内层函数引用而不会被销毁。

**常见用途**：
1. **数据封装 / 私有变量**：通过闭包保存计数状态，避免变量被外部直接修改；
2. **函数工厂**：根据参数生成定制函数；
3. **防抖、节流**：定时器变量保存在闭包中；
4. 柯里化、模块化（IIFE + 闭包）。

**需要注意的问题**：闭包会**长期持有变量引用**，如果使用不当（如事件监听未解绑、被闭包引用的大对象不释放），会**阻止垃圾回收导致内存泄漏**。因此不再需要的闭包应及时解除引用（置为 null、清除定时器、解绑监听）。

**面试回答版本（简短）**：闭包是指一个函数能够访问其定义时所在作用域中的变量，即使这个函数在该作用域之外执行。常见用途包括数据封装、函数工厂、防抖节流等。需要注意的是闭包会让变量常驻内存，使用不当可能造成内存泄漏。`,
    ana: '垃圾回收角度：引用计数/标记清除中，被闭包引用的对象标记为可达而无法回收。',
    keys: ['作用域引用', '私有变量', '内存泄漏', '防抖节流'],
    src: '一些高频率考点.md / 收集的面试知识点.md / 知识点快速复习指南.md',
  },
  {
    id: 'js-016',
    type: 'code',
    diff: 'medium',
    sub: '闭包',
    q: '写一个创建计数器的函数：调用 createCounter() 返回一个函数，每次调用返回的函数时计数 +1 并打印当前计数，外部无法直接修改计数。',
    ans: `\`\`\`js
function createCounter() {
  let count = 0 // 私有变量，只能通过返回的函数访问
  return function () {
    count += 1
    console.log(count)
    return count
  }
}

const counter = createCounter()
counter() // 1
counter() // 2
counter() // 3
// 外部无法访问 count，实现了数据封装
\`\`\`

**要点**：\`count\` 是闭包引用的外层变量，外部没有其他途径修改它；每次调用 \`createCounter()\` 会产生**独立的**计数器（各自的闭包作用域）。`,
    ana: '考察闭包的最典型应用：私有状态。追问点：多个计数器之间是否共享状态（不共享）。',
    keys: ['闭包私有变量', '独立作用域', '数据封装'],
    src: '一些高频率考点.md',
  },
  {
    id: 'js-017',
    type: 'essay',
    diff: 'medium',
    sub: 'this',
    q: 'JavaScript 中 this 的指向有哪些规则？',
    ans: `**面试回答：**按优先级从高到低：

1. **new 绑定**：指向新创建的实例对象；
2. **显式绑定**：\`call\` / \`apply\` / \`bind\` 指定的第一个参数（硬绑定）；
3. **隐式绑定**：**谁调用指向谁**，如 \`obj.fn()\` 中 this 是 obj；
4. **默认绑定**：独立函数调用，非严格模式指向 window，严格模式是 undefined；
5. **箭头函数**：**不适用以上规则**，没有自己的 this，继承**定义时外层作用域**的 this，且无法被 call/apply/bind 修改。

**易错点**：把对象方法赋值给变量再调用会丢失 this；定时器回调中的 this 默认是 window（箭头函数除外）；class 内部自动开启严格模式。`,
    ana: '优先级：new > 显式 > 隐式 > 默认；箭头函数是“定义时决定”，普通函数是“调用时决定”。',
    keys: ['默认/隐式/显式/new 绑定', '箭头函数词法 this'],
    src: '面试问答.md / 收集的面试知识点.md',
  },
  {
    id: 'js-018',
    type: 'essay',
    diff: 'easy',
    sub: 'this',
    q: 'call、apply、bind 的区别是什么？',
    ans: `**面试回答：**三者本质都是**改变函数的 this 指向**：

- **call(thisArg, arg1, arg2...)**：立即执行，参数**逐个**传递；
- **apply(thisArg, [argsArray])**：立即执行，参数以**数组**形式传递（适合参数不确定的场景，如 Math.max.apply(null, arr)）；
- **bind(thisArg, ...)**：**不立即执行**，返回一个**永久绑定 this**（还可以预设参数，即偏函数）的新函数，适合回调、事件处理中固定 this。

bind 返回的新函数被 new 调用时，绑定的 this 会失效，指向新实例（new 优先级更高）。`,
    ana: '手写 call/bind 是代码题高频：借 symbol 临时属性挂到 thisArg 上执行。',
    keys: ['call 逐个传参', 'apply 数组传参', 'bind 返回新函数'],
    src: '面试问答.md / 从零开始的前端面试题.md',
  },
  {
    id: 'js-019',
    type: 'code',
    diff: 'medium',
    sub: 'this',
    q: '手写实现 Function.prototype.call（不使用原生 call/apply/bind）。',
    ans: `\`\`\`js
Function.prototype.myCall = function (context, ...args) {
  // 处理 null/undefined 时指向全局，基本类型包装为对象
  context = context == null ? globalThis : Object(context)
  // 用 Symbol 保证 key 唯一，避免覆盖已有属性
  const fnKey = Symbol('fn')
  context[fnKey] = this // this 是调用 myCall 的函数
  const result = context[fnKey](...args)
  delete context[fnKey] // 清理临时属性
  return result
}

// 测试
function introduce(greeting) {
  return \`\${greeting}, 我是 \${this.name}\`
}
console.log(introduce.myCall({ name: '王涵' }, '你好')) // 你好, 我是 王涵
\`\`\`

**实现思路**：把函数临时挂到目标对象上调用（利用隐式绑定），执行后删除临时属性。apply 同理，只是参数直接展开数组；bind 则返回一个闭包包装的函数并保留原型的传递。`,
    ana: '核心是“隐式绑定 this”技巧 + Symbol 防 key 冲突。bind 的手写还要处理 new 调用与参数预置。',
    keys: ['隐式绑定', 'Symbol 临时属性', 'context 包装'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'js-020',
    type: 'essay',
    diff: 'medium',
    sub: '原型与原型链',
    q: 'new 操作符的实现原理是什么？',
    ans: `**面试回答：**\`new Fn(...)\` 的过程分四步：

1. **创建空对象**；
2. 把空对象的 \`__proto__\` 指向构造函数的 \`prototype\`，建立原型连接；
3. **执行构造函数**，把函数内部的 this 绑定为这个新对象，为实例添加属性；
4. **返回结果**：如果构造函数**显式返回了一个对象**，则返回该对象（覆盖默认返回）；否则返回新创建的对象。

手写实现：

\`\`\`js
function myNew(Fn, ...args) {
  const obj = Object.create(Fn.prototype) // 步骤 1+2
  const result = Fn.apply(obj, args) // 步骤 3
  return result instanceof Object ? result : obj // 步骤 4
}
\`\`\``,
    ana: 'Object.create 一步完成“创建对象+连接原型”。返回值判断要用 instanceof Object（函数返回基本类型时仍返回新对象）。',
    keys: ['Object.create', '绑定 this', '显式返回对象优先'],
    src: '从零开始的前端面试题.md / 面试问答.md',
  },
  {
    id: 'js-021',
    type: 'essay',
    diff: 'medium',
    sub: '作用域与执行上下文',
    q: '说一下执行上下文、作用域和作用域链的关系。为什么要进行变量提升？',
    ans: `**面试回答：**

- **执行上下文**：代码被执行前创建的环境，包含变量对象/词法环境、作用域链、this。分全局上下文、函数上下文、eval 上下文；
- **作用域**：变量可访问的范围，由**书写位置**决定（词法作用域/静态作用域），分全局、函数、块级作用域；
- **作用域链**：函数定义时就确定了的“由内向外查找变量”的路径，内部作用域可以访问外部作用域变量，找不到就到全局，再找不到报 ReferenceError。

**变量提升**：JS 代码执行前有**编译阶段**，会先创建执行上下文，把 var 声明和函数声明提前登记到变量环境中，让代码在声明前可用。它**方便了函数互相调用**（函数声明提升），但也导致了问题：变量未声明就使用不报错、函数表达式只有变量名提升、覆盖风险。let/const 引入暂时性死区就是为了修正这些问题。`,
    ana: '执行上下文生命周期：创建（提升/确定 this/作用域链）→ 执行 → 回收。',
    keys: ['词法作用域', '执行上下文创建阶段', '函数声明整体提升'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'js-022',
    type: 'essay',
    diff: 'hard',
    sub: '垃圾回收',
    q: 'V8 的垃圾回收机制是怎样的？哪些操作会造成内存泄漏？',
    ans: `**面试回答：**

**V8 垃圾回收**采用**分代回收**：
- **新生代（新生对象，空间小）**：使用 **Scavenge（Cheney）算法**，把空间分为 From 和 To 两块，存活对象从 From 复制到 To，然后空间角色互换；对象存活过两轮或空间占比过高会晋升到老生代；
- **老生代（存活久的对象，空间大）**：使用**标记清除（Mark-Sweep）**为主——从根对象（全局变量、调用栈等）出发标记所有可达对象，清除不可达的；为避免内存碎片，配合**标记整理（Mark-Compact）**把存活对象移到一端；
- 为避免长停顿，V8 还做了**增量标记、并发标记**等优化。

**常见内存泄漏**：
1. **未清除的定时器** setInterval/setTimeout；
2. **未解绑的事件监听**（组件卸载时 removeEventListener 缺失）；
3. **意外的全局变量**（未声明直接赋值）；
4. **闭包长期引用大对象**；
5. 脱离 DOM 的引用（JS 变量还持有已删除的 DOM 节点）；
6. 未清理的 console.log 打印大对象（devtools 打开时）。

内存泄漏指“不再需要的数据仍被引用，GC 无法释放”；栈溢出则是递归过深导致调用栈超限，两者概念不同。`,
    ana: '先讲分代模型（新生代 Scavenge / 老生代标记清除+整理），再列泄漏场景，最后区分内存泄漏与栈溢出。',
    keys: ['分代回收', 'Scavenge', '标记清除', '定时器泄漏'],
    src: '浏览器原理知识点.md / 一些高频率考点.md / 从零开始的前端面试题.md',
  },

  // ============ 异步编程 ============
  {
    id: 'js-023',
    type: 'essay',
    diff: 'medium',
    sub: '异步编程',
    q: '解释一下 JavaScript 的事件循环机制。宏任务和微任务分别有哪些？',
    ans: `**面试回答：**JS 是**单线程**语言，通过事件循环（Event Loop）实现异步。事件循环维护一个**调用栈**、一个**微任务队列**和**宏任务队列**。

**执行顺序**：
1. 执行**同步代码**，遇到异步任务按类型分发：setTimeout 回调进入**宏任务**队列，Promise.then、await 后面的代码进入**微任务**队列；
2. 当前调用栈清空后，**立即清空所有微任务**；
3. 从宏任务队列取出**一个**任务执行，执行完再次清空微任务队列，如此循环。

**宏任务**：整体 script、setTimeout/setInterval、I/O、UI 交互事件、setImmediate（Node）。
**微任务**：Promise.then/catch/finally、queueMicrotask、MutationObserver，Node 中还有 process.nextTick（优先级最高）。

注意 \`setTimeout(fn, 0)\` 不是立即执行，只是尽快进入宏任务队列；由于浏览器的定时器节流（嵌套超过 5 层最低 4ms 等），时间也不精确。`,
    ana: '经典输出题：1,4,6,7,3,5,2（setTimeout + Promise + async/await 混合代码），docs 前端面试八股文.md 中有完整推导。',
    keys: ['同步 → 微任务 → 宏任务', 'Promise.then 微任务', 'setTimeout 宏任务'],
    src: '前端面试八股文.md / 一些高频率考点.md / 浏览器原理知识点.md',
  },
  {
    id: 'js-024',
    type: 'code',
    diff: 'hard',
    sub: '异步编程',
    q: '写出下面代码的输出顺序并解释原因：\n\n```js\nconsole.log("1");\nsetTimeout(() => console.log("2"), 0);\nPromise.resolve().then(() => console.log("3"));\nasync function async1() {\n  console.log("4");\n  await async2();\n  console.log("5");\n}\nasync function async2() {\n  console.log("6");\n}\nasync1();\nconsole.log("7");\n```',
    ans: `**输出顺序：1, 4, 6, 7, 3, 5, 2**

**解析**：
1. 同步输出 \`1\`；
2. \`setTimeout\` 回调 \`2\` 放入**宏任务**队列；
3. \`Promise.then\` 回调 \`3\` 放入**微任务**队列；
4. 执行 \`async1()\`，同步输出 \`4\`；
5. 执行 \`await async2()\`：先同步执行 async2 输出 \`6\`；**await 后面的代码（console.log("5")）被包装成 Promise.then，放入微任务队列**；
6. 继续同步输出 \`7\`；
7. 同步代码执行完毕，调用栈清空，**清空微任务队列**：按入队顺序输出 \`3\`，然后 \`5\`；
8. 微任务清空后执行下一个宏任务，输出 \`2\`。

**核心记忆点**：async 函数在 await 前的代码是同步执行的；await 相当于把后面的代码挂起为微任务。`,
    ana: '这是 docs/前端面试八股文.md 的第一幕原题。易错点：6 在 4 后同步执行，而不是进微任务。',
    keys: ['输出顺序', 'await 挂起为微任务', '宏任务最后执行'],
    src: '前端面试八股文.md',
  },
  {
    id: 'js-025',
    type: 'essay',
    diff: 'easy',
    sub: '异步编程',
    q: 'Promise 有哪几种状态？为什么 then 能链式调用？Promise.all 和 Promise.race 的区别和使用场景是什么？',
    ans: `**面试回答：**

**状态**：pending（等待）→ fulfilled（成功）/ rejected（失败），状态**一旦改变不可逆**。

**then 链式调用**：因为 then 本身**返回一个新的 Promise**。回调返回普通值会被包装成 resolve；返回 Promise 则等待其完成再决定新 Promise 的状态，因此可以实现串行异步。

**Promise 组合器**：
- \`Promise.all\`：**全部成功才成功**（结果按输入顺序），**一个失败即整体失败**——适合强依赖的并行任务，如同时请求页面多个必用数据；
- \`Promise.allSettled\`：等待全部结束，分别拿到成功/失败结果——适合批量任务容错；
- \`Promise.race\`：**第一个 settled 的 Promise 决定结果**（成功或失败都算）——适合**超时控制**，与一个定时 reject 的 Promise 竞速；
- \`Promise.any\`：**第一个 fulfilled** 的决定结果，全部失败才失败——多源请求择优。`,
    ana: '手写 Promise.all 的关键：结果按索引写入（不能用 push），计数达到 total 才 resolve，任一失败立即 reject。',
    keys: ['状态不可逆', 'then 返回新 Promise', 'all 一败俱败', 'race 超时控制'],
    src: '面试问答.md / 知识点快速复习指南.md',
  },
  {
    id: 'js-026',
    type: 'code',
    diff: 'hard',
    sub: '异步编程',
    q: '手写一个 Promise.all：接收 Promise 或普通值组成的数组，保持结果顺序；全部成功时 resolve，任一任务失败时 reject。',
    ans: `\`\`\`js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let count = 0
    const total = promises.length
    // 空数组直接 resolve
    if (total === 0) return resolve([])

    promises.forEach((p, index) => {
      // Promise.resolve 统一处理普通值和 thenable
      Promise.resolve(p).then((value) => {
        // 关键：按索引写入而不是 push，保证结果顺序与输入一致
        results[index] = value
        count += 1
        if (count === total) resolve(results)
      }, reject) // 任一失败立即 reject
    })
  })
}
\`\`\`

**易错点**：
1. 结果必须**按输入索引保存**，Promise 完成顺序和结果顺序不是一回事；
2. 输入项要用 \`Promise.resolve()\` 包装，兼容普通值；
3. 输入为空数组时返回 fulfilled 的 \`[]\`；
4. 失败后不用等其余任务（原生语义），已完成的计数也不再触发 resolve。`,
    ana: '这是知识点快速复习指南.md 中的速记题。追问：Promise.allSettled 怎么改？——不 reject，收集 { status, value/reason }。',
    keys: ['按索引保存', 'Promise.resolve 包装', '计数判断完成'],
    src: '知识点快速复习指南.md',
  },
  {
    id: 'js-027',
    type: 'essay',
    diff: 'easy',
    sub: '异步编程',
    q: '对 async/await 的理解？await 后面的代码在什么时机执行？怎么捕获异常？',
    ans: `**面试回答：**

- **async/await 是基于 Promise 的语法糖**，让异步代码看起来像同步代码，提高可读性；
- \`async\` 函数**默认返回一个 Promise**，return 的值会被包装成 resolve；
- \`await\` 会**暂停当前 async 函数的执行**，等待 Promise 出结果后继续；await 后面的代码会被包装成微任务，**不会阻塞主线程**；
- **异常捕获**：await 的 Promise reject 时会抛出异常，可用 try/catch 捕获，或者在 Promise 后接 .catch()；未捕获会导致 async 函数返回的 Promise 变为 rejected；
- 多个无依赖的 await 应该用 \`Promise.all\` 并行，串行 await 会白白浪费时间。

对比回调函数和 Promise 链：async/await 避免了回调地狱和长 then 链，错误处理也更集中。`,
    ana: '可以补充：for...of + await 可以实现串行异步迭代；并行场景优先 Promise.all。',
    keys: ['Promise 语法糖', 'await 暂停函数', 'try/catch', '并行 Promise.all'],
    src: '从零开始的前端面试题.md / 一些高频率考点.md',
  },
  {
    id: 'js-028',
    type: 'single',
    diff: 'medium',
    sub: '异步编程',
    q: '关于 setTimeout(fn, 1000)，下列说法正确的是？',
    opts: [
      '1000ms 后 fn 一定立即执行',
      'fn 会在 1000ms 后被放入宏任务队列，实际执行时间取决于队列和主线程状态',
      'fn 会立即执行然后每秒重复',
      'fn 在 1000ms 时被放入微任务队列',
    ],
    ans: 'B',
    ana: 'setTimeout 的语义是“**至少**延迟 1000ms 后把回调放入宏任务队列”，实际执行时间受前面宏任务、微任务、主线程长任务影响，可能晚于预期。这也是 docs 中“为什么 setTimeout 时间不精准”的答案：定时器只保证入队时机，不保证执行时机。setInterval 同理，且回调堆积时可能连续执行。',
    keys: ['宏任务入队时机', '不精准原因', '主线程长任务'],
    src: '问答类型面试题.md',
  },

  // ============ DOM / 事件 / 请求 ============
  {
    id: 'js-029',
    type: 'essay',
    diff: 'medium',
    sub: 'DOM 与事件',
    q: '什么是 DOM 和 BOM？说一下事件冒泡、事件捕获和事件委托。',
    ans: `**面试回答：**

- **DOM**（Document Object Model）：文档对象模型，把 HTML 解析成树结构，提供操作页面内容的 API；
- **BOM**（Browser Object Model）：浏览器对象模型，提供 window、location、history、navigator、screen 等浏览器能力。

**事件流三个阶段**：捕获阶段（window 向目标传播）→ 目标阶段 → 冒泡阶段（目标向 window 传播）。addEventListener 默认在冒泡阶段监听，第三个参数传 true（或 { capture: true }）改为捕获。\`event.stopPropagation()\` 阻止传播，\`event.preventDefault()\` 阻止默认行为。

**事件委托**：利用冒泡，把子元素的事件统一绑定到父元素上，在回调中通过 \`event.target\` 判断实际目标。

**优点**：
1. 大量子元素时**减少事件监听数量**，节省内存；
2. 动态新增的子元素**无需重新绑定**事件。

适合列表项点击等场景；不适合需要 stopPropagation 的场景和 focus/blur 等不冒泡事件。`,
    ana: '事件委托是 docs 中单独整理的问答高频题，优点要点出“动态元素无需重新绑定”。',
    keys: ['三阶段', 'stopPropagation', 'event.target', '动态元素'],
    src: '从零开始的前端面试题.md / 问答类型面试题.md / 面试问答.md',
  },
  {
    id: 'js-030',
    type: 'essay',
    diff: 'easy',
    sub: 'DOM 与事件',
    q: 'ajax、axios、fetch 有什么区别？',
    ans: `**面试回答：**

- **ajax**：泛指通过 XMLHttpRequest 实现的异步请求技术，API 陈旧、需手动处理回调，一般不直接使用；
- **fetch**：浏览器原生的现代请求 API，基于 **Promise**，语法简洁；但**默认不会把 4xx/5xx 当作 reject**（只有网络错误才 reject，需要手动检查 response.ok），不支持超时（需 AbortController），不带 cookie 需要 credentials 配置；
- **axios**：基于 XMLHttpRequest 封装的库，支持**拦截器**（token 注入、统一错误处理）、自动 JSON 转换、超时配置、取消请求、并发helper，是中后台项目的主流选择。

项目中一般对 axios 做二次封装：统一 baseURL、token、业务码处理、401 登录态、blob 下载兼容。`,
    ana: 'fetch “网络错误才 reject”是高频易错点；axios 拦截器可结合项目 request.ts 讲。',
    keys: ['XHR 基础', 'fetch response.ok', 'axios 拦截器'],
    src: '从零开始的前端面试题.md / 基于简历的问题.md',
  },
  {
    id: 'js-031',
    type: 'code',
    diff: 'hard',
    sub: '性能与手写',
    q: '手写防抖函数 debounce 和节流函数 throttle，并说明各自的使用场景。',
    ans: `\`\`\`js
// 防抖：连续触发时只执行最后一次（停止触发 delay 后执行）
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer) // 每次触发先取消上一次
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 节流：规定时间内最多执行一次
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
\`\`\`

**场景区分**：
- **防抖**：搜索框输入联想（停止输入再请求）、窗口 resize 后重算布局、表单重复提交；
- **节流**：滚动监听（scroll）、拖拽、鼠标移动、上传进度更新（docs 建议 50-100ms 更新一次展示）。

面试可补充：防抖可加立即执行（首次触发先执行）选项；Vue 项目可直接用 VueUse 的 useDebounceFn/useThrottleFn 或 lodash。`,
    ana: '核心：防抖重置计时器，节流比较时间戳。箭头函数与 this 传递是细节加分点。',
    keys: ['clearTimeout 重置', '时间戳节流', '搜索框防抖', '滚动节流'],
    src: '前端性能优化面试题.md / 知识点快速复习指南.md / 面试问答.md',
  },
  {
    id: 'js-032',
    type: 'essay',
    diff: 'medium',
    sub: '性能与手写',
    q: '页面请求大规模并发时，前端如何控制并发数量？',
    ans: `**面试回答：**浏览器对同域名 HTTP/1.1 并发连接有限制（一般 6 个），大量请求同时发出会导致排队、阻塞其他请求甚至拖垮服务端。前端要做**并发控制**：

**核心思路**：维护一个**请求队列**，限制同时进行的请求数量，完成一个再从队列取下一个。

\`\`\`js
function limitConcurrency(tasks, limit) {
  return new Promise((resolve, reject) => {
    const results = []
    let index = 0 // 下一个任务指针
    let finished = 0
    const total = tasks.length

    function next() {
      if (finished === total) return resolve(results)
      if (index >= total) return
      const current = index++
      tasks[current]().then((res) => {
        results[current] = res
        finished += 1
        next() // 完成一个，补位下一个
      }, reject)
    }
    // 先启动 limit 个
    for (let i = 0; i < Math.min(limit, total); i++) next()
  })
}
\`\`\`

**配合手段**：取消无效请求（AbortController）、请求缓存/去重、防抖节流降低触发频率、失败重试与降级。分片上传场景的并发数一般从 3~6 起步按网络情况调整。`,
    ana: '大文件分片上传的并发限制就是这一思路的落地场景，可与 project 分类呼应。',
    keys: ['请求队列', '并发限制', 'AbortController', '请求合并'],
    src: '问答类型面试题.md / 一些高频率考点.md',
  },
  {
    id: 'js-033',
    type: 'essay',
    diff: 'easy',
    sub: '内置对象',
    q: 'Map 和 Object 有什么区别？WeakMap 有什么特点？',
    ans: `**面试回答：**

**Map vs Object**：
1. **键类型**：Object 键只能是字符串/Symbol（数字会被转字符串）；Map 键可以是**任意类型**（对象、函数、NaN 都行）；
2. **顺序**：Map 保证插入顺序遍历；Object 的键顺序不保证（数字键会排前面）；
3. **长度**：Map 有 \`size\` 属性；Object 需要手动 \`Object.keys().length\`；
4. **性能**：频繁增删键值对时 Map 表现更好；
5. **原型**：Object 有默认原型链，可能和自定义键冲突（可用 Object.create(null) 规避）。

**WeakMap**：键只能是**对象**，且是**弱引用**——不会阻止垃圾回收。当对象的其他引用都消失时，WeakMap 中对应键值对可被自动回收，适合存放与对象生命周期绑定的附加数据（如给 DOM 节点挂元数据），**不可遍历**。WeakSet 同理。`,
    ana: '弱引用与 GC 的关系是深挖点；对象数组按业务字段去重用 Map 也是实际应用。',
    keys: ['任意类型键', '插入顺序', '弱引用', '不可遍历'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'js-034',
    type: 'single',
    diff: 'easy',
    sub: '内置对象',
    q: '下列哪个方法可以最可靠地判断一个变量是否为数组？',
    opts: ['typeof v === "array"', 'v instanceof Array', 'Array.isArray(v)', 'Object.keys(v).length > 0'],
    ans: 'C',
    ana: 'typeof 无法区分数组和对象（都返回 "object"，且没有 "array" 这个返回值）；instanceof 在跨 iframe（多个全局环境）场景会失准；Array.isArray 是 ES5 引入的专用方法，不受上述限制，最可靠。Object.keys 对非对象参数会报错且不能证明是数组。',
    keys: ['Array.isArray', 'typeof 局限', '跨 iframe'],
    src: '从零开始的前端面试题.md',
  },
  {
    id: 'js-035',
    type: 'essay',
    diff: 'hard',
    sub: '函数式编程',
    q: '说说你对函数式编程的理解，什么是纯函数和副作用？',
    ans: `**面试回答：**函数式编程是一种**用纯函数组合来表达程序**的编程范式，强调“计算即函数求值”，主要特征：

1. **纯函数**：相同输入永远得到相同输出，且**不产生副作用**（不修改外部变量、不做 I/O、不改参数）；
2. **不可变数据**：不直接修改原数据，而是创建新数据（如 React 的 setState 用新对象替换）；
3. **无副作用地组合**：通过函数组合、高阶函数、柯里化复用逻辑；
4. **副作用隔离**：把 I/O、请求、DOM 操作等副作用推到边界统一处理。

**优点**：逻辑可预测、易测试（输入输出确定）、易并行、易复用。

**在前端框架中的体现**：React 的设计理念是“UI = f(state)”——视图是状态的纯函数；组件渲染应该是纯的，数据请求、定时器这类副作用被约定放进 useEffect 中，就是为了把副作用与渲染分离。`,
    ana: '结合 React“渲染必须纯净、副作用放 useEffect”回答，能体现框架层理解。',
    keys: ['纯函数', '副作用', '不可变', 'UI = f(state)'],
    src: '问答类型面试题.md / 收集的面试知识点.md',
  },
  {
    id: 'js-036',
    type: 'code',
    diff: 'medium',
    sub: '性能与手写',
    q: '写一个带并发限制的异步任务调度器：同一时刻最多允许 limit 个任务执行。',
    ans: `\`\`\`js
class Scheduler {
  constructor(limit) {
    this.limit = limit
    this.queue = [] // 等待队列
    this.running = 0 // 当前运行数
  }

  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      this.queue.push({ promiseCreator, resolve, reject })
      this.run()
    })
  }

  run() {
    while (this.running < this.limit && this.queue.length) {
      const { promiseCreator, resolve, reject } = this.queue.shift()
      this.running += 1
      promiseCreator().then(resolve, reject).finally(() => {
        this.running -= 1
        this.run() // 释放一个名额，立即补位
      })
    }
  }
}

// 使用
const scheduler = new Scheduler(2)
const task = (time, val) => () =>
  new Promise((r) => setTimeout(() => r(val), time))
scheduler.add(task(1000, 'A')).then(console.log) // 1s 后 A
scheduler.add(task(500, 'B')).then(console.log)  // 1s 后 B（被并发 2 允许）
scheduler.add(task(300, 'C')).then(console.log)  // 1.5s 后 C（等名额）
\`\`\`

**思路**：队列 + 运行计数；完成一个补一个。大文件分片上传、批量图片处理都直接复用该模型。`,
    ana: '与 essay 题 js-032 互为补充：一个是函数式实现，一个是类实现，思路相同。',
    keys: ['队列', 'running 计数', 'finally 补位'],
    src: '问答类型面试题.md / 一些高频率考点.md',
  },
  {
    id: 'js-037',
    type: 'judge',
    diff: 'medium',
    sub: '内置对象',
    q: 'JSON.stringify 深拷贝对象时会丢失 undefined 值的属性、函数和 Symbol，遇到循环引用会直接报错。',
    ans: true,
    ana: 'JSON.stringify 的已知缺陷：①undefined、函数、Symbol 属性被忽略（数组中变 null）；②Date 变 UTC 字符串；③NaN、Infinity 变 null；④循环引用抛 TypeError；⑤丢失原型链；⑥BigInt 直接报错。因此深拷贝推荐 structuredClone 或递归 + WeakMap 实现。',
    keys: ['序列化缺陷', '循环引用报错', 'structuredClone'],
    src: '知识点快速复习指南.md',
  },
  {
    id: 'js-038',
    type: 'essay',
    diff: 'medium',
    sub: '内置对象',
    q: '对 JSON 的理解？escape、encodeURI、encodeURIComponent 有什么区别？',
    ans: `**面试回答：**

**JSON**：一种轻量级的数据交换格式，基于 JS 对象字面量语法但独立于语言。只有三种结构：键值对（键必须是双引号字符串）、数组、基本类型（不含 undefined、函数、注释）。前端常用 \`JSON.stringify\`（序列化，可传 replacer/缩进）和 \`JSON.parse\`（反序列化，可传 reviver）；\`toJSON\` 方法可自定义序列化行为。

**编码三兄弟**（处理 URL 特殊字符）：
- **escape**：已废弃，不用于 URL 编码，忽略不解码；
- **encodeURI**：编码整个 URI，**保留 URI 结构字符**（:/?#&= 等），适合对完整 URL 编码；
- **encodeURIComponent**：编码更彻底，**连 &、=、/ 也编码**，适合编码**参数值**（如搜索关键词），防止参数中的特殊字符破坏 URL 结构。

典型用法：\`url + "?q=" + encodeURIComponent(keyword)\`。`,
    ana: 'encodeURIComponent 用于参数值、encodeURI 用于整个 URL，一句话区分。',
    keys: ['轻量数据交换', 'encodeURI 保留结构', 'encodeURIComponent 参数值'],
    src: '从零开始的前端面试题.md',
  },

  {
    id: 'js-039',
    type: 'multiple',
    diff: 'medium',
    sub: '内置对象',
    q: '下列哪些数组方法会**改变原数组**？（多选）',
    opts: ['push / pop', 'slice', 'splice', 'sort / reverse'],
    ans: ['A', 'C', 'D'],
    ana: '会改变原数组的 7 个方法：**push、pop、shift、unshift、splice、sort、reverse**。slice 截取并返回新数组、map/filter 返回新数组，都不改变原数组。sort 默认按字符串 Unicode 码位排序，数字排序要传比较器 (a, b) => a - b。',
    keys: ['splice 改变原数组', 'slice 不改变', 'sort 比较器'],
    src: '知识点快速复习指南.md / 问答类型面试题.md',
  },
  {
    id: 'js-040',
    type: 'multiple',
    diff: 'medium',
    sub: '异步编程',
    q: '下列哪些属于**微任务（microtask）**？（多选）',
    opts: ['Promise.then / catch / finally', 'queueMicrotask', 'setTimeout / setInterval', 'MutationObserver'],
    ans: ['A', 'B', 'D'],
    ana: '微任务：Promise.then/catch/finally、queueMicrotask、MutationObserver（浏览器）、process.nextTick（Node，优先级最高）。setTimeout/setInterval、I/O、UI 事件是**宏任务**；setImmediate 是 Node 的 check 阶段宏任务。执行顺序：同步代码 → 清空所有微任务 → 取一个宏任务 → 再清微任务。',
    keys: ['微任务清单', '宏任务清单', '清空微任务再取宏任务'],
    src: '一些高频率考点.md / 知识点快速复习指南.md',
  },
]
