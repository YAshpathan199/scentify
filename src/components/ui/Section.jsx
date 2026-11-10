import React from 'react';
import styles from './Section.module.css';

function Section({
  children,
  title,
  subtitle,
  dark = false,
  className = '',
  id,
}) {
  const classes = [
    styles.section,
    dark ? styles.dark : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes} id={id}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </section>
  );
}

Section.displayName = 'Section';

export default Section;
