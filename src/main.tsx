// Instant Global Asset Preload (Coins, Energies, Card Backs)
const CRITICAL_ASSETS = [
  '/assets/coin_heads.png',
  '/assets/coin_tails.png',
  '/assets/coin_heads.svg',
  '/assets/coin_tails.svg',
  '/assets/card_back.png'
];
CRITICAL_ASSETS.forEach(src => {
  const img = new Image();
  img.src = src;
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
