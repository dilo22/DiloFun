import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Game2048 from './components/Game2048';
import Numbrle from './pages/Numbrle';
import MemoryGrid from './components/MemoryGrid';
import SnakeGame from './components/SnakeGame';
import TicTacToe from './components/TicTacToe';
import NumberGuess from './components/NumberGuess';
import Sudoku from "./components/Sudoku";
import BuyMeCoffee from './components/BuyMeCoffee';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/2048" element={<Game2048 />} />
        <Route path="/numbrle" element={<Numbrle />} />
        <Route path="/memory-grid" element={<MemoryGrid />} />
        <Route path="/snake" element={<SnakeGame />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/number-guess" element={<NumberGuess />} />
        <Route path="/sudoku" element={<Sudoku />} />
      </Routes>

      <BuyMeCoffee />
    </Router>
  );
}