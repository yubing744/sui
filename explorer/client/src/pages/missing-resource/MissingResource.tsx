import { useParams } from 'react-router-dom';

import styles from './MissingResource.module.css';

const MissingResource = () => {
    const { id } = useParams();

    return (
        <dl className={styles.data}>
            <dt>Data on the following query could not be found:</dt>
            <dd>{id}</dd>
        </dl>
    );
};

export default MissingResource;
