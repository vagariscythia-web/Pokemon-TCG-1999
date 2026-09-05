import { Language, TRANSLATIONS } from '../i18n/translations';
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types/multiplayer';
import { Send, MessageSquare } from 'lucide-react';

interface InGameChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  playerName: string;
  isMultiplayer?: boolean;
  lang?: Language;
}

const QUICK_PHRASES = [
  '🔥 Good luck!',
  '⚡ Nice move!',
  '🛡️ Well played!',
  '😮 Wow!',
  '😎 GG!',
  '⏱️ Thinking...'
];

export const InGameChat: React.FC<InGameChatProps> = ({
  messages,
  onSendMessage,
  playerName,
  isMultiplayer = false,
  lang = 'tr'
}) => {
  const t = TRANSLATIONS[lang];
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  const handleQuickPhrase = (phrase: string) => {
    onSendMessage(phrase);
  };

  return (
    <div className="bg-slate-950/90 border border-yellow-500/30 rounded-xl p-2.5 h-36 md:h-48 flex flex-col shadow-inner select-text">
      {/* Quick Phrases */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-1 select-none scrollbar-none">
        {t.quickPhrases.map((phrase, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPhrase(phrase)}
            className="flex-shrink-0 text-[8.5px] bg-slate-800 hover:bg-slate-700 active:scale-95 text-gray-200 px-1.5 py-0.5 rounded-full border border-slate-700/80 transition"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-grow overflow-y-auto space-y-1.5 pr-1 text-[10px] md:text-[11px] font-sans scrollbar-thin">
        {messages.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-[10px] italic select-none">
            {t.noMessages}
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderName === playerName || (msg.sender === 'player1' && isMultiplayer && playerName === 'Player');
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} leading-tight`}
              >
                <div className="flex items-center gap-1 text-[9px] text-gray-400 mb-0.5 px-0.5">
                  <span className={`font-bold ${isMe ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {isMe ? 'You' : msg.senderName || 'Opponent'}
                  </span>
                  <span>• {msg.timestamp}</span>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-xl max-w-[90%] break-words shadow-sm ${
                    isMe
                      ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-500/40 rounded-br-none'
                      : 'bg-blue-600/25 text-blue-100 border border-blue-500/40 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="mt-1 flex items-center gap-1.5 pt-1 border-t border-slate-800">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.typeMessagePlaceholder}
          maxLength={100}
          className="flex-grow bg-slate-900 text-white text-[10px] md:text-[11px] px-2 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-400 transition placeholder:text-gray-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-30 text-slate-950 p-1.5 rounded-lg transition flex items-center justify-center font-bold shadow"
          title="Send"
        >
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
