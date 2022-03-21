import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    findDataFromID,
    prepObjTypeValue,
} from '../../utils/utility_functions';
import { navigateWithUnknown } from '../../utils/utility_functions';
import styles from './OwnedObjects.module.css';

function OwnedObjects({ objects }: { objects: string[] }) {
    const [results, setResults] = useState<
        {
            id: string;
            display?: {
                category: string;
                data: string;
            };
        }[]
    >(objects.map((objectId: string) => ({ id: objectId })));

    const navigate = useNavigate();

    useEffect(() => {
        Promise.all(
            objects.map((objectId) => {
                const entry = findDataFromID(objectId, undefined);
                return {
                    id: entry?.id,
                    Type: entry?.objType,
                    display: entry?.data?.contents?.display,
                };
            })
        )
            .then((resp) => setResults(resp))
            .catch((err) => console.log(err));
    }, [objects]);

    const handlePreviewClick = useCallback(
        (id: string, navigate: Function) => (e: React.MouseEvent) =>
            navigateWithUnknown(id, navigate),
        []
    );

    return (
        <div>
            {results.map((entryObj, index1) => (
                <div
                    className={styles.objectbox}
                    key={`object-${index1}`}
                    onClick={handlePreviewClick(entryObj.id, navigate)}
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
                    {Object.entries(entryObj).map(([key, value], index2) => (
                        <div key={`object-${index1}-${index2}`}>
                            {(() => {
                                switch (key) {
                                    case 'display':
                                        break;
                                    case 'Type':
                                        return (
                                            <div>
                                                <span>{key}</span>
                                                <span>
                                                    {typeof value === 'string'
                                                        ? prepObjTypeValue(
                                                              value
                                                          )
                                                        : ''}
                                                </span>
                                            </div>
                                        );
                                    default:
                                        return (
                                            <div>
                                                <span>{key}</span>
                                                <span>{value}</span>
                                            </div>
                                        );
                                }
                            })()}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default OwnedObjects;
