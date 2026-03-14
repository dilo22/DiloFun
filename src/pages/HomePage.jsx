import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Play, Gamepad2, Sparkles, MousePointer2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";
import GameCard from "../components/GameCard";
import { games } from "../data/games";
import Leaderboard from "../components/numbrle/Leaderboard";
import { getLeaderboardByGame, HALL_OF_FAME_GAMES } from "../data/leaderboard";

export default function HomePage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [selectedGame, setSelectedGame] = useState("numbrle");

  const shouldAnimate = !prefersReducedMotion;


  const heroY = useTransform(scrollYProgress, [0, 1], shouldAnimate ? [0, 120] : [0, 0]);
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.4],
    shouldAnimate ? [1, 0.55] : [1, 1]
  );

  const launchRandomGame = () => {
    if (!games?.length) return;
    const random = games[Math.floor(Math.random() * games.length)];
    if (random?.link) navigate(random.link);
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");

    const updateMobileState = (e) => {
      setIsMobile(e.matches);
    };

    setIsMobile(media.matches);

    if (media.addEventListener) {
      media.addEventListener("change", updateMobileState);
      return () => media.removeEventListener("change", updateMobileState);
    } else {
      media.addListener(updateMobileState);
      return () => media.removeListener(updateMobileState);
    }
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldAnimate]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    let idleId = null;

    const fetchLeaderboard = async () => {
      try {
        const entries = await getLeaderboardByGame(selectedGame);
        if (isMounted) {
          setLeaderboardEntries(Array.isArray(entries) ? entries : []);
        }
      } catch (error) {
        console.error("Erreur chargement leaderboard :", error);
        if (isMounted) setLeaderboardEntries([]);
      }
    };

    if ("requestIdleCallback" in window && !isMobile) {
      idleId = window.requestIdleCallback(() => {
        fetchLeaderboard();
      }, { timeout: 800 });
    } else {
      timeoutId = window.setTimeout(() => {
        fetchLeaderboard();
      }, 80);
    }

    return () => {
      isMounted = false;
      if (timeoutId) window.clearTimeout(timeoutId);
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [selectedGame, isMobile]);

  const heroSectionStyle = useMemo(() => {
    return shouldAnimate ? { y: heroY, opacity: heroOpacity } : {};
  }, [shouldAnimate, heroY, heroOpacity]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0B0E14] text-slate-200 selection:bg-cyan-400 selection:text-black">
      {!isMobile && <ParticleBackground />}

      {shouldAnimate && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-10 w-10 rounded-full border border-cyan-400/60 mix-blend-screen lg:block"
          animate={{ x: mousePos.x - 20, y: mousePos.y - 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 220, mass: 0.6 }}
        >
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-md" />
        </motion.div>
      )}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={shouldAnimate ? { x: [0, 40, 0], y: [0, -24, 0] } : undefined}
          transition={shouldAnimate ? { duration: 18, repeat: Infinity, ease: "easeInOut" } : undefined}
          className="absolute left-[8%] top-[10%] h-[180px] w-[180px] rounded-full bg-purple-600/15 blur-[80px] sm:h-[240px] sm:w-[240px] lg:h-[280px] lg:w-[280px]"
        />
        <motion.div
          animate={shouldAnimate ? { x: [0, -50, 0], y: [0, 40, 0] } : undefined}
          transition={shouldAnimate ? { duration: 20, repeat: Infinity, ease: "easeInOut" } : undefined}
          className="absolute right-[10%] top-[20%] h-[220px] w-[220px] rounded-full bg-cyan-500/15 blur-[90px] sm:h-[280px] sm:w-[280px] lg:h-[340px] lg:w-[340px]"
        />
        {!isMobile && (
          <motion.div
            animate={shouldAnimate ? { x: [0, 30, 0], y: [0, 60, 0] } : undefined}
            transition={shouldAnimate ? { duration: 22, repeat: Infinity, ease: "easeInOut" } : undefined}
            className="absolute bottom-[8%] left-[30%] h-[240px] w-[240px] rounded-full bg-blue-500/10 blur-[90px]"
          />
        )}
      </div>

      {!isMobile && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-[45vh] lg:block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.06) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              transform: "perspective(1000px) rotateX(72deg)",
              transformOrigin: "bottom",
              maskImage: "linear-gradient(to top, black, transparent)",
              WebkitMaskImage: "linear-gradient(to top, black, transparent)",
            }}
          />
        </div>
      )}

      <Nav />

      <motion.section
        style={heroSectionStyle}
        className="relative z-10 px-4 pb-14 pt-12 sm:px-6 lg:min-h-screen lg:flex lg:items-center lg:pb-28 lg:pt-16"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, x: -40 } : false}
            animate={shouldAnimate ? { opacity: 1, x: 0 } : false}
            transition={shouldAnimate ? { duration: 0.7, ease: [0.16, 1, 0.3, 1] } : undefined}
          >
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
              transition={shouldAnimate ? { delay: 0.08, duration: 0.45 } : undefined}
              className="group relative mb-6 inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md sm:mb-8 sm:px-5"
            >
              <span className="relative flex h-3 w-3">
                {!isMobile && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                )}
                <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400" />
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-400 transition-colors group-hover:text-white">
                Saison 2 Disponible
              </span>
            </motion.div>

            <div className="relative mb-6 sm:mb-8">
              {!isMobile && (
                <div className="pointer-events-none absolute -left-2 -top-2 hidden select-none opacity-15 blur-[2px] lg:block">
                  <h1 className="text-7xl font-black italic leading-[0.85] text-cyan-500 md:text-9xl">
                    JOUEZ SANS LIMITE
                  </h1>
                </div>
              )}

              <h1 className="relative text-5xl font-black italic leading-[0.88] text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                <motion.span
                  initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
                  animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
                  transition={shouldAnimate ? { delay: 0.12, duration: 0.5 } : undefined}
                  className="block"
                >
                  JOUEZ
                </motion.span>

                <motion.span
                  initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
                  animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
                  transition={shouldAnimate ? { delay: 0.22, duration: 0.5 } : undefined}
                  className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
                >
                  SANS
                </motion.span>

                <motion.span
                  initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
                  animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
                  transition={shouldAnimate ? { delay: 0.32, duration: 0.5 } : undefined}
                  className="block bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent"
                >
                  LIMITE
                </motion.span>
              </h1>
            </div>

            <motion.p
              initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
              transition={shouldAnimate ? { delay: 0.4, duration: 0.5 } : undefined}
              className="mb-8 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mb-10 lg:text-xl"
            >
              Défiez vos limites avec nos mini-jeux addictifs.
              <span className="font-bold text-white"> Pas de téléchargement. Juste du fun.</span>
            </motion.p>

            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
              transition={shouldAnimate ? { delay: 0.5, duration: 0.5 } : undefined}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={shouldAnimate ? { scale: 1.03, boxShadow: "0 0 28px rgba(34,211,238,0.25)" } : undefined}
                whileTap={shouldAnimate ? { scale: 0.97 } : undefined}
                onClick={launchRandomGame}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-7 py-4 font-black text-black sm:px-10 sm:py-5"
              >
                <div className="absolute inset-0 -translate-x-full bg-cyan-400 transition-transform duration-300 group-hover:translate-x-0" />
                <span className="relative z-10 text-sm sm:text-base">JOUER AU HASARD</span>
                <Play className="relative z-10 h-5 w-5 fill-current" />
              </motion.button>
            </motion.div>

            {!isMobile && (
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
                transition={shouldAnimate ? { delay: 0.6, duration: 0.5 } : undefined}
                className="mt-10 hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-500 sm:flex"
              >
                <MousePointer2 className="h-4 w-4 text-cyan-400" />
                Survolez, explorez, jouez
              </motion.div>
            )}
          </motion.div>

          {!isMobile && (
            <motion.div
              initial={shouldAnimate ? { opacity: 0, scale: 0.86, rotate: -4 } : false}
              animate={shouldAnimate ? { opacity: 1, scale: 1, rotate: 0 } : false}
              transition={shouldAnimate ? { duration: 0.8, ease: "easeOut" } : undefined}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center xl:max-w-[580px]">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={shouldAnimate ? { rotate: i % 2 === 0 ? 360 : -360 } : undefined}
                    transition={
                      shouldAnimate
                        ? {
                            duration: 20 + i * 6,
                            repeat: Infinity,
                            ease: "linear",
                          }
                        : undefined
                    }
                    className="absolute rounded-full border border-dashed border-white/10"
                    style={{ inset: `${i * 42}px` }}
                  />
                ))}

                <motion.div
                  animate={shouldAnimate ? { rotate: 360 } : undefined}
                  transition={shouldAnimate ? { duration: 14, repeat: Infinity, ease: "linear" } : undefined}
                  className="absolute h-full w-full"
                >
                  <div className="absolute left-1/2 top-2 h-6 w-6 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_16px_#22d3ee]" />
                  <div className="absolute bottom-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-purple-500 shadow-[0_0_14px_#a855f7]" />
                </motion.div>

                <motion.div
                  animate={shouldAnimate ? { y: [0, -14, 0], rotate: [-1, 1, -1] } : undefined}
                  transition={shouldAnimate ? { duration: 7, repeat: Infinity, ease: "easeInOut" } : undefined}
                  className="group relative z-10 flex items-center justify-center rounded-[4rem] border border-white/15 bg-gradient-to-br from-purple-600/20 to-cyan-500/20 p-14 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                >
                  <div className="absolute inset-0 rounded-[4rem] bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10" />
                  <Gamepad2 className="relative h-32 w-32 text-white transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.35)] xl:h-40 xl:w-40" />
                </motion.div>

                <motion.div
                  animate={shouldAnimate ? { x: [0, 8, 0], y: [0, -8, 0] } : undefined}
                  transition={shouldAnimate ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" } : undefined}
                  className="absolute right-2 top-[24%] rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md"
                >
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    Latency
                  </div>
                  <div className="font-mono text-xl font-black text-cyan-400">1.2ms</div>
                </motion.div>

                <motion.div
                  animate={shouldAnimate ? { x: [0, -8, 0], y: [0, 8, 0] } : undefined}
                  transition={shouldAnimate ? { duration: 6.2, repeat: Infinity, ease: "easeInOut" } : undefined}
                  className="absolute bottom-[18%] left-0 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md"
                >
                  <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                    Mode
                  </div>
                  <div className="font-mono text-lg font-black text-white">NEON ARCADE</div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      <section className="relative z-30 px-4 py-16 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
            transition={shouldAnimate ? { duration: 0.55 } : undefined}
            viewport={{ once: true, amount: 0.15 }}
            className="mb-12 flex flex-col items-center text-center sm:mb-16"
          >
            <motion.div
              initial={shouldAnimate ? { width: 0 } : false}
              whileInView={shouldAnimate ? { width: 90 } : undefined}
              transition={shouldAnimate ? { duration: 0.6, ease: "easeOut" } : undefined}
              viewport={{ once: true }}
              className="mb-5 h-1 rounded-full bg-cyan-500"
            />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Jeux du moment
            </h2>
            <p className="mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
              Une sélection nerveuse, rapide et pensée pour jouer instantanément.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard
                key={game.link || game.title}
                title={game.title}
                desc={game.desc}
                icon={game.icon}
                color={game.color}
                delay={shouldAnimate ? game.delay : 0}
                preview={!isMobile && game.preview ? <game.preview /> : null}
                link={game.link}
              />
            ))}
          </div>


        </div>
      </section>

      <section className="relative z-20 px-4 pb-20 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-4xl">
          <Leaderboard
            entries={leaderboardEntries}
            selectedGame={selectedGame}
            onChangeGame={setSelectedGame}
            gameOptions={HALL_OF_FAME_GAMES}
          />
        </div>
      </section>

      <Footer />

      {!isMobile && (
        <div className="pointer-events-none fixed inset-0 z-[110] opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.10)_50%),linear-gradient(90deg,rgba(255,0,0,0.015),rgba(0,255,255,0.01),rgba(0,0,255,0.015))] bg-[length:100%_4px,3px_100%]" />
      )}
    </div>
  );
}
