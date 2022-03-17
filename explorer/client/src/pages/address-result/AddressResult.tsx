import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import theme from '../../styles/theme.module.css';
import { findDataFromID } from '../../utils/utility_functions';
import { navigateWithUnknown } from '../../utils/utility_functions';
import styles from './AddressResult.module.css';

type DataType = {
    id: string;
    objects: { objectId: string }[];
};

function instanceOfDataType(object: any): object is DataType {
    return object !== undefined && ['id', 'objects'].every((x) => x in object);
}

function SuccessAddress({ data }: { data: DataType }) {
    const [results, setResults] = useState<
        {
            id: string;
            display?: {
                category: string;
                data: string;
            };
        }[]
    >(data?.objects.map(({ objectId }) => ({ id: objectId })));

    const navigate = useNavigate();

    useEffect(() => {
        Promise.all(
            data.objects.map(({ objectId }: { objectId: string }) => {
                const entry = findDataFromID(objectId, undefined);
                return {
                    id: entry.id,
                    Type: entry.objType,
                    display: entry?.data?.contents?.display,
                };
            })
        )
            .then((resp) => setResults(resp))
            .catch((err) => console.log(err));
    }, [data]);

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
                    {results && results.length > 0 ? (
                        results.map((entryObj, index1) => (
                            <div
                                className={styles.objectbox}
                                key={`object-${index1}`}
                                onClick={() =>
                                    navigateWithUnknown(entryObj.id, navigate)
                                }
                            >
                                {'display' in entryObj &&
                                entryObj?.display?.category === 'imageURL' ? (
                                    <div className={styles.previewimage}>
                                        <img
                                            className={styles.imagebox}
                                            alt="NFT preview"
                                            src={entryObj.display.data}
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.previewimage} />
                                )}
                                {Object.entries(entryObj).map(
                                    ([key, value], index2) => (
                                        <div key={`object-${index1}-${index2}`}>
                                            {(() => {
                                                switch (key) {
                                                    case 'id':
                                                        return (
                                                            <div>
                                                                <span>
                                                                    {key}:
                                                                </span>
                                                                <Longtext
                                                                    text={
                                                                        typeof value ===
                                                                        'string'
                                                                            ? value
                                                                            : ''
                                                                    }
                                                                    category="objects"
                                                                    isLink={
                                                                        true
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    case 'display':
                                                        break;
                                                    default:
                                                        return (
                                                            <div>
                                                                <span>
                                                                    {key}:
                                                                </span>
                                                                <span>
                                                                    {value}
                                                                </span>
                                                            </div>
                                                        );
                                                }
                                            })()}
                                        </div>
                                    )
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.noobjects}>
                            This address owns no objects
                        </div>
                    )}
                </div>
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
