import { Zap, Hash, Brain, Swords, Target, Grid3X3 } from "lucide-react";

import Mini2048 from "../components/Mini2048";
import MiniNumbrle from "../components/MiniNumbrle";
import MiniMemoryGrid from "../components/MiniMemoryGrid";
import MiniSnake from "../components/MiniSnake";
import MiniTicTacToe from "../components/MiniTicTacToe";
import MiniSudoku from "../components/MiniSudoku";
import MiniNumberGuess from "../components/MiniNumberGuess";

export const games = [
  {
    title: "2048",
    desc: "Le classique indémodable. Fusionnez les blocs pour atteindre le sommet.",
    icon: Zap,
    color: "purple",
    delay: 0.1,
    preview: Mini2048,
    link: "/2048",
  },
  {
    title: "Numbrle",
    desc: "Le Wordle version mathématiques. Trouvez l'équation mystère.",
    icon: Hash,
    color: "cyan",
    delay: 0.2,
    preview: MiniNumbrle,
    link: "/numbrle",
  },
  {
    title: "Memory Grid",
    desc: "Testez votre mémoire visuelle sur des grilles complexes.",
    icon: Brain,
    color: "blue",
    delay: 0.3,
    preview: MiniMemoryGrid,
    link: "/memory-grid",
  },
  {
    title: "Snake Run",
    desc: "Avalez les orbes d’énergie et faites grandir votre serpent dans une arène néon.",
    icon: Zap,
    color: "purple",
    delay: 0.4,
    preview: MiniSnake,
    link: "/snake",
  },
  {
    title: "Tic Tac Toe",
    desc: "Alignez trois symboles avant votre adversaire dans ce classique revisité.",
    icon: Swords,
    color: "cyan",
    delay: 0.5,
    preview: MiniTicTacToe,
    link: "/tic-tac-toe",
  },
  {
    title: "Number Guess",
    desc: "Devinez le nombre secret avec des indices trop grand ou trop petit.",
    icon: Target,
    color: "cyan",
    delay: 0.6,
    preview: MiniNumberGuess,
    link: "/number-guess",
  },
  {
  title: "Sudoku",
  desc: "Place les chiffres au bon endroit et termine la grille sans faute.",
  icon: Grid3X3, 
  color: "cyan",
  delay: 0.2,
  preview: MiniSudoku, 
  link: "/sudoku",
}
];