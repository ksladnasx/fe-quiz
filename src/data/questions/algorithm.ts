import type { RawQuestion } from '../../types'

/**
 * 算法与数据结构题库
 * 来源：docs/基础算法.md、docs/知识点快速复习指南.md（算法题速记）、
 *       docs/收集的面试知识点.md
 */
export const algorithmQuestions: RawQuestion[] = [
  {
    id: 'al-001',
    type: 'essay',
    diff: 'medium',
    sub: '基础概念',
    q: '动态规划的核心特征有哪些？什么样的题目适合用动态规划？',
    ans: `**面试回答：**动态规划适合的问题有三个核心特征：

1. **最优子结构**：原问题的最优解可以由**子问题的最优解**推导出来（最明显）；
2. **重叠子问题**：递归展开后同一个子问题被反复计算——这是 DP 与普通分治的关键区分点，可以用**记忆化（缓存）或递推表格**避免重复计算；
3. **无后效性**：当前状态一旦确定，后续决策不受“状态是怎么来的”影响（容易忽略）。

**解题步骤**：
1. 定义状态（dp[i] 的含义）；
2. 找状态转移方程；
3. 确定初始化（边界条件）；
4. 确定遍历顺序；
5. （可选）空间优化：滚动数组把二维压一维。

**常见模型**：线性 DP（打家劫舍）、背包（0/1 背包）、区间 DP、字符串 DP（编辑距离）、双 DP（乘积最大子数组）。

**0/1 背包要点**：n 个物品、容量 W，\`dp[j] = max(dp[j], dp[j - w[i]] + v[i])\`；**一维数组必须倒序遍历容量**，防止同件物品被重复选取。`,
    ana: '重叠子问题是“能不能用 DP”的判据，无后效性是“转移方程是否成立”的判据。',
    keys: ['最优子结构', '重叠子问题', '无后效性', '滚动数组'],
    src: '基础算法.md',
  },
  {
    id: 'al-002',
    type: 'code',
    diff: 'easy',
    sub: '双指针与滑动窗口',
    q: '合并区间：给定若干区间如 [[1,3],[2,6],[8,10],[15,18]]，合并所有重叠区间，返回不重叠的结果。',
    ans: `\`\`\`js
function merge(intervals) {
  if (!intervals.length) return []
  // 1. 按区间起点升序排序
  intervals.sort((a, b) => a[0] - b[0])
  const result = [intervals[0]]

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1] // 结果末尾区间
    const current = intervals[i]
    if (current[0] <= last[1]) {
      // 有重叠：扩展末尾区间的右边界
      last[1] = Math.max(last[1], current[1])
    } else {
      // 无重叠：直接加入
      result.push(current)
    }
  }
  return result
}
// [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]
\`\`\`

**复杂度**：排序 O(n log n) + 遍历 O(n)，空间 O(n)。
**易错点**：边界相等也算重叠——[1,3] 和 [3,5] 应合并为 [1,5]（判断用 <=）。`,
    ana: '这是知识点快速复习指南的速记题。注意 last[1] 取 max 而不是直接赋 current[1]。',
    keys: ['排序后合并', 'last[1] 取 max', 'O(n log n)'],
    src: '知识点快速复习指南.md / 基础算法.md',
  },
  {
    id: 'al-003',
    type: 'code',
    diff: 'easy',
    sub: '哈希统计',
    q: '出现次数最多的数字：给定整数数组，找出出现次数最多的数字；如果有多个并列最多，返回所有这些数字。',
    ans: `\`\`\`js
function mostFrequent(nums) {
  const map = new Map()
  // 1. 统计频次
  for (const num of nums) {
    map.set(num, (map.get(num) || 0) + 1)
  }
  // 2. 找最大次数
  let maxCount = 0
  for (const count of map.values()) {
    maxCount = Math.max(maxCount, count)
  }
  // 3. 收集所有并列最多的数字
  const result = []
  for (const [num, count] of map) {
    if (count === maxCount) result.push(num)
  }
  return result
}
// [1,2,2,3,3,4] → 最大次数 2，结果 [2,3]
\`\`\`

**复杂度**：两次遍历 O(n)，空间 O(k)（k 为不同数字数量）。
**易错点**：要处理并列时建议分两次遍历（先求 maxCount 再收集），一次遍历里维护“结果数组”的分支逻辑容易出错。`,
    ana: 'Map 统计 + 两遍遍历是标准模板，也可扩展到“字符出现次数”“两数之和”等哈希题。',
    keys: ['Map 计数', '两遍遍历', '并列处理'],
    src: '知识点快速复习指南.md / 基础算法.md',
  },
  {
    id: 'al-004',
    type: 'code',
    diff: 'easy',
    sub: '字符串',
    q: '最长公共前缀：给定字符串数组 ["flower","flow","flight"]，返回所有字符串的最长公共前缀，没有则返回空字符串。',
    ans: `\`\`\`js
function longestCommonPrefix(strs) {
  if (!strs.length) return ''
  let prefix = strs[0]
  for (let i = 1; i < strs.length; i++) {
    // 不是公共前缀就不断缩短
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
      if (!prefix) return ''
    }
  }
  return prefix
}
// "flower" → "flow"（匹配 flow）→ "fl"（匹配 flight）→ 结果 "fl"
\`\`\`

**另一种思路**（按列比较）：比较所有字符串的第 0 位、第 1 位……遇到某列字符不一致或越界即停止。

**复杂度**：时间约 O(S)（S 为字符串总字符数），空间 O(1)。
**易错点**：缩短前缀必须**从末尾删除**；不能只比较相邻字符串就返回，后续字符串可能进一步缩短公共前缀。`,
    ana: '两种实现都答出来更稳：纵向比较（列扫描）或横向缩减（startsWith）。',
    keys: ['startsWith 缩短', '列比较', '空串兜底'],
    src: '知识点快速复习指南.md / 基础算法.md',
  },
  {
    id: 'al-005',
    type: 'code',
    diff: 'medium',
    sub: '字符串',
    q: '版本号比较：比较两个版本号字符串如 "1.01" 和 "1.001"，忽略每段开头的多余零。',
    ans: `\`\`\`js
function compareVersion(v1, v2) {
  const a = v1.split('.')
  const b = v2.split('.')
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    // 缺失的段按 0 处理，Number() 去掉前导零
    const x = Number(a[i] || 0)
    const y = Number(b[i] || 0)
    if (x !== y) return x > y ? 1 : -1
  }
  return 0 // 相等
}
compareVersion('1.01', '1.001') // 0
compareVersion('1.2', '1.10')   // -1（2 < 10）
\`\`\`

**易错点**：
1. **不能直接字符串比较**：\`"1.10" < "1.2"\` 按字典序会得出错误结果；
2. 段数不同时缺失部分按 0（\`"1.0"\` 与 \`"1"\` 相等）；
3. 用 Number 转换自动处理 "01" → 1 的前导零。`,
    ana: '前端实战关联：package 版本比较、灰度发布版本判断。',
    keys: ['split 点分段', 'Number 去前导零', '缺失段补 0'],
    src: '知识点快速复习指南.md',
  },
  {
    id: 'al-006',
    type: 'code',
    diff: 'easy',
    sub: '字符串',
    q: '字符串转驼峰：把 "hello-world-test" 转换为 "helloWorldTest"。',
    ans: `\`\`\`js
function toCamelCase(str) {
  // 1. 正则统一分隔符并切分，过滤空段（处理连续分隔符）
  const parts = str.split(/[-_\\s]+/).filter(Boolean)
  if (!parts.length) return ''
  // 2. 首段保持原样，后续段首字母大写
  return (
    parts[0] +
    parts.slice(1).map((p) => p[0].toUpperCase() + p.slice(1)).join('')
  )
}
toCamelCase('hello-world-test') // helloWorldTest
toCamelCase('foo--bar')          // fooBar（连续分隔符被正确处理）
\`\`\`

**另一种实现**（一次 replace）：

\`\`\`js
const toCamel = (s) =>
  s.replace(/[-_](\\w)/g, (_, c) => c.toUpperCase())
\`\`\`

**边界约定要说清**：连续分隔符是否忽略、空字符串返回什么、是否保留首段大小写。`,
    ana: 'replace 回调写法更简洁，正则捕获组取首字母是常见变体。',
    keys: ['split 正则', 'replace 回调', '边界处理'],
    src: '知识点快速复习指南.md',
  },
  {
    id: 'al-007',
    type: 'essay',
    diff: 'medium',
    sub: '链表',
    q: '快慢指针能解决哪些链表问题？如何判断链表有环、找链表中点？',
    ans: `**面试回答：**快慢指针（Floyd 判圈）用两个速度不同的指针遍历，O(1) 空间解决一类链表问题：

1. **判断有环**：快指针每次走 2 步、慢指针每次走 1 步；如果有环，两者必然在环内**相遇**；快指针到 null 则无环。
2. **找环入口**：相遇后让一个指针回到 head，同速前进，再次相遇点就是入口（数学推导：head 到入口距离 = 相遇点绕环到入口距离）；
3. **找中点**：快指针走 2 步、慢指针走 1 步，快指针到尾时慢指针在中点（偶数长度偏后，可微调），用于**链表归并排序**的切分；
4. **删除倒数第 n 个节点**：让快指针先走 n 步，再同步走，快指针到尾时慢指针在倒数第 n+1 个，直接跳过目标节点。

**手写判断有环**：

\`\`\`js
function hasCycle(head) {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}
\`\`\``,
    ana: '四个经典应用：判环、找入口、找中点、倒数第 n 个。链表题统一注意 dummy 哨兵节点。',
    keys: ['Floyd 判圈', 'O(1) 空间', 'dummy 哨兵'],
    src: '基础算法.md',
  },
  {
    id: 'al-008',
    type: 'essay',
    diff: 'medium',
    sub: '栈与队列',
    q: '栈和队列的应用：如何实现一个最小栈？单调栈适合什么问题（如每日温度）？',
    ans: `**面试回答：**

**最小栈**：支持 push/pop/top 且 **O(1) 获取最小值**。实现：主栈正常存值，辅助栈（或栈内同时存“当前最小值”）在 push 时同步压入“min(当前值, 当前最小)”，pop 时同步弹出——保证每个状态下最小值同步维护：

\`\`\`js
class MinStack {
  constructor() { this.stack = []; this.minStack = [] }
  push(val) {
    this.stack.push(val)
    const min = this.minStack.length
      ? Math.min(this.minStack[this.minStack.length - 1], val)
      : val
    this.minStack.push(min)
  }
  pop() { this.stack.pop(); this.minStack.pop() }
  top() { return this.stack[this.stack.length - 1] }
  getMin() { return this.minStack[this.minStack.length - 1] }
}
\`\`\`

**单调栈**：栈内元素保持单调（递增/递减），遇到破坏单调性的元素时弹出并结算。适合“**下一个更大/更小元素**”类问题：
- **每日温度**：求每个位置之后多少天更热——维护递减栈，遇到更高温度时弹出栈顶并计算天数差；
- 应用还有柱状图最大矩形、下一个更大元素 II。

本质：**用一次遍历为每个元素找到它“需要等待”的目标，O(n) 替代 O(n²) 双重循环**。`,
    ana: '数组实现也可以：JavaScript 数组的 push/pop 天然是栈。',
    keys: ['辅助栈同步', '单调递减栈', '下一个更大元素'],
    src: '基础算法.md',
  },
  {
    id: 'al-009',
    type: 'essay',
    diff: 'medium',
    sub: '树与图',
    q: '二叉树的 DFS 能解决哪些问题？如何找两个节点的最近公共祖先？岛屿数量怎么求？',
    ans: `**面试回答：**

**二叉树 DFS**：递归遍历（前/中/后序）是多数树问题的基础，应用：最大深度、路径和、翻转二叉树、判断对称。技巧是**双重 DFS**（每个节点作为起点做一次遍历，O(n²)）或一次遍历携带信息（自底向上返回值）。

**最近公共祖先（LCA）**：

\`\`\`js
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root
  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)
  // p、q 分居两侧，当前节点就是 LCA
  if (left && right) return root
  return left || right
}
\`\`\`
思路：后序遍历自底向上，如果 p、q 分别出现在左右子树，当前节点就是答案；否则向上传递找到的那一侧。

**岛屿数量**：网格中 “1” 连成岛屿，求个数。遍历每个格子，遇到 "1" 计数 +1，并从该点 **DFS/BFS 把整个连通区域“淹掉”（置 0）**，保证每个岛屿只被统计一次。属于连通分量计数问题，同样思路可判断**有向图无环（拓扑排序）**。`,
    ana: 'LCA 的左右结果组合判断是核心；岛屿问题讲清“遍历 + 感染”两步。',
    keys: ['后序遍历', '分居两侧', 'DFS 感染'],
    src: '基础算法.md',
  },
  {
    id: 'al-010',
    type: 'essay',
    diff: 'medium',
    sub: '缓存设计',
    q: 'LRU 缓存怎么设计实现？',
    ans: `**面试回答：**LRU（Least Recently Used）淘汰**最久未使用**的数据。

**设计**：要求 get/put 都是 O(1)——
- **哈希表**：key → 节点，O(1) 定位；
- **双向链表**：维护使用顺序，头部最新、尾部最旧，O(1) 移动/删除节点。

**流程**：
- get(key)：哈希表找到节点 → 从链表摘下移到头部 → 返回值；不存在返回 -1；
- put(key, value)：存在则更新并移到头部；不存在则新建插入头部，**容量超限时删除链表尾部节点及哈希表记录**。

\`\`\`js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map() // Map 保持插入序，模拟链表
  }
  get(key) {
    if (!this.map.has(key)) return -1
    const val = this.map.get(key)
    this.map.delete(key)
    this.map.set(key, val) // 移到最新
    return val
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key)
    this.map.set(key, value)
    if (this.map.size > this.capacity) {
      // Map.keys().next().value 是最旧的 key
      this.map.delete(this.map.keys().next().value)
    }
  }
}
\`\`\`

**进阶**：JS 的 Map 有序，可以模拟；生产实现用双向链表 + 哈希表（如手写或 LinkedHashMap）。**前端应用**：keep-alive 的 max 缓存淘汰就是 LRU。`,
    ana: '哈希表 + 双向链表 = O(1)；Map 模拟版是 JS 特色的简化答法。',
    keys: ['双向链表 + 哈希表', 'O(1)', 'keep-alive LRU'],
    src: '基础算法.md',
  },
  {
    id: 'al-011',
    type: 'essay',
    diff: 'medium',
    sub: '位运算',
    q: '常见的位运算技巧有哪些？异或运算有什么性质和应用？',
    ans: `**面试回答：**

**常用位运算**：
- \`x & 1\`：判断奇偶（末位为 1 是奇数）；
- \`x >> 1\`：除以 2（取整）；\`x << 1\`：乘以 2；
- \`x & (x - 1)\`：消去最低位的 1，可用于**统计二进制中 1 的个数**、判断 2 的幂；
- \`x & (-x)\`：获取最低位的 1；
- \`x ^ 0 = x\`，\`x ^ x = 0\`。

**异或的性质与应用**：
1. **自反性**：a ^ a = 0，a ^ 0 = a，交换律结合律成立；
2. **只出现一次的数字**：数组中其他数都出现两次，全部异或后剩下只出现一次的数（成对的互相抵消）；
3. **不用临时变量交换两数**：a ^= b; b ^= a; a ^= b（了解即可，实际可读性差）；
4. **状态压缩**：用位标记开关集合（如 N 皇后的列/对角线占用状态），空间小、操作快。

**找不同**（两个字符串只有一个字符不同）：所有字符异或运算，剩下的是多出的字符。`,
    ana: '异或三大性质：自反、与 0 不变、交换结合。状态压缩是进阶应用。',
    keys: ['异或自反', 'x&(x-1)', '状态压缩'],
    src: '基础算法.md',
  },
  {
    id: 'al-012',
    type: 'code',
    diff: 'hard',
    sub: '回溯',
    q: 'N 皇后问题的回溯思路是什么？写出核心框架。',
    ans: `**面试回答：**N 皇后要求 n×n 棋盘放 n 个皇后，**同行、同列、同对角线**不冲突。

**回溯框架**：逐行放置（每行必有一个），尝试每一列；冲突则剪枝回溯。

\`\`\`js
function solveNQueens(n) {
  const result = []
  const cols = new Set()        // 已占用的列
  const diag1 = new Set()       // 主对角线 (row - col)
  const diag2 = new Set()       // 副对角线 (row + col)
  const board = []

  function backtrack(row) {
    if (row === n) {
      result.push([...board])
      return
    }
    for (let col = 0; col < n; col++) {
      // 剪枝：同列或同对角线已占用
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue
      cols.add(col); diag1.add(row - col); diag2.add(row + col)
      board.push(col)
      backtrack(row + 1)
      // 回溯撤销选择
      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col)
      board.pop()
    }
  }
  backtrack(0)
  return result
}
\`\`\`

**要点**：
1. **逐行递归**天然保证行不冲突；
2. 主对角线用 \`row - col\`、副对角线用 \`row + col\` 标识（同一条对角线上差值/和值恒定）；
3. 回溯三步：做选择 → 递归 → **撤销选择**；
4. 位运算优化：用三个整数的二进制位表示列/对角线占用，更快。`,
    ana: '回溯 = 决策树遍历 + 剪枝 + 撤销。对角线标识技巧是本题核心记忆点。',
    keys: ['回溯框架', '对角线 row±col', '剪枝撤销'],
    src: '基础算法.md',
  },
  {
    id: 'al-013',
    type: 'essay',
    diff: 'medium',
    sub: '贪心与哈希',
    q: '贪心算法适用什么场景？前缀和有什么用？最长连续序列怎么做？',
    ans: `**面试回答：**

**贪心**：每一步做**局部最优**选择，希望推出全局最优。适用前提：**局部最优能推出全局最优**（贪心选择性质），通常需要排序或证明。经典：跳跃游戏（维护能到达的最远位置）、区间调度、分发饼干。区别于 DP：贪心不回溯、不比较所有子问题。

**前缀和**：预处理 \`prefix[i] = nums[0..i-1] 之和\`，任意区间和 \`sum(i, j) = prefix[j+1] - prefix[i]\`，把区间求和从 O(n) 降到 O(1)。配合哈希表还能解决“和为 K 的子数组”（记录前缀和出现次数）。

**最长连续序列**（如 [100,4,200,1,3,2] → 连续序列 1,2,3,4 长度 4）：要求 O(n)——
1. 全部放入 **Set**；
2. 只从**序列起点**开始数（\`!set.has(x - 1)\` 才是起点）；
3. 从起点不断 \`set.has(x + 1)\` 向后延伸计数，更新最大值。
关键在于“只从起点数”，每个数字最多访问两次，总复杂度 O(n)。`,
    ana: '贪心 vs DP 的区别一句话：贪心不比较所有可能、不回头。',
    keys: ['局部最优', '前缀和 O(1) 区间和', 'Set 判起点'],
    src: '基础算法.md',
  },
  {
    id: 'al-014',
    type: 'code',
    diff: 'hard',
    sub: '数组',
    q: '四数之和：数组中找出四个数之和等于 target 的所有不重复四元组。说说思路。',
    ans: `**面试回答：**两种思路，推荐排序 + 双指针：

**思路一：排序 + 双指针（O(n³)，推荐）**
1. 数组**升序排序**；
2. 固定前两个数 i、j（双重循环）；
3. 剩余区间用**左右双指针** l、r 收缩：四数和偏小则 l++，偏大则 r--，相等则收集一组；
4. **去重**：i、j、l、r 移动时跳过相同值（\`nums[k] === nums[k-1]\` 时 continue）；
5. **剪枝**：最小的四个数之和 > target 直接 break；当前数配上最大三数之和 < target 直接 continue。

**思路二：回溯 + 减枝 + 去重**：把问题看成“在排序数组中选 4 个数”，DFS 层级选择，用“同一层跳过重复值”去重，选满 4 个且和等于 target 时记录。通用性更好但常数大。

**易错点**：去重必须基于**排序后的相邻比较**；结果四元组要判重；数值相加可能溢出（用 BigInt 或注意语言类型）。`,
    ana: '与三数之和（15 题）同构，n 数之和都是“固定 n-2 个 + 双指针”。',
    keys: ['排序双指针', '同层去重', '剪枝'],
    src: '基础算法.md',
  },
  {
    id: 'al-015',
    type: 'code',
    diff: 'medium',
    sub: '动态规划',
    q: '0/1 背包问题：n 个物品各有重量 w[i] 和价值 v[i]，背包容量 W，求能装入的最大价值。写出状态转移方程和代码。',
    ans: `**面试回答：**

**状态定义**：dp[i][j] 表示前 i 个物品、容量 j 时的最大价值。

**状态转移**（对第 i 个物品：不装 or 装）：

\`\`\`
dp[i][j] = max(dp[i-1][j],                    // 不装第 i 件
               dp[i-1][j - w[i]] + v[i])       // 装第 i 件（j >= w[i]）
\`\`\`

**一维滚动数组优化**（必须**倒序遍历容量**）：

\`\`\`js
function knapsack(W, weights, values) {
  const dp = new Array(W + 1).fill(0)
  for (let i = 0; i < weights.length; i++) {
    // 倒序：保证每件物品只被选一次
    for (let j = W; j >= weights[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i])
    }
  }
  return dp[W]
}
\`\`\`

**为什么倒序**：正序时 dp[j - w[i]] 已被本轮更新，相当于第 i 件物品可以被选多次，变成**完全背包**；倒序用的是上一轮（i-1）的值，才是 0/1 语义。

**变体**：完全背包正序遍历；分割等和子数组装“和/2”；目标和转化为 0/1 背包计数。`,
    ana: '“倒序遍历”的原因是本题最常被追问的点，务必讲清。',
    keys: ['dp[i][j]', '滚动数组倒序', '完全背包正序'],
    src: '基础算法.md',
  },
  {
    id: 'al-016',
    type: 'essay',
    diff: 'medium',
    sub: '数组与字符串',
    q: '接雨水问题怎么解？双指针法的思路是什么？',
    ans: `**面试回答：**接雨水：给定柱子高度数组，求能接多少水。每个位置能接的水 = **min(左边最高, 右边最高) - 当前高度**。

**思路一：动态规划预处理（O(n) 时间 O(n) 空间）**：先从左到右算出每个位置的左侧最大值 leftMax[i]，再从右到左算右侧最大值 rightMax[i]，最后逐位累加 \`min(leftMax[i], rightMax[i]) - height[i]\`。直观好懂。

**思路二：双指针（O(n) 时间 O(1) 空间，最优）**：
- 左右两个指针从两端向中间移动，同时维护 leftMax、rightMax；
- **哪边最大值更小，就结算哪边**：若 leftMax < rightMax，说明左指针位置的水位由 leftMax 决定（右边必有一个 ≥ rightMax > leftMax 的墙），可以直接累加并移动左指针；反之亦然。

\`\`\`js
function trap(height) {
  let left = 0, right = height.length - 1
  let leftMax = 0, rightMax = 0, water = 0
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left])
      water += leftMax - height[left]
      left++
    } else {
      rightMax = Math.max(rightMax, height[right])
      water += rightMax - height[right]
      right--
    }
  }
  return water
}
\`\`\`

核心洞察：**位置 i 的水量只由两侧较小的一方决定**，双指针始终处理较小一侧，无需完整预处理。`,
    ana: '先讲“逐位水量公式”，再给两种实现，体现从直观到优化的思路演进。',
    keys: ['min(左最大,右最大)', '双指针 O(1) 空间', '较小侧结算'],
    src: '基础算法.md',
  },
  {
    id: 'al-017',
    type: 'essay',
    diff: 'easy',
    sub: '基础概念',
    q: 'Time 复杂度 O(n log n) 常出现在哪些算法？HashMap/Map 的查询为什么是 O(1)？',
    ans: `**面试回答：**

**O(n log n)**：基于**比较的排序**的下界（归并、快排平均、堆排序）；以及“排序 + 一层遍历”的算法模式（合并区间、四数之和预处理）。n log n 意味着 log n 层 × 每层 n 次操作（分治）。

**Map/HashMap 为什么 O(1)**：底层用**哈希表**——key 经哈希函数映射为数组下标，直接定位存储位置，无需遍历。最坏情况（哈希冲突严重退化成链表/红黑树）是 O(n)/O(log n)，平均 O(1)。Set 的 has 同理。

**常见复杂度速查**：
- 两数之和哈希法 O(n) vs 双重循环 O(n²)；
- 二分查找 O(log n)；
- 树的遍历 O(n)；
- 回溯类通常是指数级/阶乘级（N 皇后、全排列）。

面试口答复杂度时讲清“**时间花在哪一层**”比背结论更能加分。`,
    ana: '哈希冲突处理（链地址/开放寻址）可作延伸。',
    keys: ['哈希函数', '平均 O(1)', '比较排序下界'],
    src: '基础算法.md / 收集的面试知识点.md',
  },
  {
    id: 'al-018',
    type: 'code',
    diff: 'medium',
    sub: '数组与字符串',
    q: '用两种方法实现数组去重（基本类型数组），并说明对象数组如何按字段去重。',
    ans: `\`\`\`js
// 方法一：Set（首选，O(n)）
const unique1 = (arr) => [...new Set(arr)]

// 方法二：filter + indexOf（O(n²)，但直观）
const unique2 = (arr) => arr.filter((item, i) => arr.indexOf(item) === i)

// 对象数组按字段去重：用 Map 以业务字段为 key
function uniqueBy(arr, key) {
  const map = new Map()
  for (const item of arr) {
    if (!map.has(item[key])) map.set(item[key], item)
  }
  return [...map.values()]
}
uniqueBy([{ id: 1, a: 'x' }, { id: 1, b: 'y' }], 'id') // 保留第一个
\`\`\`

**要点**：
1. Set 内部用哈希结构，去重 O(n)，NaN 也会被去重（SameValueZero 语义）；
2. indexOf 是线性查找，整体 O(n²)，小数组无妨；
3. 对象是引用类型，Set 无法直接去重对象，必须**按业务字段**用 Map/对象索引；
4. 需要保留最后一个而非第一个时，倒序处理或覆盖写入。`,
    ana: 'NaN 的去重（SameValueZero）是细节加分点。',
    keys: ['new Set', 'indexOf 两次复杂度', '按字段 Map'],
    src: '知识点快速复习指南.md / 问答类型面试题.md',
  },
  {
    id: 'al-019',
    type: 'essay',
    diff: 'medium',
    sub: '字符串与 DP',
    q: '回文子串的数量怎么统计？中心扩展法和动态规划分别怎么做？',
    ans: `**面试回答：**统计字符串中回文子串个数（如 "aaa" 有 6 个：a,a,a,aa,aa,aaa）。

**思路一：中心扩展法（O(n²) 时间 O(1) 空间，推荐）**：回文一定有中心——**奇数长度**以单个字符为中心（n 个），**偶数长度**以两字符间隙为中心（n-1 个），共 2n-1 个中心。从每个中心向两侧扩展，两侧字符相等就计数 +1：

\`\`\`js
function countSubstrings(s) {
  let count = 0
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++
      l--
      r++
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i)     // 奇数长度中心
    expand(i, i + 1) // 偶数长度中心
  }
  return count
}
\`\`\`

**思路二：二维 DP（O(n²) 时间 O(n²) 空间）**：\`dp[i][j]\` 表示 s[i..j] 是否回文——
- \`s[i] !== s[j]\`：false；
- \`s[i] === s[j]\`：j - i < 2（单字符或双字符）为 true，否则 \`dp[i][j] = dp[i+1][j-1]\`；
遍历时统计 true 的个数（i 从后往前、j 从 i 往后遍历保证子问题已算）。

同构问题：最长回文子串（两者都适用）。`,
    ana: '中心扩展空间 O(1) 是面试更推荐的答法；2n-1 个中心是关键数字。',
    keys: ['中心扩展', '2n-1 个中心', 'dp[i+1][j-1]'],
    src: '基础算法.md',
  },
  {
    id: 'al-020',
    type: 'essay',
    diff: 'easy',
    sub: '树与 Trie',
    q: 'Trie（前缀树）是什么结构？有什么使用场景？',
    ans: `**面试回答：**Trie（字典树/前缀树）是专门处理**字符串前缀**的多叉树：每个节点代表一个字符，从根到某节点的路径拼出字符串；**公共前缀共享同一条路径**。

**核心操作**：insert（逐字符建子节点）、search（整词查找，需标记 isEnd）、startsWith（前缀查找，不需要 isEnd）。

**使用场景**：
1. 搜索框**输入联想/自动补全**（前缀匹配）；
2. 拼写检查、词频统计；
3. IP 路由最长前缀匹配；
4. 大量字符串的存储与去重（压缩公共前缀省空间）。

**复杂度**：插入/查找 O(L)（L 为单词长度），与词条总数无关——这是对比哈希表的优势（哈希表查前缀必须全表扫描）。

**实现要点**：节点用 Map/array 存子节点，isEnd 标记单词结束。`,
    ana: '前端关联：搜索联想输入框、路由通配匹配。',
    keys: ['前缀共享', 'isEnd 标记', 'O(L) 查找'],
    src: '基础算法.md',
  },

  {
    id: 'al-021',
    type: 'multiple',
    diff: 'easy',
    sub: '基础概念',
    q: '下列哪些排序算法的**平均时间复杂度是 O(n log n)**？（多选）',
    opts: ['归并排序', '快速排序（平均）', '堆排序', '冒泡排序'],
    ans: ['A', 'B', 'C'],
    ana: '归并、快排（平均）、堆排序都是 O(n log n)，这也是基于比较的排序的时间复杂度下界。冒泡排序是 O(n²)。前端关联：V8 的 Array.prototype.sort 对大数组使用 TimSort（归并 + 插入的混合），JS 里“排序 + 一层遍历”的算法模式（合并区间、四数之和）整体复杂度也是 O(n log n)。',
    keys: ['比较排序下界', 'TimSort', 'O(n²) 对比'],
    src: '基础算法.md',
  },
  {
    id: 'al-022',
    type: 'code',
    diff: 'medium',
    sub: '双指针与滑动窗口',
    q: '最长无重复子串怎么求？请写出滑动窗口思路。',
    ans: `**面试回答：**用滑动窗口维护一个没有重复字符的区间。

\`\`\`js
function lengthOfLongestSubstring(s) {
  const map = new Map()
  let left = 0
  let ans = 0

  for (let right = 0; right < s.length; right++) {
    const ch = s[right]
    if (map.has(ch) && map.get(ch) >= left) {
      left = map.get(ch) + 1
    }
    map.set(ch, right)
    ans = Math.max(ans, right - left + 1)
  }

  return ans
}
\`\`\`

**思路**：right 不断向右扩展窗口；遇到重复字符且它的位置在当前窗口内，就把 left 移到上一次出现位置的后一位。Map 记录字符最近一次出现下标。

**复杂度**：每个字符最多进出窗口一次，时间 O(n)，空间 O(k)。`,
    ana: '关键是 `map.get(ch) >= left`，避免被窗口左侧已经失效的旧重复字符误伤。',
    keys: ['滑动窗口', 'Map 记录下标', 'left 跳跃', 'O(n)'],
    src: '基础算法高频题',
  },
  {
    id: 'al-023',
    type: 'single',
    diff: 'medium',
    sub: '动态规划',
    q: '爬楼梯问题：每次可以爬 1 或 2 阶，爬到第 n 阶的状态转移方程是什么？',
    opts: ['dp[n] = dp[n - 1] + dp[n - 2]', 'dp[n] = dp[n - 1] * 2', 'dp[n] = n * n', 'dp[n] = max(dp[n - 1], dp[n - 2])'],
    ans: 'A',
    ana: '到第 n 阶只有两种来源：从 n-1 阶再爬 1 阶，或从 n-2 阶再爬 2 阶，所以 dp[n] = dp[n-1] + dp[n-2]。初始化一般是 dp[1] = 1，dp[2] = 2。它本质是斐波那契模型，可用两个变量滚动优化到 O(1) 空间。',
    keys: ['斐波那契模型', '状态转移', '滚动变量'],
    src: '动态规划入门题',
  },
  {
    id: 'al-024',
    type: 'essay',
    diff: 'medium',
    sub: '树与图',
    q: 'BFS 和 DFS 有什么区别？分别适合解决什么问题？',
    ans: `**面试回答：**

- **DFS（深度优先搜索）**：沿一条路径尽可能往深处走，走不通再回溯。通常用递归或栈实现，适合树的遍历、路径枚举、回溯、连通区域感染、拓扑递归等问题；
- **BFS（广度优先搜索）**：按层向外扩展，通常用队列实现，适合求无权图最短路径、二叉树层序遍历、最少步数问题。

**复杂度**：在图中二者通常都是 O(V + E)，空间取决于递归栈/队列中同时保存的节点数量。

**选择**：要求“最少几步、最短距离、按层遍历”优先 BFS；要求“枚举所有可能、判断是否存在路径、递归结构明显”优先 DFS。`,
    ana: '一句话：DFS 适合深挖与回溯，BFS 适合层序和无权最短路。',
    keys: ['递归/栈', '队列', '层序遍历', '无权最短路'],
    src: '基础算法高频题',
  },
]
