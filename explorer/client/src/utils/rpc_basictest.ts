import * as rpc from "./rpc";

let _rpc = new rpc.SuiRpcClient('http://127.0.0.1:5000');

console.log('trying to read:  0x2164DB9A05AD6465A6F9D6FCDC1FA0C22AD79A95');


_rpc.getObjectInfoRaw('0x2164DB9A05AD6465A6F9D6FCDC1FA0C22AD79A95')
.then((val) => {
    console.log(val);
}, console.error);
