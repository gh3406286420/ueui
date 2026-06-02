# 像写 Java/cpp 一样写 Go

## 前言

**注意：此篇为AI生成**
个人看下来，可能更接近python


## go当成java/cpp写的大体区别

Collection {

List add-remove-get

set  add-remove-contains[全体都有]

Que  offer-poll-peek[Deque可以扩展 First,Last]
}

Map put-remove-get[可能得NULL,代替containsKey]/getOrDefault

都有size, isEmpty

---

Cpp {
vector push_back-erase()-[]
set    insert-erase()-contains
Que    push_back-pop_back-front/back[deque可以为front,back]
}

map []-erase-[]

都有size,empty

---

Python3 {
list    append-pop-[]      (add→append, remove按值删, pop按索引删)
set     add-remove-in       (contains→in, discard安全删除)
deque   append-popleft-[0]/[-1]
}

dict   []=-pop-[]/d.get
d.get(k,默认)

都有 len, not x

---

Go {
slice    append()-删除(切片操作)-[]
set(map模拟)   m[k]=struct{}{}/delete(m,k)/_,ok:=m[k]
slice模拟队列栈   append(入)/q[1:](出队)/q[:len(q)-1](出栈)
}

map   m[k]=v / delete(m,k) / v,ok:=m[k]
判存  _,ok:=m[k]

都有 len, len==0

---

cpp当成java写，区别如下：
对于add/offer/poll/append, 除了cpp的set要使用insert外，其他都使用push_xxx/pop_xxx
erase平替remove
对于能改中间值的，把get,set,put都改为[]

python当成java/cpp写，区别如下：
list,dict,str和vector,map,string一致(仅少数语法差异)
set和java一致，除了用in代替contains
对于add/offer/poll，除了python的set用add外，其他都使用append_xxx/pop_xxx
st,mp都用in来查存在
都有 len, not x

go当成java/cpp写，区别如下：
slice代替数组+List，append代替add，切片操作代替remove，[]代替get/set
set不存在，用map[T]struct{}模拟，判存_,ok:=m[k]，删除delete(m,k)
slice同时充当队列和栈，入队/入栈append，出队dq=dq[1:]，出栈s=s[:len(s)-1]
Go没有内置PriorityQueue，需要手写堆(container/heap)
string不可修改，转[]byte/[]rune后再操作
map取值v,ok:=m[k]代替getOrDefault/containsKey（ok=true存在，false不存在，v为零值）
for range代替增强for
nil代替null
没有while，用for代替

### 容器的对应

```go
// ========== List / 数组 ==========
// Java: int[] a = new int[n];         C++: vector<int> a(n);      Python: a = [0]*n
// Go:
a := make([]int, n)        // 定长，全0
var a []int                // 空切片，nil
a = append(a, x)           // 追加

// ========== Set ==========
// Go没有set，用map模拟
// Java: Set<Integer> st = new HashSet<>();     C++: unordered_set<int> st;     Python: st = set()
st := make(map[int]struct{})
st[1] = struct{}{}                     // add
delete(st, 1)                          // remove
_, ok := st[1]                         // contains

// ========== Map ==========
// Java: Map<K,V> mp = new HashMap<>();    C++: unordered_map<K,V> mp;    Python: d = {}
mp := make(map[string]int)
mp["a"] = 1                            // put
v := mp["a"]                           // get（不存在返回int零值0）
v, ok := mp["a"]                       // get + 判存
delete(mp, "a")                        // remove

// ========== Queue / Deque / Stack ==========
var dq []int
dq = append(dq, x)                     // offer/enqueue/push
x = dq[0]                              // peek
dq = dq[1:]                            // poll/dequeue
dq = dq[:len(dq)-1]                    // pop(栈)

// 双端操作
dq = append([]int{x}, dq...)           // offerFirst（头插）
x = dq[len(dq)-1]                      // peekLast
dq = dq[:len(dq)-1]                    // pollLast

// 也可以用 container/list（双向链表）
import "container/list"
l := list.New()
l.PushBack(x)              // add
l.PushFront(x)             // addFirst
l.Remove(l.Front())        // poll
l.Front().Value             // peekFirst
```

### string

Go的string不可修改（类似Java），操作时转成[]byte（ASCII）或[]rune（Unicode）

```
charAt(i)           →  s[i] 或 []rune(s)[i] (Unicode)
toCharArray()       →  []byte(s) 或 []rune(s)
substring(a,b)      →  s[a:b] （和Python一样，[a,b)）
length              →  len(s)(字节数) 或 len([]rune(s))(字符数)
String.valueOf(123) →  strconv.Itoa(123) 或 fmt.Sprintf("%d",123)
Integer.valueOf(s)  →  strconv.Atoi(s)
StringBuilder       →  []byte/[]rune + append + string()
```

