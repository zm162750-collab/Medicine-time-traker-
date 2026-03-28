/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

// Medicine Data
const MEDICINES = [
  {
    id: 'gfc-hs',
    name: 'GFC-HS',
    type: 'Eye Drops 💧',
    frequency: '6 baar',
    times: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'],
    color: '#E74C3C'
  },
  {
    id: 'suthin-gold',
    name: 'Suthin Gold',
    type: 'Eye Drops 💧',
    frequency: '4 baar',
    times: ['9:00 AM', '1:00 PM', '5:00 PM', '9:00 PM'],
    color: '#2980B9'
  },
  {
    id: 'polymag',
    name: 'Polymag',
    type: 'Eye Ointment 🧴',
    frequency: '3 baar',
    times: ['9:00 AM', '3:00 PM', '9:00 PM'],
    color: '#E67E22'
  },
  {
    id: 'lotel',
    name: 'Lotel',
    type: 'Eye Ointment 🧴',
    frequency: '2 baar',
    times: ['9:00 AM', '9:00 PM'],
    color: '#8E44AD'
  }
];

const ALL_TIMES = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM'];
const TOTAL_DOSES = 15;

export default function App() {
  const [completedDoses, setCompletedDoses] = useState<Record<string, boolean>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('eye-medicine-tracker');
    if (saved) {
      try {
        setCompletedDoses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved doses', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('eye-medicine-tracker', JSON.stringify(completedDoses));
  }, [completedDoses]);

  const toggleDose = (medId: string, time: string) => {
    const key = `${medId}-${time}`;
    setCompletedDoses(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const completedCount = Object.values(completedDoses).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / TOTAL_DOSES) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 font-sans">
      <div className="w-full max-w-[600px] flex flex-col gap-6">
        
        {/* 1. HEADER */}
        <header className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] p-6 text-white">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            👁️ Aankhon ki Dawai Schedule
          </h1>
          <p className="text-sm opacity-90 mb-6">9:00 AM – 9:00 PM</p>
          
          <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">Aaj ki progress — {completedCount} / {TOTAL_DOSES} doses ✅</span>
              <span className="text-xs font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </header>

        {/* 2. MEDICINE CARDS */}
        <section className="flex flex-col gap-4">
          {MEDICINES.map(med => (
            <div 
              key={med.id} 
              className="bg-white rounded-xl shadow-sm border-l-[6px] p-4 flex flex-col gap-3"
              style={{ borderLeftColor: med.color }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: med.color }}>{med.name}</h2>
                  <p className="text-xs text-gray-500">{med.type}</p>
                </div>
                <span className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold px-2 py-1 rounded-full">
                  {med.frequency}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {med.times.map(time => {
                  const isDone = completedDoses[`${med.id}-${time}`];
                  return (
                    <button
                      key={time}
                      onClick={() => toggleDose(med.id, time)}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                        ${isDone 
                          ? 'text-white border-transparent' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                        }
                      `}
                      style={{ 
                        backgroundColor: isDone ? med.color : 'transparent',
                        borderColor: isDone ? med.color : undefined
                      }}
                    >
                      {isDone ? `✓ ${time}` : time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* 3. SCHEDULE TABLE CARD */}
        <section className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            📋 Poora Schedule (Ek Nazar Mein)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2 text-[10px] uppercase text-gray-400 font-bold">Time</th>
                  {MEDICINES.map(med => (
                    <th key={med.id} className="py-2 text-[10px] uppercase font-bold text-center" style={{ color: med.color }}>
                      {med.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_TIMES.map((time, idx) => (
                  <tr key={time} className={idx % 2 === 0 ? 'bg-[#fafafa]' : 'bg-white'}>
                    <td className="py-3 text-xs font-bold text-gray-600">{time}</td>
                    {MEDICINES.map(med => (
                      <td key={med.id} className="py-3 text-center">
                        {med.times.includes(time) ? (
                          <span className="text-sm">💊</span>
                        ) : (
                          <span className="text-gray-200 text-xs">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. WARNING BOX */}
        <section className="bg-[#FFF8E1] border border-orange-200 rounded-xl p-5">
          <h4 className="text-orange-600 font-bold mb-3 flex items-center gap-2">
            ⚠️ Yaad rakhein
          </h4>
          <ul className="text-sm text-gray-700 flex flex-col gap-2 list-disc pl-5">
            <li>Eye drops pehle lagayein, ointment baad mein</li>
            <li>Do alag dawaiyon ke beech 5-10 min ka gap rakhein</li>
            <li>Lenses use karte hain toh pehle drops/ointment lagayein</li>
          </ul>
        </section>

        {/* FOOTER */}
        <footer className="text-center py-4 text-gray-400 text-[10px] uppercase tracking-widest">
          Eye Medicine Tracker • Made for Daily Use
        </footer>
      </div>
    </div>
  );
}
