import { useState, useMemo } from 'react';
import { Search, SearchX, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui';
import { FragranceCard } from '../components/fragrance';
import { SAMPLE_FRAGRANCES, COLLECTION_GAPS } from '../data/fragrances';
import { FRAGRANCE_FAMILIES } from '../data/constants';
import styles from './Explore.module.css';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFamily, setActiveFamily] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredFragrances = useMemo(() => {
    let result = [...SAMPLE_FRAGRANCES];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.brand.toLowerCase().includes(query)
      );
    }

    // Filter by family
    if (activeFamily !== 'all') {
      result = result.filter((f) => f.family === activeFamily);
    }

    // Sort
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

        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Chips + Sort Row */}
        <div className={styles.controlsRow}>
          <div className={styles.filtersScroll}>
            <button
              className={`${styles.chip} ${activeFamily === 'all' ? styles.chipActive : ''}`}
              onClick={() => setActiveFamily('all')}
            >
              All
            </button>
            {FRAGRANCE_FAMILIES.map((family) => (
              <button
                key={family.id}
                className={`${styles.chip} ${activeFamily === family.id ? styles.chipActive : ''}`}
                onClick={() => setActiveFamily(family.id)}
              >
                <span className={styles.chipIcon}>{family.icon}</span>
                {family.label}
              </button>
            ))}
          </div>

          <div className={styles.sortWrapper}>
            <select
              className={styles.sortSelect}
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
        <p className={styles.resultsCount}>
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
          <div className={styles.empty}>
            <SearchX size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              No fragrances match your search
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* ── Missing in Collection ── */}
      <div className={styles.wishlistSection}>
        <div className={styles.container}>
          <div className={styles.wishlistHeader}>
            <ShoppingBag size={22} className={styles.wishlistIcon} />
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
                  className={styles.wishlistCard}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <div className={styles.wishlistCardTop}>
                    <span className={styles.wishlistEmoji}>{gap.icon}</span>
                    <div className={styles.wishlistCardTopRight}>
                      <span
                        className={styles.wishlistFamilyChip}
                        style={{ '--fam-color': fam?.color }}
                      >
                        {fam?.icon} {fam?.label}
                      </span>
                      <span
                        className={styles.wishlistPriority}
                        style={{ '--p-color': priorityColor }}
                      >
                        {gap.priority}
                      </span>
                    </div>
                  </div>

                  <h3 className={styles.wishlistName}>{gap.title}</h3>
                  <p className={styles.wishlistWhy}>{gap.description}</p>

                  <div className={styles.wishlistOccasions}>
                    {gap.occasions.map(o => (
                      <span key={o} className={styles.wishlistOccasionTag}>{o}</span>
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
