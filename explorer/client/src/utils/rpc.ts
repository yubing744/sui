import { parseJsonBytes } from "./utility_functions";


async function readJsonBody(response: { body: ReadableStream<Uint8Array> | null })
    : Promise<object | null>
{
    if (!response.body) {
        console.warn('missing response body:', response);
        return null;
    }
    const buf = await response.body.getReader().read();
    return buf?.value ? parseJsonBytes(buf.value) : null;
}

class SuiRpcClient {
    public host: string;

    // TODO - stronger type for host
    public constructor(host: string) {
        this.host = host;
    }

    public async getObjectInfoRaw (id: string): Promise<ObjectInfoResponse<object>> {
        const objUrl = `${this.host}/object_info?objectId=${id}`;
        console.log(`GET   ${objUrl}`);

        let response = await fetch(objUrl);
        console.log(response);

        switch (response.status) {
            case 200: {
                const parsedJson = await readJsonBody(response);
                if (!parsedJson)
                    throw new Error('unable to parse response body as JSON');

                return parsedJson as ObjectInfoResponse<object>;
            }
            default: {
                console.warn(response);
                throw new Error('non-200 / unhandled response to GET /object_info');
            }
        }
    }

    public async getObjectInfo<T extends object> (id: string)
        : Promise<ObjectInfoResponse<T>>
    {
        return await this.getObjectInfoRaw(id) as ObjectInfoResponse<T>;
    }
}

export type BoolString = "true" | "false";
export type OwnerField = { ObjectOwner: number[] }
export type JsonBytes = { bytes: number[] }
export type JsonHexBytes = { bytes: string }
export type AnyVec = { vec: any[] }

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
    owner: OwnerField;
    tx_digest: number[];
}

export { SuiRpcClient }