import { useLocation, useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import theme from '../../styles/theme.module.css';
import mockTransactionData from '../../utils/mock_data.json';

type DataType = {
    id: string;
    objects: { objectId: string }[];
};

function instanceOfDataType(object: any): object is DataType {
    return object !== undefined && ['id', 'objects'].every((x) => x in object);
}

function AddressResult() {
    const { state } = useLocation();
    const { id: addressID } = useParams();

    const data =
        state || mockTransactionData.data.find(({ id }) => id === addressID);

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
                        {data.objects.map((objectID, index) => (
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
