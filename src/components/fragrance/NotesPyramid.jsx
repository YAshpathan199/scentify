import styles from './NotesPyramid.module.css';

export default function NotesPyramid({ notes, size = 'md' }) {
  if (!notes) return null;

  const layers = [
    { key: 'top', label: 'Top Notes', items: notes.top },
    { key: 'heart', label: 'Heart Notes', items: notes.heart },
    { key: 'base', label: 'Base Notes', items: notes.base },
  ];

  return (
    <div className={`${styles.pyramid} ${styles[size]}`}>
      {layers.map(layer => (
        <div key={layer.key} className={`${styles.layer} ${styles[layer.key]}`}>
          <span className={styles.label}>{layer.label}</span>
          <div className={styles.pills}>
            {layer.items?.map(note => (
              <span key={note} className={styles.pill}>{note}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
