import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import PersonPage from './pages/PersonPage.jsx';
import LyricsPage from './pages/LyricsPage.jsx';
import SavedLyricsPage from './pages/SavedLyricsPage.jsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/category/:category/person/:person" element={<PersonPage />} />
          <Route path="/lyrics/:id" element={<LyricsPage />} />
          <Route path="/saved" element={<SavedLyricsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
