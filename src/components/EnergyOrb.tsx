import React from 'react';
import { EnergyType } from '../types/game';

interface EnergyOrbProps {
  type: EnergyType | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

export const EnergyOrb: React.FC<EnergyOrbProps> = ({
  type,
  size = 'sm',
  className = '',
  title
}) => {
  const normType = type ? (type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()) : 'Colorless';
  const iconName = (normType.toLowerCase() === 'colorless' || normType.toLowerCase() === 'normal')
    ? 'normal'
    : normType.toLowerCase() === 'lightning' || normType.toLowerCase() === 'electric'
    ? 'lightning'
    : normType.toLowerCase();

  const sizeClasses = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];

  return (
    <div
      title={title || `${normType} Energy`}
      className={`inline-flex items-center justify-center rounded-full select-none flex-shrink-0 transition-transform hover:scale-110 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ${sizeClasses} ${className}`}
    >
      <img
        src={`/assets/energy_${iconName}.png`}
        alt={`${normType} Energy`}
        className="w-full h-full object-contain pointer-events-none rounded-full"
      />
    </div>
  );
};

