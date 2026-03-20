import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.json';
import missionsData from '../data/missions.json';
import { UserContext } from '../context/UserContext';
import { AlertCircle, CheckCircle2, Bot, Timer, Zap, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BorderGlow from '../components/BorderGlow';
import { sfx } from '../utils/audioEngine';

const TIMER_START = 15;

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXP, addCurrency, completeMission, addWeakTopic, unlockBadge } = useContext(UserContext);

  const mission = missionsData.find((m) => m.id === id);
  const questions = questionsData[id];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | 'timeout'
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  
  // Gaming features
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [combo, setCombo] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Voice Recognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.trim().toLowerCase();
        
        // Find matching option
        if (questions && questions[currentIndex]) {
           const match = questions[currentIndex].options.find(opt => 
             opt.toLowerCase().includes(command) || command.includes(opt.toLowerCase())
           );
           if (match) {
             handleSelect(match);
             sfx.hover();
           }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [currentIndex, questions]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Voice Commands not supported in this browser.");
      return;
    }
    sfx.click();
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (!questions || !mission) {
      navigate('/missions');
    }
  }, [questions, mission, navigate]);

  // Timer Effect
  useEffect(() => {
    if (showResult || feedback !== null) return;

    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, showResult, feedback]);

  if (!questions || !mission) return null;

  const currentQ = questions[currentIndex];

  const handleTimeout = () => {
    setFeedback('timeout');
    setCombo(0);
    addWeakTopic(mission.topic);
    simulateAIFeedback(currentQ.text, "Timeout", currentQ.correct);
  };

  const handleSelect = (option) => {
    if (feedback !== null) return;
    setSelectedOption(option);
    
    if (option === currentQ.correct) {
      setFeedback('correct');
      sfx.correct();
      setScore(prev => prev + 1);
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      // Trophy Checks
      if (newCombo === 3) unlockBadge('combo_king');
      if (timeLeft > 12) unlockBadge('speed_demon');

      const multiplier = newCombo > 0 ? (1 + (newCombo * 0.2)) : 1;
      const points = Math.round(10 * multiplier * (timeLeft / TIMER_START + 0.5));
      setEarnedXp(prev => prev + points);
      addXP(points);
      
      // Also grant currency (10 CR per right answer)
      addCurrency(10);
      
    } else {
      setFeedback('wrong');
      sfx.wrong();
      setCombo(0);
      addWeakTopic(mission.topic);
      simulateAIFeedback(currentQ.text, option, currentQ.correct);
    }
  };

  const simulateAIFeedback = (question, wrongAnswer, correctAnswer) => {
    setIsAiLoading(true);
    setTimeout(() => {
      setAiAnalysis(`You selected "${wrongAnswer}" but the answer is "${correctAnswer}". Watch out for the clock and read carefully!`);
      setIsAiLoading(false);
      sfx.hover();
    }, 1200);
  };

  const handleNext = () => {
    sfx.click();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setFeedback(null);
      setAiAnalysis('');
      setTimeLeft(TIMER_START);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const accuracy = score / questions.length;
    if (accuracy > 0.5) {
      completeMission(mission.id, mission.topic);
      addXP(mission.xpReward);
      addCurrency(mission.xpReward); // Currency matches XP reward
      setEarnedXp(prev => prev + mission.xpReward);
      sfx.levelUp(); // Celebration sound
    } else {
      sfx.wrong();
    }
    setShowResult(true);
  };

  if (showResult) {
    const passed = score / questions.length > 0.5;
    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
        className="max-w-xl mx-auto mt-20 p-8 glass-panel border-4 border-slate-700/50 rounded-3xl text-center shadow-[0_20px_50px_rgba(8,-112,184,0.7)]"
      >
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl
          ${passed ? 'bg-emerald-500 text-white shadow-emerald-500/50' : 'bg-rose-500 text-white shadow-rose-500/50'}`}>
          {passed ? <CheckCircle2 size={50} /> : <AlertCircle size={50} />}
        </div>
        <h2 className="text-4xl font-black mb-2 uppercase tracking-tight text-white drop-shadow-md">
          {passed ? 'MISSION CLEARED' : 'MISSION FAILED'}
        </h2>
        
        <p className="text-slate-300 font-medium text-lg mb-8 uppercase tracking-widest">
          Accuracy: {Math.round((score / questions.length) * 100)}%
        </p>

        {passed && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-amber-500/20 border-2 border-amber-400/50 text-amber-400 p-6 rounded-2xl flex flex-col items-center justify-center mb-8"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-1">Total Loop XP</span>
            <span className="font-mono text-4xl font-black">+{earnedXp}</span>
          </motion.div>
        )}

        <button 
          onClick={() => navigate('/missions')}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
        >
          {passed ? 'Continue Journey' : 'Retreat to Menu'}
        </button>
      </motion.div>
    );
  }

  const getProgressPercentage = () => Math.min(100, Math.max(0, (timeLeft / TIMER_START) * 100));
  let timerColor = 'emerald';
  if (timeLeft <= 5) timerColor = 'rose';
  else if (timeLeft <= 10) timerColor = 'amber';

  // Choose glow color dynamically based on feedback: Correct=Green, Wrong=Red, Timeout=Orange, Else=Indigo
  let glowColor = '250 80 80'; // Indigo
  if (feedback === 'correct') glowColor = '160 80 80'; // Emerald
  else if (feedback === 'wrong') glowColor = '350 80 80'; // Rose
  else if (feedback === 'timeout') glowColor = '40 80 80'; // Amber

  return (
    <div className="max-w-3xl mx-auto py-4 animate-in fade-in duration-300">
      
      {/* Gaming Header */}
      <div className="flex justify-between items-center mb-6 glass-panel p-4 rounded-2xl border border-slate-700/50 relative overflow-hidden">
        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-2 text-indigo-400 font-bold uppercase tracking-wider text-sm">
              <Zap size={18} className={combo > 1 ? "animate-pulse text-yellow-400" : ""} />
              <span>Combo x{combo}</span>
           </div>
           
           <button 
             onClick={toggleMic}
             className={`p-2 rounded-xl transition-all border ${isListening ? 'bg-rose-500/20 text-rose-400 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
             title="Voice Answers (Experimental)"
           >
             {isListening ? <Mic size={18} /> : <MicOff size={18} />}
           </button>
        </div>
        
        <div className="font-mono text-slate-400">
          WAVE {currentIndex + 1} / {questions.length}
        </div>
        <div className={`flex items-center space-x-2 font-black text-xl font-mono ${
          timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-200'
        }`}>
           <Timer size={20} />
           <span>00:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>
      
      {/* Timer Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-8 overflow-hidden">
        <div
          className={`bg-${timerColor}-500 h-2 rounded-full transition-all ease-linear`}
          style={{ width: `${getProgressPercentage()}%`, transitionDuration: '1s' }}
        ></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <BorderGlow
             edgeSensitivity={30}
             glowColor={glowColor}
             backgroundColor="#0f172a" /* slate-900 to match dashboard */
             borderRadius={24}
             glowRadius={30}
             glowIntensity={1.5}
             coneSpread={25}
             animated={true}
             colors={['#c084fc', '#4f46e5', '#38bdf8']}
             className="w-full"
          >
            <div className="p-6 sm:p-10 min-h-[300px] flex flex-col w-full text-slate-100 relative z-10 bg-transparent">
              <h3 className="text-2xl sm:text-3xl font-bold mb-8 leading-tight">{currentQ.text}</h3>
              
              <div className="space-y-4 flex-1">
                {currentQ.options.map((option, idx) => {
                  let btnClass = "border-slate-700/50 hover:border-indigo-500 hover:bg-indigo-500/10 text-slate-200";
                  
                  if (feedback !== null) {
                    if (option === currentQ.correct) {
                      btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                    } else if (option === selectedOption && feedback === 'wrong') {
                      btnClass = "bg-rose-500/20 border-rose-500 text-rose-400";
                    } else if (feedback === 'timeout') {
                      btnClass = "opacity-50 border-slate-700";
                    } else {
                      btnClass = "opacity-50 border-slate-700";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={feedback !== null}
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left px-6 py-5 rounded-2xl border-2 font-bold transition-all duration-200 text-lg shadow-sm ${btnClass} ${feedback === null ? 'active:scale-[0.98]' : ''}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {(feedback === 'wrong' || feedback === 'timeout') && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mt-6 p-6 rounded-2xl bg-indigo-900/40 text-white border border-indigo-500/30 backdrop-blur-md shadow-lg"
           >
             <div className="flex items-start space-x-3">
               <Bot className="text-indigo-400 mt-1 flex-shrink-0" />
               <div>
                 <h4 className="font-bold text-indigo-400 mb-1 uppercase tracking-wider text-sm">System Analysis:</h4>
                 {isAiLoading ? (
                   <div className="flex space-x-1 items-center h-6">
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                   </div>
                 ) : (
                   <p className="text-indigo-100/80 leading-relaxed">{aiAnalysis}</p>
                 )}
               </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      {feedback !== null && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex justify-end"
        >
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-8 py-4 rounded-xl font-black shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 z-50 relative"
          >
            {currentIndex < questions.length - 1 ? 'Next Wave ➔' : 'Complete Run'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;
