class SuiRpcClient {
    public host: string;

    moveCallUrl: string;
    addressesUrl: string;

    // TODO - stronger type for host
    public constructor(host: string) {
        this.host = host;
        this.moveCallUrl = `${host}/wallet/call`;
        this.addressesUrl = `${this.host}/addresses`;
    }

    public getAddresses = async (): Promise<object> =>
        fetch(this.addressesUrl, { mode: 'cors' })
        .then(r => r.json())

    public async getObjectInfo (id: string): Promise<object> {
        const objUrl = `${this.host}/object_info?objectId=${id}`;
        //console.log(`GET   ${objUrl}`);

        let response = null;
        try {
            response = await fetch(objUrl, { mode: 'cors' });
        } catch (e) {
            console.error(e);
            throw e;
        }

        //console.log(response);
        const parsedJson = await response.json();
        if (!parsedJson)
            throw new Error('unable to parse response body as JSON');

        console.log(parsedJson);
        switch (response.status) {
            case 200: {
                return parsedJson;
            }
            // response that came up a lot during development
            case 424: {
                console.warn('424 response mean likely requesting missing data!')
                return parsedJson;
            }
            default: {
                throw new Error(`unhandled HTTP response code: ${response.status}`);
            }
        }
    }

    public async moveCall<TIn>(input: TIn): Promise<MoveCallResponse> {
        console.log(`POST   ${this.moveCallUrl}`);

        let response = await fetch(this.moveCallUrl, {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log(response);
        switch (response.status) {
            case 200: {
                const parsedJson = response.json();
                if (!parsedJson)
                    throw new Error('unable to parse response body as JSON');
                return parsedJson;
            }
            default: {
                console.warn(response);
                throw new Error(`non-200 response to POST ${this.moveCallUrl}`);
            }
        }
    }

    public async getObjectInfoT<T extends object> (id: string)
        : Promise<ObjectInfoResponse<T>>
    {
        return await this.getObjectInfo(id) as ObjectInfoResponse<T>;
    }

    public static modifyForDemo <T extends object, U>(obj: T): T {
        for (var prop in obj) {
            //console.log('obj prop', prop);
            let property = obj[prop];
            //console.log('property', property);

            if (typeof(property) == 'object') {
                if ('bytes' in property) {
                    const pb = property as unknown as JsonHexBytes;
                    if(isValidSuiIdBytes(pb))
                        console.log("valid sui id bytes", pb.bytes);
                }

                this.modifyForDemo(property as unknown as object);
            }
        }

        return obj;
    }


}


export const hexToAscii = function(hex: string) {
    var str = "";
    var i = 0, l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i+=2) {
        var code = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(code);
    }

    return str;
}

const SUI_ADDRESS_LEN = 20;
export type SuiAddressBytes = number[];
export type Signature = number[];

type SuiAddressHexStr = string;

const TX_DIGEST_LEN = 32;
type SuiTxDigest = number[];   // 32 bytes

const hexStringPattern = /$0x[0-9a-fA-F]*^/;
const suiAddressHexPattern = /$0x[0-9a-fA-F]{20}^/;
const isBytesHexStr = (str: string) => hexStringPattern.test(str);
const isSuiAddressHexStr = (str: string) => suiAddressHexPattern.test(str);

const isValidSuiIdBytes = (obj: { bytes: string | number[] }) => {
    const bytesFieldType = typeof obj.bytes;

    if (bytesFieldType === 'object') {
        if (Array.isArray(obj.bytes)) {
            const objBytesAsArray = obj.bytes as number[];
            if(objBytesAsArray.length != SUI_ADDRESS_LEN)
                return false;

            for (let i = 0; i < objBytesAsArray.length; i++) {
                if(objBytesAsArray[i] > 255)
                    return false;
            }
            return true;
        }
        else return false
    }
    else if (bytesFieldType === 'string') {
        return isSuiAddressHexStr(obj.bytes as string);
    }

    return false;
}

export type AddressOwner = { AddressOwner: SuiAddressBytes }
type ObjectOwner = { ObjectOwner: SuiAddressBytes }
export type AnyVec = { vec: any[] }
type BoolString = "true" | "false";
const parseBoolString = (bs: BoolString) => bs === "true" ? true : false;

export type JsonBytes = { bytes: number[] }
export type JsonHexBytes = { bytes: string | number[] }

export type SuiRefHexBytes = { bytes: string }      // TODO - better types for hex strings

export interface SuiParentChildRef {
    child_id: SuiRefHexBytes,
    parent_id: SuiRefHexBytes
}

export type MoveVec = { vec: any[] }
export type TMoveVec<T extends object> = { vec: T[] }

export interface ObjectInfoResponse<T> {
    owner: string;
    version: string;
    id: string;
    readonly: BoolString;
    objType: string;
    data: SuiObject<T>;
}

export interface SuiObject<T> {
    contents: T;
    owner: ObjectOwner;
    tx_digest: number[];
}


export interface ObjectSummary {
    id: string;
    object_digest: string;
    type: string;
    version: string;
}

export interface ObjectEffectsSummary {
    created_objects: ObjectSummary[];
    mutated_objects: ObjectSummary[];
}

export interface CallTransactionResponse {
    function: string;
    gas_budget: number;
    module: string;
    object_arguments: any[];
    package: any[];
    pure_arguments: number[][];
    shared_object_arguments: any[];
    type_arguments: any[];
}

export interface TransactionKind {
    Call?: CallTransactionResponse;
}

export interface TransactionData {
    gas_payment: any[];
    kind: TransactionKind;
    sender: SuiAddressBytes;
}

export interface Transaction {
    data: TransactionData;
    signature: Signature;
}

export interface Certificate {
    signatures: Signature[][];
    transaction: Transaction;
}

export interface MoveCallResponse {
    gasUsed: number;
    objectEffectsSummary: ObjectEffectsSummary;
    certificate: Certificate;
}

export { SuiRpcClient }