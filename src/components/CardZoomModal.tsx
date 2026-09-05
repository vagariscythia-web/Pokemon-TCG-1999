import { Language, TRANSLATIONS } from '../i18n/translations';
import React from 'react';
import { Card, InPlayCard } from '../types/game';
import { X, Award, Flame, Sparkles } from 'lucide-react';
import { formatCardText, getEnergyIconPath } from '../utils/formatCardText';

interface CardZoomModalProps {
  card: Card | null;
  inPlayCard?: InPlayCard | null;
  onClose: () => void;
  lang?: Language;
  /** Top banner shown when the modal doubles as an attack picker (e.g. Amnesia). */
  attackSelectionPrompt?: string;
  /** When provided, the attack rows become buttons that report the picked attack name. */
  onSelectAttack?: (attackName: string) => void;
  /** Top banner shown when the modal doubles as a generic option picker (e.g. Conversion type). */
  optionSelectionPrompt?: string;
  /** When provided, renders a set of selectable option buttons below the attacks. */
  selectionOptions?: { label: string; value: string }[];
  /** Callback fired when the user picks one of the selectionOptions. */
  onSelectOption?: (value: string) => void;
  /** When true the modal cannot be dismissed without making a selection:
   *  the close (X) button is hidden and backdrop clicks are ignored. */
  forceSelection?: boolean;
}

