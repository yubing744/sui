import React, { useEffect, useState, useCallback } from 'react';
import AceEditor from 'react-ace';
import { useLocation, useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import OwnedObjects from '../../components/ownedobjects/OwnedObjects';
import theme from '../../styles/theme.module.css';
import {
    findDataFromID,
    prepObjTypeValue,
} from '../../utils/utility_functions';
import styles from './ObjectResult.module.css';

import 'ace-builds/src-noconflict/theme-github';

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
    contract_id?: { bytes: string };
    creator_address?: string;
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

function isNonEmptyArrayOfStrings(array: any[]): array is string[] {
    return (
        array &&
        array.length > 0 &&
        array.map((item) => typeof item).every((item) => item === 'string')
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

    const data = findDataFromID(objID, state);

    const [showDescription, setShowDescription] = useState(true);
    const [showProperties, setShowProperties] = useState(false);
    const [showConnectedEntities, setShowConnectedEntities] = useState(false);

    const prepLabel = (label: string) => label.split('_').join(' ');
    const checkIsPropertyType = (value: any) =>
        ['number', 'string'].includes(typeof value);

    const checkIsIDType = (key: string, value: any) =>
        /owned/.test(key) || (/_id/.test(key) && value?.bytes) || value?.vec;
    const checkSingleID = (value: any) => value?.bytes !== undefined;
    const checkVecIDs = (value: any) => value?.vec !== undefined;

    const extractOwnerData = (singleownerstring: string) => {
        const re = /SingleOwner\(k#(.*)\)/;
        const result = re.exec(singleownerstring);

        return result ? result[1] : '';
    };

    const convertEpochTimeToUTCDate = (epoch: number) =>
        new Date(epoch * 1000).toUTCString();

    useEffect(() => {
        setShowDescription(true);
        setShowProperties(true);
        setShowConnectedEntities(true);
    }, [data, setShowDescription, setShowProperties, setShowConnectedEntities]);

    if (instanceOfDataType(data)) {
        const should_put_in_title = (key: string) =>
            /name/i.test(key) && !/user_name/.test(key);
        //TO DO remove when have distinct name field under Description
        const nameKeyValue = Object.entries(data?.data?.contents)
            .filter(([key, value]) => should_put_in_title(key))
            .map(([key, value]) => value);

        const ownedObjects = Object.entries(data.data.contents).filter(
            ([key, value]) => checkIsIDType(key, value)
        );

        const properties = Object.entries(data.data.contents)
            //TO DO: remove when have distinct 'name' field in Description
            .filter(([key, value]) => !should_put_in_title(key))
            .filter(([_, value]) => checkIsPropertyType(value));

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
                    {data.name && <h1>{data.name}</h1>} 
                    {typeof nameKeyValue[0] === 'string' && (
                        <h1>{nameKeyValue}</h1>
                    )}
                    <h2
                        className={styles.clickableheader}
                        onClick={() => setShowDescription(!showDescription)}
                    >
                        Description {showDescription ? '' : '+'}
                    </h2>
                    {showDescription && (
                        <div className={theme.textresults}>
                            <div>
                                <div>Object ID</div>
                                <div data-testid="object-id">
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
                                <div>{prepObjTypeValue(data.objType)}</div>
                            </div>
                            <div>
                                <div>Owner</div>
                                <Longtext
                                    text={extractOwnerData(data.owner)}
                                    category="unknown"
                                    isLink={true}
                                />
                            </div>

                            {data.creator_address && (
                                <div>
                                    <div>Creator Address</div>
                                    <Longtext
                                        text={extractOwnerData(
                                            data.creator_address
                                        )}
                                        category="addresses"
                                        isLink={true}
                                    />
                                </div>
                            )}
                            {data.contract_id && (
                                <div>
                                    <div>Contract ID</div>
                                    <Longtext
                                        text={data.contract_id.bytes}
                                        category="objects"
                                        isLink={true}
                                    />
                                </div>
                            )}

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
                    {!IS_SMART_CONTRACT(data) && properties.length > 0 && (
                        <>
                            <h2
                                className={styles.clickableheader}
                                onClick={() =>
                                    setShowProperties(!showProperties)
                                }
                            >
                                Properties {showProperties ? '' : '+'}
                            </h2>
                            {showProperties && (
                                <div className={styles.propertybox}>
                                    {properties.map(([key, value], index) => (
                                        <div key={`property-${index}`}>
                                            <p>{prepLabel(key)}</p>
                                            <p>
                                                {key === 'created_at'
                                                    ? convertEpochTimeToUTCDate(
                                                          value
                                                      )
                                                    : value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    {ownedObjects.length > 0 &&
                        ownedObjects.map(([_, value]) =>
                            isNonEmptyArrayOfStrings(value)
                        ) && (
                            <>
                                <h2
                                    className={styles.clickableheader}
                                    onClick={() =>
                                        setShowConnectedEntities(
                                            !showConnectedEntities
                                        )
                                    }
                                >
                                    Owned Objects{' '}
                                    {showConnectedEntities ? '' : '+'}
                                </h2>
                                {showConnectedEntities && (
                                    <div className={styles.ownedObjectLabel}>
                                        {ownedObjects.map(
                                            ([key, valueDict], index) => (
                                                <div
                                                    key={`ownedObjectBox-${index}`}
                                                >
                                                    <h3>{prepLabel(key)}</h3>
                                                    <OwnedObjects
                                                        objects={((
                                                            value: any
                                                        ) => {
                                                            switch (true) {
                                                                case checkSingleID(
                                                                    value
                                                                ):
                                                                    return [
                                                                        value.bytes,
                                                                    ];
                                                                case checkVecIDs(
                                                                    value
                                                                ):
                                                                    return value.vec.map(
                                                                        ({
                                                                            bytes,
                                                                        }: {
                                                                            bytes: string;
                                                                        }) =>
                                                                            bytes
                                                                    );
                                                                default:
                                                                    return [''];
                                                            }
                                                        })(valueDict)}
                                                    />
                                                </div>
                                            )
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
