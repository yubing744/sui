import { useLocation, useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import theme from '../../styles/theme.module.css';
import mockTransactionData from '../../utils/mock_data.json';

type DataType = {
    id: string;
    objects: string[];
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
            <dl className={theme.textbox}>
                <dt>Address ID</dt>
                <dd>
                    <Longtext
                        text={data.id}
                        category="addresses"
                        isLink={false}
                    />
                </dd>

                <dt>Owned Objects</dt>
                {data.objects.map((objectID, index) => (
                    <dd key={`object-${index}`}>
                        <Longtext text={objectID} category="objects" />
                    </dd>
                ))}
            </dl>
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
