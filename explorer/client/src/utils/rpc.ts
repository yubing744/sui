import { Url } from "url"



class SuiRpcClient {

    public host: string;

    public constructor(host: string) {
        this.host = host;
    }

    public readObject = async (id: string) => {
        const objUrl = `${this.host}/object_info/${id}`;

        let response = await fetch(objUrl);
        console.log(response);

        switch (response.status) {
            case 200: {

            }
        }
    }
}


export { SuiRpcClient }