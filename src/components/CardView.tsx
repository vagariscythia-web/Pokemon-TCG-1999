import React from 'react';
import { Card, InPlayCard } from '../types/game';
import { ZoomIn, Skull } from 'lucide-react';

interface CardViewProps {
  card?: Card;
  inPlayCard?: InPlayCard;
  size?: 'sm' | 'md' | 'active' | 'lg';
  isSelected?: boolean;
  isDropHovered?: boolean;
  isTargetable?: boolean;
  isFainted?: boolean;
  isAscending?: boolean;
  isDescending?: boolean;
  showInspectIcon?: boolean;
  onClick?: () => void;
  onInspect?: () => void;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  inPlayCard,
  size = 'md',
  isSelected = false,
  isDropHovered = false,
  isTargetable = false,
  isFainted = false,
  isAscending = false,
  isDescending = false,
  showInspectIcon = true,
  onClick,
  onInspect
}) => {
  const currentCard = card || inPlayCard?.card;
  if (!currentCard) return null;

  const sizeClasses = {
    sm: 'w-[92px] sm:w-[96px] md:w-[110px] lg:w-[112px]', // Bench (+15%)
    md: 'w-28 md:w-36 lg:w-40', // Hand / Reference
    active: 'w-[128px] sm:w-[142px] md:w-[166px] lg:w-[184px]', // Active (+15%)
    lg: 'w-52 md:w-68'
  };

  const imagePath = currentCard.originalImageUrl || currentCard.image || (currentCard.set === 'Base Set' || !currentCard.set ? `/cards/${currentCard.number}.jpg` : `/cards/${currentCard.number}.jpg`);

  // Tally attached energies
  const energyTally: Record<string, number> = {};
  if (inPlayCard?.attachedEnergy) {
    inPlayCard.attachedEnergy.forEach(e => {
      if (e.name.includes('Double Colorless') || (e.energy && e.energy.amount === 2) || e.number === 96 || e.number === 124) {
        energyTally['colorless'] = (energyTally['colorless'] || 0) + 2;
      } else if (e.name === 'Rainbow Energy') {
        energyTally['rainbow'] = (energyTally['rainbow'] || 0) + 1;
      } else if (e.types && e.types[0]) {
        const t = e.types[0].toLowerCase();
        energyTally[t] = (energyTally[t] || 0) + 1;
      } else if (e.name.includes('Grass')) {
        energyTally['grass'] = (energyTally['grass'] || 0) + 1;
      } else if (e.name.includes('Fire')) {
        energyTally['fire'] = (energyTally['fire'] || 0) + 1;
      } else if (e.name.includes('Water')) {
        energyTally['water'] = (energyTally['water'] || 0) + 1;
      } else if (e.name.includes('Lightning')) {
        energyTally['lightning'] = (energyTally['lightning'] || 0) + 1;
      } else if (e.name.includes('Psychic')) {
        energyTally['psychic'] = (energyTally['psychic'] || 0) + 1;
      } else if (e.name.includes('Fighting')) {
        energyTally['fighting'] = (energyTally['fighting'] || 0) + 1;
      } else {
        energyTally['colorless'] = (energyTally['colorless'] || 0) + 1;
      }
    });
  }

  // Calculate HP pips (1 pip per 10 HP)
  const maxHp = (inPlayCard?.card.hp && !isNaN(inPlayCard.card.hp)) ? inPlayCard.card.hp : 50;
  const currentHp = (inPlayCard && typeof inPlayCard.currentHp === 'number' && !isNaN(inPlayCard.currentHp)) 
    ? Math.max(0, inPlayCard.currentHp) 
    : maxHp;
  const totalPips = Math.max(1, Math.ceil(maxHp / 10));
  const currentPips = Math.max(0, Math.ceil(currentHp / 10));
  const hpRatio = maxHp > 0 ? currentHp / maxHp : 1;
  const isZeroHp = inPlayCard && currentHp === 0;

  const pipColor = hpRatio <= 0.25 ? 'bg-red-500 shadow-[0_0_4px_#ef4444]' : hpRatio <= 0.5 ? 'bg-amber-400' : 'bg-yellow-400 shadow-[0_0_4px_#facc15]';

  return (
    <div
      onClick={onClick}
      onDragStart={(e) => e.preventDefault()}
      draggable={false}
      className={`relative select-none flex flex-col items-center transition-all duration-500 ease-out cursor-pointer group bg-transparent ${sizeClasses[size]} ${
        isAscending ? '-translate-y-24 md:-translate-y-32 scale-115 z-40' :
        isDescending ? 'translate-y-16 opacity-50 scale-95 z-10' :
        isSelected ? 'scale-105 z-20' : isTargetable ? 'hover:scale-102 active:scale-98' : 'hover:scale-102'
      }`}
    >
      {/* 1. TOP STATUS STRIP (ABOVE CARD): HP READOUT & SEGMENTED LIFE PIPS */}
      {inPlayCard && !isAscending && !isDescending && (
        <div className="w-full flex flex-col items-center mb-1 px-0.5 pointer-events-none select-none bg-transparent">
          <div className="w-full flex items-center justify-between text-[9px] md:text-[10px] font-mono font-black leading-none mb-0.5">
            <span className={`${isZeroHp ? 'text-red-500 font-black animate-ping' : hpRatio <= 0.25 ? 'text-red-400 animate-pulse' : hpRatio <= 0.5 ? 'text-amber-300' : 'text-yellow-300'}`}>
              {isZeroHp ? '0/' + maxHp + ' HP' : currentHp + '/' + maxHp + ' HP'}
            </span>
            {isZeroHp ? (
              <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-red-950 text-red-300 border border-red-600 flex items-center gap-0.5">
                <Skull className="w-2.5 h-2.5" /> FAINTED
              </span>
            ) : (inPlayCard.status !== 'None' || inPlayCard.poisonType) ? (
              <span className="flex items-center gap-0.5">
                {inPlayCard.status !== 'None' && (
                  <span lang="en" className={`text-[8px] font-black px-1 py-0.2 rounded ${
                    inPlayCard.status === 'Paralyzed' ? 'bg-yellow-900 text-yellow-200' :
                    inPlayCard.status === 'Asleep' ? 'bg-blue-900 text-blue-200' : 'bg-orange-900 text-orange-200'
                  }`}>
                    {inPlayCard.status.toUpperCase()}
                  </span>
                )}
                {inPlayCard.poisonType && (
                  <span lang="en" className="text-[8px] font-black px-1 py-0.2 rounded bg-purple-900 text-purple-200">
                    {inPlayCard.poisonType.toUpperCase()}
                  </span>
                )}
              </span>
            ) : null}
          </div>
          {/* Segmented HP Pips Bar */}
          <div className="w-full h-1.5 bg-slate-950/90 rounded-full border border-slate-700/80 flex gap-0.5 p-0.5 overflow-hidden">
            {Array.from({ length: totalPips }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full rounded-sm transition-all duration-300 ${
                  i < currentPips ? pipColor : 'bg-slate-800/60'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. THE CARD ITSELF - REFINED VINTAGE BORDER (-10%) WITH CLEAN ZOOM-IN ELEVATION */}
      <div
        className={`w-full aspect-[600/825] p-[1.2px] sm:p-[2px] md:p-[2.5px] bg-[#f5cb39] rounded-xl overflow-hidden transition-all duration-200 border border-[#c79808] ${
          isAscending
            ? 'scale-105 shadow-2xl z-20'
            : isZeroHp || isFainted
            ? 'grayscale brightness-75 ring-2 ring-red-600 animate-pulse'
            : isDropHovered
            ? 'scale-[1.04] shadow-2xl z-20'
            : isSelected
            ? '-translate-y-2 scale-105 shadow-2xl z-30'
            : isTargetable && !isAscending
            ? 'scale-[1.02] shadow-xl'
            : 'shadow-md hover:shadow-xl hover:scale-[1.02]'
        } relative select-none`}
      >
        <div className="w-full h-full rounded-[6px] overflow-hidden flex items-center justify-center relative bg-[#f5cb39]">
          <img
            src={imagePath}
            alt={currentCard.name}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="w-full h-full object-fill pointer-events-none select-none rounded-[6px]"
            decoding="async"
            onError={(e) => {
              const img = e.currentTarget;
              if (currentCard.originalImageUrl && img.src !== currentCard.originalImageUrl) {
                img.src = currentCard.originalImageUrl;
              } else if (currentCard.image && img.src !== currentCard.image) {
                img.src = currentCard.image;
              } else if ((currentCard.set === 'Base Set' || !currentCard.set) && !img.src.endsWith(`/cards/${currentCard.number}.jpg`)) {
                img.src = `/cards/${currentCard.number}.jpg`;
              }
            }}
          />
        </div>

        {/* Hover Zoom Inspection Trigger */}
        {onInspect && !isZeroHp && showInspectIcon && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInspect();
            }}
            className="absolute top-1 right-1 p-1 bg-yellow-500/90 hover:bg-yellow-400 text-slate-900 rounded-full opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-30 shadow active:scale-90 touch-manipulation"
            title="Zoom & Inspect Card"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. BOTTOM TRAY (BELOW CARD): 100% TRANSPARENT FLOATING ATTACHED ENERGY SYMBOLS */}
      {inPlayCard && !isAscending && !isDescending && Object.keys(energyTally).length > 0 && (
        <div className="w-full flex items-center justify-center gap-1.5 mt-1 px-1 py-0.5 pointer-events-none">
          {Object.entries(energyTally).map(([type, count]) => {
            const iconName = (type === 'colorless' || type === 'normal' || type === 'rainbow')
              ? 'normal'
              : type === 'electric'
              ? 'lightning'
              : type;
            return (
              <div key={type} className="flex items-center gap-0.5">
                <img
                  src={`/assets/energy_${iconName}.png`}
                  alt={type}
                  className="w-4 h-4 md:w-5 md:h-5 rounded-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                />
                {count > 1 && (
                  <span className="text-[9px] md:text-[10px] font-mono font-black text-yellow-300 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                    x{count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
