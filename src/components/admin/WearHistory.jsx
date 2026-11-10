import { useState, useMemo } from 'react';
import { Calendar, Plus, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFragrances } from '../../context/FragranceContext';
import { OCCASIONS, FRAGRANCE_FAMILIES } from '../../data/constants';
import styles from './WearHistory.module.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function WearHistory() {
  const { fragrances, history, logWear, deleteWear } = useFragrances();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [wearForm, setWearForm] = useState({ fragranceId: '', occasion: '', notes: '' });

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [year, month]);

  const historyByDate = useMemo(() => {
    const map = {};
    history.forEach(h => {
      if (!map[h.date]) map[h.date] = [];
      map[h.date].push(h);
    });
    return map;
  }, [history]);

  const dateStr = (day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const monthlyStats = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthEntries = history.filter(h => h.date?.startsWith(prefix));
    const uniqueDays = new Set(monthEntries.map(h => h.date)).size;
    const uniqueFrags = new Set(monthEntries.map(h => h.fragranceId)).size;
    const topFrag = monthEntries.reduce((acc, h) => {
      acc[h.fragranceId] = (acc[h.fragranceId] || 0) + 1;
      return acc;
    }, {});
    const topId = Object.entries(topFrag).sort((a, b) => b[1] - a[1])[0];
    const topName = topId ? fragrances.find(f => f.id === topId[0])?.name || 'Unknown' : '—';
    return { totalWears: monthEntries.length, uniqueDays, uniqueFrags, topName };
  }, [history, year, month, fragrances]);

  const selectedEntries = useMemo(() => {
    if (!selectedDay) return [];
    return historyByDate[dateStr(selectedDay)] || [];
  }, [selectedDay, historyByDate, year, month]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const openLogModal = () => {
    setWearForm({
      fragranceId: fragrances[0]?.id || '',
      occasion: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleLog = () => {
    if (!wearForm.fragranceId) return;
    const date = selectedDay ? dateStr(selectedDay) : new Date().toISOString().split('T')[0];
    logWear({
      fragranceId: wearForm.fragranceId,
      date,
      occasion: wearForm.occasion,
      notes: wearForm.notes,
    });
    setShowModal(false);
  };

  const wearFrequency = useMemo(() => {
    const counts = {};
    history.forEach(h => { counts[h.fragranceId] = (counts[h.fragranceId] || 0) + 1; });
    return Object.entries(counts)
      .map(([id, count]) => {
        const frag = fragrances.find(f => f.id === id);
        return { id, name: frag?.name || 'Unknown', family: frag?.family, count };
      })
      .sort((a, b) => b.count - a.count);
  }, [history, fragrances]);

  return (
    <motion.div className={styles.wearHistory} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Monthly Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Wears', value: monthlyStats.totalWears },
          { label: 'Days Worn', value: monthlyStats.uniqueDays },
          { label: 'Fragrances Used', value: monthlyStats.uniqueFrags },
          { label: 'Most Worn', value: monthlyStats.topName },
        ].map((s, i) => (
          <div className={styles.statTile} key={i}>
            <p className={styles.statValue}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        {/* Calendar */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarNav}>
            <button className={styles.navBtn} onClick={prevMonth}><ChevronLeft size={18} /></button>
            <h3 className={styles.calendarTitle}>{MONTHS[month]} {year}</h3>
            <button className={styles.navBtn} onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>

          <div className={styles.calendarGrid}>
            {DAYS.map(d => <div key={d} className={styles.dayHeader}>{d}</div>)}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`e${i}`} className={styles.dayEmpty} />;
              const ds = dateStr(day);
              const entries = historyByDate[ds] || [];
              const isToday = ds === new Date().toISOString().split('T')[0];
              const isSelected = selectedDay === day;
              return (
                <div
                  key={day}
                  className={`${styles.dayCell} ${isToday ? styles.dayCellToday : ''} ${isSelected ? styles.dayCellSelected : ''} ${entries.length > 0 ? styles.dayCellHasWear : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className={styles.dayNum}>{day}</span>
                  {entries.length > 0 && (
                    <div className={styles.wearDots}>
                      {entries.slice(0, 3).map((e, j) => {
                        const frag = fragrances.find(f => f.id === e.fragranceId);
                        const fam = FRAGRANCE_FAMILIES.find(ff => ff.id === frag?.family);
                        return <span key={j} className={styles.wearDot} style={{ background: fam?.color || 'var(--accent)' }} />;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button className={styles.logBtn} onClick={openLogModal}>
            <Plus size={16} /> Log Wear
          </button>
        </div>

        {/* Day Detail */}
        <div className={styles.detailPanel}>
          {selectedDay ? (
            <>
              <h3 className={styles.detailTitle}>
                <Calendar size={18} />
                {new Date(year, month, selectedDay).toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })}
              </h3>
              {selectedEntries.length === 0 ? (
                <div className={styles.emptyDay}>
                  <p>No wears logged for this day.</p>
                  <button className={styles.logBtnSmall} onClick={openLogModal}>
                    <Plus size={14} /> Log a Wear
                  </button>
                </div>
              ) : (
                <div className={styles.entryList}>
                  {selectedEntries.map((entry, i) => {
                    const frag = fragrances.find(f => f.id === entry.fragranceId);
                    const fam = FRAGRANCE_FAMILIES.find(ff => ff.id === frag?.family);
                    const occ = OCCASIONS.find(o => o.id === entry.occasion);
                    return (
                      <div className={styles.entryCard} key={entry.timestamp || i}>
                        <div className={styles.entryDot} style={{ background: fam?.color }} />
                        <div className={styles.entryInfo}>
                          <p className={styles.entryName}>{frag?.name || 'Unknown'}</p>
                          {occ && <span className={styles.entryOccasion}>{occ.icon} {occ.label}</span>}
                          {entry.notes && <p className={styles.entryNotes}>{entry.notes}</p>}
                        </div>
                        <button className={styles.entryDelete} onClick={() => deleteWear(entry.timestamp)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyDay}>
              <Calendar size={40} className={styles.emptyIcon} />
              <p>Select a day to view wear details</p>
            </div>
          )}
        </div>
      </div>

      {/* Wear Frequency */}
      {wearFrequency.length > 0 && (
        <div className={styles.freqCard}>
          <h3 className={styles.freqTitle}>Wear Frequency</h3>
          <div className={styles.freqList}>
            {wearFrequency.map((f, i) => {
              const fam = FRAGRANCE_FAMILIES.find(ff => ff.id === f.family);
              const maxCount = wearFrequency[0]?.count || 1;
              return (
                <div className={styles.freqRow} key={f.id}>
                  <span className={styles.freqRank}>{i + 1}</span>
                  <span className={styles.freqDot} style={{ background: fam?.color }} />
                  <span className={styles.freqName}>{f.name}</span>
                  <div className={styles.freqBarTrack}>
                    <div className={styles.freqBarFill} style={{
                      width: `${(f.count / maxCount) * 100}%`,
                      background: fam?.color || 'var(--accent)',
                    }} />
                  </div>
                  <span className={styles.freqCount}>{f.count}x</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Log Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}>
            <motion.div className={styles.modal} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Log a Wear</h3>
                <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Fragrance *</label>
                  <select className={styles.modalSelect} value={wearForm.fragranceId}
                    onChange={e => setWearForm({ ...wearForm, fragranceId: e.target.value })}>
                    {fragrances.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Occasion</label>
                  <select className={styles.modalSelect} value={wearForm.occasion}
                    onChange={e => setWearForm({ ...wearForm, occasion: e.target.value })}>
                    <option value="">— None —</option>
                    {OCCASIONS.map(o => <option key={o.id} value={o.id}>{o.icon} {o.label}</option>)}
                  </select>
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Notes</label>
                  <textarea className={styles.modalTextarea} rows={3} placeholder="How did it perform?"
                    value={wearForm.notes} onChange={e => setWearForm({ ...wearForm, notes: e.target.value })} />
                </div>
                <p className={styles.modalDate}>
                  Date: {selectedDay ? dateStr(selectedDay) : new Date().toISOString().split('T')[0]}
                </p>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleLog}>Log Wear</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
