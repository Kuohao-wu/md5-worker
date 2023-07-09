<script setup>
import { ref } from 'vue';
// import { useMD5 } from './utils/spark-md5';
// import { useMD5 } from './utils/worker-md5/index';
// import { useMD5 } from './utils/hash-wasm/index';
import { useMD5 } from './utils/worker-hash-wasm/index';

defineProps({
  msg: String,
})

const fileMD5 = ref('')

const { readFileProcess, fileSize, getMD5, usedTime, throughput } = useMD5()

const changeHandler = async (evt) => {
  const file = evt.target.files[0];
  const res = await getMD5(file)
  fileMD5.value = res
  evt.target.value = ''
}

</script>

<template>
  <h1>{{ msg }}</h1>
  <div class="content">
    <input type="file" @change="changeHandler">
    <div>文件读取进度: {{ readFileProcess }}</div>
    <div>文件MD5: {{ fileMD5 }}</div>
    <div>耗时: {{ usedTime }}ms</div>
    <div>文件大小: {{ fileSize }}mb</div>
    <div>IO速率: {{ throughput }}mb/s</div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.content {
  width: 450px;
  margin: 0 auto;
  text-align: left;
  line-height: 2.15;
  padding-left: 200px;
}
</style>
