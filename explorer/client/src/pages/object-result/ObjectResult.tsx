import React, { useEffect, useState, useCallback } from 'react';
import AceEditor from 'react-ace';
import { useLocation, useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import theme from '../../styles/theme.module.css';
import mockTransactionData from '../../utils/mock_data.json';
import styles from './ObjectResult.module.css';

import 'ace-builds/src-noconflict/theme-github';

type DataType = {
    id: string;
    category: string;
    owner: string;
    version: string;
    readonly: string;
    objType: string;
    data: {
        contents: {
            [key: string]: any;
        };
    };
};

const IS_SMART_CONTRACT = (data: DataType) =>
    data.data.contents.display?.category === 'moveScript';

function instanceOfDataType(object: any): object is DataType {
    return (
        object !== undefined &&
        ['id', 'owner', 'version', 'readonly', 'objType'].every(
            (x) => x in object
        )
    );
}

function DisplayBox({ data }: { data: DataType }) {
    const [hasDisplayLoaded, setHasDisplayLoaded] = useState(false);

    const imageStyle = hasDisplayLoaded ? {} : { display: 'none' };

    const handleImageLoad = useCallback(
        () => setHasDisplayLoaded(true),
        [setHasDisplayLoaded]
    );

    if (data.data.contents.display?.category === 'imageURL') {
        return (
            <div className={styles['display-container']}>
                {!hasDisplayLoaded && (
                    <div className={styles.imagebox}>
                        Please wait for display to load
                    </div>
                )}
                <img
                    className={styles.imagebox}
                    style={imageStyle}
                    alt="NFT"
                    src={data.data.contents.display.data}
                    onLoad={handleImageLoad}
                />
            </div>
        );
    }

    if (IS_SMART_CONTRACT(data)) {
        return (
            <div className={styles['display-container']}>
                <AceEditor
                    theme="github"
                    value={data.data.contents.display?.data}
                    showGutter={true}
                    readOnly={true}
                    fontSize="0.8rem"
                    className={styles.codebox}
                />
            </div>
        );
    }

    return <div />;
}

function ObjectResult() {
    const { state } = useLocation();
    const { id: objID } = useParams();

    const data =
        state || mockTransactionData.data.find(({ id }) => id === objID);

    const [showDescription, setShowDescription] = useState(true);
    const [showProperties, setShowProperties] = useState(false);

    useEffect(() => {
        setShowDescription(true);
        setShowProperties(false);
    }, [data, setShowDescription, setShowProperties]);

    if (instanceOfDataType(data)) {
        return (
            <div className={styles.resultbox}>
                {data?.data.contents.display?.data && (
                    <DisplayBox data={data} />
                )}
                <div
                    className={`${styles.textbox} ${
                        data?.data.contents.display?.data !== undefined
                            ? styles.accommodate
                            : styles.noaccommodate
                    }`}
                >
                    <h2
                        className={styles.clickableheader}
                        onClick={() => setShowDescription(!showDescription)}
                    >
                        Description {showDescription ? '-' : '+'}
                    </h2>
                    {showDescription && (
                        <div className={theme.textresults}>
                            <div>
                                <div>Object ID</div>
                                <div>
                                    <Longtext
                                        text={data.id}
                                        category="objects"
                                        isLink={false}
                                    />
                                </div>
                            </div>

                            <div>
                                <div>Version</div>
                                <div>{data.version}</div>
                            </div>

                            <div>
                                <div>Read Only?</div>
                                {data.readonly ? (
                                    <div
                                        data-testid="read-only-text"
                                        className={styles.immutable}
                                    >
                                        True
                                    </div>
                                ) : (
                                    <div
                                        data-testid="read-only-text"
                                        className={styles.mutable}
                                    >
                                        False
                                    </div>
                                )}
                            </div>

                            <div>
                                <div>Type</div>
                                <div>{data.objType}</div>
                            </div>

                            <div>
                                <div>Owner</div>
                                <div>{data.owner}</div>
                            </div>
                        </div>
                    )}

                    {!IS_SMART_CONTRACT(data) && (
                        <>
                            <h2
                                className={styles.clickableheader}
                                onClick={() =>
                                    setShowProperties(!showProperties)
                                }
                            >
                                Properties {showProperties ? '-' : '+'}
                            </h2>
                            {showProperties && (
                                <div className={styles.propertybox}>
                                    {data.data.contents &&
                                        Object.entries(data.data.contents).map(
                                            ([key, value]) => {
                                                if (
                                                    [
                                                        'number',
                                                        'string',
                                                    ].includes(typeof value)
                                                ) {
                                                    return (
                                                        <div>
                                                            <p>
                                                                {key
                                                                    .split('_')
                                                                    .join(' ')}
                                                            </p>
                                                            <p>{value}</p>
                                                        </div>
                                                    );
                                                }
                                                if (value.bytes) {
                                                    return (
                                                        <div>
                                                            <p>
                                                                {key
                                                                    .split('_')
                                                                    .join(' ')}
                                                            </p>
                                                            <p>
                                                                {Array.isArray(
                                                                    value.bytes
                                                                )
                                                                    ? value.bytes.join(
                                                                          ' '
                                                                      )
                                                                    : value.bytes}
                                                            </p>
                                                        </div>
                                                    );
                                                }

                                                if (value.vec) {
                                                    return (
                                                        <div>
                                                            <p>
                                                                {key
                                                                    .split('_')
                                                                    .join(' ')}
                                                            </p>
                                                            <p>
                                                                {value.vec.map(
                                                                    (el: {
                                                                        bytes: string;
                                                                    }) => (
                                                                        <p>
                                                                            {
                                                                                el.bytes
                                                                            }
                                                                        </p>
                                                                    )
                                                                )}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return <></>;
                                            }
                                        )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }
    return (
        <ErrorResult
            id={objID}
            errorMsg="There was an issue with the data on the following object"
        />
    );
}

export default ObjectResult;
