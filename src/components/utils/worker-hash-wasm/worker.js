importScripts('../../../../node_modules/hash-wasm/dist/md5.umd.min.js');

const chunkSize = 64 * 1024 * 1024;
const fileReader = new FileReader();
let md5 = null;

function hashChunk(chunk) {
  return new Promise((resolve) => {
    fileReader.onload = async(e) => {
      const view = new Uint8Array(e.target.result);
      md5.update(view);
      resolve();
    };

    fileReader.readAsArrayBuffer(chunk);
  });
}

const readFile = async(file) => {
  if (md5) {
    md5.init();
  } else {
    md5 = await hashwasm.createMD5();
  }

  const chunkNumber = Math.floor(file.size / chunkSize);

  for (let i = 0; i <= chunkNumber; i++) {
    const chunk = file.slice(
      chunkSize * i,
      Math.min(chunkSize * (i + 1), file.size)
    );
    await hashChunk(chunk);
  }

  const hash = md5.digest();
  return hash
};

/*接收到主线程发来的文件*/
self.onmessage = async function(event){
  const hash = await readFile(event.data.input)
  postMessage(hash)
}
