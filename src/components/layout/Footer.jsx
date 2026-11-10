import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <Sparkles size={20} />
              <span>Scentify</span>
            </Link>
            <p className={styles.tagline}>
              Your personal fragrance advisor for every occasion.
            </p>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.linksTitle}>Explore</h4>
            <Link to="/discover">Discover Your Fragrance</Link>
            <Link to="/explore">Browse Collection</Link>
            <Link to="/guide">How to Wear</Link>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.linksTitle}><Link to="/learn">Learn</Link></h4>
            <Link to="/guide">Spray Guide</Link>
            <Link to="/families">Fragrance Families</Link>
            <Link to="/storage">Storage Tips</Link>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} Scentify. Crafted with{' '}
            <Heart size={14} className={styles.heart} /> for fragrance lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
