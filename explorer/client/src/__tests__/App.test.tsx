import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import {
    MemoryRouter,
    unstable_HistoryRouter as HistoryRouter,
} from 'react-router-dom';

import App from '../app/App';

function expectHome() {
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
}

function searchText(text: string) {
    fireEvent.change(screen.getByPlaceholderText(/Search by ID/i), {
        target: { value: text },
    });
    fireEvent.submit(screen.getByRole('form', { name: /search form/i }));
}

function expectTransactionStatus(result: 'fail' | 'success' | 'pending') {
    expect(screen.getByTestId('transaction-status')).toHaveTextContent(result);
}

const expectReadOnlyStatus = async (result: 'True' | 'False') => {
    const el1 = await screen.findByTestId('read-only-text');
    expect(el1).toHaveTextContent(result);
};

const checkObjectId = async (result: string) => {
    const el1 = await screen.findByTestId('object-id');
    expect(el1).toHaveTextContent(result);
};

const checkAddressId = async (result: string) => {
    const el1 = await screen.findByTestId('address-id');
    expect(el1).toHaveTextContent(result);
};

const successTransactionID = 'txCreateSuccess';
const failTransactionID = 'txFails';
const pendingTransactionID = 'txSendPending';

const problemTransactionID = 'txProblem';

const successObjectID = 'CollectionObject';
const problemObjectID = 'ProblemObject';

const noDataID = 'nonsenseQuery';

const readOnlyObject = 'ComponentObject';
const notReadOnlyObject = 'CollectionObject';

const addressID = 'receiverAddress';
const addressNoObjectsID = 'senderAddress';

const problemAddressID = 'problemAddress';

describe('End-to-end Tests', () => {
    it('renders the home page', () => {
        render(<App />, { wrapper: MemoryRouter });
        expectHome();
    });

    describe('Redirects to Home Page', () => {
        it('redirects to home for every unknown path', () => {
            render(
                <MemoryRouter initialEntries={['/anything']}>
                    <App />
                </MemoryRouter>
            );
            expectHome();
        });
        it('redirects to home for unknown path by replacing the history', () => {
            const history = createMemoryHistory({
                initialEntries: ['/anything'],
            });
            render(
                <HistoryRouter history={history}>
                    <App />
                </HistoryRouter>
            );
            expectHome();
            expect(history.index).toBe(0);
        });
    });

    describe('Displays data on transactions', () => {
        it('when transaction was a success', () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(successTransactionID);
            expect(screen.getByText('Transaction ID')).toBeInTheDocument();
            expectTransactionStatus('success');
            expect(screen.getByText('From')).toBeInTheDocument();
            expect(screen.getByText('Event')).toBeInTheDocument();
            expect(screen.getByText('Object')).toBeInTheDocument();
            expect(screen.getByText('To')).toBeInTheDocument();
        });

        it('when transaction was a failure', () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(failTransactionID);
            expectTransactionStatus('fail');
        });

        it('when transaction was pending', () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(pendingTransactionID);
            expectTransactionStatus('pending');
        });

        it('when transaction data has missing info', () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(problemTransactionID);
            expect(
                screen.getByText(
                    'There was an issue with the data on the following transaction'
                )
            ).toBeInTheDocument();
        });
    });

    describe('Displays data on objects', () => {
        it('when object was a success', async () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(successObjectID);
            await checkObjectId(successObjectID);
            const el1 = await screen.findByText('Object ID');
            expect(el1).toBeInTheDocument();
        });

        it('when object is read only', async () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(readOnlyObject);
            await expectReadOnlyStatus('True');
        });

        it('when object is not read only', async () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(notReadOnlyObject);
            await expectReadOnlyStatus('False');
        });

        it('when object data has missing info', () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(problemObjectID);
            expect(
                screen.getByText(
                    'There was an issue with the data on the following object'
                )
            ).toBeInTheDocument();
        });
    });
    describe('Displays data on addresses', () => {
        it('when address has required fields', async () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(addressID);
            await checkAddressId(addressID);
            const el1 = await screen.findByText('Address ID');
            const el2 = await screen.findByText('Owned Objects');
            expect(el1).toBeInTheDocument();
            expect(el2).toBeInTheDocument();
        });
        it('when address has missing fields', async () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(problemAddressID);

            const el1 = await screen.findByText(
                'There was an issue with the data on the following address'
            );
            expect(el1).toBeInTheDocument();
        });
        it('when address has no objects', async () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(addressNoObjectsID);

            const el2 = await screen.findByText('This address owns no objects');

            expect(el2).toBeInTheDocument();
        });
    });

    describe('Enables clicking links to', () => {
        it('go from address to object and back', async () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText(addressID);
            const el1 = await screen.findByText('playerOne');
            fireEvent.click(el1);

            await checkObjectId('playerOne');

            const el2 = await screen.findByText(addressID);

            fireEvent.click(el2);

            await checkAddressId(addressID);
        });
        it('go from object to child object and back', async () => {
            const parentObj = 'playerTwo';
            const childObj = 'standaloneObject';

            render(<App />, { wrapper: MemoryRouter });
            searchText(parentObj);
            await checkObjectId(parentObj);

            const el1 = await screen.findByText(childObj);
            fireEvent.click(el1);
            await checkObjectId(childObj);

            const el2 = await screen.findByText(parentObj);
            fireEvent.click(el2);
            await checkObjectId(parentObj);
        });
    });

    it('handles an ID with no associated data point', () => {
        render(<App />, { wrapper: MemoryRouter });
        searchText(noDataID);
        expect(
            screen.getByText('Data on the following query could not be found')
        ).toBeInTheDocument();
    });

    describe('Returns Home', () => {
        it('when Home Button is clicked', () => {
            render(<App />, { wrapper: MemoryRouter });
            searchText('Mysten Labs');
            fireEvent.click(screen.getByRole('link', { name: /home button/i }));
            expectHome();
        });
    });
});
