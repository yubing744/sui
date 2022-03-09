import mockTransactionData from './mock_data.json';

const findDataFromID = (targetID: string | undefined, state: object | unknown) => 
        state || mockTransactionData.data.find(({ id }) => id === targetID);

const navigateWithUnknown = (input: string, navigate: Function) => {
    const data = mockTransactionData.data.find(({ id }) => id === input);

    if (data === undefined || !('category' in data)) {
        navigate(`../missing/${input}`);
    } else if (data.category === 'transaction') {
        navigate(`../transactions/${input}`, { state: data });
    } else if (data.category === 'object') {
        navigate(`../objects/${input}`, { state: data });
    } else if (data.category === 'address') {
        navigate(`../addresses/${input}`, { state: data });
    } else {
        navigate(`../missing/${input}`);
    }
};

export { findDataFromID, navigateWithUnknown };
