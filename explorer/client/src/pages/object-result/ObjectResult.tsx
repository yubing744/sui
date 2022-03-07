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
    version: number;
    readonly: boolean;
    type: string;
    display?: {
        category: string;
        data: string;
    };
    description?: {
        title: string;
        lore: string;
    };
    properties?: {
        [key: string]: string;
    };
    components?: string[];
    contract?: string;
};

const IS_SMART_CONTRACT = (data: DataType) =>
    data.display?.category === 'moveScript';

function instanceOfDataType(object: any): object is DataType {
    return (
        object !== undefined &&
        ['id', 'owner', 'version', 'readonly', 'type'].every((x) => x in object)
    );
}

function DisplayBox({ data }: { data: DataType }) {
    const [hasDisplayLoaded, setHasDisplayLoaded] = useState(false);

    const imageStyle = hasDisplayLoaded ? {} : { display: 'none' };

    const handleImageLoad = useCallback(
        () => setHasDisplayLoaded(true),
        [setHasDisplayLoaded]
    );

    if (data.display?.category === 'imageURL') {
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
                    src={data.display.data}
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
                    value={data.display?.data}
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
    const [showConnectedEntities, setShowConnectedEntities] = useState(false);

    useEffect(() => {
        setShowDescription(true);
        setShowProperties(false);
        setShowConnectedEntities(false);
    }, [data, setShowDescription, setShowProperties, setShowConnectedEntities]);

    if (instanceOfDataType(data)) {
        return (
            <div className={styles.resultbox}>
                {data?.display?.data && <DisplayBox data={data} />}
                <div className={styles.textbox}>
                    {data?.description?.title && (
                        <h1 className={styles.title}>
                            {data.description.title}
                        </h1>
                    )}

                    <h2
                        className={styles.clickableheader}
                        onClick={() => setShowDescription(!showDescription)}
                    >
                        Description {showDescription ? '-' : '+'}
                    </h2>
                    {showDescription && (
                        <div className={theme.textresults}>
                            {data?.description && (
                                <div>
                                    <div>Lore</div>
                                    <div className={styles.unconstrained}>
                                        {data.description.lore}
                                    </div>
                                </div>
                            )}
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
                                        Immutable
                                    </div>
                                ) : (
                                    <div
                                        data-testid="read-only-text"
                                        className={styles.mutable}
                                    >
                                        Mutable
                                    </div>
                                )}
                            </div>

                            <div>
                                <div>Type</div>
                                <div>{data.type}</div>
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
                                    {data.properties &&
                                        Object.entries(data.properties).map(
                                            ([key, value]) => (
                                                <div
                                                    className={styles.property}
                                                >
                                                    <p className={styles.key}>
                                                        {key}
                                                    </p>
                                                    <p>{value}</p>
                                                </div>
                                            )
                                        )}
                                </div>
                            )}
                        </>
                    )}

                    <h2
                        className={styles.clickableheader}
                        onClick={() =>
                            setShowConnectedEntities(!showConnectedEntities)
                        }
                    >
                        Connected Entities {showConnectedEntities ? '-' : '+'}
                    </h2>
                    {showConnectedEntities && (
                        <div className={theme.textresults}>
                            <div>
                                <div>
                                    {IS_SMART_CONTRACT(data)
                                        ? 'Creator'
                                        : 'Owner'}
                                </div>
                                <div>
                                    <Longtext
                                        text={data.owner}
                                        category="unknown"
                                    />
                                </div>
                            </div>

                            {!IS_SMART_CONTRACT(data) && (
                                <>
                                    <div>
                                        <div>Contract ID</div>
                                        <div>
                                            {data.contract && (
                                                <Longtext
                                                    text={data.contract}
                                                    category="objects"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div>Component Objects</div>
                                        {!data.components && (
                                            <div
                                                className={styles.unconstrained}
                                            />
                                        )}
                                        {data.components &&
                                            data.components.map(
                                                (objectID, index) => (
                                                    <div
                                                        key={`object-${index}`}
                                                    >
                                                        <Longtext
                                                            text={objectID}
                                                            category="objects"
                                                        />
                                                    </div>
                                                )
                                            )}
                                    </div>
                                </>
                            )}
                        </div>
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
