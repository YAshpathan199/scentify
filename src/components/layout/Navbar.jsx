import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navClass = [
    styles.navbar,
    scrolled ? styles.scrolled : '',
    isHome && !scrolled ? styles.transparent : '',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClass} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        <Link to="/" className={styles.logo} aria-label="Scentify home">
          <Sparkles size={24} className={styles.logoIcon} />
          <span className={styles.logoText}>Scentify</span>
        </Link>

        <div className={`${styles.links} ${mobileOpen ? styles.open : ''}`}>
          <Link to="/discover" className={location.pathname === '/discover' ? styles.active : ''}>
            Discover
          </Link>
          <Link to="/explore" className={location.pathname === '/explore' ? styles.active : ''}>
            Explore
          </Link>
          <Link to="/guide" className={location.pathname === '/guide' ? styles.active : ''}>
            Guide
          </Link>
          <Link to="/learn" className={location.pathname === '/learn' ? styles.active : ''}>
            Learn
          </Link>
        </div>

        <Link to="/discover" className={styles.cta}>
          Find Your Scent
        </Link>

        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/discover" className={location.pathname === '/discover' ? styles.active : ''}>
            Discover Your Fragrance
          </Link>
          <Link to="/explore" className={location.pathname === '/explore' ? styles.active : ''}>
            Explore Collection
          </Link>
          <Link to="/guide" className={location.pathname === '/guide' ? styles.active : ''}>
            How to Wear
          </Link>
          <Link to="/learn" className={location.pathname === '/learn' ? styles.active : ''}>
            Learn
          </Link>
          <Link to="/discover" className={styles.mobileCta}>
            Find Your Scent
          </Link>
        </div>
      )}
    </nav>
  );
}
