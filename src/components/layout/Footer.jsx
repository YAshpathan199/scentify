import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-auto">
      <div className="footer max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 py-16 sm:py-20">
        <aside className="max-w-[300px]">
          <Link to="/" className="inline-flex items-center gap-2 text-neutral-content no-underline mb-4">
            <Sparkles size={20} className="text-primary" />
            <span className="font-[var(--font-display)] text-xl font-bold">Scentify</span>
          </Link>
          <p className="text-sm text-neutral-content/60 leading-relaxed">
            Your personal fragrance advisor for every occasion.
          </p>
        </aside>

        <nav>
          <h6 className="footer-title font-[var(--font-body)] text-neutral-content/50">Explore</h6>
          <Link to="/discover" className="link link-hover text-sm text-neutral-content/75">Discover Your Fragrance</Link>
          <Link to="/explore" className="link link-hover text-sm text-neutral-content/75">Browse Collection</Link>
          <Link to="/guide" className="link link-hover text-sm text-neutral-content/75">How to Wear</Link>
        </nav>

        <nav>
          <h6 className="footer-title font-[var(--font-body)] text-neutral-content/50">
            <Link to="/learn" className="hover:text-neutral-content/70 transition-colors">Learn</Link>
          </h6>
          <Link to="/guide" className="link link-hover text-sm text-neutral-content/75">Spray Guide</Link>
          <Link to="/families" className="link link-hover text-sm text-neutral-content/75">Fragrance Families</Link>
          <Link to="/storage" className="link link-hover text-sm text-neutral-content/75">Storage Tips</Link>
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
