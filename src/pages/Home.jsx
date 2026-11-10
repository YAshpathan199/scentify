import { Hero, HowItWorks, FeaturedCollection, CTASection } from '../components/home';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <Hero />
      <HowItWorks />
      <FeaturedCollection />
      <CTASection />
    </div>
  );
}
