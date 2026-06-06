# 智能体消息缓冲机制
不同输入状态下的智能体处理方式
这里的输入指输入提示词并回车的操作

本文主要理解agent实现中的消息缓冲区

## 前提概念
> turn——通常指用户输入一次到智能体输出结果的过程，其中可能运行了多次llm-loop


一般情况下会有三种方式，以应对下面三种情况

- 情况一 之前没有对话或之前的对话已完成，这是新的一轮对话
- 情况二 之前的对话还没有输出结果，我希望补充之前的提示词
- 情况三 之前的对话还没有输出结果，我希望开新一轮对话

翻译上述情况如下

- 当前没有`turn`正在`Loop`中，要开新对话
- 当前的`turn`在`loop`中执行，需要把输入给到当前的 `loop` 中
- 当前的`turn`在`loop`中执行，需要等当前的`turn`完成后再执行这次输入的`turn`

对于情况二，我们称之为 `steer`，只需要在其中一次 loop 中获取输入并注入上下文即可

## 对于情况三的实现
我们需要缓冲区，即一个队列，下面是其中一种实现方式

我们把一次`turn`的输入，结合其具体信息（如所给大模型选择，所选模式，解析的文件等），包装为一个`op` - `operation`

### 伪代码
```txt
enqueue(op)
await

while !active:
    
    op = que.pop()
    if op is Null:
        修改status
        ...
        break
    
    runOperator(op)


def runOperator(op):
    解析op信息
    active = true
    修改status
    构建 loop 运行
```

### 实现效果
当之前有`turn`正在`loop`中运行，即 `!active = false` 新`req`携带的`turn`进来后，其线程`enqueu(op)`后`await`，并执行`while`后续代码，无法执行，处于之前等待状态

旧`turn`的线程执行完后，发现`op`不为`Null`，故继续执行（但上一次的结果已经`SSE`输出了），执行完新`turn`(唤醒新`turn`的线程解除`await`状态，输出新`turn`的`SSE`响应)，最后一轮`while`发现`op is Null`后结束


如果其中的`op`撤销执行，删除对应`queue`中的对应`op`即可
通常情况下，一个会话，维持一个`queue`即可

## 线程情况
旧的请求的线程，实际上执行了新请求的`turn`任务后再结束，而新`turn`的线程实际上`enqueue(op)`后，就处于`await`状态，等执行完成后被唤醒最后响应，通过`active`作为锁来协调