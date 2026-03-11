import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GameCard({ title, desc, icon: Icon, color, delay, preview, link }) {
  const navigate = useNavigate();

  const colors = {
    purple: 'border-purple-500/30 bg-purple-500/20 text-purple-400',
    cyan: 'border-cyan-500/30 bg-cyan-500/20 text-cyan-400',
    blue: 'border-blue-500/30 bg-blue-500/20 text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -12 }}
      onClick={() => link && navigate(link)}
      className="group cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${colors[color] || colors.purple}`}>
        <Icon className="h-8 w-8" />
      </div>

      <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-400">{desc}</p>

      <div className="mb-6 rounded-2xl border border-white/5 bg-slate-900/50 p-4">
        <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-[#060b14]">
            <div className="scale-110">
            {preview}
            </div>
        </div>
        </div>

      <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white transition-colors group-hover:text-cyan-400">
        Jouer <Play className="h-4 w-4 fill-current" />
      </button>
    </motion.div>
  );
}