```go
s := "hello"
bs := []byte(s)
bs[0] = 'H'
s = string(bs)                     // "Hello"

s2 := "你好"
rs := []rune(s2)
rs[0] = '您'
s2 = string(rs)                    // "您好"

// 拼接
var sb []byte
sb = append(sb, 'a', 'b', 'c')
s3 := string(sb)                    // "abc"

// int <-> string
n, _ := strconv.Atoi("123")        // string → int
s4 := strconv.Itoa(123)            // int → string
```

## 类

Go没有class，用struct + 方法。方法在struct外面定义，通过接收者(receiver)绑定。

```go
package main

import "fmt"

type A struct {
    x int
}

// 构造函数（惯例NewXxx）
func NewA(t int) A {
    return A{x: t}
}

// 方法：值接收者
func (a A) Say() {
    fmt.Println(a.x)
}

// 方法：指针接收者（可修改）
func (a *A) Set(val int) {
    a.x = val
}

// 包级变量（类静态变量）
var a = 2

// 普通函数（类静态方法）
func sout() {
    fmt.Println("A")
}

func method() {
    fmt.Printf("Hello%d\n", a)
}

func main() {
    a := NewA(2)    // 创建实例
    sout()          // 调用包级函数 = A.sout()
    a.Say()         // 调用方法
    a.Set(3)        // 修改
    method()
}
```

关键点：

- `func (接收者) 方法名()` — 括号里的是接收者，相当于Java的`this`/Python的`self`
- 值接收者(`a A`)不修改原对象；指针接收者(`a *A`)可修改
- 包级变量+普通函数 = 静态变量+静态方法
- 首字母大写 = public，小写 = private（在包外不可见）
- 没有继承，没有构造方法（惯例用`NewXxx`）

## 声明

```java
// Java
List<List<Integer>> a = new ArrayList<>();
A a = new A(1, 2);
int[] arr = new int[n];
```

```cpp
// C++
vector<vector<int>> a;
A a(1, 2);
vector<int> arr(n);
```

```python
# Python
a = []
a = A(1, 2)
a = [0] * n
```

```go
// Go：类型在变量名后面
a := make([][]int, 0)     // 空二维切片
a := A{1, 2}              // 创建结构体（不写字段名）
a := A{x: 1}              // 指定字段名
arr := make([]int, n)     // 定长切片
var arr []int             // nil切片

// 指针形式（类似于java的new A()）
a := &A{1, 2}
a := new(A)
```

**规律：Go声明时类型写在变量名后面** `变量名 类型`，和Java/Python/Cpp都不一样。
`:=` 短声明=声明+赋值，`var` 关键词=声明但不一定赋值

## 排序写法

```go
import "sort"

// 升序
sort.Ints(arr)                   // Java: Arrays.sort(arr) / C++: sort(v.begin(),v.end())
sort.Slice(arr, func(i, j int) bool {
    return arr[i] < arr[j]
})

// 降序
sort.Slice(arr, func(i, j int) bool {
    return arr[i] > arr[j]       // 大于号就是降序
})

// 二维排序（按第一列升序，相同则按第二列降序）
sort.Slice(arr, func(i, j int) bool {
    if arr[i][0] != arr[j][0] {
        return arr[i][0] < arr[j][0]
    }
    return arr[i][1] > arr[j][1]
})

// 稳定排序
sort.SliceStable(arr, ...)
```

**Comparator规则**（和C++一样，return true表示i放前面，false表示j放前面）：


| Java                       | C++ / Go                      |
| -------------------------- | ----------------------------- |
| `a-b>0` return -1（a大，a放前面） | `a > b` return true（a大，a放前面）  |
| `a-b<0` return 1（a小，a放后面）  | `a < b` return false（a小，a放后面） |


### PriorityQueue（堆）

Go没有内置PriorityQueue，需要实现`container/heap`接口，比较繁琐：

```go
import "container/heap"

type MinHeap []int
func (h MinHeap) Len() int            { return len(h) }
func (h MinHeap) Less(i, j int) bool  { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)         { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any           { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

// 使用
h := &MinHeap{}
heap.Init(h)
heap.Push(h, 3)
heap.Push(h, 1)
x := heap.Pop(h).(int)      // 1

// 大顶堆：改Less为 > 即可

// 更简单的替代方案：排序后取
sort.Ints(arr)    // 小顶
x := arr[0]       // peek
arr = arr[1:]     // poll
arr = append(arr, newVal)
sort.Ints(arr)    // 重新排序
```

