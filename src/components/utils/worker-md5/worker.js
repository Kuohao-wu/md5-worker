importScripts('../../../../node_modules/spark-md5/spark-md5.js');

const md5 = new SparkMD5();

/*接收到主线程发来的文件*/
self.onmessage = function(event){
    md5.appendBinary(event.data.input)
    postMessage(md5.end())
}