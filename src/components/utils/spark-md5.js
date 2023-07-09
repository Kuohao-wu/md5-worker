import SparkMD5 from 'spark-md5';
import { ref } from 'vue';

export function useMD5() {
  const fileMD5 = ref('')
  const usedTime = ref(0)
  const readFileProcess = ref('0%')
  const fileSize = ref(0)
  const throughput = ref(0)

  const getMD5 = (file) => {
    const fileReader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()
    return new Promise((resolve) => {
      let startTime = Date.now()
  
      fileSize.value = Math.floor(file.size / 1024 / 1024)
      fileReader.onprogress = e => {
        readFileProcess.value = `${Math.floor((e.loaded / e.total) * 100)}%`
      }
      usedTime.value = 0
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      const chunkSize = 1024 * 1024 * 20                           
      const chunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0

      fileReader.onload = function (e) {
          spark.append(e.target.result);
          currentChunk++;

          if (currentChunk < chunks) {
              loadNext();
          } else {
              usedTime.value = Date.now() - startTime
              throughput.value = Math.floor(fileSize.value / (usedTime.value / 1000))
              resolve(spark.end())
          }
      };

      function loadNext() {
          const start = currentChunk * chunkSize
          const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }

      loadNext();
    })
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
