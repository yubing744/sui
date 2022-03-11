
class SuiRpcClient {
    public host: string;

    // TODO - stronger type for host
    public constructor(host: string) {
        this.host = host;
    }

    public readObject = async (id: string) => {
        const objUrl = `${this.host}/object_info?objectId=${id}`;
        console.log(`GET   ${objUrl}`);

        let response = await fetch(objUrl);
        console.log(response);

        switch (response.status) {
            case 200: {
                return response.body?.getReader().read();
            }
            default:
                console.warn(response);
        }
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
    data: Data<T>;
}

export interface Data<T> {
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