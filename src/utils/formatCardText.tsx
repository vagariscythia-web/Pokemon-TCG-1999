import React from 'react';

export const getEnergyIconPath = (symbol: string): string => {
  const s = symbol.toLowerCase().trim();
  if (s === 'r' || s === 'fire') return '/assets/energy_fire.png';
  if (s === 'w' || s === 'water') return '/assets/energy_water.png';
  if (s === 'g' || s === 'grass') return '/assets/energy_grass.png';
  if (s === 'l' || s === 'lightning' || s === 'electric') return '/assets/energy_lightning.png';
  if (s === 'p' || s === 'psychic') return '/assets/energy_psychic.png';
  if (s === 'f' || s === 'fighting') return '/assets/energy_fighting.png';
  if (s === 'c' || s === 'colorless') return '/assets/energy_colorless.png';
  if (s === 'dce' || s === 'double colorless') return '/assets/energy_double_colorless.png';
  return '/assets/energy_colorless.png';
};

export const formatCardText = (
  text?: string | null,
  iconClassName: string = 'inline-block w-4 h-4 align-text-bottom mx-0.5 shadow-sm'
): React.ReactNode => {
  if (!text) return null;

  // Match { R }, {R}, { W }, {W}, { G }, {G}, { L }, {L}, { P }, {P}, { F }, {F}, { C }, {C}, etc.
  const regex = /\{([a-zA-Z\s]+)\}/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const symbol = match[1].trim();
    const iconPath = getEnergyIconPath(symbol);

    parts.push(
      <img
        key={`${match.index}-${symbol}`}
        src={iconPath}
        alt={symbol}
        title={symbol}
        className={iconClassName}
      />
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};
