# 像写 Java/cpp 一样写 Python


## 前言

之前我说“在写算法题的层面上，CPP是浓缩的Java，或Java是繁琐版的CPP”

不妨可以把话说明白一些，Java语言的繁琐，是因为其在书写时有诸多限制与规范，也是这种标准化使得其转cpp,python等其他语言，大概率是做减法

显著的是，cpp的vector很大程度上代替了Java数组+数组集合，string代替了String,StringBuilder,char数组，以及在语法上的一些简化 使得cpp在算法中更好写

如果cpp更多的是java在集合/容器 方面的压缩，python则更多的是在语法和规则上的压缩

以我朴素的认识来看，对于一般算法题而言

| 语言 | 书写复杂度 | 运行效率 |
| -- | -- | -- |
| Java | 高 | 中高 |
| C++ | 中/高 | 极高 |
| Python | 低 | 低 |


## python当成java/cpp写的大体区别

```
Collection {

List add-remove-get

set  add-remove-contains[全体都有]

Que  offer-poll-peek[Deque可以扩展 First,Last]
}

Map put-remove-get[可能得NULL,代替containsKey]/getOrDefault

都有size, isEmpty
```

---

```
Cpp {
vector push_back-erase()-[]
set    insert-erase()-contains
Que    push_back-pop_back-front/back[deque可以为front,back]
}

map []-erase-[]

都有size,empty
```

---

```python
Python3 {
list    append-pop-[]      (add→append, remove按值删, pop按索引删)
set     add-remove-in       (contains→in, discard安全删除)
deque   append-popleft-[0]/[-1]     (offer→append, poll→popleft, peek→[0]/[-1])
}

dict   []=-pop-[]/d.get          (put→d[k]=v, remove→del/pop, get→d[k]/d.get)
d.get(k,默认)                   (getOrDefault→d.get(k, 默认))

都有 len, not x
```

---

cpp当成java写，区别如下：
对于add/offer/poll/append, 除了cpp的set要使用insert外，其他都使用push_xxx/pop_xxx
erase平替remove
对于能改中间值的，把get,set,put都改为[]

python当成java/cpp写，区别如下：
list,dict,str和vecotr,map,string一致(仅少数语法差异)
set和java一致，除了用in代替contains
对于add/offer/poll，除了python的set用add外，其他都使用append_xxx/pop_xxx(仅在deque时xxx可为left)

st,mp都用in来查存在
都有 len, not x

可见，python更像cpp去类型化，除了set如java，其他的使用如cpp套壳如把push_back换成append，把erase换成pop
另外没有queue,deque,priority_queue(heapq)，全是用[]

## 类
python的类和变量全部是public的，没有私有变量
```python
class A:
    def __init__(self, t: int):
        self.x = t
    @staticmethod
    def sout():
        print("A")
    def say(self):
        print(self.x)
a = 2
def method():
    print(f"Hello{a}")
def main():
    a_obj = A(2)
    A.sout()
    a_obj.say()
    method()
if __name__ == "__main__":
    main()
```
使用 (self) 来表示成员方法；
不传入就是静态方法，会默认传入类对象，通常推荐加上@staticmethod表明意图

self是实例本身，self.x表示实例的对象(哪个实例调用就获取对应实例的变量)

def __init__():是初始化

## 声明
java
List<List<Integer>> a = new ArrayList<>();
cpp
vector<vector<int>> a;
python
a = list() 或 a = []

cpp如同java失去右边，python如同java失去左边

python是java的右边 且 不用new

## 排序写法
PriorityQueue默认小顶堆，python和java一样，而cpp是大顶堆
a = []
heapq.heappush(a, num)
heapq.heappop(a)
我们存负数，取时取反 来实现大顶堆。理论上Java也能这样做

students = [
["Alice", 90, 18],
["Bob", 85, 20],
["Charlie", 90, 17],
]

students.sort(key=lambda x: (-x[1], x[2]))
负数为降序


## 其他

#### 语言特点
- 使用":"替代{}
  : + 缩进 = java或cpp的 大括号
  - 可以用";"
  - 没有 a++
  - && 是 and, || 是 or
  - while,for,if,else等,可以不打小括号(有时可能需要打表示优先级),但一定要有:

a , b = b , a的特点

