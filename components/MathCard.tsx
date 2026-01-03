
import React from 'react';
import { MathProblem } from '../types';

interface MathCardProps {
  problem: MathProblem;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  showCorrection: boolean;
}

export const MathCard: React.FC<MathCardProps> = ({ problem, onAnswer, selectedAnswer, showCorrection }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200 max-w-2xl w-full transform transition-all">
      <div className="mb-8 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mb-4 uppercase tracking-widest">
          Misi Matematika
        </span>
        <h3 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
          {problem.question}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problem.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === problem.correctAnswer;
          
          let bgColor = "bg-white hover:bg-blue-50 hover:border-blue-400";
          let borderColor = "border-slate-200";
          let textColor = "text-slate-800"; // Warna default yang gelap dan jelas
          
          if (showCorrection) {
            if (isCorrect) {
              bgColor = "bg-green-100";
              borderColor = "border-green-500";
              textColor = "text-green-800";
            } else if (isSelected && !isCorrect) {
              bgColor = "bg-red-100";
              borderColor = "border-red-500";
              textColor = "text-red-800";
            }
          } else if (isSelected) {
            bgColor = "bg-blue-500";
            borderColor = "border-blue-700";
            textColor = "text-white"; // Kontras saat terpilih
          }

          return (
            <button
              key={idx}
              disabled={showCorrection}
              onClick={() => onAnswer(option)}
              className={`group relative p-6 text-3xl font-bold border-4 rounded-3xl transition-all duration-200 shadow-md ${bgColor} ${borderColor} ${textColor} transform active:scale-90 flex items-center justify-center min-h-[100px]`}
            >
              <span className="relative z-10">{option}</span>
              {!showCorrection && !isSelected && (
                <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
              )}
            </button>
          );
        })}
      </div>

      {showCorrection && (
        <div className={`mt-10 p-6 rounded-3xl border-4 ${
          selectedAnswer === problem.correctAnswer 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        } animate-float`}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">
              {selectedAnswer === problem.correctAnswer ? '🎉' : '💡'}
            </div>
            <div>
              <p className="text-xl font-black mb-1">
                {selectedAnswer === problem.correctAnswer ? 'Keren Banget!' : 'Hampir Tepat!'}
              </p>
              <p className="text-lg font-medium opacity-90">{problem.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
