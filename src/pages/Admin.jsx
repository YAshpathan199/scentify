import { useState, useCallback } from 'react';
import { Routes, Route, NavLink, Navigate, Link, useLocation } from 'react-router-dom';
import {
  Sparkles, LayoutDashboard, FlaskConical, BarChart3,
  Database, ExternalLink, Menu, X,
  Lock, Eye, EyeOff, LogOut,
} from 'lucide-react';
import { Overview, FragranceManager, Analytics, DataTools } from '../components/admin';
import { getGreeting } from '../utils/helpers';
import styles from './Admin.module.css';

const ADMIN_HASH = '87b07733d3118f24ef5749b7b015d96f6cfb53c3641d362f414f63cdb0107046';
const SESSION_KEY = 'scentify_admin_auth';

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function useAdminAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');

  const login = useCallback(async (password) => {
    const hash = await hashPassword(password);
    if (hash === ADMIN_HASH) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }, []);

  return { authed, login, logout };
}

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');
    const ok = await onLogin(password);
    setLoading(false);
    if (!ok) setError('Incorrect password');
  }

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <div className={styles.loginIconWrap}>
          <Lock size={28} />
        </div>
        <h1 className={styles.loginTitle}>Admin Panel</h1>
        <p className={styles.loginSubtitle}>Enter the password to continue</p>

        <div className={styles.loginInputWrap}>
          <input
            type={showPassword ? 'text' : 'password'}
            className={styles.loginInput}
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="Password"
            autoFocus
            autoComplete="current-password"
          />
          <button
            type="button"
            className={styles.loginToggle}
            onClick={() => setShowPassword(v => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className={styles.loginError}>{error}</p>}

        <button type="submit" className={styles.loginBtn} disabled={loading || !password.trim()}>
          {loading ? 'Verifying...' : 'Unlock'}
        </button>

        <Link to="/" className={styles.loginBack}>Back to Site</Link>
      </form>
    </div>
  );
}

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/fragrances', label: 'Fragrances', icon: FlaskConical },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/data', label: 'Data Tools', icon: Database },
];

const TITLES = {
  '/admin': 'Overview',
  '/admin/fragrances': 'Fragrances',
  '/admin/analytics': 'Analytics',
  '/admin/data': 'Data Tools',
};

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authed, login, logout } = useAdminAuth();
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Dashboard';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  if (!authed) return <AdminLogin onLogin={login} />;

  return (
    <div className={styles.layout}>
      <button
        className={styles.hamburger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/admin" className={styles.logoLink} onClick={() => setSidebarOpen(false)}>
            <Sparkles size={22} className={styles.logoIcon} />
            <span className={styles.logoText}>Scentify</span>
          </Link>
          <div className={styles.adminBadge}>Admin</div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} className={styles.navIcon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.backLink}>
            <ExternalLink size={14} />
            Back to Site
          </Link>
          <button className={styles.logoutBtn} onClick={logout}>
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <h1>{title}</h1>
          </div>
          <div className={styles.topBarRight}>
            <span className={styles.greeting}>{getGreeting()}</span>
            <span className={styles.dateBadge}>{today}</span>
          </div>
        </header>

        <div className={styles.content}>
          <Routes>
            <Route index element={<Overview />} />
            <Route path="fragrances" element={<FragranceManager />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="data" element={<DataTools />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
