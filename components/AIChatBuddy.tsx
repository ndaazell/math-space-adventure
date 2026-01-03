
import React, { useState } from 'react';
import { getMathExplanation, speakText } from '../services/geminiService';

export const AIChatBuddy: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      const result = await getMathExplanation(query);
      setResponse(result);
      speakText(result);
    } catch (error) {
      setResponse("Aduh, bateraiku sedang lemah. Tanya lagi nanti ya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50 p-6 rounded-3xl border-4 border-indigo-200 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-indigo-300">
          🤖
        </div>
        <div>
          <h4 className="text-xl font-bold text-indigo-700">Profesor Robot</h4>
          <p className="text-sm text-indigo-500 italic">"Matematika itu seru, lho!"</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 min-h-[120px] mb-4 border-2 border-indigo-100 text-indigo-900 leading-relaxed overflow-y-auto max-h-60">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          response || "Halo! Aku Profesor Robot. Ada yang bingung di pelajaran matematika hari ini? Tanyakan saja padaku!"
        )}
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kenapa 5 + 5 = 10?"
          className="flex-1 p-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Tanya
        </button>
      </form>
    </div>
  );
};