export const CardZoomModal: React.FC<CardZoomModalProps> = ({ card, inPlayCard, onClose, lang = 'tr', attackSelectionPrompt, onSelectAttack, optionSelectionPrompt, selectionOptions, onSelectOption, forceSelection }) => {
  const t = TRANSLATIONS[lang];
  if (!card) return null;

  const currentHp = inPlayCard ? inPlayCard.currentHp : card.hp;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={forceSelection ? undefined : onClose}
    >
      <div
        className="relative bg-slate-900 border-2 border-yellow-500/80 rounded-2xl max-w-4xl w-[95%] md:w-full p-4 sm:p-6 text-white shadow-2xl flex flex-col md:flex-row gap-4 md:gap-6 max-h-[90vh] overflow-y-auto safe-area-padding"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button — yellow and prominent when the modal doubles as a picker.
            Hidden entirely when forceSelection is set so the player MUST pick. */}
        {!forceSelection && (
          <button
            onClick={onClose}
            title={(onSelectAttack || onSelectOption) ? (lang === 'tr' ? 'Vazgeç' : 'Cancel') : undefined}
            className={(onSelectAttack || onSelectOption)
              ? "absolute top-3 right-3 z-10 text-slate-900 bg-yellow-400 hover:bg-yellow-300 rounded-full p-2 border-2 border-yellow-200 shadow-lg shadow-yellow-400/50 hover:scale-110 transition cursor-pointer"
              : "absolute top-4 right-4 text-gray-400 hover:text-white bg-slate-800 rounded-full p-1.5 border border-slate-700 hover:bg-slate-700 transition cursor-pointer"}
          >
            <X className={(onSelectAttack || onSelectOption) ? "w-7 h-7" : "w-6 h-6"} />
          </button>
        )}

        {/* Card Artwork */}
        <div className="flex-shrink-0 flex justify-center items-center">
          <img
            src={card.originalImageUrl || card.image || `/cards/${card.number}.jpg`}
            alt={card.name}
            className="w-44 sm:w-56 md:w-72 lg:w-80 h-auto rounded-xl shadow-2xl border-2 border-amber-400/60 object-contain bg-amber-100"
            onError={(e) => {
              if (card.originalImageUrl) (e.target as HTMLImageElement).src = card.originalImageUrl;
              else if (card.image) (e.target as HTMLImageElement).src = card.image;
            }}
          />
        </div>

        {/* Detailed Stats & Attack Descriptions */}
        <div className="flex-grow flex flex-col justify-between">
          <div>
            {/* Selection banner (Amnesia / Metronome attack picker, Conversion type picker) */}
            {(attackSelectionPrompt || optionSelectionPrompt) && (
              <div className="mb-3 p-3 bg-purple-950/70 border-2 border-purple-500/80 rounded-xl">
                <div className="text-sm font-black text-purple-200">
                  <span>{attackSelectionPrompt || optionSelectionPrompt}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {optionSelectionPrompt
                    ? (lang === 'tr'
                        ? 'Bir seçeneğe tıklayarak belirleyin. Seçim yapmadan devam edilemez.'
                        : 'Click an option to confirm. You must pick an option before continuing.')
                    : (lang === 'tr'
                        ? 'Bir saldırının üzerine tıklayarak onu seçin. Seçim yapmadan devam edilemez.'
                        : 'Click an attack to select it. You must pick an attack before continuing.')}
                </p>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <span className="text-xs font-mono tracking-widest text-yellow-400">
                  {card.supertype} {card.subtype ? `• ${card.subtype}` : ''}
                </span>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {card.name}
                  {card.rarity === 'Rare Holo' && <Award className="w-5 h-5 text-yellow-400" />}
                </h2>
              </div>
              {card.hp && (
                <div className="text-right">
                  <span className="text-xs text-gray-400">HP</span>
                  <div className="text-2xl font-black text-red-400">
                    {currentHp} <span className="text-sm font-normal text-gray-400">/ {card.hp}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Evolves from */}
            {card.evolvesFrom && (
              <div className="text-xs text-gray-300 mt-2 bg-slate-800/80 px-2.5 py-1 rounded inline-block">
                {t.evolvesFrom} <span className="font-semibold text-yellow-300">{card.evolvesFrom}</span>
              </div>
            )}

            {/* Pokemon Power */}
            {card.power && (
              <div className="mt-4 p-3 bg-red-950/40 border border-red-700/50 rounded-lg">
                <div className="text-sm font-bold text-red-400 tracking-wide flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> {t.pokemonPower} {card.power.name}
                </div>
                <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                  {formatCardText(card.power.text)}
                </p>
              </div>
            )}

            {/* Attacks — in picker mode each row is a selectable button */}
            {card.attacks && card.attacks.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="text-xs font-semibold text-gray-400 tracking-wider">{t.attacks}</div>
                {card.attacks.map((atk, idx) => {
                  const rowContent = (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Cost Badges */}
                          <div className="flex gap-1 items-center">
                            {atk.cost.map((c, i) => (
                              <img
                                key={i}
                                src={getEnergyIconPath(c)}
                                alt={c}
                                className="w-5 h-5 drop-shadow"
                                title={c}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-base text-yellow-200">{atk.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {atk.damage > 0 && (
                            <span className="text-lg font-black text-red-400">{atk.damage}</span>
                          )}
                          {onSelectAttack && (
                            <span className="text-[9px] font-black tracking-wider text-slate-900 bg-yellow-400 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                              {lang === 'tr' ? 'ENGELLE' : 'BLOCK'}
                            </span>
                          )}
                        </div>
                      </div>
                      {atk.text && (
                        <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                          {formatCardText(atk.text)}
                        </p>
                      )}
                    </>
                  );
                  return onSelectAttack ? (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectAttack(atk.name)}
                      className="w-full text-left p-3 bg-slate-800/60 rounded-lg border-2 border-slate-700/60 hover:bg-yellow-500/15 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20 transition cursor-pointer group"
                    >
                      {rowContent}
                    </button>
                  ) : (
                    <div key={idx} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
                      {rowContent}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Generic option buttons (Conversion type picker) */}
            {selectionOptions && onSelectOption && (
              <div className="mt-3 space-y-2">
                {selectionOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectOption(opt.value)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-purple-900/50 hover:border-yellow-400 text-white text-xs font-bold transition cursor-pointer group flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <img src={getEnergyIconPath(opt.value as any)} alt={opt.value} className="w-5 h-5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      {opt.label}
                    </span>
                    <span className="text-yellow-400 opacity-0 group-hover:opacity-100 transition text-[10px] font-black tracking-wider">SEÇ ✓</span>
                  </button>
                ))}
              </div>
            )}

            {/* Trainer Text */}
            {card.trainer && (
              <div className="mt-4 p-4 bg-blue-950/40 border border-blue-700/50 rounded-lg">
                <div className="text-xs font-bold text-blue-400 tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {lang === 'tr' ? 'EĞİTMEN KARTI ETKİSİ' : 'TRAINER EFFECT'}
                </div>
                <p className="text-sm text-gray-100 leading-relaxed">
                  {formatCardText(card.trainer.text)}
                </p>
              </div>
            )}

            {/* Energy Text */}
            {card.energy && (
              <div className="mt-4 p-4 bg-amber-950/40 border border-amber-700/50 rounded-lg">
                <p className="text-sm text-yellow-200">
                  {formatCardText(card.energy.text)}
                </p>
              </div>
            )}
          </div>

          {/* Footer stats: Weakness, Resistance, Retreat Cost */}
          {card.supertype === 'Pokemon' && (
            <div className="grid grid-cols-3 gap-2 mt-6 pt-3 border-t border-slate-700 text-center text-xs">
              <div className="bg-slate-800/80 p-2 rounded">
                <div className="text-gray-400">{t.weakness}</div>
                <div className="font-bold text-red-400 mt-0.5 flex items-center justify-center gap-1">
                  {card.weakness ? (
                    <>
                      <img src={getEnergyIconPath(card.weakness.type)} alt={card.weakness.type} className="w-4 h-4 inline-block" />
                      <span>×{card.weakness.value}</span>
                    </>
                  ) : (
                    'None'
                  )}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2 rounded">
                <div className="text-gray-400">{t.resistance}</div>
                <div className="font-bold text-blue-400 mt-0.5 flex items-center justify-center gap-1">
                  {card.resistance ? (
                    <>
                      <img src={getEnergyIconPath(card.resistance.type)} alt={card.resistance.type} className="w-4 h-4 inline-block" />
                      <span>{card.resistance.value}</span>
                    </>
                  ) : (
                    'None'
                  )}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2 rounded">
                <div className="text-gray-400">{t.retreatCost}</div>
                <div className="font-bold text-yellow-400 mt-0.5 flex items-center justify-center gap-1">
                  {card.retreatCost ? (
                    <div className="flex gap-0.5">
                      {Array.from({ length: card.retreatCost }).map((_, i) => (
                        <img key={i} src="/assets/energy_colorless.png" alt="C" className="w-3.5 h-3.5" />
                      ))}
                    </div>
                  ) : (
                    'Free'
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
