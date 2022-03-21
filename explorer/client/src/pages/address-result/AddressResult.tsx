import { useLocation, useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import OwnedObjects from '../../components/ownedobjects/OwnedObjects';
import theme from '../../styles/theme.module.css';
import { findDataFromID } from '../../utils/utility_functions';
import styles from './AddressResult.module.css';

type DataType = {
    id: string;
    objects: { objectId: string }[];
};

function instanceOfDataType(object: any): object is DataType {
    return object !== undefined && ['id', 'objects'].every((x) => x in object);
}

function isNonEmptyArrayOfStrings(array: any[]): array is string[] {
    return (
        array &&
        array.length > 0 &&
        array.map((item) => typeof item).every((item) => item === 'string')
    );
}

function SuccessAddress({ data }: { data: DataType }) {
    const ownedObjects = data?.objects.map(({ objectId }) => objectId);
    return (
        <div className={theme.textresults}>
            <div>
                <div>Address ID</div>
                <div data-testid="address-id">
                    <Longtext
                        text={data?.id}
                        category="addresses"
                        isLink={false}
                    />
                </div>
            </div>
            <div>
                <div>Owned Objects</div>
                {isNonEmptyArrayOfStrings(ownedObjects) ? (
                    <OwnedObjects objects={ownedObjects} />
                ) : (
                    <div className={styles.noobjects}>
                        This address owns no objects
                    </div>
                )}
            </div>
        </div>
    );
}

function AddressResult() {
    const { state } = useLocation();
    const { id: addressID } = useParams();

    const data = findDataFromID(addressID, state);

    if (instanceOfDataType(data)) {
        return <SuccessAddress data={data} />;
    } else {
        return (
            <ErrorResult
                id={addressID}
                errorMsg="There was an issue with the data on the following address"
            />
        );
    }
}

export default AddressResult;
export { instanceOfDataType, SuccessAddress };
