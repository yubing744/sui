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
                throw new Error('non-200 response to POST /wallet/call');
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
        return {} as MoveCallResponse<TOut>;
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

export interface MoveCallResponse<T> {
    // TODO - fill in
}


export { SuiRpcClient }