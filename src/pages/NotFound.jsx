// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import styles from '../styles/NotFound.module.css'; // Import the CSS module

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.notFoundContent}>
        <h1>404</h1>
        <p>Oops! The page youre looking for doesnt exist.</p>
        <Link to="/" className={styles.backHome}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
