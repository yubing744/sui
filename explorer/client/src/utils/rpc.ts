

async function readJsonBody(response: { body: ReadableStream<Uint8Array> | null })
    : Promise<object | null>
{
    if (!response.body) {
        console.warn('missing response body:', response);
        return null;
    }
    if('getReader' in response.body) {
        const buf = await response.body.getReader().read();
        return buf?.value ? parseJsonBytes(buf.value) : null;
    }
    else {
        console.error("MISSING ReadableStream.getReader()");
        return null;
    }
}

class SuiRpcClient {
    public host: string;

    // TODO - stronger type for host
    public constructor(host: string) {
        this.host = host;
    }

    public getObjectInfoRaw = async (id: string) => {
        const objUrl = `${this.host}/object_info?objectId=${id}`;
        console.log(`GET   ${objUrl}`);

        let response = await fetch(objUrl);
        console.log(response);

        switch (response.status) {
            case 200: {
                return response.body != null ? readJsonBody(response) : null;
            }
            default:
                console.warn(response); return null;
        }
    }

    public async getObjectInfo<T extends object> (id: string)
        : Promise<ObjectInfoResponse<T>>
    {
        const json = await this.getObjectInfoRaw(id);
        const asType = json as ObjectInfoResponse<T>;
        // TODO - real errors
        return asType;
    }
}

const textDecoder = new TextDecoder();
export function parseJsonBytes(buffer: Uint8Array): object | null {
    let asStr = textDecoder.decode(buffer);
    return asStr ? JSON.parse(asStr) : null;
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


// demo-specific types below here
export type CosmeticOption = AnyVec | RawCosmetic;

export interface RawCosmetic {
    cosmetic_type: number;
    id: string;
}

export interface RawMonster {
    affection_level: number;
    applied_monster_cosmetic_0: CosmeticOption;
    applied_monster_cosmetic_1: CosmeticOption;
    breed: number;
    buddy_level: number;
    hunger_level: number;
    id: string;
    monster_affinity: number;
    monster_description: JsonBytes;
    monster_img_index: number;
    monster_level: number;
    monster_name: JsonBytes;
    monster_xp: number;
}

export interface RawPetMonsters {
    child_id: JsonHexBytes;
    parent_id: JsonHexBytes;
}

export interface RawFarm {
    applied_farm_cosmetic_0: CosmeticOption;
    applied_farm_cosmetic_1: CosmeticOption;
    current_xp: number;
    farm_img_index: number;
    farm_name: JsonBytes;
    id: string;
    level: number;
    occupied_monster_slots: number;
    pet_monsters: RawPetMonsters;
    total_monster_slots: number;
}


export { SuiRpcClient }