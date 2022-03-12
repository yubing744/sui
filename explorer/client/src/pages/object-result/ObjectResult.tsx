import React, { useEffect, useState, useCallback } from 'react';
import AceEditor from 'react-ace';
import { useLocation, useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import theme from '../../styles/theme.module.css';
import { findDataFromID } from '../../utils/utility_functions';
import styles from './ObjectResult.module.css';

import 'ace-builds/src-noconflict/theme-github';
import { SuiRpcClient } from '../../utils/rpc';


type DataType = {
    id: string;
    category: string;
    owner: string;
    version: string;
    readonly?: string;
    objType: string;
    name?: string;
    ethAddress?: string;
    ethTokenId?: string;
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
        ['id', 'version', 'objType'].every((x) => x in object)
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

const _rpc: SuiRpcClient = new SuiRpcClient('http://127.0.0.1:5000');

async function getObjectState(objID: string): Promise<object | null> {
    _rpc.readObject(objID)
    .then((data) => {
        console.log(data);
        return data;
    });
    return null;
}

const ObjectResult = (() => {
    const { id: objID } = useParams();
    if (!objID)
        return {};

    const [showDescription, setShowDescription] = useState(true);
    const [showProperties, setShowProperties] = useState(false);
    const [showConnectedEntities, setShowConnectedEntities] = useState(false);

    const [showObjectState, setObjectState] = useState({});

    const prepLabel = (label: string) => label.split('_').join(' ');
    const checkIsPropertyType = (value: any) =>
        ['number', 'string'].includes(typeof value);

    const checkIsIDType = (key: string, value: any) =>
        /owned/.test(key) || (/_id/.test(key) && value?.bytes) || value?.vec;
    const checkSingleID = (value: any) => value?.bytes;
    const checkVecIDs = (value: any) => value?.vec;

    const extractOwnerData = (singleownerstring: string) => {
        const re = /SingleOwner\(k#(.*)\)/;
        const result = re.exec(singleownerstring);

        return result ? result[1] : '';
    };

    useEffect(() => {
        const objState = await getObjectState(objID);
        if (objState)
            setObjectState(objState);
    }, []);

    useEffect(() => {
        setShowDescription(true);
        setShowProperties(true);
        setShowConnectedEntities(true);
    }, [setShowDescription, setShowProperties, setShowConnectedEntities]);

        if (instanceOfDataType(data)) {
            return (<>
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
                        {data.name && <h1>{data.name}</h1>}
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

                                {data.readonly && (
                                    <div>
                                        <div>Read Only?</div>
                                        {data.readonly === 'true' ? (
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
                                )}

                                <div>
                                    <div>Type</div>
                                    <div>{data.objType}</div>
                                </div>
                                {data.ethAddress && (
                                    <div>
                                        <div>Ethereum Contract Address</div>
                                        <div>
                                            <Longtext
                                                text={data.ethAddress}
                                                category="ethAddress"
                                                isLink={true}
                                            />
                                        </div>
                                    </div>
                                )}
                                {data.ethTokenId && (
                                    <div>
                                        <div>Ethereum Token ID</div>
                                        <div>
                                            <Longtext
                                                text={data.ethTokenId}
                                                category="addresses"
                                                isLink={false}
                                            />
                                        </div>
                                    </div>
                                )}
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
                                            Object.entries(data.data.contents)
                                                .filter(([_, value]) =>
                                                    checkIsPropertyType(value)
                                                )
                                                .map(([key, value], index) => (
                                                    <div key={`property-${index}`}>
                                                        <p>{prepLabel(key)}</p>
                                                        <p>{value}</p>
                                                    </div>
                                                ))}
                                    </div>
                                )}
                            </>
                        )}

                        {data.owner && (
                            <>
                                <h2
                                    className={styles.clickableheader}
                                    onClick={() =>
                                        setShowConnectedEntities(
                                            !showConnectedEntities
                                        )
                                    }
                                >
                                    Connected Entities{' '}
                                    {showConnectedEntities ? '-' : '+'}
                                </h2>
                                {showConnectedEntities && (
                                    <div className={theme.textresults}>
                                        <div>
                                            <div>Owner</div>
                                            <Longtext
                                                text={extractOwnerData(data.owner)}
                                                category="unknown"
                                                isLink={true}
                                            />
                                        </div>
                                        {data.data.contents &&
                                            Object.entries(data.data.contents)
                                                .filter(([key, value]) =>
                                                    checkIsIDType(key, value)
                                                )
                                                .map(([key, value], index1) => (
                                                    <div
                                                        key={`ConnectedEntity-${index1}`}
                                                    >
                                                        <div>{prepLabel(key)}</div>
                                                        {checkSingleID(value) && (
                                                            <Longtext
                                                                text={value.bytes}
                                                                category="unknown"
                                                            />
                                                        )}
                                                        {checkVecIDs(value) && (
                                                            <div>
                                                                {value?.vec.map(
                                                                    (
                                                                        value2: {
                                                                            bytes: string;
                                                                        },
                                                                        index2: number
                                                                    ) => (
                                                                        <Longtext
                                                                            text={
                                                                                value2.bytes
                                                                            }
                                                                            category="unknown"
                                                                            key={`ConnectedEntity-${index1}-${index2}`}
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div></>
            );
        }
        return (
            <ErrorResult
                id={objID}
                errorMsg="There was an issue with the data on the following object"
            />
        );
    });
}

export { ObjectResult };
export type { DataType };

