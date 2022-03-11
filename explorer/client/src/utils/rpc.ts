import { Url } from "url"
import { ExplorerObjData } from "../pages/object-result/ObjectResult";


class SuiRpcClient {

    public host: string;

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
        }
    }
}

export type BoolString = "true" | "false";
export type OwnerField = { ObjectOwner: number[] }

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

/*
export interface Monster {
    affection_level: number;
    applied_monster_cosmetic_0: AppliedMonsterCosmetic0;
    applied_monster_cosmetic_1: AppliedMonsterCosmetic1;
    breed: number;
    buddy_level: number;
    hunger_level: number;
    id: Id;
    monster_affinity: number;
    monster_description: MonsterDescription;
    monster_img_index: number;
    monster_level: number;
    monster_name: MonsterName;
    monster_xp: number;
}
*/


export { SuiRpcClient }