import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import theme from '../../styles/theme.module.css';
import { DefaultRpcClient } from '../../utils/rpc';


type DataType = {
    id: string;
    objects: {
        objectId: string,
        version: string,
        objectDigest: string
    }[];
};

function instanceOfDataType(object: any): object is DataType {
    return object !== undefined && ['id', 'objects'].every((x) => x in object);
}

function AddressResult() {
    const rpc = DefaultRpcClient;
    const { id: addressID } = useParams();
    const defaultData = { id: addressID, objects: [{}] };
    const [data, setData] = useState(defaultData);

    useEffect(() => {
        if(addressID === undefined)
            return;

        rpc.getAddressObjects(addressID)
        .then((json) => {
            console.log(json);
            json.id = addressID;
            setData(json as DataType);
        });
    }, []);

    if (instanceOfDataType(data)) {
        return (
            <div className={theme.textresults}>
                <div>
                    <div>Address ID</div>
                    <div>
                        <Longtext
                            text={data?.id}
                            category="addresses"
                            isLink={false}
                        />
                    </div>
                </div>
                <div>
                    <div>Owned Objects</div>
                    <div>
                        {data.objects.map(
                            (objectID: { objectId: string; }, index: any) => (
                            <div key={`object-${index}`}>
                                <Longtext
                                    text={objectID.objectId}
                                    category="objects"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <ErrorResult
            id={addressID}
            errorMsg="There was an issue with the data on the following address"
        />
    );
}

export default AddressResult;
export { instanceOfDataType };
