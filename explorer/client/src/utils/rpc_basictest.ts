import { SuiRpcClient, RawMonster } from "./rpc";
import { logResult } from "./utility_functions";


let _rpc = new SuiRpcClient('http://127.0.0.1:5000');

console.log('trying to read:  0x2164DB9A05AD6465A6F9D6FCDC1FA0C22AD79A95');

logResult(() => _rpc.getObjectInfoRaw('0x2164DB9A05AD6465A6F9D6FCDC1FA0C22AD79A95'));
logResult(() => _rpc.getObjectInfo<RawMonster>('0x2164DB9A05AD6465A6F9D6FCDC1FA0C22AD79A95'));
