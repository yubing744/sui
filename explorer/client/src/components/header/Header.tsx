import { Link } from 'react-router-dom';

import styles from './Header.module.css';

const Header = () => {
    return (
        <header>
            <nav className={styles.nav}>
                <Link to="/" aria-label="logo" className={styles.logo}>
                    <span className={styles.leadlogo}>Mysten</span>
                    <span className={styles.endlogo}>Labs</span>
                </Link>
            </nav>
        </header>
    );
};

export default Header;
