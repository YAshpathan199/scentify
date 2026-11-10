import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui';
import { FRAGRANCE_FAMILIES, PAIRING_RULES, SEASONS } from '../data/constants';
import { SAMPLE_FRAGRANCES } from '../data/fragrances';
import styles from './Families.module.css';

const FAMILY_DETAILS = {
  woody: {
    description:
      'Woody fragrances feature notes like sandalwood, cedarwood, vetiver, and oud. They evoke forests, warmth, and masculinity. In India, sandalwood (chandan) has deep cultural significance in religious ceremonies and daily life.',
    keyNotes: ['Sandalwood', 'Cedarwood', 'Vetiver', 'Oud', 'Patchouli'],
    bestSeasons: ['autumn', 'winter'],
  },
  floral: {
    description:
      'Floral scents capture the essence of flowers — rose, jasmine, tuberose, and lily. Rose and jasmine are iconic in Indian perfumery, from ittar traditions to modern fragrances. Perfect for weddings and festive occasions.',
    keyNotes: ['Rose', 'Jasmine', 'Tuberose', 'Lily', 'Iris'],
    bestSeasons: ['spring', 'autumn'],
  },
  oriental: {
    description:
      'Oriental fragrances blend warm spices, resins, and amber. Think vanilla, cinnamon, incense, and oud. They mirror the richness of Indian spice markets and are perfect for cool winter evenings and grand celebrations.',
    keyNotes: ['Vanilla', 'Cinnamon', 'Incense', 'Amber', 'Oud'],
    bestSeasons: ['winter'],
  },
  fresh: {
    description:
      "Fresh fragrances feature clean, green, and airy notes — vetiver grass, cucumber, green tea, and mint. They feel like a morning breeze. Ideal for India's hot summers and humid monsoon season.",
    keyNotes: ['Green Tea', 'Cucumber', 'Mint', 'Vetiver Grass', 'Bamboo'],
    bestSeasons: ['summer', 'monsoon'],
  },
  citrus: {
    description:
      "Citrus fragrances burst with lemon, bergamot, orange, and grapefruit. They're energizing and uplifting — the perfect morning fragrance. Great for office wear and casual outings in Indian heat.",
    keyNotes: ['Bergamot', 'Lemon', 'Orange', 'Grapefruit', 'Lime'],
    bestSeasons: ['summer', 'spring'],
  },
  gourmand: {
    description:
      'Gourmand fragrances are sweet and edible — vanilla, chocolate, coffee, caramel, and honey. They wrap you in comfort like your favourite dessert. Best for winter evenings and date nights.',
    keyNotes: ['Vanilla', 'Chocolate', 'Coffee', 'Caramel', 'Honey'],
    bestSeasons: ['winter', 'autumn'],
  },
  aromatic: {
    description:
      'Aromatic fragrances feature herbs like lavender, rosemary, thyme, and sage. They feel sophisticated and clean. A versatile choice for Indian professionals — subtle enough for office, refined enough for dinner.',
    keyNotes: ['Lavender', 'Rosemary', 'Thyme', 'Sage', 'Basil'],
    bestSeasons: ['spring', 'autumn'],
  },
  aquatic: {
    description:
      "Aquatic fragrances capture ocean breeze, sea salt, and water notes. They feel cool and refreshing. Perfect for India's scorching summers and coastal city vibes.",
    keyNotes: ['Sea Salt', 'Ocean Breeze', 'Water Lily', 'Algae', 'Driftwood'],
    bestSeasons: ['summer', 'monsoon'],
  },
};

