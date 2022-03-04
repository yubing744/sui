import { useLocation, useParams } from 'react-router-dom';

import Longtext from '../../components/longtext/Longtext';
import theme from '../../styles/theme.module.css';
import mockTransactionData from '../../utils/mock_data.json';
import styles from './TransactionResult.module.css';

type DataType = {
    id: string;
    status: 'success' | 'fail' | 'pending';
    sender: string;
    created?: string[];
    deleted?: string[];
    mutated?: string[];
    recipients: string[];
};

function instanceOfDataType(object: any): object is DataType {
    return (
        object !== undefined &&
        ['id', 'status', 'sender'].every((x) => x in object)
    );
}

function TransactionResult() {
    const { state } = useLocation();
    const { id: txID } = useParams();

    const data =
        state || mockTransactionData.data.find(({ id }) => id === txID);

    if (instanceOfDataType(data)) {
        let action: string;
        let objectIDs: string[];

        if (data.created !== undefined) {
            action = 'Create';
            objectIDs = data.created;
        } else if (data.deleted !== undefined) {
            action = 'Delete';
            objectIDs = data.deleted;
        } else if (data.mutated !== undefined) {
            action = 'Mutate';
            objectIDs = data.mutated;
        } else {
            action = 'Fail';
            objectIDs = ['-'];
        }

        const statusClass =
            data.status === 'success'
                ? styles['status-success']
                : data.status === 'fail'
                ? styles['status-fail']
                : styles['status-pending'];

        let actionClass;

        switch (action) {
            case 'Create':
                actionClass = styles['action-create'];
                break;
            case 'Delete':
                actionClass = styles['action-delete'];
                break;
            case 'Fail':
                actionClass = styles['status-fail'];
                break;
            default:
                actionClass = styles['action-mutate'];
        }

        return (
            <dl className={theme.textbox}>
                <dt>Transaction ID</dt>
                <dd>
                    <Longtext
                        text={data.id}
                        category="transactions"
                        isLink={false}
                    />
                </dd>

                <dt>Status</dt>
                <dd data-testid="transaction-status" className={statusClass}>
                    {data.status}
                </dd>

                <dt>From</dt>
                <dd>
                    <Longtext text={data.sender} category="addresses" />
                </dd>

                <dt>Event</dt>
                <dd className={actionClass}>{action}</dd>

                <dt>Object</dt>
                {objectIDs.map((objectID, index) => (
                    <dd key={`object-${index}`}>
                        <Longtext text={objectID} category="objects" />
                    </dd>
                ))}

                <dt>To</dt>
                {data.recipients.length !== 0 ? (
                    data.recipients.map((address, index) => (
                        <dd key={`recipient-${index}`}>
                            <Longtext text={address} category="addresses" />
                        </dd>
                    ))
                ) : (
                    <dd />
                )}
            </dl>
        );
    }
    return (
        <dl className={theme.textbox}>
            <dt>
                There was an issue with the data on the following transaction:
            </dt>
            <dd>{txID}</dd>
        </dl>
    );
}

export default TransactionResult;
export { instanceOfDataType };
