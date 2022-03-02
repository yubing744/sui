import React, { useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import theme from '../../styles/theme.module.css';
import mockTransactionData from '../../utils/mock_data.json';
import styles from './ObjectResult.module.css';

type DataType = {
    id: string;
    owner: string;
    version: number;
    readonly: boolean;
    type: string;
    display?: {
        category: string;
        data: string;
    };
};

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

    return <div />;
}

function ObjectResult() {
    const { state } = useLocation();
    const { id: objID } = useParams();

    const data =
        state || mockTransactionData.data.find(({ id }) => id === objID);

    if (instanceOfDataType(data)) {
        return (
            <div className={styles.resultbox}>
                {data?.display?.data && <DisplayBox data={data} />}
                <dl
                    className={`${theme.textbox} ${
                        data?.display?.data
                            ? styles.accommodate
                            : styles.noaccommodate
                    }`}
                >
                    <dt>Object ID</dt>
                    <dd>{data.id}</dd>

                    <dt>Owner</dt>
                    <dd>{data.owner}</dd>

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
