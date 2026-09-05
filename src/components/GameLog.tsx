import React, { useEffect, useRef } from 'react';
import { GameLogEntry } from '../types/game';
import { Terminal, ArrowDown } from 'lucide-react';
import { Language, TRANSLATIONS, translateLog } from '../i18n/translations';

interface GameLogProps {
  logs: GameLogEntry[];
  lang?: Language;
}

export const GameLog: React.FC<GameLogProps> = ({ logs, lang = 'tr' }) => {
  const t = TRANSLATIONS[lang];
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top on every new log so the latest entry (row 0) is always visible
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs, logs.length]);

  return (
    <div className="bg-slate-950/95 border border-yellow-500/30 rounded-xl p-2.5 h-36 md:h-48 flex flex-col shadow-inner select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5 text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-yellow-400" />
          <span>{t.battleLogTab}</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-yellow-300 font-semibold bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/30">
          <span>{lang === 'tr' ? 'En yeni kayıt en üstte' : 'Latest on top'}</span>
          <ArrowDown className="w-2.5 h-2.5 text-yellow-400" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-1 font-mono text-[10px] md:text-[11px] pr-1 scrollbar-thin">
        {logs.map((log, index) => {
          const isLatest = index === 0;
          const colorClass = {
            damage: 'text-red-400 font-semibold',
            status: 'text-purple-400 font-medium',
            system: 'text-yellow-300 font-bold',
            ai: 'text-blue-400 font-medium',
            action: 'text-gray-200'
          }[log.type] || 'text-gray-200';

          const translatedText = translateLog(log.text, lang);

          return (
            <div
              key={log.id}
              className={`leading-snug flex items-start gap-1.5 py-0.5 px-1.5 rounded transition-all ${
                isLatest
                  ? 'bg-yellow-500/20 border-l-2 border-yellow-400 font-semibold text-white shadow-sm ring-1 ring-yellow-400/20'
                  : 'hover:bg-slate-900/60 opacity-90 hover:opacity-100'
              }`}
            >
              <span className="text-gray-500 text-[9px] shrink-0 select-none">[{log.timestamp}]</span>
              <span className={`${colorClass} break-words`}>{translatedText}</span>
            </div>
          );
        })}
        {logs.length === 0 && (
          <div className="text-center text-gray-500 py-4 text-xs italic">
            {lang === 'tr' ? 'Savaş günlüğü boş...' : 'Battle log empty...'}
          </div>
        )}
      </div>
    </div>
  );
};
