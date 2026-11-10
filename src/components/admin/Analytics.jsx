import { useMemo } from 'react';
import { BarChart3, PieChart, Thermometer, Target, Droplets, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFragrances } from '../../context/FragranceContext';
import { FRAGRANCE_FAMILIES, SEASONS, OCCASIONS, OCCASION_CATEGORIES, CONCENTRATIONS, MOODS } from '../../data/constants';
import { formatPrice, getProjectionPercent } from '../../utils/helpers';
import styles from './Analytics.module.css';

const BRAND_COLORS = ['#B8956A', '#6B8F71', '#7B96AA', '#C25B56', '#8B6914', '#B85070', '#5A7A1A', '#D08A10'];
const CONC_COLORS = { Cologne: '#7B96AA', EDT: '#B8956A', EDP: '#6B8F71', Parfum: '#C25B56' };

export default function Analytics() {
  const { fragrances } = useFragrances();

  const summary = useMemo(() => {
    const totalValue = fragrances.reduce((s, f) => s + (f.price || 0), 0);
    const avgLongevity = fragrances.length ? (fragrances.reduce((s, f) => s + f.longevity, 0) / fragrances.length).toFixed(1) : '0';
    const avgRating = fragrances.length ? (fragrances.reduce((s, f) => s + f.rating, 0) / fragrances.length).toFixed(1) : '0';
    const familyCounts = {};
    fragrances.forEach(f => { familyCounts[f.family] = (familyCounts[f.family] || 0) + 1; });
    const topFamily = Object.entries(familyCounts).sort((a, b) => b[1] - a[1])[0];
    const topFamilyObj = FRAGRANCE_FAMILIES.find(f => f.id === topFamily?.[0]);
    return { totalValue, avgLongevity, avgRating, topFamily: topFamilyObj?.label || '—' };
  }, [fragrances]);

  const familyDist = useMemo(() => {
    const counts = {};
    fragrances.forEach(f => { counts[f.family] = (counts[f.family] || 0) + 1; });
    return FRAGRANCE_FAMILIES.map(fam => ({ ...fam, count: counts[fam.id] || 0 })).sort((a, b) => b.count - a.count);
  }, [fragrances]);

  const brandDist = useMemo(() => {
    const counts = {};
    fragrances.forEach(f => { counts[f.brand] = (counts[f.brand] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([brand, count], i) => ({
      brand, count, color: BRAND_COLORS[i % BRAND_COLORS.length],
    }));
  }, [fragrances]);

  const brandConicGradient = useMemo(() => {
    const total = fragrances.length || 1;
    let angle = 0;
    const stops = brandDist.map(b => {
      const start = angle;
      angle += (b.count / total) * 360;
      return `${b.color} ${start}deg ${angle}deg`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [brandDist, fragrances.length]);

  const concDist = useMemo(() => {
    const counts = {};
    fragrances.forEach(f => { counts[f.concentration] = (counts[f.concentration] || 0) + 1; });
    return CONCENTRATIONS.map(c => ({ ...c, count: counts[c.id] || 0 }));
  }, [fragrances]);

  const concConicGradient = useMemo(() => {
    const total = fragrances.length || 1;
    let angle = 0;
    const stops = concDist.map(c => {
      const start = angle;
      angle += (c.count / total) * 360;
      return `${CONC_COLORS[c.id] || '#999'} ${start}deg ${angle}deg`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [concDist, fragrances.length]);

  const seasonMatrix = useMemo(() => {
    return SEASONS.map(s => ({
      ...s,
      fragrances: fragrances.filter(f => f.seasons?.includes(s.id)),
    }));
  }, [fragrances]);

  const perfMatrix = useMemo(() => {
    return [...fragrances].sort((a, b) => b.longevity - a.longevity);
  }, [fragrances]);

  const moodCoverage = useMemo(() => {
    return MOODS.map(m => ({
      ...m,
      count: fragrances.filter(f => f.mood?.includes(m.id)).length,
    }));
  }, [fragrances]);

  const maxMoodCount = Math.max(...moodCoverage.map(m => m.count), 1);

  const occasionHeatmap = useMemo(() => {
    return OCCASION_CATEGORIES.map(cat => ({
      ...cat,
      occasions: OCCASIONS.filter(o => o.category === cat.id).map(o => ({
        ...o,
        count: fragrances.filter(f => f.occasions?.includes(o.id)).length,
      })),
    }));
  }, [fragrances]);

  const priceData = useMemo(() => {
    const withPrice = fragrances.filter(f => f.price > 0);
    const noPrice = fragrances.filter(f => !f.price);
    const maxPrice = withPrice.length ? Math.max(...withPrice.map(f => f.price)) : 0;
    const avgPrice = withPrice.length ? Math.round(withPrice.reduce((s, f) => s + f.price, 0) / withPrice.length) : 0;
    return { withPrice, noPrice, maxPrice, avgPrice };
  }, [fragrances]);

  return (
    <motion.div className={styles.analytics} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Summary */}
      <div className={styles.summaryRow}>
        {[
          { label: 'Collection Value', value: formatPrice(summary.totalValue) },
          { label: 'Avg Longevity', value: `${summary.avgLongevity}h` },
          { label: 'Avg Rating', value: summary.avgRating },
          { label: 'Top Family', value: summary.topFamily },
        ].map((s, i) => (
          <div className={styles.summaryTile} key={i}>
            <p className={styles.summaryValue}>{s.value}</p>
            <p className={styles.summaryLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {/* Family Distribution */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><BarChart3 size={18} /> Family Distribution</h3>
          <div className={styles.barList}>
            {familyDist.map(fam => (
              <div className={styles.barRow} key={fam.id}>
                <span className={styles.barLabel}>{fam.icon} {fam.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{
                    width: `${(fam.count / (fragrances.length || 1)) * 100}%`,
                    background: fam.color,
                  }} />
                </div>
                <span className={styles.barCount}>{fam.count}</span>
                <span className={styles.barPct}>{Math.round((fam.count / (fragrances.length || 1)) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Breakdown */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><PieChart size={18} /> Brand Breakdown</h3>
          <div className={styles.donutRow}>
            <div className={styles.donut} style={{ background: brandConicGradient }}>
              <div className={styles.donutCenter}>{brandDist.length}<br /><small>brands</small></div>
            </div>
            <div className={styles.legend}>
              {brandDist.map(b => (
                <div className={styles.legendItem} key={b.brand}>
                  <span className={styles.legendDot} style={{ background: b.color }} />
                  <span className={styles.legendLabel}>{b.brand}</span>
                  <span className={styles.legendCount}>{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Concentration */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><Droplets size={18} /> Concentration Breakdown</h3>
          <div className={styles.donutRow}>
            <div className={styles.donut} style={{ background: concConicGradient }}>
              <div className={styles.donutCenter}>{fragrances.length}<br /><small>total</small></div>
            </div>
            <div className={styles.legend}>
              {concDist.map(c => (
                <div className={styles.legendItem} key={c.id}>
                  <span className={styles.legendDot} style={{ background: CONC_COLORS[c.id] }} />
                  <span className={styles.legendLabel}>{c.label}</span>
                  <span className={styles.legendCount}>{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Season Matrix */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><Thermometer size={18} /> Season Coverage</h3>
          <div className={styles.seasonCols}>
            {seasonMatrix.map(s => (
              <div key={s.id} className={styles.seasonCol}>
                <div className={`${styles.seasonHeader} ${s.fragrances.length < 2 ? styles.seasonRed : s.fragrances.length < 5 ? styles.seasonYellow : styles.seasonGreen}`}>
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                  <strong>{s.fragrances.length}</strong>
                </div>
                <div className={styles.seasonNames}>
                  {s.fragrances.map(f => {
                    const fam = FRAGRANCE_FAMILIES.find(ff => ff.id === f.family);
                    return (
                      <div key={f.id} className={styles.seasonName}>
                        <span className={styles.familyDot} style={{ background: fam?.color }} />
                        {f.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Distribution */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>💰 Price Distribution</h3>
          <div className={styles.priceStats}>
            <span>Min: {priceData.withPrice.length ? formatPrice(Math.min(...priceData.withPrice.map(f => f.price))) : '—'}</span>
            <span>Avg: {priceData.avgPrice ? formatPrice(priceData.avgPrice) : '—'}</span>
            <span>Max: {priceData.maxPrice ? formatPrice(priceData.maxPrice) : '—'}</span>
          </div>
          {priceData.maxPrice > 0 && (
            <div className={styles.priceScale}>
              <div className={styles.priceBar} />
              {priceData.withPrice.map(f => {
                const fam = FRAGRANCE_FAMILIES.find(ff => ff.id === f.family);
                return (
                  <div key={f.id} className={styles.priceDot}
                    style={{ left: `${(f.price / priceData.maxPrice) * 100}%`, background: fam?.color }}
                    title={`${f.name}: ${formatPrice(f.price)}`} />
                );
              })}
            </div>
          )}
          {priceData.noPrice.length > 0 && (
            <p className={styles.priceNote}>{priceData.noPrice.length} fragrance{priceData.noPrice.length > 1 ? 's' : ''} with unknown price</p>
          )}
        </div>

        {/* Performance Matrix */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><Target size={18} /> Performance Matrix</h3>
          <div className={styles.perfTable}>
            {perfMatrix.map(f => (
              <div key={f.id} className={styles.perfRow}>
                <span className={styles.perfName}>{f.name}</span>
                <div className={styles.perfBars}>
                  <div className={styles.perfBarWrap}>
                    <div className={styles.perfBarFill} style={{ width: `${(f.longevity / 12) * 100}%`, background: 'var(--accent)' }} />
                  </div>
                  <span className={styles.perfVal}>{f.longevity}h</span>
                </div>
                <div className={styles.perfBars}>
                  <div className={styles.perfBarWrap}>
                    <div className={styles.perfBarFill} style={{ width: `${getProjectionPercent(f.projection)}%`, background: 'var(--info)' }} />
                  </div>
                  <span className={styles.perfVal}>{f.projection}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Coverage */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><Heart size={18} /> Mood Coverage</h3>
          <div className={styles.barList}>
            {moodCoverage.map(m => (
              <div className={styles.barRow} key={m.id}>
                <span className={styles.barLabel}>{m.icon} {m.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${(m.count / maxMoodCount) * 100}%`, background: 'var(--accent)' }} />
                </div>
                <span className={styles.barCount}>{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Occasion Heatmap */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📍 Occasion Coverage</h3>
          <div className={styles.heatmapGroups}>
            {occasionHeatmap.map(cat => (
              <div key={cat.id} className={styles.heatmapGroup}>
                <h4 className={styles.heatmapCatTitle}>{cat.icon} {cat.label}</h4>
                <div className={styles.heatmapGrid}>
                  {cat.occasions.map(o => (
                    <div key={o.id} className={styles.heatCell}
                      style={{ background: o.count === 0 ? 'var(--bg-elevated)' : `rgba(184,149,106,${Math.min(o.count * 0.15, 0.6)})` }}
                      title={`${o.label}: ${o.count} fragrances`}>
                      <span className={styles.heatIcon}>{o.icon}</span>
                      <span className={styles.heatCount}>{o.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
