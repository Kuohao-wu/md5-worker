import { ref } from 'vue';
const worker = new Worker(new URL('./worker.js', import.meta.url))

const throughput = ref(0)

export function useMD5() {
  const usedTime = ref(0)
  const readFileProcess = ref('0%')
  const fileSize = ref(0)

  const getMD5 = async (file) => {
    const start = Date.now();
    worker.postMessage({
      operation:'sendArrayBuffer',
      input: file,
      threshold:0.8,
      finish:true
    })
    
    return new Promise((resolve) => {
      /*worker线程计算MD5完成并返回结果*/
      worker.onmessage = function(event){
        const end = Date.now();
        const duration = end - start;
        fileSize.value = Math.floor(file.size / 1024 / 1024)
        throughput.value = Math.floor(fileSize.value / (duration / 1000))
        usedTime.value = duration
        /*读取完成，获取md5*/
        const md5 = event.data
        resolve(md5)
      }
    });
  }

   return {
    usedTime,
    readFileProcess,
    fileSize,
    getMD5,
    throughput
   }
}