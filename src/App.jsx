import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FragranceProvider } from './context/FragranceContext';
import { Navbar, Footer } from './components/layout';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Results from './pages/Results';
import Explore from './pages/Explore';
import Detail from './pages/Detail';
import Guide from './pages/Guide';
import Learn from './pages/Learn';
import Families from './pages/Families';
import BuyAssist from './pages/BuyAssist';
import Storage from './pages/Storage';
import LayeringLab from './pages/LayeringLab';
import Admin from './pages/Admin';

export default function App() {
  return (
    <FragranceProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/fragrance/:id" element={<Detail />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/families" element={<Families />} />
                  <Route path="/scout" element={<BuyAssist />} />
                  <Route path="/storage" element={<Storage />} />
                  <Route path="/layering" element={<LayeringLab />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </FragranceProvider>
  );
}
