// eslint-disable-next-line no-undef
importScripts("../../../../node_modules/comlink/dist/umd/comlink.js");
importScripts('../../../../node_modules/hash-wasm/dist/md5.umd.min.js');


// 文件分片大小
const chunkSize = 64 * 1024 * 1024;


const readFile = async (file) => {
  let md5 = null;
  const fileReader = new FileReader();

  function hashChunk(chunk) {
    return new Promise((resolve) => {
      fileReader.onload = async (e) => {
        const view = new Uint8Array(e.target.result);
        md5.update(view);
        resolve();
      };

      fileReader.readAsArrayBuffer(chunk);
    });
  }

  if (md5) {
    md5.init();
  } else {
    // eslint-disable-next-line no-undef
    md5 = await hashwasm.createMD5();
  }

  const chunkNumber = Math.floor(file.size / chunkSize);

  // eslint-disable-next-line no-unreachable-loop, no-plusplus
  for (let i = 0; i <= chunkNumber; i++) {
    const chunk = file.slice(
      chunkSize * i,
      Math.min(chunkSize * (i + 1), file.size)
    );
    // eslint-disable-next-line no-await-in-loop
    await hashChunk(chunk);
  }

  const hash = md5.digest();
  return hash;
};

Comlink.expose(readFile);

// /* 接收到主线程发来的文件 */
// onmessage = async (event) => {
//   const hash = await readFile(event.data.input);
//   postMessage(hash);
// };
