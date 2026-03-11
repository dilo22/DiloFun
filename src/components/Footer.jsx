import React from 'react';
import { Gamepad2, Twitter, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-slate-950/50 px-6 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Gamepad2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">DILO FUN</span>
        </div>

        <div className="flex gap-6">
          <Twitter className="h-5 w-5 text-slate-500" />
          <Instagram className="h-5 w-5 text-slate-500" />
          <Github className="h-5 w-5 text-slate-500" />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          © 2026 Dilo Fun Entertainment
        </p>
      </div>
    </footer>
  );
}