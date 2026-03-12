import React, { useState } from "react";

export default function NicknameModal({ onSubmit, onAnonymous }) {
  const [nickname, setNickname] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#10141d] p-8 shadow-2xl">
        <h2 className="mb-2 text-2xl font-black text-white">
          Entre dans le Hall of Fame
        </h2>

        <p className="mb-6 text-sm text-slate-400">
          Choisis ton surnom pour apparaître dans le classement Numbrle.
        </p>

        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit(nickname);
            }
          }}
          placeholder="Ex: NeonDigit"
          className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none placeholder:text-slate-500"
        />

        <button
          onClick={() => onSubmit(nickname)}
          className="mb-3 w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 font-bold text-white"
        >
          Jouer avec ce surnom
        </button>

        <button
          onClick={onAnonymous}
          className="w-full rounded-xl border border-white/10 py-3 text-slate-300 transition-colors hover:bg-white/5"
        >
          Jouer masqué 🎭
        </button>
      </div>
    </div>
  );
}