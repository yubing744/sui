import mockTransactionData from './mock_data.json';
import { SuiRpcClient } from './rpc';

// API info
// const BACKEND_URL = "http://3.229.149.13:5000";
// const ADDRESS_URL = `${BACKEND_URL}/objects?address=`;
// const OBJECT_URL = `${BACKEND_URL}/object_info?objectId=`;

const findDataFromID = (targetID: string | undefined, state: any) =>
    state?.category !== undefined
        ? state
        : mockTransactionData.data.find(({ id }) => id === targetID);


const navigateWithUnknown = (input: string, navigate: Function) => {
    const data = findDataFromID(input, false);
    if (data === undefined || !('category' in data)) {
        navigate(`../missing/${input}`);
    } else if (data.category === 'transaction') {
        navigate(`../transactions/${input}`, { state: data });
    } else if (data.category === 'object') {
        navigate(`../objects/${input}`, { state: data });
    } else if (data.category === 'address') {
        navigate(`../addresses/${input}`, { state: data });
    } else {
        navigate(`../missing/${input}`);
    }
};

const logResult = function logResult<T>(task: () => Promise<T>) {
    task()
    .then((result) => {
        console.log(result);
    }, console.error);
}


export function asciiFromNumberBytes(bytes: number[]) {
    return String.fromCharCode.apply(null, bytes)
        .replace(/\0/g,'')
}

const stdLibPrefix = /^0x2::/;
export const trimStdLibPrefix = (str: string): string => str.replace(stdLibPrefix, '');

export { findDataFromID, navigateWithUnknown, logResult };
