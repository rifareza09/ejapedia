import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Reader from './pages/Reader';
import Favorites from './pages/Favorites';
import Disclaimer from './pages/Disclaimer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:slug" element={<Detail />} />
        <Route path="/reader/:slug/:chapter" element={<Reader />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
    </Router>
  );
}

export default App;