function scrollToFamily(id) {
  document.getElementById(`family-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Families() {
  const navigate = useNavigate();

  const familyFragrances = useMemo(() => {
    const map = {};
    FRAGRANCE_FAMILIES.forEach((f) => {
      map[f.id] = SAMPLE_FRAGRANCES.filter((s) => s.family === f.id);
    });
    return map;
  }, []);

  const familyPairings = useMemo(() => {
    const map = {};
    FRAGRANCE_FAMILIES.forEach((f) => {
      map[f.id] = PAIRING_RULES.filter((r) => r.a === f.id || r.b === f.id).map((r) => {
        const partnerId = r.a === f.id ? r.b : r.a;
        const partner = FRAGRANCE_FAMILIES.find((fam) => fam.id === partnerId);
        return { ...r, partner };
      });
    });
    return map;
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Fragrance Families</h1>
          <p className={styles.subtitle}>
            Understand the building blocks of perfumery
          </p>
        </header>

        {/* Family Wheel Grid */}
        <section className={styles.wheelSection}>
          <div className={styles.wheelGrid}>
            {FRAGRANCE_FAMILIES.map((family, i) => (
              <motion.button
                key={family.id}
                className={styles.wheelCard}
                style={{ borderLeftColor: family.color }}
                onClick={() => scrollToFamily(family.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <span className={styles.wheelIcon}>{family.icon}</span>
                <div className={styles.wheelInfo}>
                  <span className={styles.wheelName}>{family.label}</span>
                  <span className={styles.wheelDesc}>{family.description}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Detail Cards */}
        <div className={styles.details}>
          {FRAGRANCE_FAMILIES.map((family, i) => {
            const detail = FAMILY_DETAILS[family.id];
            const frags = familyFragrances[family.id] || [];
            const pairings = familyPairings[family.id] || [];
            const bestSeasons = (detail?.bestSeasons || [])
              .map((sId) => SEASONS.find((s) => s.id === sId))
              .filter(Boolean);

            return (
              <motion.section
                key={family.id}
                id={`family-${family.id}`}
                className={styles.familySection}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: 0.05 }}
              >
                <div
                  className={styles.familyHeader}
                  style={{ borderLeftColor: family.color }}
                >
                  <span className={styles.familyIcon}>{family.icon}</span>
                  <div>
                    <h2 className={styles.familyName}>{family.label}</h2>
                    <span
                      className={styles.familyTag}
                      style={{ background: `${family.color}18`, color: family.color }}
                    >
                      {family.description}
                    </span>
                  </div>
                </div>

                <p className={styles.familyDesc}>{detail?.description}</p>

                {/* Key Notes */}
                {detail?.keyNotes && (
                  <div className={styles.subsection}>
                    <h3 className={styles.subTitle}>Key Notes</h3>
                    <div className={styles.noteTags}>
                      {detail.keyNotes.map((note) => (
                        <span
                          key={note}
                          className={styles.noteTag}
                          style={{ borderColor: `${family.color}40` }}
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best Seasons */}
                {bestSeasons.length > 0 && (
                  <div className={styles.subsection}>
                    <h3 className={styles.subTitle}>Best Seasons</h3>
                    <div className={styles.seasonTags}>
                      {bestSeasons.map((s) => (
                        <span key={s.id} className={styles.seasonTag}>
                          {s.icon} {s.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* From Your Collection */}
                {frags.length > 0 && (
                  <div className={styles.subsection}>
                    <h3 className={styles.subTitle}>From Your Collection</h3>
                    <div className={styles.collectionRow}>
                      {frags.map((f) => (
                        <Link
                          key={f.id}
                          to={`/fragrance/${f.id}`}
                          className={styles.miniCard}
                        >
                          <div
                            className={styles.miniImage}
                            style={{ background: `${family.color}12` }}
                          >
                            {f.image ? (
                              <img src={f.image} alt={f.name} className={styles.miniImg} />
                            ) : (
                              <span className={styles.miniPlaceholder}>{family.icon}</span>
                            )}
                          </div>
                          <span className={styles.miniName}>{f.name}</span>
                          <span className={styles.miniBrand}>{f.brand}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pairs Well With */}
                {pairings.length > 0 && (
                  <div className={styles.subsection}>
                    <h3 className={styles.subTitle}>Pairs Well With</h3>
                    <div className={styles.pairingRow}>
                      {pairings.map((p, pi) => (
                        <div key={pi} className={styles.pairingCard}>
                          <div className={styles.pairingHeader}>
                            <span
                              className={styles.pairingIcon}
                              style={{ background: `${p.partner?.color}18`, color: p.partner?.color }}
                            >
                              {p.partner?.icon}
                            </span>
                            <span className={styles.pairingName}>{p.partner?.label}</span>
                          </div>
                          <p className={styles.pairingDesc}>{p.description}</p>
                          <span className={styles.pairingBest}>{p.bestFor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={styles.ctaWrap}>
          <Sparkles size={28} className={styles.ctaIcon} />
          <h2 className={styles.ctaTitle}>Find Your Family Match</h2>
          <p className={styles.ctaDesc}>
            Take our quick quiz and discover which fragrance family suits you best.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/discover')}>
            Start the Quiz <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
