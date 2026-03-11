import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Game2048 from './components/Game2048';
import Numbrle from './components/Numbrle';
import MemoryGrid from './components/MemoryGrid';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/2048" element={<Game2048 />} />
        <Route path="/numbrle" element={<Numbrle />} />
        <Route path="/memory-grid" element={<MemoryGrid />} />
      </Routes>
    </Router>
  );
}