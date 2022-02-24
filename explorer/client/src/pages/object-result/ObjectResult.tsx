import { useLocation, useParams } from 'react-router-dom';

import mockTransactionData from '../../utils/mock_data.json';
import styles from './ObjectResult.module.css';

type DataType = {
    id: string;
    owner: string;
    version: number;
    readonly: boolean;
    type: string;
    svg?: string;
};

function instanceOfDataType(object: any): object is DataType {
    return (
        object !== undefined &&
        ['id', 'owner', 'version', 'readonly', 'type'].every((x) => x in object)
    );
}

function ObjectResult() {
    const { state } = useLocation();
    const { id: objID } = useParams();

    const data =
        state || mockTransactionData.data.find(({ id }) => id === objID);

    if (instanceOfDataType(data)) {
        return (
            <dl className={styles.data}>
                <dt>Object ID</dt>
                <dd>{data.id}</dd>

                <dt>Owner</dt>
                <dd>{data.owner}</dd>

                <dt>Version</dt>
                <dd>{data.version}</dd>

                <dt>Read Only?</dt>
                <dd>{data.readonly ? 'Yes' : 'No'}</dd>

                <dt>Type</dt>
                <dd>{data.type}</dd>

                {data?.svg && (
                    <>
                        <dt>Image</dt>
                        <img
                            alt="NFT"
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(
                                data.svg
                            )}`}
                        />
                    </>
                )}
            </dl>
        );
    }
    return (
        <dl className={styles.data}>
            <dt>There was an issue with the data on the following object:</dt>
            <dd>{objID}</dd>
        </dl>
    );
}

export default ObjectResult;
