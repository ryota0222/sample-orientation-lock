import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { capitalize } from '../utils';

export default function Home() {
  /**
   * null: 初期値
   * undefined: サポートなし
   * portrait: 縦向き
   * landscape: 横向き
   */
  const [orientation, setOrientation] = useState(null);
  const handleChangeOrientation = useCallback(
    (value) => {
      screen.orientation
        .lock(value)
        .then(() => {
          setOrientation(value);
        })
        .catch((err) => {
          setOrientation(undefined);
        });
    },
    [orientation]
  );
  useEffect(() => {
    const _orientation = screen.orientation.type.startsWith('portrait')
      ? 'landscape'
      : 'portrait';
    handleChangeOrientation(_orientation);
  }, []);
  const toggle = useCallback(() => {
    handleChangeOrientation(
      orientation === 'portrait' ? 'landscape' : 'portrait'
    );
  }, [orientation]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        {orientation === null ? (
          <></>
        ) : (
          <h1 className={styles.title}>
            {orientation === undefined && (
              <>
                This device does not support <span>orientation locking</span>
              </>
            )}
            {orientation && (
              <>
                This screen is locked in{' '}
                <span>{capitalize(orientation || '')}</span> orientation
              </>
            )}
          </h1>
        )}
        {orientation === undefined && <p>スマートフォンでお試しください</p>}
        {orientation && (
          <button onClick={toggle} className={styles.toggleButton}>
            Change to landscape orientation
          </button>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://portfolio.ryotanny.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by Ryotanny
        </a>
      </footer>
    </div>
  );
}
