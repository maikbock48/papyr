'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/context';
import { getCommitments, type Commitment } from '@/lib/supabase/database';

interface RightSidebarProps {
  isOpen: boolean;
}

export default function RightSidebar({ isOpen }: RightSidebarProps) {
  const { user, profile } = useAuth();
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const currentStreak = profile?.current_streak || 0;

  const sfProFont = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif'
  };

  // Load commitments
  useEffect(() => {
    if (user) {
      loadCommitments();
    }
  }, [user]);

  const loadCommitments = async () => {
    try {
      const data = await getCommitments();
      setCommitments(data);
    } catch (error) {
      console.error('Error loading commitments:', error);
    }
  };

  return (
    <div
      className={`hidden md:block fixed right-0 top-16 bottom-0 border-l-2 shadow-lg z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ width: '280px', backgroundColor: 'rgb(206, 205, 203)', borderColor: '#2d2e2e' }}
    >
      <div className="flex flex-col h-full p-6 overflow-y-auto">
        {/* Calendar */}
        <div className="mb-6">
          <div className="bg-white shadow-lg rounded-xl p-4" style={{ border: '2px solid #2d2e2e' }}>
            {/* Calendar Header */}
            <div className="text-center mb-3 pb-2 border-b-2" style={{ borderColor: '#e0e0e0' }}>
              <p className="text-base font-bold" style={{ color: '#2d2e2e', ...sfProFont }}>
                {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                const firstDay = new Date(currentYear, currentMonth, 1);
                const lastDay = new Date(currentYear, currentMonth + 1, 0);
                const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                const daysInMonth = lastDay.getDate();

                // Get commitment dates
                const commitmentDates = new Set(
                  commitments
                    .filter(c => !c.is_developing)
                    .map(c => c.date)
                );

                const cells = [];

                // Weekday headers
                ['M', 'D', 'M', 'D', 'F', 'S', 'S'].forEach((day, i) => {
                  cells.push(
                    <div key={`header-${i}`} className="text-xs font-bold text-center" style={{ color: 'rgba(45, 46, 46, 0.6)', ...sfProFont }}>
                      {day}
                    </div>
                  );
                });

                // Empty cells before first day
                for (let i = 0; i < startDay; i++) {
                  cells.push(<div key={`empty-${i}`} />);
                }

                // Days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(currentYear, currentMonth, day);
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = day === today.getDate();
                  const hasCommitment = commitmentDates.has(dateStr);

                  cells.push(
                    <div
                      key={`day-${day}`}
                      className={`text-sm text-center p-1.5 relative rounded ${
                        isToday
                          ? 'text-white font-bold'
                          : ''
                      }`}
                      style={isToday
                        ? { backgroundColor: '#2d2e2e', ...sfProFont }
                        : { color: 'rgba(45, 46, 46, 0.7)', ...sfProFont }}
                    >
                      {isToday ? (
                        <div className="flex flex-col items-center">
                          <div className="text-xs leading-none">{day}</div>
                          <div className="text-[10px] leading-none mt-0.5">🔥{currentStreak}</div>
                        </div>
                      ) : (
                        <>
                          {day}
                          {hasCommitment && (
                            <div className="absolute -top-0.5 -right-0.5 text-[10px]">⭐</div>
                          )}
                        </>
                      )}
                    </div>
                  );
                }

                return cells;
              })()}
            </div>
          </div>
        </div>

        {/* Onboarding Video Card */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4" style={{ border: '2px solid #2d2e2e' }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#2d2e2e', ...sfProFont }}>
              Go onboarding in 2 minutes
            </h3>
            <p className="text-sm mb-3" style={{ color: '#666', lineHeight: '1.4', ...sfProFont }}>
              Schau dir das kurze Onboarding Video an und nimm Disziplin, Fokus & Fantasie mit
            </p>
            <Link
              href="/onboarding-video"
              className="inline-block bg-black text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-900 transition-all hover:scale-105 shadow-md text-sm w-full text-center"
              style={sfProFont}
            >
              Welcome to PAPYR
            </Link>
          </div>
        </div>

        {/* Spielregeln Card */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4" style={{ border: '2px solid #2d2e2e' }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#2d2e2e', ...sfProFont }}>
              Spielregeln
            </h3>
            <p className="text-sm mb-3" style={{ color: '#666', lineHeight: '1.4', ...sfProFont }}>
              Lerne die Spielregeln von PAPYR kennen
            </p>
            <Link
              href="/rules"
              className="inline-block bg-black text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-900 transition-all hover:scale-105 shadow-md text-sm w-full text-center"
              style={sfProFont}
            >
              Regeln ansehen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
