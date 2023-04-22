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
  const [lockErrorType, setLockErrorType] = useState(null);
  const handleChangeOrientation = useCallback(
    async (value) => {
      // フルスクリーンでない場合に実行
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          if (err instanceof Error) {
            console.log(err.name);
          }
          setOrientation(undefined);
        }
      }
      // 画面のロック
      if ('lock' in screen.orientation) {
        screen.orientation
          .lock(value)
          .then(() => {
            setOrientation(value);
          })
          .catch((err) => {
            if (err instanceof Error) {
              console.log(err.name);
              setLockErrorType(err.name);
            }
            setOrientation(undefined);
          });
      } else {
        setOrientation(undefined);
      }
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
                This device does not support <span>orientation lock</span>
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
        {orientation === undefined && (
          <>
            {lockErrorType !== null ? (
              <p>screen.orientation.lock: {lockErrorType}</p>
            ) : (
              <p>タブレット、もしくはスマートフォンでお試しください</p>
            )}
          </>
        )}
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
