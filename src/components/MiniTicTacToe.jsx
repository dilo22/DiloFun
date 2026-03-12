import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle, X } from 'lucide-react'

const sequences = [
  ['X', null, null, null, 'O', null, null, null, null],
  ['X', null, null, null, 'O', null, null, 'X', null],
  ['X', null, 'O', null, 'O', null, null, 'X', null],
  ['X', null, 'O', null, 'O', null, 'X', 'X', null],
  ['X', null, 'O', null, 'O', 'O', 'X', 'X', null],
  ['X', 'X', 'O', null, 'O', 'O', 'X', 'X', 'O'],
  ['X', 'X', 'O', null, 'O', 'O', 'X', 'X', 'X'],
]

function CellIcon({ value }) {
  return (
    <AnimatePresence mode="wait">
      {value === 'X' && (
        <motion.div
          key="X"
          initial={{ opacity: 0, scale: 0.7, y: 2 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          <X className="h-5 w-5 text-cyan-400" strokeWidth={3} />
        </motion.div>
      )}

      {value === 'O' && (
        <motion.div
          key="O"
          initial={{ opacity: 0, scale: 0.7, y: 2 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          <Circle className="h-5 w-5 text-purple-400" strokeWidth={3} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function MiniTicTacToe() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % sequences.length)
    }, 900)

    return () => clearInterval(interval)
  }, [])

  const board = sequences[step]
  const isFinal = step === sequences.length - 1

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* viewport global */}
      <div className="relative overflow-hidden rounded-[1.4rem]">
        {/* glow contenu dans le cadre */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.4rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_72%)]" />
        </div>

        {/* frame */}
        <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/80 p-3 shadow-xl backdrop-blur-xl">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="grid grid-cols-3 gap-2">
              {board.map((cell, index) => {
                const isWinning = isFinal && [6, 7, 8].includes(index)

                return (
                  <div
                    key={index}
                    className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border ${
                      isWinning
                        ? 'border-cyan-300/30 bg-cyan-400/10'
                        : 'border-white/5 bg-slate-800/70'
                    }`}
                  >
                    <CellIcon value={cell} />
                  </div>
                )
              })}
            </div>

            {/* ligne de victoire douce, sans flash */}
            <AnimatePresence>
              {isFinal && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="pointer-events-none absolute left-0 right-0 top-[calc(100%-1.55rem)] mx-1 h-[2px] origin-left rounded-full bg-cyan-400/70"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}