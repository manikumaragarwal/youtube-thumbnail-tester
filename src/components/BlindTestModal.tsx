'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BlindTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
  gameState: 'idle' | 'countdown' | 'playing' | 'success';
  elapsedTime: number;
  onPlayAgain: () => void;
}

export const BlindTestModal: React.FC<BlindTestModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  gameState,
  elapsedTime,
  onPlayAgain,
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (gameState === 'countdown') {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'success') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  }, [gameState]);

  if (!isOpen) return null;

  // Evaluation breakdown
  const seconds = (elapsedTime / 1000).toFixed(2);
  const getFeedback = (timeInSec: number) => {
    if (timeInSec < 1.2) {
      return {
        grade: 'S-Tier Pop',
        color: 'text-amber-400',
        badge: 'God-Tier Thumbnail',
        desc: 'Incredible visual gravity! Your thumbnail captures human attention almost instantly among competitors.',
      };
    }
    if (timeInSec < 2.5) {
      return {
        grade: 'A-Tier Pop',
        color: 'text-emerald-400',
        badge: 'High CTR Potential',
        desc: 'Great visibility! The contrast and subject are strong enough to hook casual scrollers.',
      };
    }
    return {
      grade: 'B-Tier (Low Contrast)',
      color: 'text-rose-400',
      badge: 'Needs Higher Pop',
      desc: 'It took over 2.5 seconds to locate your thumbnail. Consider increasing subject scale, brightness contrast, or bold face close-up.',
    };
  };

  const feedback = getFeedback(parseFloat(seconds));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-neutral-900 border border-neutral-700 shadow-2xl text-white text-center">
        {/* State 1: IDLE / INTRO */}
        {gameState === 'idle' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Target className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Blind Pop & CTR Reaction Test
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                We will shuffle your thumbnail into a random slot among 20 competitor videos. Find and click your video as fast as you can to measure visual pop!
              </p>
            </div>

            <div className="w-full bg-neutral-800/60 rounded-xl p-3 text-xs text-neutral-300 flex items-center justify-around border border-neutral-700/50">
              <div>⚡ Tests eye-tracking speed</div>
              <div>🎯 No labels or hints</div>
            </div>

            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onStartGame}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/25 transition-all"
              >
                Start Pop Test
              </button>
            </div>
          </div>
        )}

        {/* State 2: COUNTDOWN */}
        {gameState === 'countdown' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Get Ready to Spot Your Video
            </span>
            <div className="text-7xl font-black text-white font-mono animate-bounce">
              {countdown > 0 ? countdown : 'GO!'}
            </div>
            <p className="text-xs text-neutral-400">
              Keep your eyes on the feed...
            </p>
          </div>
        )}

        {/* State 3: SUCCESS RESULT */}
        {gameState === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Reaction Time
              </span>
              <div className="text-4xl font-black text-white font-mono mt-0.5">
                {seconds}s
              </div>
              <div className={`text-base font-bold mt-1 ${feedback.color}`}>
                {feedback.grade} • {feedback.badge}
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-800/60 p-3 rounded-xl border border-neutral-700/50">
              {feedback.desc}
            </p>

            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                Back to Editor
              </button>
              <button
                onClick={onPlayAgain}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
