# 像写Java一样写C++
### 前言
AI时代下，什么才算掌握一门语言？掌握的定义是什么？拿Java来说，面试时我会说，我会Javase,jvm,juc，然而这就是掌握这门语言了吗？或许我还知道各种集合的一些原理，但这就算熟练了吗？

我想可能如此，面试层面的掌握，仅仅是你会用这门语言写算法题，知道这个语言的一些底层原理，机制。不妨把话说明白些，会写算法题，并知道一堆东西，就算是掌握了。否则，很多人都无法掌握一门语言，即使我们学过c语言，但是你可敢说你会c语言吗？对于一门语言而言，我相信即使是最有技术能力的前辈，恐怕也不敢说其对一门语言的每个方法，历史处理逻辑的全部变更都了如指掌，但是，我们不能说只有记住了所有的东西才算掌握，即使是在过去，代码补全都会存在，而今日，AI的发展下，或许将更是如此


我之前学的cpp，后费了很大劲转了java
写这些文字时
曾经的cpp的题量是洛谷117题，加上力扣，cf，天梯赛等，总的算大概200个左右，使用该语言学习过最复杂的问题是多重权重的最短路径或Johnson；当前的java的题量是240题

考虑到cpp在校招笔试，升学复试，期末考试方面都有涉及，又不可不完全放弃，甚至还需要保持些热度，以提供更多可能性。故写此文


主要是基于Java的视角，企图回答如何最小化或最符合记忆模式的更改，能将java转化为cpp，即如何像写java一样写cpp，同时也可以反过来，为基于cpp学java提供一些思路


在写算法题的层面上，CPP是浓缩的Java，或Java是繁琐版的CPP


Java比cpp在默认情况下时，java很区分 引用 与 实例
但cpp通常直接获取 实例，
进而体系在 声明方式，类的使用，传参与赋值

java拿到的是引用
cpp的类本身就是类实例，所以其方法都能直接用.调用



### cpp当成java写的大体区别
```
根据[

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
对于add/offer/poll/append, 除了cpp的set要使用insert外，其他都使用push_xxx/pop_xxx
erase平替remove【erase传入下标时统一用begin()+index】
对于能改中间值的，把get,set,put都改为[]

### string=StringBuilder + String + char[]
```
对于字符串,Java可能会把其化为char[]/StringBuilder来操作,或charAt,setCharAt之类，再转化回去。而cpp则视为char[]直接操作。java中用Builder来append,remove(x.size()-1)或deleteCharAt(前者更通用)之类，而cpp中依旧push_xxx,erase可以代替，而且都有insert且效果与使用方法一样。都有length()
【总结来看，string=String+StringBuilder+char[]】【如果没有Integer.valueOf(Str)或String.valueOf()】
int → 字符串	String.valueOf(123)	to_string(123)
字符串 → int	Integer.valueOf(str)	stoi(str)
其他情况下Java一般还记得的方法就是isDigit或isLetter，但其实也可以代替，而唯一的仅剩下num <-> string的转换如果记得cpp的方法，cpp也能代替。最后如果非常需要String.valueOf则使用Java
【即cpp能满足java中的各种String的要求，除了一定要String.valueOf的场景】
```
// Java
s.substring(a, b);    // [a, b)
// C++
s.substr(a, b - a);   // 从 a 开始，取 b-a 个 = [a, b)
### vector=List + Java数组
有时我们可能使用vector的assign(大小, 值)来对整个数组赋值
且能动态大小，而cpp的int[]不能 a[n]，必须确定，但是Java中可以，priority_queue中不能<int[]>，而Java中可以。且我们通常不在里面放List<>，比较麻烦，用int[]就满足要求

vector类似于 Java的数组+数组集合。
数组层面
Java的数组可以动态初始化大小，而vector也行[Java int[] a = new int[n];Cpp vector<int> a(n)]。Java数组有Arrays.fill(数组,赋值)来全部赋值，vector有assign()来赋值。
vector可以直接[]来赋值和获取值
数组集合层面
vector可以像List一样有add,remove,isEmpty,size[push_back,erase]

int[] a = {1,2,3};	int a[] = {1,2,3};	vector<int> a = {1,2,3};均合法


int[][] a = new int[n][m];
// Java — 当 List 用（只建外层，内层待添加）
List<List<Integer>> list = new ArrayList<>();
对应CPP为
// C++ — 当数组用（行列固定，全 0）
vector<vector<int>> a(n, vector<int>(m, 0));
// C++ — 当 List 用（外层 n 个空 vector，和 Java 循环 add 效果一样）
vector<vector<int>> a(n);

// Java — 拷贝一份加入
list.add(new ArrayList<>(list2));
// Java — 共享引用加入
list.add(list2);
// C++ — 拷贝加入
a.push_back(vec2); 或 a.push_back(vector<类型>vec2);【都是深拷贝】
### 类
cpp中的方法，可以public: 方法 来处理，以保持和java一致，构造方法cpp向java那样写即可【java统一写static class】【cpp默认全部static】传参上cpp默认深拷贝，加&才是引用。
【null对应nullptr】【cpp中一般方法和变量都用'.'，而对于指针用->（如果是指针来获取方法或变量，使用->）】

用X::method来调用静态方法，java也用·

区别在于Java中，类中的方法如果不是静态的，就需要用实例对象来调用【因为静态的才是程序一开始就初始化的，才能直接用】
而cpp则直接获取的是实例本身，所以能直接用

```java
public class Main {
    static int a = 2;
    public static void method() {
        System.out.println("Hello" + a);
    }
    static class A{
        int x;
        public A(int t) {
            x = t;
        }
        public static void sout() {
            System.out.println("A");
        }
        public void say() {
            System.out.println(x);
        }
    }
    
