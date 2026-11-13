import { useState, useEffect, useId } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/discover', label: 'Discover' },
  { to: '/explore', label: 'Explore' },
  { to: '/guide', label: 'Guide' },
  { to: '/learn', label: 'Learn' },
];

const MOBILE_LINKS = [
  { to: '/discover', label: 'Discover Your Fragrance' },
  { to: '/explore', label: 'Explore Collection' },
  { to: '/guide', label: 'How to Wear' },
  { to: '/learn', label: 'Learn' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const drawerId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location]);

  const navClass = [
    styles.navbar,
    scrolled ? styles.scrolled : '',
    isHome && !scrolled ? styles.transparent : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="drawer drawer-end z-[100]">
      <input
        id={drawerId}
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={(e) => setDrawerOpen(e.target.checked)}
      />

      {/* Main navbar */}
      <div className="drawer-content">
        <nav className={navClass} role="navigation" aria-label="Main navigation">
          <div className={styles.container}>
            <Link to="/" className={styles.logo} aria-label="Scentify home">
              <Sparkles size={24} className={styles.logoIcon} />
              <span className={styles.logoText}>Scentify</span>
            </Link>

            <div className={styles.links}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={location.pathname === link.to ? styles.active : ''}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link to="/discover" className={styles.cta}>
              Find Your Scent
            </Link>

            <label
              htmlFor={drawerId}
              className="btn btn-ghost btn-square md:hidden"
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            >
              {drawerOpen ? <X size={22} /> : <Menu size={22} />}
            </label>
          </div>
        </nav>
      </div>

      {/* Drawer sidebar */}
      <div className="drawer-side" style={{ top: 0 }}>
        <label htmlFor={drawerId} aria-label="Close menu" className="drawer-overlay" />
        <div className="menu min-h-full w-72 bg-base-100 p-6 pt-20 flex flex-col gap-1">
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-base-200 ${
                location.pathname === link.to ? 'text-primary bg-base-200' : 'text-base-content'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4">
            <Link
              to="/discover"
              className="btn btn-primary btn-block rounded-full"
            >
              Find Your Scent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
