import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClipboardPaste, Library, ShoppingBag, Search } from 'lucide-react';
import { Button } from '../components/ui';
import { useFragrances } from '../context/FragranceContext';
import { FRAGRANCE_FAMILIES } from '../data/constants';
import { noteAccords } from '../utils/accords';
import { classifyFamily, parseInputJSON } from '../utils/classify';
import styles from './BuyAssist.module.css';

const PLACEHOLDER = `{
  "fruity": 1.0,
  "citrus": 0.95,
  "aquatic": 0.80,
  "fresh": 0.71,
  "warm spicy": 0.48,
  "sweet": 0.39,
  "amber": 0.39,
  "musky": 0.36
}`;

const familyMap = Object.fromEntries(FRAGRANCE_FAMILIES.map(f => [f.id, f]));

export default function BuyAssist() {
  const { fragrances } = useFragrances();
  const [mode, setMode] = useState('paste');
  const [jsonText, setJsonText] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState('');
  const [pasteResults, setPasteResults] = useState(null);
  const [pasteMeta, setPasteMeta] = useState(null);

  const collectionCoverage = useMemo(() => {
    const map = {};
    FRAGRANCE_FAMILIES.forEach(f => { map[f.id] = []; });
    fragrances.forEach(f => {
      if (map[f.family]) map[f.family].push(f);
    });
    return map;
  }, [fragrances]);

  const ownedCount = useMemo(
    () => FRAGRANCE_FAMILIES.filter(f => collectionCoverage[f.id]?.length > 0).length,
    [collectionCoverage],
  );

  const selectedFragrance = useMemo(
    () => fragrances.find(f => f.id === selectedId),
    [fragrances, selectedId],
  );

  const selectResults = useMemo(() => {
    if (!selectedFragrance) return null;
    const accords = noteAccords(selectedFragrance);
    return classifyFamily(accords);
  }, [selectedFragrance]);

  const results = mode === 'paste' ? pasteResults : selectResults;
  const topResult = results?.[0];
  const topFamily = topResult ? familyMap[topResult.familyId] : null;

  function handleClassify() {
    setError('');
    setPasteResults(null);
    setPasteMeta(null);
    try {
      const parsed = parseInputJSON(jsonText.trim());
      setPasteResults(parsed.results);
      if (parsed.name || parsed.brand) {
        setPasteMeta({ name: parsed.name, brand: parsed.brand });
      }
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Scent Scout</h1>
          <p className={styles.subtitle}>
            Classify any fragrance into its family — see where it fits in your collection
          </p>
        </header>

        {/* Mode Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'paste' ? styles.tabActive : ''}`}
            onClick={() => setMode('paste')}
          >
            <ClipboardPaste size={16} /> Paste JSON
          </button>
          <button
            className={`${styles.tab} ${mode === 'select' ? styles.tabActive : ''}`}
            onClick={() => setMode('select')}
          >
            <Library size={16} /> From Collection
          </button>
        </div>

        {/* Input Panel */}
        <div className={styles.inputPanel}>
          {mode === 'paste' ? (
            <>
              <h2 className={styles.inputLabel}>Paste Fragrantica Accords or Fragrance JSON</h2>
              <p className={styles.inputHint}>
                Copy the accords from Fragrantica (e.g. {`{"fruity": 1.0, "citrus": 0.95}`}) or paste a full fragrance object with notes.
              </p>
              <textarea
                className={styles.textarea}
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                placeholder={PLACEHOLDER}
                spellCheck={false}
              />
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.inputActions}>
                <Button variant="primary" onClick={handleClassify} disabled={!jsonText.trim()}>
                  <Search size={16} /> Classify Family
                </Button>
                {pasteMeta && (
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--text-secondary)' }}>
                    {pasteMeta.brand && `${pasteMeta.brand} — `}{pasteMeta.name}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.inputLabel}>Select a Fragrance</h2>
              <p className={styles.inputHint}>
                Pick one from your collection to see its full family classification breakdown.
              </p>
              <div className={styles.selectGrid}>
                {fragrances.map(f => (
                  <button
                    key={f.id}
                    className={`${styles.selectCard} ${selectedId === f.id ? styles.selectCardActive : ''}`}
                    onClick={() => setSelectedId(f.id)}
                  >
                    <div className={styles.selectThumb}>
                      {f.image ? (
                        <img src={f.image} alt={f.name} />
                      ) : (
                        <ShoppingBag size={20} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <div className={styles.selectInfo}>
                      <span className={styles.selectName}>{f.name}</span>
                      <span className={styles.selectBrand}>{f.brand}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Results */}
        {results ? (
          <motion.div
            className={styles.results}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Classification Result */}
            <div className={styles.classifyCard}>
              <h2 className={styles.classifyTitle}>Classification Result</h2>

              {topFamily && (
                <div className={styles.topFamily} style={{ borderLeftColor: topFamily.color }}>
                  <span className={styles.topFamilyIcon}>{topFamily.icon}</span>
                  <div className={styles.topFamilyInfo}>
                    <h3 className={styles.topFamilyLabel}>{topFamily.label}</h3>
                    <p className={styles.topFamilyDesc}>{topFamily.description}</p>
                  </div>
                  <span className={styles.topFamilyConfidence} style={{ color: topFamily.color }}>
                    {topResult.confidence}%
                  </span>
                </div>
              )}

              <p className={styles.runnersTitle}>Other Families</p>
              <div className={styles.runnersList}>
                {results.slice(1, 6).map(r => {
                  const fam = familyMap[r.familyId];
                  if (!fam) return null;
                  return (
                    <div key={r.familyId} className={styles.runnerRow}>
                      <span className={styles.runnerIcon}>{fam.icon}</span>
                      <span className={styles.runnerName}>{fam.label}</span>
                      <div className={styles.runnerBar}>
                        <div
                          className={styles.runnerFill}
                          style={{ width: `${r.confidence}%`, background: fam.color }}
                        />
                      </div>
                      <span className={styles.runnerScore}>{r.confidence}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collection Coverage */}
            <div className={styles.coverageCard}>
              <h2 className={styles.coverageTitle}>Collection Coverage</h2>
              <p className={styles.coverageSubtitle}>
                {ownedCount} of {FRAGRANCE_FAMILIES.length} families covered
              </p>

              <div className={styles.coverageGrid}>
                {FRAGRANCE_FAMILIES.map(fam => {
                  const owned = collectionCoverage[fam.id]?.length || 0;
                  const isMatch = fam.id === topResult?.familyId;
                  let cls = styles.coverageItem;
                  if (isMatch) cls += ` ${styles.coverageMatch}`;
                  else if (owned > 0) cls += ` ${styles.coverageOwned}`;
                  else cls += ` ${styles.coverageMissing}`;

                  return (
                    <div key={fam.id} className={cls}>
                      <span className={styles.coverageIcon}>{fam.icon}</span>
                      <span className={styles.coverageLabel}>{fam.label}</span>
                      {owned > 0 ? (
                        <span className={styles.coverageCount}>{owned} bottle{owned !== 1 ? 's' : ''}</span>
                      ) : (
                        <span className={styles.coverageCount}>Missing</span>
                      )}
                      {isMatch && <span className={styles.coverageBadge}>Match</span>}
                    </div>
                  );
                })}
              </div>

              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{ownedCount}</span>
                  <span className={styles.statLabel}>Covered</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{FRAGRANCE_FAMILIES.length - ownedCount}</span>
                  <span className={styles.statLabel}>Missing</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{fragrances.length}</span>
                  <span className={styles.statLabel}>Total Bottles</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className={styles.emptyState}>
            <ShoppingBag size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>
              {mode === 'paste' ? 'Paste accords to classify' : 'Select a fragrance'}
            </h3>
            <p className={styles.emptyDesc}>
              {mode === 'paste'
                ? 'Copy the accord data from Fragrantica or any fragrance site and paste it above to find out which family it belongs to.'
                : 'Pick a fragrance from your collection to see its detailed family classification.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
