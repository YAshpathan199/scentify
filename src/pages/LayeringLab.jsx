import { Layers } from 'lucide-react';
import LayeringLabPanel from '../components/admin/LayeringLab';
import { SAMPLE_FRAGRANCES } from '../data/fragrances';
import styles from './LayeringLab.module.css';

export default function LayeringLab() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroIcon}><Layers size={32} /></div>
        <h1 className={styles.heroTitle}>Layering Lab</h1>
        <p className={styles.heroSub}>
          Discover which fragrances from your collection pair beautifully together and learn the art of scent layering.
        </p>
      </div>
      <div className={styles.content}>
        <LayeringLabPanel fragrances={SAMPLE_FRAGRANCES} />
      </div>
    </div>
  );
}
