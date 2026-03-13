import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Gamepad2, Sparkles, MousePointer2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";
import GameCard from "../components/GameCard";
import { games } from "../data/games";
import Leaderboard from "../components/numbrle/Leaderboard";
import { getLeaderboardByGame  } from "../data/leaderboard";

export default function HomePage() {
  const navigate = useNavigate();

  const launchRandomGame = () => {
    const random = games[Math.floor(Math.random() * games.length)];
    navigate(random.link);
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [selectedGame, setSelectedGame] = useState("numbrle");
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.35]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const entries = await getLeaderboardByGame (selectedGame);
      setLeaderboardEntries(entries);
    };

    loadLeaderboard();
  }, [selectedGame]);

  const availableGames = useMemo(() => {
    return games.map((game) => ({
      label: game.title,
      value: game.title.trim().toLowerCase(),
    }));
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0B0E14] text-slate-200 selection:bg-cyan-400 selection:text-black">
      <ParticleBackground />

      {/* Cursor follower desktop */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-10 w-10 rounded-full border border-cyan-400/70 mix-blend-screen lg:block"
        animate={{ x: mousePos.x - 20, y: mousePos.y - 20 }}
        transition={{ type: "spring", damping: 22, stiffness: 260, mass: 0.45 }}
      >
        <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-md" />
      </motion.div>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-[10%] h-[280px] w-[280px] rounded-full bg-purple-600/20 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] h-[340px] w-[340px] rounded-full bg-cyan-500/20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 80, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[8%] left-[30%] h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[90px]"
        />
      </div>

      {/* Grid floor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-[45vh] lg:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            transform: "perspective(1000px) rotateX(72deg)",
            transformOrigin: "bottom",
            maskImage: "linear-gradient(to top, black, transparent)",
            WebkitMaskImage: "linear-gradient(to top, black, transparent)",
          }}
        />
      </div>

      <Nav />

      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 px-6 pb-28 pt-16 lg:min-h-screen lg:flex lg:items-center"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="group relative mb-8 inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-xl"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400" />
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400 transition-colors group-hover:text-white">
                Saison 2 Disponible
              </span>
            </motion.div>

            <div className="relative mb-8">
              <div className="pointer-events-none absolute -left-2 -top-2 hidden select-none opacity-20 blur-[2px] lg:block">
                <h1 className="text-7xl font-black italic leading-[0.85] text-cyan-500 md:text-9xl">
                  JOUEZ SANS LIMITE
                </h1>
              </div>

              <h1 className="relative text-7xl font-black italic leading-[0.85] text-white md:text-9xl">
                <motion.span
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.7 }}
                  className="block"
                >
                  JOUEZ
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34, duration: 0.7 }}
                  className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.18)]"
                >
                  SANS
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="block bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.16)]"
                >
                  LIMITE
                </motion.span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="mb-10 max-w-xl text-xl leading-relaxed text-slate-400"
            >
              Défiez vos limites avec nos mini-jeux addictifs.
              <span className="font-bold text-white"> Pas de téléchargement. Juste du fun.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-wrap gap-5"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34,211,238,0.35)" }}
                whileTap={{ scale: 0.95 }}
                onClick={launchRandomGame}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-10 py-5 font-black text-black"
              >
                <div className="absolute inset-0 -translate-x-full bg-cyan-400 transition-transform duration-300 group-hover:translate-x-0" />
                <span className="relative z-10">JOUER AU HASARD</span>
                <Play className="relative z-10 h-5 w-5 fill-current" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="mt-10 hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-500 sm:flex"
            >
              <MousePointer2 className="h-4 w-4 text-cyan-400" />
              Survolez, explorez, jouez
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.72, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto flex aspect-square w-full max-w-[580px] items-center justify-center">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{
                    duration: 16 + i * 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute rounded-full border border-dashed border-white/10"
                  style={{ inset: `${i * 42}px` }}
                />
              ))}

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-full"
              >
                <div className="absolute left-1/2 top-2 h-7 w-7 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]" />
                <div className="absolute bottom-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-purple-500 shadow-[0_0_18px_#a855f7]" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -24, 0],
                  rotate: [-1.5, 1.5, -1.5],
                }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="group relative z-10 flex items-center justify-center rounded-[4.5rem] border border-white/15 bg-gradient-to-br from-purple-600/20 to-cyan-500/20 p-16 shadow-2xl backdrop-blur-3xl"
              >
                <div className="absolute inset-0 rounded-[4.5rem] bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10" />
                <Gamepad2 className="relative h-40 w-40 text-white transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
              </motion.div>

              <motion.div
                animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-2 top-[24%] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl"
              >
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  Latency
                </div>
                <div className="font-mono text-xl font-black text-cyan-400">1.2ms</div>
              </motion.div>

              <motion.div
                animate={{ x: [0, -12, 0], y: [0, 10, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 bottom-[18%] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl"
              >
                <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  Mode
                </div>
                <div className="font-mono text-lg font-black text-white">NEON ARCADE</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="relative z-10 px-6 py-24 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-16 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 110 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="mb-6 h-1 rounded-full bg-cyan-500"
            />
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white md:text-6xl">
              Jeux du moment
            </h2>
            <p className="mt-4 max-w-xl text-slate-500">
              Une sélection nerveuse, rapide et pensée pour jouer instantanément.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard
                key={game.title}
                title={game.title}
                desc={game.desc}
                icon={game.icon}
                color={game.color}
                delay={game.delay}
                preview={<game.preview />}
                link={game.link}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 110 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="mb-6 h-1 rounded-full bg-purple-500"
            />
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white md:text-6xl">
              Classement des jeux
            </h2>
            <p className="mt-4 max-w-xl text-slate-500">
              Les meilleurs joueurs du moment.
            </p>
          </motion.div>

          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-sm">
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                Filtrer par jeu
              </label>

              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none backdrop-blur-xl transition focus:border-cyan-400"
              >
                {availableGames.map((game) => (
                  <option
                    key={game.value}
                    value={game.value}
                    className="bg-slate-900 text-white"
                  >
                    {game.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Leaderboard entries={leaderboardEntries} />
        </div>
      </section>

      <Footer />

      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-[110] opacity-[0.10] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,255,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}