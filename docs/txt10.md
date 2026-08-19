# 使用自制Skill进行代码转化的情况

> Agent是Cursor, AI是deepseek-flash, Skill是codebridge-skill(结合了同站中的文档)
 
[点击获取Skill](https://github.com/gh3406286420/CodeBridge)

## 结论
出现了AI根据源码+Skill推测出我的不同语言的写法的情况

该Skill已公开，其主要功能是，最小化更改源码，尽可能只做同义替换，同时尽可能使用最小化的记忆量完成代码（例如：cpp可以使用数组和vector，但鉴于java中的数组可以动态声明且依旧可以通过[]访问，固抛弃数组，使用vector。又或者，python中的del是具有特色的，但对deque无法使用，且综合cpp,java,与erase,remove相近的则是pop，故放弃del）

## Java（原版）- 零钱兑换

```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE - 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int j = coin; j <= amount; j++) {
                dp[j] = Math.min(dp[j - coin] + 1, dp[j]);
            }
        }
        return dp[amount] == Integer.MAX_VALUE - 1 ? -1 : dp[amount];
    }
}
```
### Python3(我写的)
```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [100000] * (amount + 1)
        dp[0] = 0
        for coin in coins:
            for j in range(coin, amount + 1):
                dp[j] = min(dp[j - coin] + 1,dp[j])
        if dp[amount] == 100000:
            return -1
        return dp[amount]
```

### Python3(Skill)

```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        INF = 10 ** 9
        dp = [INF] * (amount + 1)
        dp[0] = 0
        for coin in coins:
            for j in range(coin, amount + 1):
                dp[j] = min(dp[j - coin] + 1, dp[j])
        return -1 if dp[amount] == INF else dp[amount]
```
### C++(我写的)
```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, INT_MAX - 1);
        dp[0] = 0;
        for (auto coin : coins) {
            for (int j = coin; j <= amount; j++) {
                dp[j] = min(dp[j - coin] + 1, dp[j]);
            }
        }
        return dp[amount] == INT_MAX - 1 ? -1 : dp[amount];
    }
};
```

### C++(Skill)

```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, INT_MAX - 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int j = coin; j <= amount; j++) {
                dp[j] = min(dp[j - coin] + 1, dp[j]);
            }
        }
        return dp[amount] == INT_MAX - 1 ? -1 : dp[amount];
    }
};
```
### Go(Skill)

```go
func coinChange(coins []int, amount int) int {
    INF := 1 << 30
    dp := make([]int, amount+1)
    for i := range dp {
        dp[i] = INF
    }
    dp[0] = 0
    for _, coin := range coins {
        for j := coin; j <= amount; j++ {
            dp[j] = min(dp[j-coin]+1, dp[j])
        }
    }
    if dp[amount] == INF {
        return -1
    }
    return dp[amount]
}
```

## C++（原版）- 合并区间
```cpp
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

### Java(我写的)
```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        int l = 0, r = 0, mx = 0;
        mx = intervals[r][1];
        List<int[]> a = new ArrayList<>();
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
        int[][] ans = new int[a.size()][];
        for (int i = 0; i < a.size(); i++) ans[i] = a.get(i);
        return ans;
    }
}
```
### Java(Skill)
```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        int l = 0, r = 0, mx = intervals[r][1];
        List<int[]> a = new ArrayList<>();
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
                mx = intervals[r][1];
                a.add(new int[]{intervals[l][0], mx});
            }
            l = r;
        }
        int[][] ans = new int[a.size()][];
        for (int i = 0; i < a.size(); i++) ans[i] = a.get(i);
        return ans;
    }
}
```

### Python(Skill)
```python
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda x: x[0])
        a = []
        l, r, mx = 0, 0, intervals[0][1]
        a.append([intervals[0][0], intervals[0][1]])
        while r < len(intervals):
            if intervals[l][1] >= intervals[r][0]:
                while r < len(intervals) and intervals[r][0] <= mx:
                    mx = max(mx, intervals[r][1])
                    r += 1
                a.pop()
                a.append([intervals[l][0], mx])
            if r < len(intervals):
                mx = intervals[r][1]
                a.append([intervals[l][0], mx])
            l = r
        return a
```