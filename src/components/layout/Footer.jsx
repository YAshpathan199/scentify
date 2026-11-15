import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-auto">
      <div className="footer grid-cols-3 md:grid-cols-[2fr_1fr_1fr] max-w-[1200px] mx-auto px-3 md:px-6 lg:px-10 py-10 md:py-20">
        <aside>
          <Link to="/" className="inline-flex items-center gap-1.5 text-neutral-content no-underline mb-3">
            <Sparkles size={16} className="text-primary shrink-0" />
            <span className="font-[var(--font-display)] text-base md:text-xl font-bold">Scentify</span>
          </Link>
          <p className="text-xs md:text-sm text-neutral-content/60 leading-relaxed">
            Your personal fragrance advisor for every occasion.
          </p>
        </aside>

        <nav>
          <h6 className="footer-title font-[var(--font-body)] text-neutral-content/50 text-xs md:text-sm">Explore</h6>
          <Link to="/discover" className="link link-hover text-xs md:text-sm text-neutral-content/75">Discover</Link>
          <Link to="/explore" className="link link-hover text-xs md:text-sm text-neutral-content/75">Collection</Link>
          <Link to="/guide" className="link link-hover text-xs md:text-sm text-neutral-content/75">How to Wear</Link>
        </nav>

        <nav>
          <h6 className="footer-title font-[var(--font-body)] text-neutral-content/50 text-xs md:text-sm">
            <Link to="/learn" className="hover:text-neutral-content/70 transition-colors">Learn</Link>
          </h6>
          <Link to="/guide" className="link link-hover text-xs md:text-sm text-neutral-content/75">Spray Guide</Link>
          <Link to="/families" className="link link-hover text-xs md:text-sm text-neutral-content/75">Families</Link>
          <Link to="/storage" className="link link-hover text-xs md:text-sm text-neutral-content/75">Storage</Link>
        </nav>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10">
        <div className="divider before:bg-neutral-content/10 after:bg-neutral-content/10 my-0" />
        <div className="py-6 text-center">
          <p className="text-xs text-neutral-content/40 inline-flex items-center gap-1">
            &copy; {new Date().getFullYear()} Scentify. Crafted with
            <Heart size={14} className="text-error fill-error" />
            for fragrance lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
