import { useState, useEffect, useId, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Heart } from 'lucide-react';
import { useFragrances } from '../../context/FragranceContext';
import ScentifyMark from '../ui/ScentifyMark';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/discover', label: 'Discover' },
  { to: '/explore', label: 'Explore' },
  { to: '/scout', label: 'Scout' },
  { to: '/guide', label: 'Guide' },
  { to: '/learn', label: 'Learn' },
];

const MOBILE_LINKS = [
  { to: '/discover', label: 'Discover Your Fragrance' },
  { to: '/explore', label: 'Explore Collection' },
  { to: '/scout', label: 'Scent Scout' },
  { to: '/guide', label: 'How to Wear' },
  { to: '/learn', label: 'Learn' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useFragrances();
  const isHome = location.pathname === '/';
  const drawerId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

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
              <ScentifyMark className={styles.logoIcon} />
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

            <div className={styles.actions}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className={styles.searchForm}>
                  <Search size={16} className={styles.searchIcon} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search fragrances..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  />
                  <button type="button" className={styles.searchClose} onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search">
                  <Search size={18} />
                </button>
              )}
              <Link to="/explore?tab=favorites" className={styles.iconBtn} aria-label="Favorites">
                <Heart size={18} fill={favorites.length > 0 ? 'var(--accent)' : 'none'} />
                {favorites.length > 0 && <span className={styles.badge}>{favorites.length}</span>}
              </Link>
            </div>

            <Link to="/discover" className={styles.cta}>
              Find Your Scent
            </Link>

            <label
              htmlFor={drawerId}
              className={`btn btn-ghost btn-square md:hidden ${styles.hamburger}`}
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
          <form onSubmit={handleSearch} className="mb-3">
            <label className="input input-bordered flex items-center gap-2 rounded-full bg-base-200 border-base-300">
              <Search size={16} className="text-base-content/40 shrink-0" />
              <input
                type="text"
                className="grow bg-transparent border-none outline-none text-sm"
                placeholder="Search fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </form>
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
