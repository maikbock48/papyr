'use client';

import { useState } from 'react';
import { getDailyQuestion, saveAnswer } from '@/lib/dailyQuestions';

interface DailyQuestionProps {
  day: number;
  onComplete: () => void;
}

export default function DailyQuestion({ day, onComplete }: DailyQuestionProps) {
  const [answer, setAnswer] = useState('');
  const question = getDailyQuestion(day);

  if (!question) {
    onComplete();
    return null;
  }

  const handleSubmit = () => {
    if (!answer.trim()) {
      alert('⚠️ Nimm dir einen Moment. Beantworte die Frage ehrlich.');
      return;
    }

    saveAnswer(day, question.question, answer);
    onComplete();
  };

  const handleSkip = () => {
    // Save empty answer to mark as "seen"
    saveAnswer(day, question.question, '(übersprungen)');
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-cream z-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-brown/60 text-xl font-bold tracking-wider">
            {question.subtitle}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-brown leading-tight">
            {question.question}
          </h1>
        </div>

        {/* Answer Input */}
        <div className="space-y-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Deine ehrliche Antwort..."
            rows={6}
            className="w-full border-4 border-brown p-6 text-lg bg-white focus:outline-none focus:ring-4 focus:ring-brown/50 font-typewriter resize-none"
            autoFocus
          />
          <p className="text-sm text-brown/60 italic">
            Niemand wird deine Antwort sehen. Außer du selbst. Sei ehrlich.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full bg-brown text-cream px-8 py-5 text-xl font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bekenntnis siegeln
          </button>

          <button
            onClick={handleSkip}
            className="w-full bg-cream text-brown/50 px-8 py-3 text-sm border-2 border-brown/30 hover:bg-vintage/20 transition-colors"
          >
            Später beantworten
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 pt-4">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <div
              key={d}
              className={`w-3 h-3 rounded-full ${
                d === day ? 'bg-brown' : d < day ? 'bg-brown/40' : 'bg-brown/10'
              }`}
            />
          ))}
        </div>

        <p className="text-center text-sm text-brown/50">
          Frage {day} von 7
        </p>
      </div>
    </div>
  );
}
