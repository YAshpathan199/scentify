import { useState, useRef, useCallback } from 'react';
import { Download, Upload, RotateCcw, ShieldCheck, HardDrive, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFragrances } from '../../context/FragranceContext';
import styles from './DataTools.module.css';

export default function DataTools() {
  const { fragrances, history, exportData, importData, resetData } = useFragrances();
  const [status, setStatus] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleExport = () => {
    try {
      const json = exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scentify-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showStatus('success', 'Data exported successfully!');
    } catch {
      showStatus('error', 'Export failed. Please try again.');
    }
  };

  const processImport = useCallback((file) => {
    if (!file || !file.name.endsWith('.json')) {
      showStatus('error', 'Please select a valid .json file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.fragrances || !Array.isArray(data.fragrances)) {
          showStatus('error', 'Invalid data format — missing fragrances array.');
          return;
        }
        importData(data);
        showStatus('success', `Imported ${data.fragrances.length} fragrances and ${data.history?.length || 0} wear entries.`);
      } catch {
        showStatus('error', 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  }, [importData]);

  const handleFileSelect = (e) => {
    processImport(e.target.files[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processImport(e.dataTransfer.files[0]);
  };

  const handleReset = () => {
    if (resetConfirmText !== 'RESET') return;
    resetData();
    setShowReset(false);
    setResetConfirmText('');
    showStatus('success', 'Data reset to defaults.');
  };

  const storageInfo = (() => {
    try {
      const fSize = new Blob([localStorage.getItem('scentify_fragrances') || '']).size;
      const hSize = new Blob([localStorage.getItem('scentify_history') || '']).size;
      const sSize = new Blob([localStorage.getItem('scentify_settings') || '']).size;
      const total = fSize + hSize + sSize;
      return { fSize, hSize, sSize, total };
    } catch {
      return { fSize: 0, hSize: 0, sSize: 0, total: 0 };
    }
  })();

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const healthChecks = (() => {
    const checks = [];
    const noPriceCount = fragrances.filter(f => !f.price).length;
    const noNotesCount = fragrances.filter(f => !f.notes?.top?.length && !f.notes?.heart?.length && !f.notes?.base?.length).length;
    const noOccasionCount = fragrances.filter(f => !f.occasions?.length).length;
    const noSeasonCount = fragrances.filter(f => !f.seasons?.length).length;
    const duplicateNames = fragrances.filter((f, i) => fragrances.findIndex(ff => ff.name === f.name) !== i);

    if (noPriceCount > 0) checks.push({ type: 'warn', msg: `${noPriceCount} fragrance${noPriceCount > 1 ? 's' : ''} missing price data` });
    if (noNotesCount > 0) checks.push({ type: 'warn', msg: `${noNotesCount} fragrance${noNotesCount > 1 ? 's' : ''} missing notes` });
    if (noOccasionCount > 0) checks.push({ type: 'warn', msg: `${noOccasionCount} fragrance${noOccasionCount > 1 ? 's' : ''} missing occasions` });
    if (noSeasonCount > 0) checks.push({ type: 'warn', msg: `${noSeasonCount} fragrance${noSeasonCount > 1 ? 's' : ''} missing seasons` });
    if (duplicateNames.length > 0) checks.push({ type: 'error', msg: `${duplicateNames.length} duplicate name${duplicateNames.length > 1 ? 's' : ''} found` });
    if (checks.length === 0) checks.push({ type: 'ok', msg: 'All data looks healthy — no issues detected!' });
    return checks;
  })();

  return (
    <motion.div className={styles.dataTools} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Status Toast */}
      <AnimatePresence>
        {status && (
          <motion.div
            className={`${styles.toast} ${status.type === 'error' ? styles.toastError : styles.toastSuccess}`}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          >
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.grid}>
        {/* Export */}
        <div className={styles.card}>
          <div className={styles.cardIcon}><Download size={28} /></div>
          <h3 className={styles.cardTitle}>Export Data</h3>
          <p className={styles.cardDesc}>
            Download your entire collection, wear history, and settings as a JSON backup file.
          </p>
          <div className={styles.cardMeta}>
            <span>{fragrances.length} fragrances</span>
            <span>{history.length} wear entries</span>
          </div>
          <button className={styles.primaryBtn} onClick={handleExport}>
            <Download size={16} /> Export JSON
          </button>
        </div>

        {/* Import */}
        <div className={styles.card}>
          <div className={styles.cardIcon}><Upload size={28} /></div>
          <h3 className={styles.cardTitle}>Import Data</h3>
          <p className={styles.cardDesc}>
            Restore from a backup or import new data. This will replace all existing data.
          </p>
          <div
            className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={24} className={styles.dropIcon} />
            <p>Drop a .json file here or click to browse</p>
          </div>
          <input type="file" ref={fileRef} accept=".json" onChange={handleFileSelect} style={{ display: 'none' }} />
        </div>

        {/* Reset */}
        <div className={styles.card}>
          <div className={`${styles.cardIcon} ${styles.cardIconDanger}`}><RotateCcw size={28} /></div>
          <h3 className={styles.cardTitle}>Reset to Defaults</h3>
          <p className={styles.cardDesc}>
            Remove all custom data and restore the original 12-fragrance collection. This cannot be undone.
          </p>
          <button className={styles.dangerBtn} onClick={() => setShowReset(true)}>
            <RotateCcw size={16} /> Reset All Data
          </button>
        </div>

        {/* Health Check */}
        <div className={styles.card}>
          <div className={`${styles.cardIcon} ${styles.cardIconInfo}`}><ShieldCheck size={28} /></div>
          <h3 className={styles.cardTitle}>Data Health</h3>
          <div className={styles.healthList}>
            {healthChecks.map((check, i) => (
              <div key={i} className={`${styles.healthRow} ${check.type === 'ok' ? styles.healthOk : check.type === 'error' ? styles.healthError : styles.healthWarn}`}>
                {check.type === 'ok' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                <span>{check.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Storage */}
        <div className={`${styles.card} ${styles.cardWide}`}>
          <div className={`${styles.cardIcon} ${styles.cardIconInfo}`}><HardDrive size={28} /></div>
          <h3 className={styles.cardTitle}>Storage Usage</h3>
          <div className={styles.storageGrid}>
            {[
              { label: 'Fragrances', size: storageInfo.fSize, color: 'var(--accent)' },
              { label: 'Wear History', size: storageInfo.hSize, color: 'var(--success)' },
              { label: 'Settings', size: storageInfo.sSize, color: 'var(--info)' },
            ].map((item, i) => (
              <div className={styles.storageItem} key={i}>
                <div className={styles.storageBar}>
                  <div className={styles.storageFill} style={{
                    width: `${storageInfo.total ? (item.size / storageInfo.total) * 100 : 0}%`,
                    background: item.color,
                  }} />
                </div>
                <span className={styles.storageLabel}>{item.label}</span>
                <span className={styles.storageSize}>{formatBytes(item.size)}</span>
              </div>
            ))}
            <div className={styles.storageTotal}>
              Total: {formatBytes(storageInfo.total)}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showReset && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowReset(false)}>
            <motion.div className={styles.modal} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}>
              <div className={styles.modalIcon}><AlertTriangle size={40} /></div>
              <h3 className={styles.modalTitle}>Reset All Data?</h3>
              <p className={styles.modalText}>
                This will permanently delete all custom fragrances, wear history, and settings. The collection will be restored to the default 12 fragrances.
              </p>
              <p className={styles.modalConfirmLabel}>Type <strong>RESET</strong> to confirm:</p>
              <input
                className={styles.modalInput}
                value={resetConfirmText}
                onChange={e => setResetConfirmText(e.target.value)}
                placeholder="RESET"
              />
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => { setShowReset(false); setResetConfirmText(''); }}>
                  Cancel
                </button>
                <button
                  className={styles.dangerBtn}
                  disabled={resetConfirmText !== 'RESET'}
                  onClick={handleReset}
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
