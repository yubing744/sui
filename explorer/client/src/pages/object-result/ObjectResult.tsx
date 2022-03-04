import React, { useEffect, useState, useCallback } from 'react';
import AceEditor from 'react-ace';
import { useLocation, useParams } from 'react-router-dom';

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

    const AdaptiveTextBoxStyle = (data: DataType) =>
        `${theme.textbox} ${
            data?.display?.data ? styles.accommodate : styles.noaccommodate
        }`;

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
                <dl className={AdaptiveTextBoxStyle(data)}>
                    {data?.description?.title && (
                        <h2>{data.description.title}</h2>
                    )}

                    <h3
                        className={styles.clickableheader}
                        onClick={() => setShowDescription(!showDescription)}
                    >
                        Description {showDescription ? '-' : '+'}
                    </h3>
                    {showDescription && (
                        <dl className={AdaptiveTextBoxStyle(data)}>
                            {data?.description && (
                                <>
                                    <dt>Lore</dt>
                                    <dd className={styles.unconstrained}>
                                        {data.description.lore}
                                    </dd>
                                </>
                            )}
                            <dt>Object ID</dt>
                            <dd>
                                <Longtext
                                    text={data.id}
                                    category="objects"
                                    isLink={false}
                                />
                            </dd>

                            <dt>Version</dt>
                            <dd>{data.version}</dd>

                            <dt>Read Only?</dt>
                            {data.readonly ? (
                                <dd
                                    data-testid="read-only-text"
                                    className={styles.immutable}
                                >
                                    Immutable
                                </dd>
                            ) : (
                                <dd
                                    data-testid="read-only-text"
                                    className={styles.mutable}
                                >
                                    Mutable
                                </dd>
                            )}

                            <dt>Type</dt>
                            <dd>{data.type}</dd>
                        </dl>
                    )}

                    {!IS_SMART_CONTRACT(data) && (
                        <>
                            <h3
                                className={styles.clickableheader}
                                onClick={() =>
                                    setShowProperties(!showProperties)
                                }
                            >
                                Properties {showProperties ? '-' : '+'}
                            </h3>
                            {showProperties && (
                                <dd className={styles.unconstrained}>
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
                                </dd>
                            )}
                        </>
                    )}

                    <h3
                        className={styles.clickableheader}
                        onClick={() =>
                            setShowConnectedEntities(!showConnectedEntities)
                        }
                    >
                        Connected Entities {showConnectedEntities ? '-' : '+'}
                    </h3>
                    {showConnectedEntities && (
                        <dl className={AdaptiveTextBoxStyle(data)}>
                            <dt>
                                {IS_SMART_CONTRACT(data) ? 'Creator' : 'Owner'}
                            </dt>
                            <dd>
                                <Longtext
                                    text={data.owner}
                                    category="unknown"
                                />
                            </dd>

                            {!IS_SMART_CONTRACT(data) && (
                                <>
                                    <dt>Contract ID</dt>
                                    <dd>
                                        {data.contract && (
                                            <Longtext
                                                text={data.contract}
                                                category="objects"
                                            />
                                        )}
                                    </dd>

                                    <dt>Component Objects</dt>
                                    {!data.components && (
                                        <dd className={styles.unconstrained} />
                                    )}
                                    {data.components &&
                                        data.components.map(
                                            (objectID, index) => (
                                                <dd key={`object-${index}`}>
                                                    <Longtext
                                                        text={objectID}
                                                        category="objects"
                                                    />
                                                </dd>
                                            )
                                        )}
                                </>
                            )}
                        </dl>
                    )}
                    <br className="h-10vh" />
                </dl>
            </div>
        );
    }
    return (
        <dl className={theme.textbox}>
            <dt>There was an issue with the data on the following object:</dt>
            <dd>{objID}</dd>
        </dl>
    );
}

export default ObjectResult;
