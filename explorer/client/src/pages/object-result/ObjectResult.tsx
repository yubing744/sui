import React, { useEffect, useState, useCallback, useRef } from 'react';
import AceEditor from 'react-ace';
import { useLocation, useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import theme from '../../styles/theme.module.css';
import styles from './ObjectResult.module.css';

import 'ace-builds/src-noconflict/theme-github';
import { type AddressOwner, SuiRpcClient } from '../../utils/rpc';
import { asciiFromNumberBytes, trimStdLibPrefix } from '../../utils/utility_functions';


type DataType = {
    id: string;
    category: string;
    owner: string | AddressOwner;
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
        owner?: { AddressOwner: number[] } | string
    };
};

const DATATYPE_DEFAULT: DataType = {
    id: '',
    category: '',
    owner: '',
    version: '',
    objType: '',
    data: { contents: {} }
}

const IS_SMART_CONTRACT = (data: DataType) =>
    data.data.contents.display?.category === 'moveScript';

function instanceOfDataType(object: any) {
    return (
        object !== undefined &&
        ['id', 'version', 'objType'].every((x) => x in object) &&
        object['id'].length > 0
    );
}

const fixNameMsg = 'FIXME';
function handleSpecialDemoNames(data: {
        name?: string,
        player_name?: string,
        monster_name?: string,
        farm_name?: string
    }): string
{
    console.log('handleSpecialDemoNames()', data);

    if('player_name' in data) {
        console.log('OH FUCK PLAYER DATA DAMN', data);
        return data.player_name ? data.player_name : fixNameMsg;
    }
    if('monster_name' in data)
        return data.monster_name ? data.monster_name : fixNameMsg;
    if('farm_name' in data)
        return data.farm_name ? data.farm_name : fixNameMsg;
    if('name' in data)
        return data.name ? data.name : fixNameMsg;
    return fixNameMsg;
}

function handleSpecialDemoNameArrays(data: {
    name?: number[],
    player_name?: number[],
    monster_name?: number[],
    farm_name?: number[]
}): string
{
    console.log('handleSpecialDemoNames() NUMBERS', data);

    let bytes: number[] = [];
    if('player_name' in data) {
        console.log('OH FUCK PLAYER DATA DAMN', data);
        bytes = data.player_name ? data.player_name : [];
    }
    if('monster_name' in data)
        bytes =  data.monster_name ? data.monster_name : [];
    if('farm_name' in data)
        bytes = data.farm_name ? data.farm_name : [];
    if('name' in data)
        bytes = data.name ? data.name : [];
    else
        bytes = [];

    return asciiFromNumberBytes(bytes);
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

async function getObjectState(objID: string): Promise<object> {
    /*
    return new Promise((resolve, reject) => {
        let data = findDataFromID(objID, {});
        if (data) resolve(data);
        else reject('object ID not found');
    });
    */
    return _rpc.getObjectInfoRaw(objID);
}

const ObjectResult = ((): JSX.Element => {
    const { id: objID } = useParams();

    const [showDescription, setShowDescription] = useState(true);
    const [showProperties, setShowProperties] = useState(false);
    const [showConnectedEntities, setShowConnectedEntities] = useState(false);

    const [showObjectState, setObjectState] = useState(DATATYPE_DEFAULT);

    const prepLabel = (label: string) => label.split('_').join(' ');
    const checkIsPropertyType = (value: any) =>
        ['number', 'string'].includes(typeof value);

    const checkIsIDType = (key: string, value: any) =>
        /owned/.test(key) || (/_id/.test(key) && value?.bytes) || value?.vec;
    const checkSingleID = (value: any) => value?.bytes;
    const checkVecIDs = (value: any) => value?.vec;

    const extractOwnerData = (owner: string | AddressOwner): string => {
        switch (typeof(owner)) {
            case 'string':
                console.log(`STRING owner:  ${owner}`);
                if(addrOwnerPattern.test(owner)) {
                    let ownerId = getAddressOwnerId(owner);
                    return ownerId ? ownerId : '';
                }
                const singleOwnerPattern = /SingleOwner\(k#(.*)\)/;
                const result = singleOwnerPattern.exec(owner);
                return result ? result[1] : '';
            case 'object':
                console.log(`OBJECT owner:  ${JSON.stringify(owner)}`);
                if('AddressOwner' in owner) {
                    let ownerId = extractAddressOwner(owner.AddressOwner);
                    return ownerId ? ownerId : '';
                }
                return '';
            default:
                return '';
        }
    };

    const addrOwnerPattern = /^AddressOwner\(k#/;
    const endParensPattern = /\){1}$/
    const getAddressOwnerId = (addrOwner: string): string | null => {
        if (!addrOwnerPattern.test(addrOwner) || !endParensPattern.test(addrOwner))
            return null;

        let str = addrOwner.replace(addrOwnerPattern, '');
        return str.replace(endParensPattern, '');
    };

    const extractAddressOwner = (addrOwner: number[]): string | null => {
        if(addrOwner.length != 20) {
            console.log('address owner byte length must be 20');
            return null;
        }

        return asciiFromNumberBytes(addrOwner);
    };

    let dataRef = useRef(DATATYPE_DEFAULT);

    useEffect(() => {
        console.log('trying to call API in useEffect...');

        getObjectState(objID as string)
        .then((objState) => {
            if (objState) {
                let asType = objState as DataType;
                console.log('got obj state?', asType);

                setObjectState(asType);
                dataRef.current = asType;
            }
        });
    }, []);

    useEffect(() => {
        setShowDescription(true);
        setShowProperties(true);
        setShowConnectedEntities(true);
    }, [setShowDescription, setShowProperties, setShowConnectedEntities]);

    console.log('object data?', showObjectState);

    if (instanceOfDataType(showObjectState)) {
        console.log("is instance of DataType, RENDER?");
        let data = showObjectState;
        console.log('data', data);
        data = SuiRpcClient.modifyForDemo(data);

        data.objType = trimStdLibPrefix(data.objType);
        // TODO - fix up special name handling here
        if(data.name == '')
            data.name = handleSpecialDemoNames(data.data.contents);
        if(data.name == '')
            data.name = handleSpecialDemoNameArrays(data.data.contents);

        const innerData = data.data;

        const typeOfOwner = typeof(innerData.owner);
        console.log(`type of ' data.owner ':   ${typeOfOwner}`);

        switch (typeOfOwner) {
            case 'object':
                const ownerObj = innerData.owner as object;
                console.log('got obj OWNER value:', ownerObj);

                if ('AddressOwner' in ownerObj) {
                    console.log(ownerObj);
                    innerData.owner = asciiFromNumberBytes((ownerObj as AddressOwner).AddressOwner);
                    console.log(innerData);
                }
                break;
        }

        console.log('data, modded?', data);

        //data.name = 'Hughe Nuts';

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


export { ObjectResult };
export type { DataType };
