# 各种MD5的计算方案

* 目前最优的方案是 hash-wasm + worker的方式进行计算

* 打开控制台会导致hash-wasm的io性能下降，https://github.com/Daninet/hash-wasm/issues/46

* 各个md库的性能对比： https://daninet.github.io/hash-wasm-benchmark/
