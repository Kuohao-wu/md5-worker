import { ref } from 'vue';
const worker = new Worker(new URL('./worker.js', import.meta.url))

export function useMD5() {
  const fileMD5 = ref('')
  const usedTime = ref(0)
  const readFileProcess = ref('0%')
  const fileSize = ref(0)
  const throughput = ref(0)

  const fileRead = (file) => {
    const fileReader = new FileReader()
    return new Promise((resolve) => {
      
      fileSize.value = Math.floor(file.size / 1024 / 1024)
      fileReader.onprogress = e => {
        readFileProcess.value = `${Math.floor((e.loaded / e.total) * 100)}%`
      }
  
      fileReader.readAsBinaryString(file);

      fileReader.onload = e => {
         resolve(e.target.result)
      }
  })
}

  const getMD5 = async (file) => {
      let startTime = Date.now()
      usedTime.value = 0
      const data = await fileRead(file)

      worker.postMessage({
        operation:'sendArrayBuffer',
        input:data,
        threshold:0.8,
        finish:true
      })
      return new Promise((resolve) => {
        /*worker线程计算MD5完成并返回结果*/
        worker.onmessage = function(event){
          usedTime.value = Date.now() - startTime
          throughput.value = Math.floor(fileSize.value / (usedTime.value / 1000))
          /*读取完成，获取md5*/
          const md5 = event.data
          resolve(md5)
        }
      });
  }


   return {
    fileMD5,
    usedTime,
    readFileProcess,
    fileSize,
    throughput,
    getMD5
   }
}
