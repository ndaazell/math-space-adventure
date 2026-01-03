
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Category, Difficulty, MathProblem, UserStats } from './types';
import { generateMathProblems } from './services/geminiService';
import { MathCard } from './components/MathCard';
import { AIChatBuddy } from './components/AIChatBuddy';

// --- Home Screen ---
const HomeScreen = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="relative mb-8">
      <div className="text-9xl animate-float">🚀</div>
      <div className="absolute -top-4 -right-4 text-4xl">⭐</div>
      <div className="absolute bottom-0 -left-6 text-4xl">☄️</div>
    </div>
    <h1 className="text-5xl md:text-6xl font-black text-blue-700 text-center mb-4 tracking-tight">
      MATHSPACE ADVENTURE
    </h1>
    <p className="text-xl text-blue-500 font-medium text-center max-w-xl mb-12">
      Belajar matematika jadi petualangan luar angkasa yang seru bersama Profesor Robot!
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
      <CategoryCard 
        title="Operasi Angka" 
        icon="➕" 
        color="bg-orange-400" 
        to="/play/Addition"
        desc="Tambah, kurang, kali, bagi!"
      />
      <CategoryCard 
        title="Dunia Bentuk" 
        icon="📐" 
        color="bg-green-400" 
        to="/play/Geometry"
        desc="Segitiga, lingkaran, kotak!"
      />
      <CategoryCard 
        title="Tantangan Logika" 
        icon="🧩" 
        color="bg-purple-400" 
        to="/play/Logic"
        desc="Asah otakmu biar makin tajam!"
      />
    </div>

    <div className="mt-16 w-full max-w-2xl">
      <AIChatBuddy />
    </div>
  </div>
);

const CategoryCard = ({ title, icon, color, to, desc }: any) => (
  <Link 
    to={to} 
    className={`${color} p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all group`}
  >
    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white opacity-90">{desc}</p>
  </Link>
);

// --- Play Screen ---
const PlayScreen = ({ category }: { category: Category }) => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    const loadProblems = async () => {
      setLoading(true);
      const data = await generateMathProblems(category, Difficulty.EASY, 5);
      setProblems(data);
      setLoading(false);
    };
    loadProblems();
  }, [category]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowCorrection(true);
    if (answer === problems[currentIndex].correctAnswer) {
      setScore(prev => prev + 10);
    }
  };

  const nextProblem = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowCorrection(false);
    } else {
      setGameFinished(true);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-6xl animate-bounce mb-4">🛸</div>
      <p className="text-2xl font-bold text-blue-600">Menyiapkan misi...</p>
    </div>
  );

  if (gameFinished) return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-8xl mb-6">🏆</div>
      <h2 className="text-4xl font-bold text-blue-800 mb-4 text-center">Misi Selesai!</h2>
      <p className="text-2xl text-blue-600 mb-8">Skor Kamu: <span className="font-black">{score}</span></p>
      <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:bg-blue-700 shadow-lg">
        Kembali ke Beranda
      </Link>
    </div>
  );

  const currentProblem = problems[currentIndex];

  return (
    <div className="flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl mb-6 flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-blue-100">
        <div className="text-blue-600 font-bold">Soal {currentIndex + 1} / {problems.length}</div>
        <div className="text-orange-500 font-bold">✨ {score} Poin</div>
      </div>

      <MathCard 
        problem={currentProblem} 
        onAnswer={handleAnswer} 
        selectedAnswer={selectedAnswer}
        showCorrection={showCorrection}
      />

      {showCorrection && (
        <button 
          onClick={nextProblem}
          className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl text-xl font-bold hover:bg-blue-700 shadow-xl animate-bounce"
        >
          {currentIndex === problems.length - 1 ? 'Lihat Skor' : 'Soal Berikutnya ➡️'}
        </button>
      )}
    </div>
  );
};

// --- App Layout ---
const App = () => {
  return (
    <Router>
      <div className="min-h-screen pb-12">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b-4 border-blue-50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">👨‍🚀</span>
              <span className="text-2xl font-black text-blue-800 tracking-tighter">MATHSPACE</span>
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="text-blue-600 font-bold hover:text-blue-800">Beranda</Link>
              <div className="hidden md:flex gap-4">
                <span className="text-gray-300">|</span>
                <span className="text-green-600 font-bold">Level 1</span>
                <span className="text-orange-500 font-bold">⭐ 120</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/play/Addition" element={<PlayScreen category={Category.ADDITION} />} />
            <Route path="/play/Geometry" element={<PlayScreen category={Category.GEOMETRY} />} />
            <Route path="/play/Logic" element={<PlayScreen category={Category.LOGIC} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
