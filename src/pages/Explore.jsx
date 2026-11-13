import { useState, useMemo } from 'react';
import { Search, SearchX, ShoppingBag, TrendingUp, Package, IndianRupee, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui';
import { FragranceCard } from '../components/fragrance';
import { SAMPLE_FRAGRANCES, COLLECTION_GAPS } from '../data/fragrances';
import { FRAGRANCE_FAMILIES } from '../data/constants';
import { formatPrice } from '../utils/helpers';
import styles from './Explore.module.css';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFamily, setActiveFamily] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredFragrances = useMemo(() => {
    let result = [...SAMPLE_FRAGRANCES];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.brand.toLowerCase().includes(query)
      );
    }

    if (activeFamily !== 'all') {
      result = result.filter((f) => f.family === activeFamily);
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'longevity':
        result.sort((a, b) => b.longevity - a.longevity);
        break;
      case 'price':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, activeFamily, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFamily('all');
  };

  const collectionStats = useMemo(() => {
    const priced = SAMPLE_FRAGRANCES.filter(f => f.price > 0);
    const totalValue = priced.reduce((sum, f) => sum + f.price, 0);
    const avgValue = priced.length > 0 ? Math.round(totalValue / priced.length) : 0;
    const mostExpensive = priced.reduce((best, f) => (!best || f.price > best.price ? f : best), null);

    const byBrand = SAMPLE_FRAGRANCES.reduce((acc, f) => {
      if (!acc[f.brand]) acc[f.brand] = { total: 0, count: 0, priced: 0 };
      acc[f.brand].count++;
      if (f.price > 0) { acc[f.brand].total += f.price; acc[f.brand].priced++; }
      return acc;
    }, {});

    return { totalValue, avgValue, mostExpensive, pricedCount: priced.length, byBrand };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Explore Collection</h1>
          <p className={styles.subtitle}>
            Browse all {SAMPLE_FRAGRANCES.length} fragrances
          </p>
        </header>

        {/* Collection Value */}
        <motion.div
          className={styles.valueSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.valueSectionHeader}>
            <TrendingUp size={18} className={styles.valueIcon} />
            <span className={styles.valueSectionTitle}>Collection Value</span>
            <span className={styles.valuePricedNote}>
              {collectionStats.pricedCount} of {SAMPLE_FRAGRANCES.length} priced
            </span>
          </div>

          <div className={styles.valueGrid}>
            <div className={styles.valueTile}>
              <IndianRupee size={16} className={styles.valueTileIcon} />
              <span className={styles.valueTileLabel}>Total Value</span>
              <span className={styles.valueTileNumber}>
                {formatPrice(collectionStats.totalValue)}
              </span>
              {collectionStats.pricedCount < SAMPLE_FRAGRANCES.length && (
                <span className={styles.valueTileSub}>known prices</span>
              )}
            </div>

            <div className={styles.valueTile}>
              <Package size={16} className={styles.valueTileIcon} />
              <span className={styles.valueTileLabel}>Bottles</span>
              <span className={styles.valueTileNumber}>{SAMPLE_FRAGRANCES.length}</span>
              <span className={styles.valueTileSub}>
                {Object.keys(collectionStats.byBrand).length} brands
              </span>
            </div>

            <div className={styles.valueTile}>
              <IndianRupee size={16} className={styles.valueTileIcon} />
              <span className={styles.valueTileLabel}>Avg per Bottle</span>
              <span className={styles.valueTileNumber}>
                {formatPrice(collectionStats.avgValue)}
              </span>
              <span className={styles.valueTileSub}>of priced items</span>
            </div>

            {collectionStats.mostExpensive && (
              <div className={styles.valueTile}>
                <Award size={16} className={styles.valueTileIcon} />
                <span className={styles.valueTileLabel}>Most Valuable</span>
                <span className={styles.valueTileNumber}>
                  {formatPrice(collectionStats.mostExpensive.price)}
                </span>
                <span className={styles.valueTileSub}>{collectionStats.mostExpensive.name}</span>
              </div>
            )}
          </div>

          <div className={styles.brandBreakdown}>
            {Object.entries(collectionStats.byBrand)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([brand, data]) => (
                <div key={brand} className={styles.brandRow}>
                  <span className={styles.brandRowName}>{brand}</span>
                  <span className={styles.brandRowCount}>{data.count} bottle{data.count !== 1 ? 's' : ''}</span>
                  <span className={styles.brandRowValue}>
                    {data.total > 0 ? formatPrice(data.total) : '—'}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Search Bar — daisyUI input with icon */}
        <div className="max-w-[500px] mx-auto mb-6">
          <label className="input input-bordered flex items-center gap-2 rounded-full shadow-sm bg-base-100 border-base-300 focus-within:border-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/15">
            <Search size={18} className="text-base-content/40" />
            <input
              type="text"
              className="grow bg-transparent border-none outline-none text-base-content placeholder:text-base-content/40"
              placeholder="Search by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>

        {/* Filter Chips + Sort Row */}
        <div className={styles.controlsRow}>
          <div className={styles.filtersScroll}>
            <button
              className={`btn btn-sm rounded-full ${activeFamily === 'all' ? 'btn-primary' : 'btn-outline border-base-300 text-base-content/70'}`}
              onClick={() => setActiveFamily('all')}
            >
              All
            </button>
            {FRAGRANCE_FAMILIES.map((family) => (
              <button
                key={family.id}
                className={`btn btn-sm rounded-full gap-1 ${activeFamily === family.id ? 'btn-primary' : 'btn-outline border-base-300 text-base-content/70'}`}
                onClick={() => setActiveFamily(family.id)}
              >
                <span className="text-sm leading-none">{family.icon}</span>
                {family.label}
              </button>
            ))}
          </div>

          <div className="shrink-0">
            <select
              className="select select-bordered select-sm rounded-xl bg-base-100 border-base-300 text-base-content focus:border-primary focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="rating">Rating (High-Low)</option>
              <option value="longevity">Longevity (High-Low)</option>
              <option value="price">Price (High-Low)</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-base-content/50 mb-6">
          Showing {filteredFragrances.length} of {SAMPLE_FRAGRANCES.length}{' '}
          fragrances
        </p>

        {/* Fragrance Grid or Empty State */}
        {filteredFragrances.length > 0 ? (
          <div className={styles.grid}>
            <AnimatePresence mode="popLayout">
              {filteredFragrances.map((fragrance, i) => (
                <motion.div
                  key={fragrance.id}
                  layout
                  initial={{ opacity: 0, y: 40, rotateX: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ perspective: 1000 }}
                >
                  <FragranceCard fragrance={fragrance} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <SearchX size={48} className="text-base-content/30" />
            <p className="text-base text-base-content/60">
              No fragrances match your search
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Missing in Collection */}
      <div className={styles.wishlistSection}>
        <div className={styles.container}>
          <div className={styles.wishlistHeader}>
            <ShoppingBag size={22} className="text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className={styles.wishlistTitle}>Missing in Collection</h2>
              <p className={styles.wishlistSub}>
                Popular fragrances worth adding — filling the gaps in your lineup
              </p>
            </div>
          </div>

          <div className={styles.wishlistGrid}>
            {COLLECTION_GAPS.map((gap, i) => {
              const fam = FRAGRANCE_FAMILIES.find(f => f.id === gap.family);
              const priorityColor = gap.priority === 'High' ? '#B34A45' : gap.priority === 'Medium' ? '#B8956A' : '#6A859A';
              return (
                <motion.div
                  key={gap.id}
                  className="card bg-base-100 border-2 border-dashed border-base-300 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-2"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl leading-none">{gap.icon}</span>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="badge badge-sm font-medium"
                        style={{
                          backgroundColor: `${fam?.color}15`,
                          color: fam?.color,
                          borderColor: `${fam?.color}30`,
                        }}
                      >
                        {fam?.icon} {fam?.label}
                      </span>
                      <span
                        className="badge badge-xs font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${priorityColor}15`,
                          color: priorityColor,
                          borderColor: `${priorityColor}30`,
                        }}
                      >
                        {gap.priority}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-[var(--font-display)] text-lg font-semibold text-base-content leading-tight">{gap.title}</h3>
                  <p className="text-sm text-base-content/60 leading-relaxed flex-1">{gap.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {gap.occasions.map(o => (
                      <span key={o} className="badge badge-sm bg-base-200 border-base-300 text-base-content/50 font-normal">{o}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
