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
            objectIDs = [];
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
            <div>
                <div className={theme.textrow}>
                    <div>Transaction ID</div>
                    <div>
                        <Longtext
                            text={data.id}
                            category="transactions"
                            isLink={false}
                        />
                    </div>
                </div>

                <div className={theme.textrow}>
                    <div>Status</div>
                    <div
                        data-testid="transaction-status"
                        className={statusClass}
                    >
                        {data.status}
                    </div>
                </div>

                <div className={theme.textrow}>
                    <div>From</div>
                    <div>
                        <Longtext text={data.sender} category="addresses" />
                    </div>
                </div>

                <div className={theme.textrow}>
                    <div>Event</div>
                    <div className={actionClass}>{action}</div>
                </div>

                <div className={theme.textrow}>
                    <div>Object</div>
                    <div>
                        {objectIDs.map((objectID, index) => (
                            <div key={`object-${index}`}>
                                <Longtext text={objectID} category="objects" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={theme.textrow}>
                    <div>To</div>
                    <div>
                        {data.recipients.length !== 0 ? (
                            data.recipients.map((address, index) => (
                                <div key={`recipient-${index}`}>
                                    <Longtext
                                        text={address}
                                        category="addresses"
                                    />
                                </div>
                            ))
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            </div>
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