    public static void main(String[] args) {
        A a = new A(2);
        A.sout();
        a.say();
        method();
    }
}
```
```cpp
#include<iostream>
int a = 2;
void method() {
    std::cout << "Hello" << a << std::endl;
}
class A {
    int x;
    public: A(int t) {
        x = t;
    }
    public: static void sout() {
        std::cout << "A" << std::endl;
    }
    public: void say() {
        std::cout << x << std::endl;
    }
};
int main () {
    A a(2);
    A::sout();
    a.say();
    method();
}
```
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
### 声明
java A a = new A(1, 2); cpp A a(1, 2);
其他的也是java声明的只是引用，new了才是实例，而cpp直接是实例
【因为cpp都是栈上分配，除非用new】

### 排序写法

**Java中普遍使用 `{...} -> {...}`**
且对象用Collections.sort,可以传入{}->()，而数组则Arrays.sort()只有升序

```cpp
Cpp中也用 `[](...){...}`，但 对于sort(nums.begin(), nums.end(), `[](){}`)。
而对于priority_queue中则需要写 auto cmp = `[](){}`，
然后 priority_queue<type, 容器<type>, decltype(cmp)> pq(cmp)
```
sort(原生数组) 或 sort(对象数组.begin(),对象数组.end())

对于Cmp
java中 a > b return -1 表明 a大,放前面。a < b return 1 表明 a 小放后面。都是降序
return -1 就表明 a 放前面，return 1表明放后面，相等则return 0

Cpp是 return true表明放前面，return false 表明放后面


### 其他
#### 指针
Java中默认的变量都是引用，这些引用直接关联的对象也通常是GC的起点

C++的容器中，存放的也是引用，但C++的引用其实是指针

所以map<int,TreeNode*>在cpp中合法，Map<Integer,TreeNode>在java中合法

同时，当我们new TreeNode()时，new返回的结果就是指针本身，且是指向堆中对象的指针

另外，C++中的空指针为nullptr

样例参考 [点击跳转](txt8.md#_12)
#### 特殊点
Nod nod = mp.get(key);
if (nod == null) {
// key 不存在，但 map 没被修改
}
对于Java是安全的，对于cpp通常使用find，但是不想记的话，最好不要用。即我们使用containsKey(key)<->contains(key)
即如果要把java转化为cpp，java中不要出现上面这种写法


此外，java中用contains/containsKey，cpp中20才有，可能需要完全使用count()替代

for (const auto& p : m) {
// 直接使用p.first, p.second
}
#### 容器与集合的对应
ArrayList, LinkedList, CopyOnWriteArrayList, Vector
HashSet, TreeSet, ConcurrentHashSet, LinkedHashSet
ArrayDeque, LinkedList, BlockingQueue

HashMap, TreeMap, ConcurrentHashMap, LinkedHashMap


记忆层面，除了特殊的
vector,其他的都有种把Java的接口类型当数据类型一样的美
比如Java中Map<K,V>, cpp中的map就是数据类型，set同理。只是多记个unordered,不加的为TreeSet/Map，加了为Hash的
Deque对应deque

// ========== List ==========
// ArrayList
vector<int> a;

// LinkedList → list
list<int> lst;


// ========== Set ==========
// HashSet → unordered_set
unordered_set<int> us;

// TreeSet → set
set<int> s;


// ========== Queue / Deque ==========
// ArrayDeque → deque
deque<int> dq;
list<int> lst;
// LinkedList → list（同 List 那个）


// ========== Map ==========
// HashMap → unordered_map
unordered_map<int, string> um;

// TreeMap → map
map<int, string> m;


####  传参与赋值

**Cpp中的对象，如果 a = b，实际是 对 b对象的深拷贝。而Java中则是传递引用。传参时也是如此**

在java中int[] znums = nums;实际上会把znums引用到nums【int[] znums = nums.clone() 才是深拷贝】，而cpp中，原生数组不是对象，这样不代表深拷贝，只能自己手动实现

#### IO
cin(空格间隔), getline() 获取一行
cout,printf()
endl, "\n"控制换行
while(cin >> x)
## 无重复字符的最长子串
```
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
——————————————————
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char,int> mp;
        int l = 0, r= 0, mx = 0;
        for (; r < s.length(); r++) {
            mp[s[r]]++;
            while (mp[s[r]] > 1) {
                mp[s[l]]--;
                l++;
            }
            mx = max(r - l + 1, mx);
        }
        return mx;
    }
};
```
## 找到字符串中所有字母异位词
```
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        Map<Character, Integer> mp = new HashMap<>();
        for (int i = 0; i < p.length(); i++) mp.put(p.charAt(i), mp.getOrDefault(p.charAt(i), 0) + 1);
        int len = mp.size();
        char[] cs = s.toCharArray();
        int count = 0;
        List<Integer> a = new ArrayList<>();
        for (int l = 0, r = 0; r < cs.length; r++) {
            mp.put(cs[r], mp.getOrDefault(cs[r], 0) - 1);
            if (mp.get(cs[r]) == 0) count++;
            while (mp.get(cs[r]) < 0) {
                if (mp.get(cs[l]) == 0) count--;
                mp.put(cs[l], mp.get(cs[l]) + 1);
                l++;
            }
            if (count == len) a.add(l);
        }
        return a;
    }
}
___________
class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        unordered_map<char,int> mp;
        unordered_set<char> st;
        int l = 0, r = 0;
        for (auto& x : p) {
            mp[x]++;st.insert(x);
        }
        vector<int> a;
        int type = 0;
        for (; r < s.length(); r++) {
            mp[s[r]]--;
            if (st.count(s[r]) != 0 && mp[s[r]] == 0) type++;
            while (mp[s[r]] < 0) {
                if (st.count(s[l]) != 0 && mp[s[l]] == 0) type--;
                mp[s[l]]++;
                l++;
            }
            if (r - l + 1 == p.size() && type == st.size()) a.push_back(l);
        }
        return a;
    }
};
```
## 合并区间
```
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        int l = 0, r = 0, mx = 0;
        mx = intervals[r][1];
        List<int[]> a = new ArrayList<>();
        a.add(new int[]{intervals[0][0], intervals[0][1]});//可以省略new int[]
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
                mx = intervals[r][1];//别忘了更新
            }
            l = r;
        }
        int[][] ans = new int[a.size()][];
        for (int i = 0; i < a.size(); i++) ans[i] = a.get(i);
        return ans;
    }
}
// 有交集[坏子]就while去除坏子，没有就正常入窗口
_______
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(), [](auto a, auto b){
            if (a[0] < b[0]) return true;
            else return false;
        });
        vector<vector<int>> a;
        int l = 0, r = 0, mx = intervals[0][1];
        a.push_back({intervals[0][0], intervals[0][1]});
        for (; r < intervals.size();) {
            if (intervals[l][1] >= intervals[r][0]) {
                while (r < intervals.size() && intervals[r][0] <= mx) {
                    mx = max(mx, intervals[r][1]);
                    r++;
                }
                a.erase(a.end() - 1);
                a.push_back({intervals[l][0], mx});
            }
            if (r < intervals.size()) {
                mx = intervals[r][1];
                a.push_back({intervals[l][0], mx});
            }
            l = r;
        }
        return a;
    }
};
```


## 两两交换链表中的节点
```
class Solution {
    public ListNode swapPairs(ListNode head) {
        if (head == null) return head;

        List<Integer> a = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            a.add(cur.val);
            cur = cur.next;
        }
        
        int len = a.size();
        for (int i = 1; i < len; i += 2) {
            Integer t = a.get(i - 1);
            a.set(i - 1, a.get(i));
            a.set(i, t);
        }
        
        ListNode h = new ListNode(a.get(0));
        cur = h;
        for (int i = 1; i < len; i++) {
            ListNode nod = new ListNode(a.get(i));
            cur.next = nod;
            cur = cur.next;
        }
        return h;
    }
}
_____
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        vector<int> a;
        ListNode* cur = head;
        while (cur != nullptr) {
            a.push_back(cur->val);
            cur = cur->next;
        }
        for (int i = 1; i < a.size(); i += 2) {
            int t = a[i];
            a[i] = a[i - 1];
            a[i - 1] = t;
        }
        if (a.empty()) return nullptr;
        ListNode* h = new ListNode(a[0]);
        cur = h;
        for (int i = 1; i < a.size(); i++) {
            ListNode* nod = new ListNode(a[i]);
            cur->next = nod;
            cur = nod;
        }
        return h;
    }
};
```