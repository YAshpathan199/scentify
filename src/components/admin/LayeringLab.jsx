import { useState, useMemo } from 'react';
import { Layers, Sparkles, ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFragrances } from '../../context/FragranceContext';
import { PAIRING_RULES, FRAGRANCE_FAMILIES } from '../../data/constants';
import { getSharedNotes, getPairingScore } from '../../utils/pairing';
import styles from './LayeringLab.module.css';

export default function LayeringLab({ fragrances: fragProp } = {}) {
  const { fragrances: ctxFragrances } = useFragrances();
  const fragrances = fragProp ?? ctxFragrances;
  const [fragA, setFragA] = useState('');
  const [fragB, setFragB] = useState('');

  const autoPairs = useMemo(() => {
    if (fragrances.length < 2) return [];
    const pairs = [];
    for (let i = 0; i < fragrances.length; i++) {
      for (let j = i + 1; j < fragrances.length; j++) {
        const { score, reasons } = getPairingScore(fragrances[i], fragrances[j], PAIRING_RULES);
        if (score > 15) {
          pairs.push({ a: fragrances[i], b: fragrances[j], score, reasons });
        }
      }
    }
    return pairs.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [fragrances]);

  const suggestions = useMemo(() => {
    if (!fragA) return [];
    const a = fragrances.find(f => f.id === fragA);
    if (!a) return [];
    return fragrances
      .filter(f => f.id !== fragA)
      .map(f => ({ frag: f, ...getPairingScore(a, f, PAIRING_RULES) }))
      .sort((x, y) => y.score - x.score)
      .slice(0, 4);
  }, [fragA, fragrances]);

  const manualComparison = useMemo(() => {
    if (!fragA || !fragB || fragA === fragB) return null;
    const a = fragrances.find(f => f.id === fragA);
    const b = fragrances.find(f => f.id === fragB);
    if (!a || !b) return null;
    const { score, reasons } = getPairingScore(a, b, PAIRING_RULES);
    const shared = getSharedNotes(a, b);
    return { a, b, score, reasons, shared };
  }, [fragA, fragB, fragrances]);

  return (
    <motion.div className={styles.layeringLab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Pairing Rules */}
      <div className={styles.rulesCard}>
        <h3 className={styles.cardTitle}><Info size={18} /> Layering Guide</h3>
        <p className={styles.rulesIntro}>
          Layering fragrances combines two scents to create something unique. Apply the lighter scent first, then the heavier one on top.
        </p>
        <div className={styles.rulesGrid}>
          {PAIRING_RULES.map((rule, i) => {
            const famA = FRAGRANCE_FAMILIES.find(f => f.id === rule.a);
            const famB = FRAGRANCE_FAMILIES.find(f => f.id === rule.b);
            return (
              <div className={styles.ruleCard} key={i}>
                <div className={styles.ruleFamilies}>
                  <span>
                    <span className={styles.ruleDot} style={{ background: famA?.color }} />
                    {famA?.label}
                    <span className={styles.rulePlus}> + </span>
                  </span>
                  <span>
                    <span className={styles.ruleDot} style={{ background: famB?.color }} />
                    {famB?.label}
                  </span>
                </div>
                <p className={styles.ruleTip}>{rule.description}</p>
                <p className={styles.ruleTip}><strong>Best for:</strong> {rule.bestFor}</p>
                <p className={styles.ruleTip}><strong>How:</strong> {rule.howToLayer}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auto Pairs */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}><Sparkles size={18} /> Suggested Pairings</h3>
        {autoPairs.length === 0 ? (
          <p className={styles.emptyText}>Add at least 2 fragrances to see pairing suggestions.</p>
        ) : (
          <div className={styles.pairsGrid}>
            {autoPairs.map((pair, i) => {
              const famA = FRAGRANCE_FAMILIES.find(f => f.id === pair.a.family);
              const famB = FRAGRANCE_FAMILIES.find(f => f.id === pair.b.family);
              return (
                <div className={styles.pairCard} key={i}>
                  <div className={styles.pairHeader}>
                    <div className={styles.pairFrag}>
                      <span className={styles.pairDot} style={{ background: famA?.color }} />
                      <span className={styles.pairName}>{pair.a.name}</span>
                    </div>
                    <ArrowRight size={14} className={styles.pairArrow} />
                    <div className={styles.pairFrag}>
                      <span className={styles.pairDot} style={{ background: famB?.color }} />
                      <span className={styles.pairName}>{pair.b.name}</span>
                    </div>
                  </div>
                  <div className={styles.pairScore}>
                    <div className={styles.scoreTrack}>
                      <div className={styles.scoreFill} style={{ width: `${pair.score}%` }} />
                    </div>
                    <span className={styles.scoreValue}>{pair.score}%</span>
                  </div>
                  <ul className={styles.pairReasons}>
                    {pair.reasons.slice(0, 2).map((r, j) => (
                      <li key={j}>{r}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Comparison */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}><Layers size={18} /> Compare Two Fragrances</h3>
        <div className={styles.compareSelects}>
          <select className={styles.select} value={fragA} onChange={e => setFragA(e.target.value)}>
            <option value="">Select first fragrance...</option>
            {fragrances.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <span className={styles.compareVs}>vs</span>
          <select className={styles.select} value={fragB} onChange={e => setFragB(e.target.value)}>
            <option value="">Select second fragrance...</option>
            {fragrances.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        {fragA && !fragB && suggestions.length > 0 && (
          <div className={styles.suggestions}>
            <p className={styles.suggestLabel}>
              Best matches for <strong>{fragrances.find(f => f.id === fragA)?.name}</strong>
            </p>
            <div className={styles.suggestGrid}>
              {suggestions.map((s, i) => {
                const fam = FRAGRANCE_FAMILIES.find(f => f.id === s.frag.family);
                return (
                  <motion.button
                    key={s.frag.id}
                    className={styles.suggestCard}
                    onClick={() => setFragB(s.frag.id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    type="button"
                  >
                    <div className={styles.suggestTop}>
                      <span className={styles.suggestDot} style={{ background: fam?.color }} />
                      <span className={styles.suggestName}>{s.frag.name}</span>
                      <span className={styles.suggestPct}>{s.score}%</span>
                    </div>
                    <div className={styles.suggestBar}>
                      <div className={styles.suggestFill} style={{ width: `${s.score}%` }} />
                    </div>
                    <span className={styles.suggestFamily}>{fam?.icon} {fam?.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {fragA && fragB && fragA === fragB && (
          <p className={styles.sameNote}>Select two different fragrances to compare.</p>
        )}

        {manualComparison && (
          <motion.div className={styles.compResult} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.compHeader}>
              <div className={styles.compFrag}>
                <h4>{manualComparison.a.name}</h4>
                <span className={styles.compFamily} style={{ color: FRAGRANCE_FAMILIES.find(f => f.id === manualComparison.a.family)?.color }}>
                  {FRAGRANCE_FAMILIES.find(f => f.id === manualComparison.a.family)?.label}
                </span>
              </div>
              <div className={styles.compScoreBig}>
                <span className={styles.compScoreNum}>{manualComparison.score}</span>
                <span className={styles.compScoreLabel}>Compatibility</span>
              </div>
              <div className={styles.compFrag} style={{ textAlign: 'right' }}>
                <h4>{manualComparison.b.name}</h4>
                <span className={styles.compFamily} style={{ color: FRAGRANCE_FAMILIES.find(f => f.id === manualComparison.b.family)?.color }}>
                  {FRAGRANCE_FAMILIES.find(f => f.id === manualComparison.b.family)?.label}
                </span>
              </div>
            </div>

            {/* Notes Comparison */}
            <div className={styles.notesComp}>
              <div className={styles.notesSide}>
                <h5>Top</h5>
                {manualComparison.a.notes?.top?.map((n, i) => (
                  <span key={i} className={`${styles.noteChip} ${manualComparison.shared.includes(n.toLowerCase()) ? styles.noteShared : ''}`}>{n}</span>
                ))}
                <h5>Heart</h5>
                {manualComparison.a.notes?.heart?.map((n, i) => (
                  <span key={i} className={`${styles.noteChip} ${manualComparison.shared.includes(n.toLowerCase()) ? styles.noteShared : ''}`}>{n}</span>
                ))}
                <h5>Base</h5>
                {manualComparison.a.notes?.base?.map((n, i) => (
                  <span key={i} className={`${styles.noteChip} ${manualComparison.shared.includes(n.toLowerCase()) ? styles.noteShared : ''}`}>{n}</span>
                ))}
              </div>
              <div className={styles.notesSide}>
                <h5>Top</h5>
                {manualComparison.b.notes?.top?.map((n, i) => (
                  <span key={i} className={`${styles.noteChip} ${manualComparison.shared.includes(n.toLowerCase()) ? styles.noteShared : ''}`}>{n}</span>
                ))}
                <h5>Heart</h5>
                {manualComparison.b.notes?.heart?.map((n, i) => (
                  <span key={i} className={`${styles.noteChip} ${manualComparison.shared.includes(n.toLowerCase()) ? styles.noteShared : ''}`}>{n}</span>
                ))}
                <h5>Base</h5>
                {manualComparison.b.notes?.base?.map((n, i) => (
                  <span key={i} className={`${styles.noteChip} ${manualComparison.shared.includes(n.toLowerCase()) ? styles.noteShared : ''}`}>{n}</span>
                ))}
              </div>
            </div>

            {manualComparison.shared.length > 0 && (
              <div className={styles.sharedBadge}>
                Shared notes: {manualComparison.shared.join(', ')}
              </div>
            )}

            <ul className={styles.compReasons}>
              {manualComparison.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