## 其他

#### 语言特点

- Go用`{}`（和Java/C++一样），不用`:`（和Python不同）
- `{` 必须和`for/if/else/func`同一行，不能换行
- `++i` / `i++` 都有，但是**语句**不是**表达式**（不能`a = i++`）
- `&&` `||` `!` 和Java/C++一样
- `==` 值比较（和Java的`equals`类似，但Go的`==`对struct是比较每个字段）
- `nil` 指针/切片/map/interface的零值（≈ `null`）
- 没有三元表达式（`a ? b : c`）
- 没有while，全部用`for`
- 没有泛型（Go 1.18+有泛型，但常用`int`/`string`等具体类型）
- 多返回值是Go的特色
- `:=` 自动推导类型
- `_` 忽略返回值

```go
// for 代替 while
for condition {              // Java: while(condition) { }
    ...
}
for {                        // Java: while(true) { }
    if ... { break }
}

// for range = 增强for
for i, x := range arr {      // i=下标, x=值
    fmt.Println(i, x)
}
for _, x := range arr {      // 忽略下标
    fmt.Println(x)
}
for k, v := range mp {       // 遍历map
    fmt.Println(k, v)
}
for k := range mp {          // 只遍历key
    fmt.Println(k)
}

// 多返回值
v, ok := mp["key"]
n, err := strconv.Atoi(s)

// := 短声明
x := 10                      // var x int = 10

// _ 忽略
_, ok := mp["key"]
```

#### func 定义方法/函数

```go
// 函数
func add(a, b int) int {
    return a + b
}

// 多返回值
func div(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("divide by zero")
    }
    return a / b, nil
}

// 方法（和struct绑定）
type Point struct { x, y int }
func (p Point) Dist() int {
    return p.x*p.x + p.y*p.y
}
```

#### 传参和赋值

- Go都是**值传递**（和Java传引用不一样）
- 但是slice/map/chan本身是引用类型，传slice时底层数组共享
- struct传参是拷贝，要修改得传指针`*T`

```go
// struct传值
type T struct { a int }
func f(v T) { v.a = 2 }           // 不修改原值
func f(v *T) { v.a = 2 }          // 修改原值

// slice传引用（底层数组共享）
func f(s []int) { s[0] = 100 }    // 会修改原slice元素
func f(s []int) { s = append(s, 1) } // 不会改原slice长度（append可能扩容）
```

#### IO

```go
import "fmt"

// 输出
fmt.Println("hello")                // 自带换行，等价System.out.println
fmt.Print("hello")                  // 不换行
fmt.Printf("name:%s, age:%d\n", name, age)  // printf格式

// 输入
var n int
fmt.Scan(&n)                         // 读一个int（空格/换行分隔）
fmt.Scanf("%d %d", &a, &b)           // 格式化读

// 行读取（推荐）
import "bufio"
import "os"
scanner := bufio.NewScanner(os.Stdin)
for scanner.Scan() {                 // 相当于while(sc.hasNextLine())
    line := scanner.Text()           // 获取一行
    fmt.Println(line)
}

// 按空格分割（一行内多个数字）
scanner.Scan()
line := scanner.Text()               // "12 13 1 2 3"
parts := strings.Fields(line)        // ["12", "13", "1", "2", "3"]
nums := make([]int, len(parts))
for i, p := range parts {
    nums[i], _ = strconv.Atoi(p)
}

// 快速读（大量数据时）
import "bufio"
reader := bufio.NewReader(os.Stdin)
line, _ := reader.ReadString('\n')   // 读到换行
line = strings.TrimSpace(line)

// 对比
// Java: sc.nextInt(), sc.nextLine(), sc.hasNext()
// C++:  cin >> x, getline(cin, s), while(cin >> x)
// Python: input(), input().split()
// Go:    fmt.Scan(&x), scanner.Scan() + scanner.Text(), strings.Fields()
```

### 补充

**Go没有的东西（算法题中常见的）**：


| 特性          | Java         | C++             | Python              | Go           |
| ----------- | ------------ | --------------- | ------------------- | ------------ |
| 三元表达式       | `a ? b : c`  | `a ? b : c`     | `b if a else c`     | ❌ 用if        |
| set         | `HashSet`    | `unordered_set` | `set()`             | ❌ 用map模拟     |
| queue/deque | `ArrayDeque` | `deque`         | `collections.deque` | ❌ 用slice模拟   |
| while       | `while(){}`  | `while(){}`     | `while():`          | ❌ 用`for`     |
| 异常捕获        | `try-catch`  | `try-catch`     | `try-except`        | ❌ error返回值   |
| 自动装箱        | ✅            | ❌               | ✅（无类型）              | ❌            |
| 泛型          | ✅            | ✅（模板）           | ✅（无类型）              | 1.18+有限支持    |
| 继承          | ✅            | ✅               | ✅                   | ❌（用组合）       |
| 重载          | ✅            | ✅               | ❌                   | ❌（参数不同时命名不同） |

