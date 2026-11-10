import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus, Pencil, Trash2, Search, ArrowLeft, ArrowUpDown,
  Star, ChevronUp, ChevronDown, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFragrances } from '../../context/FragranceContext';
import {
  FRAGRANCE_FAMILIES, SEASONS, OCCASIONS, OCCASION_CATEGORIES,
  CONCENTRATIONS, MOODS, DRESS_CODES, TIME_OF_DAY,
} from '../../data/constants';
import { formatPrice } from '../../utils/helpers';
import styles from './FragranceManager.module.css';

const EMPTY_FORM = {
  name: '', brand: '', concentration: 'EDP', family: 'woody', size: '',
  price: '', rating: 0, longevity: 6, projection: 'moderate', image: '',
  notes: { top: '', heart: '', base: '' },
  occasions: [], seasons: [], timeOfDay: [], mood: [], dressCodes: [],
};

function ChipPicker({ items, selected, onChange, label }) {
  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };
  return (
    <div className={styles.chipSection}>
      {label && <label className={styles.fieldLabel}>{label}</label>}
      <div className={styles.chipGrid}>
        {items.map(item => (
          <button
            key={item.id} type="button"
            className={`${styles.chip} ${selected.includes(item.id) ? styles.chipActive : ''}`}
            onClick={() => toggle(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FragranceManager() {
  const { fragrances, addFragrance, updateFragrance, deleteFragrance } = useFragrances();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState('table');
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setView('form');
      setEditId(null);
      setForm({ ...EMPTY_FORM });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    let list = [...fragrances];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.brand.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'rating') cmp = b.rating - a.rating;
      else if (sortBy === 'longevity') cmp = b.longevity - a.longevity;
      else if (sortBy === 'price') cmp = (b.price || 0) - (a.price || 0);
      else if (sortBy === 'brand') cmp = a.brand.localeCompare(b.brand);
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return list;
  }, [fragrances, search, sortBy, sortDir]);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const openAdd = () => { setEditId(null); setForm({ ...EMPTY_FORM }); setErrors({}); setView('form'); };
  const openEdit = (f) => {
    setEditId(f.id);
    setForm({
      ...f,
      price: f.price || '',
      notes: {
        top: f.notes?.top?.join(', ') || '',
        heart: f.notes?.heart?.join(', ') || '',
        base: f.notes?.base?.join(', ') || '',
      },
    });
    setErrors({});
    setView('form');
  };

  const handleSave = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.brand.trim()) errs.brand = 'Brand is required';
    if (form.rating < 1) errs.rating = 'Select a rating';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const data = {
      ...form,
      price: Number(form.price) || 0,
      longevity: Number(form.longevity) || 6,
      notes: {
        top: form.notes.top.split(',').map(s => s.trim()).filter(Boolean),
        heart: form.notes.heart.split(',').map(s => s.trim()).filter(Boolean),
        base: form.notes.base.split(',').map(s => s.trim()).filter(Boolean),
      },
    };

    if (editId) updateFragrance({ ...data, id: editId });
    else addFragrance(data);
    setView('table');
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ArrowUpDown size={12} className={styles.sortInactive} />;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  if (view === 'form') {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={styles.formView}>
        <button className={styles.backBtn} onClick={() => setView('table')}>
          <ArrowLeft size={16} /> Back to list
        </button>
        <h2 className={styles.formTitle}>{editId ? `Edit — ${form.name}` : 'Add New Fragrance'}</h2>

        <div className={styles.formGrid}>
          <div className={styles.formSection}>
            <h4 className={styles.sectionLabel}>Basic Info</h4>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Name *</label>
                <input className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Brand *</label>
                <input className={`${styles.input} ${errors.brand ? styles.inputError : ''}`}
                  value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
                {errors.brand && <span className={styles.errorText}>{errors.brand}</span>}
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Concentration</label>
                <select className={styles.select} value={form.concentration}
                  onChange={e => setForm({ ...form, concentration: e.target.value })}>
                  {CONCENTRATIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Family</label>
                <select className={styles.select} value={form.family}
                  onChange={e => setForm({ ...form, family: e.target.value })}>
                  {FRAGRANCE_FAMILIES.map(f => <option key={f.id} value={f.id}>{f.icon} {f.label}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Size</label>
                <input className={styles.input} placeholder="e.g. 100ml"
                  value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Price (₹)</label>
                <input className={styles.input} type="number" placeholder="0"
                  value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.sectionLabel}>Rating {errors.rating && <span className={styles.errorText}>— {errors.rating}</span>}</h4>
            <div className={styles.starPicker}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" className={styles.starBtn}
                  onClick={() => setForm({ ...form, rating: n })}>
                  <Star size={28} fill={n <= form.rating ? 'var(--accent)' : 'none'}
                    color={n <= form.rating ? 'var(--accent)' : 'var(--border)'} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.sectionLabel}>Performance</h4>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Longevity (hours)</label>
                <input className={styles.input} type="number" min="1" max="12"
                  value={form.longevity} onChange={e => setForm({ ...form, longevity: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Projection</label>
                <select className={styles.select} value={form.projection}
                  onChange={e => setForm({ ...form, projection: e.target.value })}>
                  {['soft', 'moderate', 'strong', 'beast'].map(p =>
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.sectionLabel}>Notes</h4>
            {['top', 'heart', 'base'].map(layer => (
              <div className={styles.field} key={layer}>
                <label className={styles.fieldLabel}>{layer.charAt(0).toUpperCase() + layer.slice(1)} Notes</label>
                <input className={styles.input} placeholder="Separate with commas"
                  value={form.notes[layer]}
                  onChange={e => setForm({ ...form, notes: { ...form.notes, [layer]: e.target.value } })} />
              </div>
            ))}
          </div>

          <ChipPicker label="Occasions" items={OCCASIONS} selected={form.occasions}
            onChange={v => setForm({ ...form, occasions: v })} />
          <ChipPicker label="Seasons" items={SEASONS} selected={form.seasons}
            onChange={v => setForm({ ...form, seasons: v })} />
          <ChipPicker label="Time of Day" items={TIME_OF_DAY} selected={form.timeOfDay}
            onChange={v => setForm({ ...form, timeOfDay: v })} />
          <ChipPicker label="Dress Codes" items={DRESS_CODES} selected={form.dressCodes}
            onChange={v => setForm({ ...form, dressCodes: v })} />
          <ChipPicker label="Mood" items={MOODS} selected={form.mood}
            onChange={v => setForm({ ...form, mood: v })} />

          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSave}>
              {editId ? 'Update Fragrance' : 'Save Fragrance'}
            </button>
            <button className={styles.cancelBtn} onClick={() => setView('table')}>Cancel</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderLeft}>
          <h2 className={styles.tableTitle}>Fragrance Collection</h2>
          <span className={styles.countBadge}>{fragrances.length}</span>
        </div>
        <div className={styles.tableHeaderRight}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Search name or brand..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className={styles.addBtn} onClick={openAdd}><Plus size={16} /> Add New</button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th onClick={() => handleSort('name')} className={styles.sortable}>Name <SortIcon col="name" /></th>
              <th>Family</th>
              <th>Conc.</th>
              <th onClick={() => handleSort('rating')} className={styles.sortable}>Rating <SortIcon col="rating" /></th>
              <th onClick={() => handleSort('longevity')} className={styles.sortable}>Long. <SortIcon col="longevity" /></th>
              <th>Proj.</th>
              <th onClick={() => handleSort('price')} className={styles.sortable}>Price <SortIcon col="price" /></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => {
              const family = FRAGRANCE_FAMILIES.find(fam => fam.id === f.family);
              return (
                <tr key={f.id}>
                  <td className={styles.rowNum}>{i + 1}</td>
                  <td>
                    {f.image ? (
                      <img src={f.image} alt="" className={styles.thumb} />
                    ) : (
                      <div className={styles.thumbIcon} style={{ background: `${family?.color}20`, color: family?.color }}>
                        {family?.icon}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={styles.cellName}>{f.name}</span>
                    <span className={styles.cellBrand}>{f.brand}</span>
                  </td>
                  <td>
                    <span className={styles.familyBadge} style={{ background: `${family?.color}18`, color: family?.color }}>
                      {family?.label}
                    </span>
                  </td>
                  <td className={styles.cellMuted}>{f.concentration}</td>
                  <td>
                    <div className={styles.miniStars}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} size={11} fill={n <= f.rating ? 'var(--accent)' : 'none'}
                          color={n <= f.rating ? 'var(--accent)' : 'var(--border)'} />
                      ))}
                    </div>
                  </td>
                  <td className={styles.cellMuted}>{f.longevity}h</td>
                  <td className={styles.cellMuted}>{f.projection}</td>
                  <td className={styles.cellPrice}>{f.price ? formatPrice(f.price) : '—'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionEdit} onClick={() => openEdit(f)} aria-label="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className={styles.actionDelete} onClick={() => setDeleteConfirm(f)} aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileCards}>
        {filtered.map((f, i) => {
          const family = FRAGRANCE_FAMILIES.find(fam => fam.id === f.family);
          return (
            <div className={styles.mobileCard} key={f.id}>
              <div className={styles.mobileCardTop}>
                {f.image ? (
                  <img src={f.image} alt="" className={styles.mobileThumb} />
                ) : (
                  <div className={styles.mobileThumbIcon} style={{ background: `${family?.color}20` }}>
                    {family?.icon}
                  </div>
                )}
                <div className={styles.mobileInfo}>
                  <p className={styles.mobileName}>{f.name}</p>
                  <p className={styles.mobileBrand}>{f.brand}</p>
                  <span className={styles.familyBadge} style={{ background: `${family?.color}18`, color: family?.color }}>
                    {family?.label}
                  </span>
                </div>
                <div className={styles.mobileActions}>
                  <button className={styles.actionEdit} onClick={() => openEdit(f)}><Pencil size={14} /></button>
                  <button className={styles.actionDelete} onClick={() => setDeleteConfirm(f)}><Trash2 size={14} /></button>
                </div>
              </div>
              <div className={styles.mobileCardStats}>
                <span>{f.concentration}</span>
                <span>⭐ {f.rating}</span>
                <span>{f.longevity}h</span>
                <span>{f.projection}</span>
                {f.price > 0 && <span className={styles.cellPrice}>{formatPrice(f.price)}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}>
            <motion.div className={styles.modal} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>Delete Fragrance</h3>
              <p className={styles.modalText}>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className={styles.deleteBtn} onClick={() => { deleteFragrance(deleteConfirm.id); setDeleteConfirm(null); }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
