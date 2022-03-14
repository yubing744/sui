import { asciiFromNumberBytes } from "./utility_functions";

class SuiRpcClient {
    public host: string;

    moveCallUrl: string;

    // TODO - stronger type for host
    public constructor(host: string) {
        this.host = host;
        this.moveCallUrl = `${host}/wallet/call`;
    }

    public async getObjectInfoRaw (id: string): Promise<object> {
        const objUrl = `${this.host}/object_info?objectId=${id}`;
        console.log(`GET   ${objUrl}`);

        let response = await fetch(objUrl);
        console.log(response);

        switch (response.status) {
            case 200: {
                const parsedJson = await response.json();
                if (!parsedJson)
                    throw new Error('unable to parse response body as JSON');
                return parsedJson;
            }
            default: {
                console.warn(response);
                throw new Error('non-200 response to GET /object_info');
            }
        }
    }

    public async moveCallRaw<TIn> (input: TIn): Promise<object> {
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

    public async getObjectInfo<T extends object> (id: string)
        : Promise<ObjectInfoResponse<T>>
    {
        return await this.getObjectInfoRaw(id) as ObjectInfoResponse<T>;
    }

    public async moveCall<TIn extends object, TOut extends object> (input: TIn)
        : Promise<MoveCallResponse<TOut>>
    {
        // TODO - implement
        return {} as MoveCallResponse<TOut>;
    }

    public static modifyForDemo<T extends object, U>(obj: T): T {
        for (var prop in obj) {
            //console.log('obj prop', prop);

            let property = obj[prop];
            //console.log('property', property);

            if (typeof(property) == 'object') {
                if ('bytes' in property) {
                    console.log("bytes IN PROPERTY", property);
                    //const objProperty = property['bytes'];
                    let mapChars = Object.assign({}, property);
                    console.log('mapChars', mapChars);

                    const pb = property as unknown as JsonHexBytes;
                    if(isValidSuiIdBytes(pb)) {
                        //let newProp = asciiFromNumberBytes(pb.bytes);
                        console.log("VALID ID BYTE ARRAY", pb.bytes);
                    }
                    //let newProp = hexToAscii(bs);
                    //console.log('ascii:  ', newProp);
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
type SuiAddressBytes = Array<number>;
type SuiAddressHexStr = string;

const TX_DIGEST_LEN = 32;
type SuiTxDigest = Array<number>;   // 32 bytes

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

export interface MoveCallResponse<T> {
    // TODO - fill in
}


const TEST_OBJ_1 = {
    owner: "AddressOwner(k#09818aac3edf9cf9b006b70c36e7241768b26386)",
    version: "5",
    id: "2164DB9A05AD6465A6F9D6FCDC1FA0C22AD79A95",
    readonly: "false",
    objType: "0x2::Geniteam::Player",
    data: {
        contents: {
            "earth_runes_count": 0,
            "fire_runes_count": 0,
            "id": {
                "id": {
                    "id": { "bytes": "2164db9a05ad6465a6f9d6fcdc1fa0c22ad79a95" }
                },
                "version": 5
            },
            "inventory": {
                "child_id": { "bytes": "c4afface77c09dc57eeb3b517bec3c1c69771e6f" },
                "parent_id": { "bytes": "2164db9a05ad6465a6f9d6fcdc1fa0c22ad79a95" }
            },
            "owned_farm": {
                "vec": [
                    {
                        "child_id": { "bytes": "fe538d19d8dbd20ee2c6e6793572cf4459800686" },
                        "parent_id": { "bytes": "2164db9a05ad6465a6f9d6fcdc1fa0c22ad79a95" }
                    }
                ]
            },
            "player_name": {
                "bytes": [
                    84,
                    101,
                    115,
                    116,
                    32,
                    80,
                    108,
                    97,
                    121,
                    101,
                    114
                ]
            },
            "water_runes_count": 0,
            "wind_runes_count": 0
        },
        "owner": {
            "AddressOwner": [
                9,
                129,
                138,
                172,
                62,
                223,
                156,
                249,
                176,
                6,
                183,
                12,
                54,
                231,
                36,
                23,
                104,
                178,
                99,
                134
            ]
        },
        "tx_digest": [
            153,
            191,
            38,
            174,
            15,
            12,
            148,
            96,
            175,
            125,
            128,
            9,
            95,
            146,
            59,
            172,
            53,
            116,
            145,
            224,
            91,
            101,
            130,
            7,
            202,
            180,
            205,
            200,
            99,
            160,
            113,
            36
        ]
    }
}

export { SuiRpcClient }