---

## 例题

### 1. 两数之和

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> mp = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (mp.containsKey(target - nums[i]))
                return new int[]{mp.get(target - nums[i]), i};
            mp.put(nums[i], i);
        }
        return new int[]{};
    }
}
```

```go
func twoSum(nums []int, target int) []int {
    mp := make(map[int]int)
    for i, v := range nums {
        if j, ok := mp[target-v]; ok {
            return []int{j, i}
        }
        mp[v] = i
    }
    return nil
}
```

**对照要点**：
- `Map<Integer, Integer>` → `map[int]int`
- `containsKey` → `_, ok := mp[k]`（用`ok`判断存在）
- `put(k, v)` → `mp[k] = v`
- `get(k)` → `mp[k]`
- `for (int i = 0; ...)` → `for i, v := range nums`
- `new int[]{j, i}` → `[]int{j, i}`
- `null` → `nil`

---

### 2. 无重复字符的最长子串

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> mp = new HashMap<>();
        char[] cs = s.toCharArray();
        int mx = 0;
        for (int l = 0, i = 0; i < cs.length; i++) {
            mp.put(cs[i], mp.getOrDefault(cs[i], 0) + 1);
            while (mp.get(cs[i]) > 1) {
                mp.put(cs[l], mp.get(cs[l]) - 1);
                l++;
            }
            mx = Math.max(mx, i - l + 1);
        }
        return mx;
    }
}
```

```go
func lengthOfLongestSubstring(s string) int {
    mp := make(map[byte]int)
    mx, l := 0, 0
    for r := 0; r < len(s); r++ {
        mp[s[r]]++
        for mp[s[r]] > 1 {
            mp[s[l]]--
            l++
        }
        mx = max(mx, r-l+1)
    }
    return mx
}
```

**对照要点**：
- `toCharArray()` 不需要，Go的`s[i]`直接取byte
- `getOrDefault(cs[i], 0) + 1` → `mp[s[r]]++`（map零值初始化为0，直接++即可）
- `Math.max(a,b)` → `max(a, b)`（Go 1.21+内置，之前要手写）
- 多变量初始化：`mx, l := 0, 0`
- Go 没有 `charAt(i)`，直接 `s[i]`（s是string时取byte）

---

### 3. 合并区间

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> a = new ArrayList<>();
        int l = 0, r = 0, mx = intervals[0][1];
        a.add(new int[]{intervals[0][0], intervals[0][1]});
        for (; r < intervals.length;) {
            if (intervals[l][1] >= intervals[r][0]) {
                while (r < intervals.length && intervals[r][0] <= mx) {
                    mx = Math.max(mx, intervals[r][1]);
                    r++;
                }
                a.remove(a.size() - 1);
                a.add(new int[]{intervals[l][0], mx});
            }
            if (r < intervals.length) {
                a.add(new int[]{intervals[r][0], intervals[r][1]});
                mx = intervals[r][1];
            }
            l = r;
        }
        return a.toArray(new int[a.size()][]);
    }
}
```

```go
func merge(intervals [][]int) [][]int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    ans := make([][]int, 0)
    l, r, mx := 0, 0, intervals[0][1]
    ans = append(ans, []int{intervals[0][0], intervals[0][1]})
    for r < len(intervals) {
        if intervals[l][1] >= intervals[r][0] {
            for r < len(intervals) && intervals[r][0] <= mx {
                mx = max(mx, intervals[r][1])
                r++
            }
            ans = ans[:len(ans)-1]               // 删除最后一个
            ans = append(ans, []int{intervals[l][0], mx})
        }
        if r < len(intervals) {
            ans = append(ans, []int{intervals[r][0], intervals[r][1]})
            mx = intervals[r][1]
        }
        l = r
    }
    return ans
}
```

**对照要点**：
- `int[][]` → `[][]int`
- `Arrays.sort(intervals, (a,b)->a[0]-b[0])` → `sort.Slice(intervals, func(i,j int) bool { return intervals[i][0] < intervals[j][0] })`
- `List<int[]> a = new ArrayList<>()` → `a := make([][]int, 0)`
- `new int[]{a, b}` → `[]int{a, b}`
- `a.remove(a.size() - 1)` → `ans = ans[:len(ans)-1]`（切片删除最后一个）
- `a.add(...)` → `ans = append(ans, ...)`


