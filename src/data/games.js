import { Zap, Hash, Brain } from 'lucide-react';

export const games = [
  {
    title: '2048',
    desc: 'Le classique indémodable. Fusionnez les blocs pour atteindre le sommet.',
    icon: Zap,
    color: 'purple',
    delay: 0.1,
    link: '/2048',
    type: '2048',
  },
  {
    title: 'Numbrle',
    desc: "Le Wordle version mathématiques. Trouvez l'équation mystère.",
    icon: Hash,
    color: 'cyan',
    delay: 0.2,
    type: 'numbrle',
  },
  {
    title: 'Memory Grid',
    desc: 'Testez votre mémoire visuelle sur des grilles complexes.',
    icon: Brain,
    color: 'blue',
    delay: 0.3,
    type: 'memory',
  },
];