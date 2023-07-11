import { ref } from 'vue';
import * as Comlink from 'comlink';
const readFile = Comlink.wrap(new Worker(new URL('./worker.js', import.meta.url)))

const throughput = ref(0)

export function useMD5() {
  const usedTime = ref(0)
  const readFileProcess = ref('0%')
  const fileSize = ref(0)

  const getMD5 = async (file) => {

    const start = Date.now();
    const md5 = await readFile(file)
    const end = Date.now();
    const duration = end - start;
    fileSize.value = Math.floor(file.size / 1024 / 1024)
    throughput.value = Math.floor(fileSize.value / (duration / 1000))
    usedTime.value = duration
    return md5
  }

   return {
    usedTime,
    readFileProcess,
    fileSize,
    getMD5,
    throughput
   }
}