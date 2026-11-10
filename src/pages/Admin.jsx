import { useState } from 'react';
import { Routes, Route, NavLink, Navigate, Link, useLocation } from 'react-router-dom';
import {
  Sparkles, LayoutDashboard, FlaskConical, BarChart3,
  Calendar, Layers, Database, ExternalLink, Menu, X,
} from 'lucide-react';
import { Overview, FragranceManager, Analytics, WearHistory, LayeringLab, DataTools } from '../components/admin';
import { getGreeting } from '../utils/helpers';
import styles from './Admin.module.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/fragrances', label: 'Fragrances', icon: FlaskConical },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/history', label: 'Wear History', icon: Calendar },
  { to: '/admin/layering', label: 'Layering Lab', icon: Layers },
  { to: '/admin/data', label: 'Data Tools', icon: Database },
];

const TITLES = {
  '/admin': 'Overview',
  '/admin/fragrances': 'Fragrances',
  '/admin/analytics': 'Analytics',
  '/admin/history': 'Wear History',
  '/admin/layering': 'Layering Lab',
  '/admin/data': 'Data Tools',
};

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Dashboard';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

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
            <Route path="history" element={<WearHistory />} />
            <Route path="layering" element={<LayeringLab />} />
            <Route path="data" element={<DataTools />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
