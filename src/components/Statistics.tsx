import React, { useEffect, useMemo, useState } from 'react';
import {
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { statisticsDescriptions } from '../data/statisticsDescriptions';
import { BarChart2, TrendingUp, Users, Brain, Info } from 'lucide-react';
import { getEntries, clearEntries } from '../utils/progressTracker';
import { GratitudeGarden } from './games/GratitudeGarden';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

const dayLabels = (d: Date) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];

export const Statistics: React.FC = () => {
  const [entries, setEntries] = useState(() => getEntries(7));

  const [recentPlant, setRecentPlant] = useState<{ text: string; time: string } | null>(null);
  const [blooming, setBlooming] = useState(false);

  useEffect(() => {
    const onNew = () => setEntries(getEntries(7));
    const onPlant = (e: any) => {
      setRecentPlant(e.detail);
      setBlooming(true);
      setTimeout(() => setBlooming(false), 1800);
    };
    window.addEventListener('progress:entry', onNew);
    window.addEventListener('progress:entryUpdated', onNew);
    window.addEventListener('progress:cleared', onNew);
    window.addEventListener('gratitude:planted', onPlant as EventListener);
    return () => {
      window.removeEventListener('progress:entry', onNew);
      window.removeEventListener('progress:entryUpdated', onNew);
      window.removeEventListener('progress:cleared', onNew);
      window.removeEventListener('gratitude:planted', onPlant as EventListener);
    };
  }, []);

  const weeklyData = useMemo(() => {
    const days: { day: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - i);
      days.push({ day: dayLabels(d), minutes: 0 });
    }
    entries.forEach((e) => {
      const d = new Date(e.timestamp);
      d.setHours(0,0,0,0);
      const idx = days.findIndex((dayObj) => dayObj.day === dayLabels(d));
      if (idx >= 0) {
        days[idx].minutes += e.minutes;
      }
    });
    return days.map((d) => ({ day: d.day, minutes: d.minutes, engagement: Math.round(Math.min(1, d.minutes / 30) * 100) }));
  }, [entries]);

  const totalMinutes = weeklyData.reduce((s, d) => s + d.minutes, 0);
  const avgEngagement = (
    weeklyData.reduce((s, d) => s + d.engagement, 0) / weeklyData.length
  ).toFixed(0);

  // Aggregate activities across the week for pie chart by game categories
  const activityMap: Record<string, number> = {};
  entries.forEach((e) => {
    activityMap[e.game] = (activityMap[e.game] || 0) + e.minutes;
  });
  const activityData = Object.entries(activityMap).map(([name, value]) => ({ name, value }));

  // simple streak (days with minutes >= 20)
  const streak = weeklyData.filter((d) => d.minutes >= 20).length;

  const exportCSV = () => {
    const rows = entries.map((e) => `${new Date(e.timestamp).toISOString()},${e.game},${e.minutes}`);
    const csv = 'timestamp,game,minutes\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progress.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    if (!confirm('Clear all local progress data?')) return;
    clearEntries();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Weekly Progress Tracking</h1>
          <p className="text-lg text-gray-600">Monitor your weekly wellness activities, mood, and streaks.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Total Minutes</h3>
                <div className="text-2xl font-bold text-purple-700">{totalMinutes} min</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">Time spent on wellness activities this week.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Engagement Score</h3>
                <div className="text-2xl font-bold text-green-700">{avgEngagement}%</div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">Engagement is based on minutes spent relative to a 30 min/day target.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Streak</h3>
                <div className="text-2xl font-bold text-blue-700">{streak} days</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">Days this week with meaningful wellness time (≥20 min).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Minutes (by day)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-3 text-sm text-gray-600">Shows minutes spent per day on wellness activities.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Engagement Trend</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(val:any) => `${val}%`} />
                <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-3 text-sm text-gray-600">Daily engagement based on minutes relative to a 30 min target.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Breakdown</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={activityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {activityData.map((entry, idx) => (
                    <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-3 text-sm text-gray-600">Distribution of activity minutes across categories.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Weekly Goals</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Meditate 5× this week</div>
                  <div className="text-sm text-gray-500">Completed: 4/5</div>
                </div>
                <div className="text-sm text-gray-700">80%</div>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Play brain games 3×</div>
                  <div className="text-sm text-gray-500">Completed: 3/3</div>
                </div>
                <div className="text-sm text-green-700">Done</div>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Read for 60 min</div>
                  <div className="text-sm text-gray-500">Completed: 20/60 min</div>
                </div>
                <div className="text-sm text-gray-700">33%</div>
              </li>
            </ul>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={exportCSV} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Export CSV</button>
              <button onClick={resetData} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg">Reset Data</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Gratitude Garden</h2>
            <GratitudeGarden />
            {/* visual bloom when new gratitude is added */}
            {blooming && (
              <div className="absolute right-6 top-6 pointer-events-none">
                <div className="transform animate-bounce">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" fill="#34D399"/>
                    <path d="M7 8C8.10457 8 9 8.89543 9 10C9 11.1046 8.10457 12 7 12C5.89543 12 5 11.1046 5 10C5 8.89543 5.89543 8 7 8Z" fill="#60A5FA"/>
                    <path d="M17 8C18.1046 8 19 8.89543 19 10C19 11.1046 18.1046 12 17 12C15.8954 12 15 11.1046 15 10C15 8.89543 15.8954 8 17 8Z" fill="#F472B6"/>
                    <circle cx="12" cy="16" r="3" fill="#F97316" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 text-gray-600 text-sm">Tip: Consistent short practices beat inconsistent long sessions. Try to build small daily habits.</div>
      </div>
    </div>
  );
};
