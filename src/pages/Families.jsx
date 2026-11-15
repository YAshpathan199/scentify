import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui';
import { FRAGRANCE_FAMILIES, PAIRING_RULES, SEASONS } from '../data/constants';
import { SAMPLE_FRAGRANCES } from '../data/fragrances';
import styles from './Families.module.css';

const FAMILY_DETAILS = {
  floral: {
    description:
      'Floral scents capture the essence of flowers — rose, jasmine, tuberose, and peony. Rose and jasmine are iconic in Indian perfumery, woven into ittar traditions, weddings, and temple offerings for centuries. The most universal family, moving from soft and powdery to rich and heady.',
    keyNotes: ['Rose', 'Jasmine', 'Tuberose', 'Peony', 'Orange Blossom'],
    bestSeasons: ['spring', 'autumn'],
  },
  oriental: {
    description:
      'Oriental fragrances blend warm spices, resins, amber, and oud into something rich and enveloping. They mirror the depth of Indian spice markets — saffron, incense, labdanum — and feel most at home on cool winter evenings and grand festive occasions. Heavy-handed projection is their natural state.',
    keyNotes: ['Vanilla', 'Saffron', 'Incense', 'Amber', 'Oud'],
    bestSeasons: ['winter', 'autumn'],
  },
  woody: {
    description:
      'Woody fragrances are built on sandalwood, cedarwood, vetiver, and patchouli — earthy, warm, and grounding. In India, sandalwood (chandan) carries centuries of cultural weight, used in religious ceremonies and ittars long before modern perfumery. Smoky woods and oakmoss push this family toward darker, more dramatic territory.',
    keyNotes: ['Sandalwood', 'Cedarwood', 'Vetiver', 'Patchouli', 'Oakmoss'],
    bestSeasons: ['autumn', 'winter'],
  },
  fresh: {
    description:
      "Fresh fragrances open with mint, green apple, lemon, or clean herbal notes that feel like a burst of cool air. They are energetic and linear — what you smell at the top is largely what stays. Mint and citrus-led freshness cuts through Indian summer heat better than heavier families, making this a natural pick for warm afternoons and evenings outdoors.",
    keyNotes: ['Mint', 'Green Apple', 'Green Tea', 'Vetiver Grass', 'Ozonic Notes'],
    bestSeasons: ['summer', 'spring'],
  },
  citrus: {
    description:
      "Citrus fragrances burst with bergamot, lemon, orange, and grapefruit — energising, uplifting, and gone within hours if worn light-handed. The natural choice for mornings, office wear, and anything outdoors in Indian heat. They rarely last the full day, so a small decant in your bag solves that.",
    keyNotes: ['Bergamot', 'Lemon', 'Orange', 'Grapefruit', 'Lime'],
    bestSeasons: ['summer', 'spring'],
  },
  aquatic: {
    description:
      "Aquatic fragrances bottle ocean breeze, sea salt, and driftwood into something wearable. They feel cool and effortless — the olfactory equivalent of a breeze off the sea. Perfect for India's scorching summers, coastal cities like Mumbai and Chennai, and any occasion where the heat calls for something that won't weigh you down.",
    keyNotes: ['Sea Salt', 'Ambroxan', 'Driftwood', 'Water Lily', 'Marine Accord'],
    bestSeasons: ['summer', 'monsoon'],
  },
  aromatic: {
    description:
      'Aromatic fragrances are built around lavender, geranium, rosemary, and mint — clean, herbal, and sophisticated without demanding attention. They are the workhorse of the professional wardrobe: inoffensive in a meeting room, polished at dinner, and comfortable enough for a long day. Cool Rush sits here — close to the skin, never loud.',
    keyNotes: ['Lavender', 'Geranium', 'Rosemary', 'Mint', 'Sage'],
    bestSeasons: ['spring', 'autumn'],
  },
  fougere: {
    description:
      "Fougère (French for \"fern\") is the backbone of classic masculine perfumery — lavender, coumarin, oakmoss, and tonka bean in a structure that feels simultaneously herbal, warm, and clean. It's the DNA of Brut, Cool Water, and Versace Eros. Modern fougères swap the coumarin for ambroxan and tonka, keeping the approachable, all-occasion character. Modern Code and Atlas both carry this structure.",
    keyNotes: ['Lavender', 'Coumarin', 'Oakmoss', 'Tonka Bean', 'Geranium'],
    bestSeasons: ['spring', 'autumn'],
  },
  chypre: {
    description:
      'Chypre (named after Cyprus) is built on a classic three-note accord: bergamot on top, oakmoss in the base, and labdanum holding them together. The result is mossy, slightly woody, and sophisticated in a way that few other families match. Creed Aventus — and its many inspirations including Aventus Legacy — carry this structure. Best worn in cool weather when the mossy drydown has space to develop.',
    keyNotes: ['Oakmoss', 'Bergamot', 'Labdanum', 'Cistus', 'Vetiver'],
    bestSeasons: ['autumn', 'winter'],
  },
  spicy: {
    description:
      "Spicy fragrances lead with pepper, cinnamon, clove, cardamom, and tobacco — the notes India's spice trade made famous. They feel bold, warm, and unapologetically present. Tobacco Mabkhar from Ibrahim Al Qurashi sits here, with its tobacco-and-spice opening and long leather-oakmoss trail. These are evening fragrances that suit ethnic wear and occasions where subtlety is not the goal.",
    keyNotes: ['Black Pepper', 'Cardamom', 'Cinnamon', 'Clove', 'Tobacco'],
    bestSeasons: ['winter', 'autumn'],
  },
  gourmand: {
    description:
      'Gourmand fragrances smell edible — coffee, cherry, vanilla, caramel, and praline. They wrap you in warmth like a dessert rather than a garden. Wet Cherry (cherry praline), Faunwalk Mocha (coffee rose), and Oud on the Rocks (coffee liquor) all live here. They project best in cool weather and suit evening wear, when the sweetness reads as indulgent rather than cloying.',
    keyNotes: ['Vanilla', 'Coffee', 'Cherry', 'Praline', 'Caramel'],
    bestSeasons: ['winter', 'autumn'],
  },
  green: {
    description:
      'Green fragrances capture the smell of a garden after rain — cut grass, galbanum, cucumber, violet leaf, and herbs. They are understated and natural, the opposite of loud oriental statements. No bottles in this collection sit here yet, but a good green fragrance is the ideal companion for spring mornings, parks, and any occasion that calls for something that smells genuinely outdoorsy rather than perfume-like.',
    keyNotes: ['Galbanum', 'Green Tea', 'Violet Leaf', 'Cucumber', 'Tomato Leaf'],
    bestSeasons: ['spring', 'summer'],
  },
  leather: {
    description:
      'Leather fragrances are built on birch tar, suede, and smoky woods — bold, slightly animalic, and deeply mature. They share DNA with chypre and spicy families, but leather is the defining note rather than a supporting one. No bottle in this collection sits here yet. When you are ready for one, look toward niche houses — leather fragrances tend to be better built at higher price points.',
    keyNotes: ['Birch Tar', 'Suede', 'Smoky Woods', 'Labdanum', 'Styrax'],
    bestSeasons: ['autumn', 'winter'],
  },
  powdery: {
    description:
      'Powdery fragrances are soft, skin-close, and intimate — iris, violet, heliotrope, and white musk create a gentle talc-like warmth that feels refined rather than perfumey. They wear close to the skin and project quietly, making them ideal for formal occasions and daytime wear where subtlety matters. White Oud sits close to this territory with its musky-powdery dry-down.',
    keyNotes: ['Iris', 'Violet', 'Heliotrope', 'Orris Root', 'White Musk'],
    bestSeasons: ['spring', 'autumn'],
  },
  musk: {
    description:
      'Musk fragrances smell like warm, clean skin rather than a traditional perfume. White musks, ambroxan, and ambrette create an invisible halo that draws people closer without announcing itself. The most wearable family — almost every fragrance uses musk as a base note, but in a musk-led fragrance it is the entire point. Ideal for minimal days and layering under heavier scents to extend their longevity.',
    keyNotes: ['White Musk', 'Ambroxan', 'Ambrette', 'Cashmeran', 'Skin Musk'],
    bestSeasons: ['summer', 'spring'],
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
