import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical, IndianRupee, Calendar, Star,
  Building2, Palette, Plus, History, Download,
  ExternalLink, BarChart3, TrendingUp, AlertTriangle, Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useFragrances } from '../../context/FragranceContext';
import { FRAGRANCE_FAMILIES, SEASONS, CONCENTRATIONS } from '../../data/constants';
import { formatPrice } from '../../utils/helpers';
import styles from './Overview.module.css';

export default function Overview() {
  const { fragrances, history, exportData } = useFragrances();

  const stats = useMemo(() => {
    const totalValue = fragrances.reduce((s, f) => s + (f.price || 0), 0);
    const avgRating = fragrances.length
      ? (fragrances.reduce((s, f) => s + f.rating, 0) / fragrances.length).toFixed(1)
      : '0';
    const brands = new Set(fragrances.map(f => f.brand));
    const families = new Set(fragrances.map(f => f.family));
    return { totalValue, avgRating, brandCount: brands.size, familyCount: families.size };
  }, [fragrances]);

  const familyDist = useMemo(() => {
    const counts = {};
    fragrances.forEach(f => { counts[f.family] = (counts[f.family] || 0) + 1; });
    return FRAGRANCE_FAMILIES
      .map(fam => ({ ...fam, count: counts[fam.id] || 0 }))
      .sort((a, b) => b.count - a.count);
  }, [fragrances]);

  const maxFamilyCount = Math.max(...familyDist.map(f => f.count), 1);

  const seasonCoverage = useMemo(() => {
    return SEASONS.map(s => {
      const count = fragrances.filter(f => f.seasons?.includes(s.id)).length;
      return { ...s, count };
    });
  }, [fragrances]);

  const topRated = useMemo(() => {
    return [...fragrances].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [fragrances]);

  const recentActivity = useMemo(() => {
    return [...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [history]);

  const gaps = useMemo(() => {
    const ownedFamilies = new Set(fragrances.map(f => f.family));
    const missing = FRAGRANCE_FAMILIES.filter(f => !ownedFamilies.has(f.id));
    const weakSeasons = seasonCoverage.filter(s => s.count < 2);
    const prices = fragrances.filter(f => f.price > 0).map(f => f.price);
    const concCounts = {};
    fragrances.forEach(f => { concCounts[f.concentration] = (concCounts[f.concentration] || 0) + 1; });
    return { missing, weakSeasons, prices, concCounts };
  }, [fragrances, seasonCoverage]);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scentify-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div className={styles.overview} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        {[
          { label: 'Total Fragrances', value: fragrances.length, icon: FlaskConical, cls: styles.statIconAccent },
          { label: 'Collection Value', value: formatPrice(stats.totalValue), icon: IndianRupee, cls: styles.statIconSuccess },
          { label: 'Total Wears', value: history.length, icon: Calendar, cls: styles.statIconInfo },
          { label: 'Avg Rating', value: stats.avgRating, icon: Star, cls: styles.statIconAccent },
          { label: 'Brands', value: stats.brandCount, icon: Building2, cls: styles.statIconSecondary },
          { label: 'Families Covered', value: `${stats.familyCount}/8`, icon: Palette, cls: styles.statIconSecondary },
        ].map((s, i) => (
          <div className={styles.statTile} key={i}>
            <div className={`${styles.statIcon} ${s.cls}`}><s.icon size={22} /></div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <TrendingUp size={20} className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
        </div>
        <div className={styles.quickActions}>
          <Link to="/admin/fragrances?action=add" className={`${styles.actionBtn} ${styles.actionPrimary}`}>
            <Plus size={16} /> Add Fragrance
          </Link>
          <Link to="/admin/history" className={`${styles.actionBtn} ${styles.actionSecondary}`}>
            <History size={16} /> Log Wear
          </Link>
          <button onClick={handleExport} className={`${styles.actionBtn} ${styles.actionOutline}`}>
            <Download size={16} /> Export Data
          </button>
          <Link to="/" className={`${styles.actionBtn} ${styles.actionGhost}`}>
            <ExternalLink size={16} /> View Site
          </Link>
        </div>
      </div>

      {/* Family Distribution + Recent Activity */}
      <div className={styles.twoCol}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <BarChart3 size={20} className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>Family Distribution</h3>
          </div>
          <div className={styles.barChartList}>
            {familyDist.map(fam => (
              <div className={styles.barRow} key={fam.id}>
                <span className={styles.barLabel}>{fam.icon} {fam.label}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(fam.count / maxFamilyCount) * 100}%`, background: fam.color }}
                  />
                </div>
                <span className={styles.barCount}>{fam.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <History size={20} className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>Recent Activity</h3>
          </div>
          {recentActivity.length === 0 ? (
            <p className={styles.emptyMessage}>No wear history yet. Start logging!</p>
          ) : (
            <div className={styles.activityList}>
              {recentActivity.map((entry, i) => {
                const frag = fragrances.find(f => f.id === entry.fragranceId);
                return (
                  <div className={`${styles.activityRow} ${i % 2 ? styles.activityRowAlt : ''}`} key={entry.timestamp}>
                    <span className={styles.activityDate}>{entry.date}</span>
                    <span className={styles.activityName}>{frag?.name || 'Unknown'}</span>
                    {entry.occasion && <span className={styles.activityOccasion}>{entry.occasion}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Season Coverage */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Calendar size={20} className={styles.sectionIcon} />
          <h3 className={styles.sectionTitle}>Season Coverage</h3>
        </div>
        <div className={styles.seasonGrid}>
          {seasonCoverage.map(s => {
            const cls = s.count < 2 ? styles.seasonWeak : s.count < 5 ? styles.seasonOk : styles.seasonStrong;
            return (
              <div className={`${styles.seasonCard} ${cls}`} key={s.id}>
                {s.count < 2 && <span className={styles.warningBadge}>Weak</span>}
                <div className={styles.seasonIcon}>{s.icon}</div>
                <p className={styles.seasonName}>{s.label}</p>
                <p className={styles.seasonCount}>{s.count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Rated + Gaps */}
      <div className={styles.twoCol}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Star size={20} className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>Top Rated</h3>
          </div>
          <div className={styles.topRatedList}>
            {topRated.map((f, i) => {
              const family = FRAGRANCE_FAMILIES.find(fam => fam.id === f.family);
              return (
                <div className={styles.topRatedCard} key={f.id}>
                  <span className={styles.rankBadge}>{i + 1}</span>
                  <div className={styles.topRatedInfo}>
                    <p className={styles.topRatedName}>{f.name}</p>
                    <p className={styles.topRatedBrand}>{f.brand}</p>
                  </div>
                  <div className={styles.topRatedMeta}>
                    <div className={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} size={12} fill={n <= f.rating ? 'var(--accent)' : 'none'}
                          className={n <= f.rating ? styles.starFilled : styles.starEmpty} />
                      ))}
                    </div>
                    <div className={styles.familyDot} style={{ background: family?.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <AlertTriangle size={20} className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>Collection Gaps</h3>
          </div>
          <div className={styles.gapsGrid}>
            {gaps.missing.length > 0 && (
              <div className={`${styles.gapCard} ${styles.gapCardWarn}`}>
                <div className={styles.gapHeader}>
                  <AlertTriangle size={16} className={styles.gapIconWarn} />
                  <p className={styles.gapTitle}>Missing Families</p>
                </div>
                <div className={styles.gapList}>
                  {gaps.missing.map(f => (
                    <span key={f.id} className={styles.gapChip}>{f.icon} {f.label}</span>
                  ))}
                </div>
              </div>
            )}
            {gaps.weakSeasons.length > 0 && (
              <div className={`${styles.gapCard} ${styles.gapCardWarn}`}>
                <div className={styles.gapHeader}>
                  <AlertTriangle size={16} className={styles.gapIconWarn} />
                  <p className={styles.gapTitle}>Weak Seasons</p>
                </div>
                <div className={styles.gapList}>
                  {gaps.weakSeasons.map(s => (
                    <span key={s.id} className={styles.gapChip}>{s.icon} {s.label} ({s.count})</span>
                  ))}
                </div>
              </div>
            )}
            <div className={`${styles.gapCard} ${styles.gapCardInfo}`}>
              <div className={styles.gapHeader}>
                <Info size={16} className={styles.gapIconInfo} />
                <p className={styles.gapTitle}>Price Range</p>
              </div>
              <p className={styles.gapBody}>
                {gaps.prices.length > 0
                  ? `${formatPrice(Math.min(...gaps.prices))} — ${formatPrice(Math.max(...gaps.prices))}`
                  : 'No price data'}
              </p>
            </div>
            <div className={`${styles.gapCard} ${styles.gapCardInfo}`}>
              <div className={styles.gapHeader}>
                <Info size={16} className={styles.gapIconInfo} />
                <p className={styles.gapTitle}>Concentrations</p>
              </div>
              <div className={styles.gapList}>
                {CONCENTRATIONS.map(c => (
                  <span key={c.id} className={styles.gapChip}>{c.label}: {gaps.concCounts[c.id] || 0}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
