import React from 'react';
import { motion } from 'framer-motion';
import { Play, Gamepad2, Zap, Brain, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import GameCard from '../components/GameCard';
import Mini2048 from '../components/Mini2048';
import MiniNumbrle from '../components/MiniNumbrle';
import MiniMemoryGrid from "../components/MiniMemoryGrid";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0B0E14] text-slate-200">
      <ParticleBackground />
      <Nav />

      <section className="relative px-6 pb-32 pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                Saison 2 Disponible
              </span>
            </div>

            <h1 className="mb-8 text-7xl font-black italic leading-[0.85] text-white md:text-9xl">
              JOUEZ <br />
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SANS LIMITE
              </span>
            </h1>

            <p className="mb-10 max-w-md text-xl leading-relaxed text-slate-400">
              Défiez vos limites avec nos mini-jeux addictifs.
              <span className="font-bold text-white"> Pas de téléchargement. Juste du fun.</span>
            </p>

            <div className="flex flex-wrap gap-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/2048')}
                className="flex items-center gap-3 rounded-2xl bg-white px-10 py-5 font-black text-black transition-colors hover:bg-cyan-400"
              >
                LANCER LE JEU <Play className="h-5 w-5 fill-current" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto flex aspect-square w-full max-w-[500px] items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/10"
              />
              <motion.div
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="z-10 rounded-[4rem] border border-white/20 bg-gradient-to-br from-purple-600/20 to-cyan-500/20 p-12 backdrop-blur-3xl"
              >
                <Gamepad2 className="h-32 w-32 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
              Jeux du moment
            </h2>
            <div className="mt-2 h-1.5 w-20 rounded-full bg-cyan-500" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <GameCard
              title="2048"
              desc="Le classique indémodable. Fusionnez les blocs pour atteindre le sommet."
              icon={Zap}
              color="purple"
              delay={0.1}
              preview={<Mini2048 />}
              link="/2048"
            />

            <GameCard
              title="Numbrle"
              desc="Le Wordle version mathématiques. Trouvez l'équation mystère."
              icon={Hash}
              color="cyan"
              delay={0.2}
              preview={<MiniNumbrle/>}
              link="/Numbrle"
            />

            <GameCard
              title="Memory Grid"
              desc="Testez votre mémoire visuelle sur des grilles complexes."
              icon={Brain}
              color="blue"
              delay={0.3}
              preview={<MiniMemoryGrid/>}
              link="/memory-grid"
              
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}