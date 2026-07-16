import React, { useState } from 'react';
import type { JobApplication } from '../types';

interface CalendarViewProps {
  jobApplications: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_CHIPS_PER_DAY = 3;

const pad = (n: number) => String(n).padStart(2, '0');
const toDateKey = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;
const todayKey = () => {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
};

type ChipEntry = { job: JobApplication; type: 'applied' | 'followUp' };

const CalendarView: React.FC<CalendarViewProps> = ({ jobApplications, onSelectJob }) => {
  const [viewedMonth, setViewedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = viewedMonth.getFullYear();
  const month = viewedMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const today = todayKey();

  const prevMonth = () => setViewedMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewedMonth(new Date(year, month + 1, 1));
  const goToday = () => {
    const now = new Date();
    setViewedMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white dark:bg-bg-card dark:border dark:border-neon-violet/10 border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
          {viewedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200 dark:border-neon-violet/20 text-slate-600 dark:text-slate-300 hover:border-neon-violet dark:hover:border-neon-cyan transition-colors duration-150"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="w-7 h-7 rounded-full border border-slate-200 dark:border-neon-violet/20 text-slate-600 dark:text-slate-300 hover:border-neon-violet dark:hover:border-neon-cyan transition-colors duration-150"
          >
            ‹
          </button>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="w-7 h-7 rounded-full border border-slate-200 dark:border-neon-violet/20 text-slate-600 dark:text-slate-300 hover:border-neon-violet dark:hover:border-neon-cyan transition-colors duration-150"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} className="min-h-[80px] rounded-lg bg-slate-50/50 dark:bg-bg-secondary/30" />;
          }

          const dateKey = toDateKey(year, month, day);
          const isToday = dateKey === today;

          const entries: ChipEntry[] = [
            ...jobApplications.filter(j => j.dateApplied === dateKey).map(job => ({ job, type: 'applied' as const })),
            ...jobApplications.filter(j => j.followUpDate === dateKey).map(job => ({ job, type: 'followUp' as const })),
          ];
          const visibleEntries = entries.slice(0, MAX_CHIPS_PER_DAY);
          const overflowCount = entries.length - visibleEntries.length;

          return (
            <div
              key={dateKey}
              className={`min-h-[80px] rounded-lg border p-1 ${
                isToday
                  ? 'border-neon-violet dark:border-neon-cyan ring-1 ring-neon-violet dark:ring-neon-cyan'
                  : 'border-slate-100 dark:border-neon-violet/10'
              }`}
            >
              <p className={`text-xs px-0.5 mb-0.5 ${isToday ? 'font-semibold text-neon-violet dark:text-neon-cyan' : 'text-slate-500 dark:text-slate-400'}`}>
                {day}
              </p>
              <div className="space-y-0.5">
                {visibleEntries.map(({ job, type }, idx) => (
                  <button
                    key={`${job.id}-${type}-${idx}`}
                    onClick={() => onSelectJob(job)}
                    title={`${job.companyName} · ${job.jobTitle}`}
                    className={`w-full truncate text-left text-[10px] leading-tight px-1 py-0.5 rounded border ${
                      type === 'applied'
                        ? 'bg-violet-50 dark:bg-neon-violet/10 border-violet-200 dark:border-neon-violet/30 text-violet-700 dark:text-neon-violet-light'
                        : 'bg-amber-50 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/30 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {job.companyName}
                  </button>
                ))}
                {overflowCount > 0 && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 px-1">+{overflowCount} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 dark:bg-neon-violet inline-block" /> Applied
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Follow-up
        </span>
      </div>
    </div>
  );
};

export default CalendarView;