这个是好东西
py的资料 [点击前往](https://python3-cookbook.readthedocs.io/zh-cn/latest/c01/p02_unpack_elements_from_iterables.html)

#### def 定义方法/函数

使用 def 来定义方法

python没有公有私有，也没有返回类型，不能
public static void main(){}来构建方法，不能
int main(){}来构建方法，只能
def main():

#### 传参和赋值
都是引用，和java一样
b=[] a=[] a.append(b)，实际上是放了引用，a.append(b.copy())才是深拷贝

#### IO
print() 自带换行
print("xxx", end="") 则不换行
print("awfew",a,"wef") 则a可以不为str
print(f"姓名：{name}，年龄：{age}，分数：{score:.1f}") 格式控制

input() 默认获取一行
input().split() 就能按照空格间隔，获取[]

对比java
String line = sc.nextLine();           // "12 13 1 2 3"
String[] parts = line.split(" ");      // ["12", "13", "1", "2", "3"]
sc.next() 空格间隔的获取字符
sc.next包装类型() 获取对应类型数据
while (sc.hasNext())

## 补充
和python类似的Lua
仅有 {}, table.insert(变量, x)/(变量, index, x) 用于代替append,table.remove(变量, index) 代替pop(下标),#等于len(),循环的":"换为do,if后的":"换为then,函数不加:,cpp/java用"}"的地方换为end

参考资料： [点击前往](https://www.bilibili.com/video/BV1vf4y1L7Rb/?share_source=copy_web&vd_source=931f6dd344bd9cbb619e74cca0ddd461)
```lua
local a = 2
print(a)
local b = 0;
for i = 1, 2 do
    b = b + 1
end
local tb = {1, 2, 3, c = "True"}
function solve (a, b)
    print(b)
    print(b > 2 and "Hello" or "World")
    if b == 2 then
        print(#tb .." + " .. tb[1] ..tb.c)
    end
    return a + b
end
 
print(solve(a + 1, b));
 
输出
2
2
World
3 + 1True
5
```
## 例子
### 两数之和
```txt
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        int[] znums = nums.clone();
        Arrays.sort(znums);
        while (l < r) {
            int sum = znums[l] + znums[r];
            if (sum == target) break;
            else if (sum < target) l++;
            else r--;
        }
        int i = 0, j = 0;
        for (; i < nums.length; i++) if (nums[i] == znums[l]) break;
        for (; j < nums.length; j++) if (j != i && nums[j] == znums[r]) break;
        return new int[]{i, j};
    }
}
——————————————————
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        nc = nums.copy()
        nums.sort(key=lambda x: x)
        l, r = 0, len(nums) - 1
        while l < r:
            sum = nums[l] + nums[r]
            if sum == target:
                break
            if sum < target:
                l += 1
            else: r -= 1
        for i in range(0,len(nums)):
            if nums[l] == nc[i]: break
        for j in range(0,len(nums)):
            if i != j and nums[r] == nc[j]: return [i,j]
        return [i,j]

```
### 2144. 打折购买糖果的最小开销
```java
class Solution {
    public int minimumCost(int[] cost) {
        Arrays.sort(cost);
        int l = 0, r = cost.length - 1;
        while (l < r) {
            int t = cost[l];
            cost[l++] = cost[r];
            cost[r--] = t;
        }
        int ans = 0;
        for (int i = 0; i < cost.length; i += 3) {
            if (i + 2 < cost.length) {
                if (cost[i] >= cost[i + 2] || cost[i + 1] >= cost[i + 2]) {
                    ans += cost[i] + cost[i + 1];
                } else {
                    for (int j = i; j <= i + 2; j++) ans += cost[j];
                }
            }
            else {
                for (int j = i; j < cost.length; j++)
                ans += cost[j];
                break;
            }
        }
        return ans;
    }
}
```
```cpp
class Solution {
public:
    int minimumCost(vector<int>& cost) {
        sort(cost.begin(), cost.end(), [](int a,int b){
            return a > b;
        });
        int ans = 0;
        for (int i = 0; i < cost.size(); i += 3) {
            if (i + 2 < cost.size()) {
                if (cost[i] >= cost[i + 2] || cost[i + 1] >= cost[i + 2]) {
                    ans += cost[i] + cost[i + 1];
                } else {
                    ans += cost[i] + cost[i + 1] + cost[i + 2];
                }
            } else {
                for (int j = i; j < cost.size(); j++) ans += cost[j];
            }
        }
        return ans;
    }
};
```
```python
class Solution:
    def minimumCost(self, cost: List[int]) -> int:
        cost.sort(key=lambda x : -x)
        i, ans =0, 0
        while i < len(cost):
            if i + 2 < len(cost):
                if cost[i] >= cost[i + 2] or cost[i + 1] >= cost[i + 2]:
                    ans += cost[i] + cost[i + 1]
                else:
                    ans += cost[i] + cost[i + 1] + cost[i + 2]
                i += 3
            else:
                for j in range(i, len(cost)):
                    ans += cost[j]
                break
        return ans
```