import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import mockTransactionData from '../../utils/mock_data.json';
import styles from './Search.module.css';

function Search() {
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const data = mockTransactionData.data.find(
                ({ id }) => id === input
            );

            if (data === undefined || !('category' in data)) {
                navigate('../home');
            } else if (data.category === 'transaction') {
                navigate(`../transactions/${input}`, { state: data });
            } else if (data.category === 'object') {
                navigate(`../objects/${input}`, { state: data });
            } else {
                navigate(`../search/${input}`);
            }

            setInput('');
        },
        [input, navigate, setInput]
    );

    const handleTextChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.currentTarget.value),
        [setInput]
    );

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
            aria-label="search form"
        >
            <input
                className={styles.searchtext}
                id="search"
                placeholder="Search transactions by ID"
                value={input}
                onChange={handleTextChange}
                type="text"
            />
            <input type="submit" value="Search" className={styles.searchbtn} />
        </form>
    );
}

export default Search;
