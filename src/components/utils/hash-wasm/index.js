import { createMD5 } from 'hash-wasm';
import { ref } from 'vue';

const chunkSize = 64 * 1024 * 1024;
const fileReader = new FileReader();
let hasher = null;
const throughput = ref(0)

function hashChunk(chunk) {
  return new Promise((resolve, reject) => {
    fileReader.onload = async(e) => {
      const view = new Uint8Array(e.target.result);
      hasher.update(view);
      resolve();
    };

    fileReader.readAsArrayBuffer(chunk);
  });
}

const readFile = async(file) => {
  if (hasher) {
    hasher.init();
  } else {
    hasher = await createMD5();
  }

  const chunkNumber = Math.floor(file.size / chunkSize);

  for (let i = 0; i <= chunkNumber; i++) {
    const chunk = file.slice(
      chunkSize * i,
      Math.min(chunkSize * (i + 1), file.size)
    );
    await hashChunk(chunk);
  }

  const hash = hasher.digest();
  return Promise.resolve(hash);
};

export function useMD5() {
  const usedTime = ref(0)
  const readFileProcess = ref('0%')
  const fileSize = ref(0)

  const getMD5 = async (file) => {
    const start = Date.now();
    const hash = await readFile(file);
    const end = Date.now();
    const duration = end - start;
    fileSize.value = Math.floor(file.size / 1024 / 1024)
    throughput.value = Math.floor(fileSize.value / (duration / 1000))
    usedTime.value = duration
    return hash
  }

   return {
    usedTime,
    readFileProcess,
    fileSize,
    getMD5,
    throughput
   }
}