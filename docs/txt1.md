# 记一次抢单接口压测踩坑：从本地假上限到云环境受限

<br>

## 背景

<br>

对Java后端抢单接口进行压力测试，目标是找到吞吐量上限。整个过程中，测试环境经历了三次变化，每次都踩到了不同的坑。

<br>

---

<br>

## 第一阶段：本地单机压测（JMeter与服务同机）

<br>

**基础配置：**

<br>

JMeter和服务部署在同一台电脑上，Ramp-Up统一为30秒。

<br>

**测试过程：**

<br>

先是固定循环次数：

<br>

- 80线程 × 循环100次：跑到 1500.4/sec 后出现异常

<br>

- 50线程 × 循环100次：跑到 1543/sec 后出现异常

<br>

两组数据高度接近，怀疑摸到了某种上限。

<br>

接着改为永远循环，逐步调整线程数：

<br>

- 400线程：一开始就大量异常，测试无法正常进行

<br>

- 350线程和300线程：吞吐量均稳定在约1500/sec

<br>

看起来像是找到了系统瓶颈。

<br>

然后用单线程验证：

<br>

- 1线程，永远循环：冲到约140/sec后，立刻大量报错

<br>

矛盾出现了：如果吞吐量连140都不到，之前的1500是怎么出来的？

<br>

**关键线索：**

<br>

单线程失败请求的错误详情：

<br>

- Response code: `Non HTTP response code: java.net.BindException`

<br>

- Response message: `Non HTTP response message: Address already in use: connect`

<br>

- Load time: 2ms

<br>

`BindException`——端口已被占用，无法再发起新连接。而成功连上的请求，耗时仅2毫秒。

<br>

**阶段结论：**

<br>

报错原因不是服务扛不住，恰恰是服务处理太快。每个连接2毫秒完成，大量短连接迅速耗尽本机可用端口，新连接无处建立，直接报错。

<br>

1500/sec 测的是本机能发出请求的上限。这一阶段的所有数据均不能反映服务真实处理能力。

<br>

---

<br>

## 第二阶段：Linux云环境部署压测

<br>

将服务部署到云服务器上，配置如下：

<br>

- 规格：3Mbps带宽，1核2G

<br>

- JVM参数：`-Xms128M -Xmx160M -XX:MetaspaceSize=32M -XX:MaxMetaspaceSize=64M -XX:MaxDirectMemorySize=24M -XX:ReservedCodeCacheSize=24M -Xss256K -XX:+UseContainerSupport -XX:+UseSerialGC -XX:TieredStopAtLevel=1 -XX:+DisableExplicitGC -XX:+UseCompressedOops -XX:+UseCompressedClassPointers`

<br>

**压测结果：** 50/sec

<br>

**阶段分析：**

<br>

瓶颈出在多个层面：

<br>

1. **带宽：** 3Mbps，按每个请求几KB算，理论极限也就几十到上百TPS，50/sec已经接近物理带宽上限。

<br>

2. **CPU：** 单核，没有任何并发处理余量。

<br>

3. **JVM内存配置过小，且与GC策略冲突：**

<br>

- 堆内存仅128M-160M。Spring Boot框架本身就要占几十兆，剩余空间极窄，稍有点并发就会频繁触发GC。

<br>

- `-XX:+UseSerialGC` 是单线程垃圾回收器，回收时会暂停所有业务线程（Stop The World）。堆越小，GC越频繁；单线程回收越慢，每次暂停时间越长。业务线程频繁被暂停，吞吐量直接被打下来。

<br>

- `-Xss256K` 线程栈偏小，限制了单个线程的方法调用深度，稍复杂的链式调用就有栈溢出风险。

<br>

- `-XX:MaxDirectMemorySize=24M` 和 `-XX:ReservedCodeCacheSize=24M` 也都偏紧，给直接内存和JIT编译缓存留的空间都很小，进一步制约了性能。

<br>

**阶段结论：** 1核CPU + 3Mbps带宽 + 160M堆 + SerialGC，50/sec是这套极低配环境的综合瓶颈，数据能反映该配置下的真实上限。

<br>

---
<br>

## 第三阶段：内网穿透远程压测

<br>

为了打破云服务器资源限制，改回本地运行服务，通过Natapp免费隧道内网穿透，由另一台电脑的JMeter远程压测。

<br>

**测试过程：**

<br>

一经尝试就发现问题：

<br>

- 并发稍高即返回409，被隧道限流，无法正常压测

<br>

- 降为极低负载：1线程，Ramp-Up 20秒，固定定时器2000ms

<br>

- 最高仅 28.7/min

<br>

Natapp免费隧道有严格的并发限制，解除需购买年度隧道开白名单。此阶段同样无法测出服务真实性能。