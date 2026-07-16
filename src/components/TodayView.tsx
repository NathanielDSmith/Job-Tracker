import React from 'react';
import type { GeneralNote, JobApplication } from '../types';
import { getFollowUpStatus, getDaysOverdue } from '../utils/followUp';
import { formatEventDateTime } from '../utils/events';

interface TodayViewProps {
  jobApplications: JobApplication[];
  generalNotes: GeneralNote[];
  onSelectJob: (job: JobApplication) => void;
}

const RECENT_NOTES_LIMIT = 5;

const pad = (n: number) => String(n).padStart(2, '0');
const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const formatNoteTimestamp = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const TodayView: React.FC<TodayViewProps> = ({ jobApplications, generalNotes, onSelectJob }) => {
  const today = todayKey();

  const todaysInterviews = jobApplications
    .flatMap(job => (job.events ?? []).filter(e => e.date === today).map(event => ({ job, event })))
    .sort((a, b) => (a.event.time ?? '').localeCompare(b.event.time ?? ''));

  const dueApplications = jobApplications
    .filter(job => {
      const status = getFollowUpStatus(job.followUpDate);
      return status === 'overdue' || status === 'due-today';
    })
    .sort((a, b) => (a.followUpDate ?? '').localeCompare(b.followUpDate ?? ''));

  const recentNotes = [...generalNotes].reverse().slice(0, RECENT_NOTES_LIMIT);

  const isAllCaughtUp = todaysInterviews.length === 0 && dueApplications.length === 0 && recentNotes.length === 0;

  if (isAllCaughtUp) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 dark:text-slate-500 text-sm">
          Nothing due today, no interviews scheduled, no notes yet. You're all caught up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's interviews */}
      {todaysInterviews.length > 0 && (
        <div className="bg-white dark:bg-bg-card dark:border dark:border-neon-cyan/15 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-neon-cyan mb-2">
            Today's interviews
          </p>
          <div className="space-y-1.5">
            {todaysInterviews.map(({ job, event }) => (
              <button
                key={event.id}
                onClick={() => onSelectJob(job)}
                className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-cyan-50/50 dark:bg-neon-cyan/5 border border-cyan-100 dark:border-neon-cyan/15 hover:border-cyan-300 dark:hover:border-neon-cyan/40 transition-colors duration-150"
              >
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="font-medium">{job.companyName}</span>
                  <span className="text-slate-400 dark:text-slate-500"> · {event.type}</span>
                </span>
                <span className="text-xs font-medium text-cyan-700 dark:text-neon-cyan shrink-0 ml-3">
                  {formatEventDateTime(event)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Due follow-ups */}
      {dueApplications.length > 0 && (
        <div className="bg-white dark:bg-bg-card dark:border dark:border-amber-400/15 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            Due for follow-up
          </p>
          <div className="space-y-1.5">
            {dueApplications.map(job => {
              const status = getFollowUpStatus(job.followUpDate);
              const daysOverdue = job.followUpDate ? getDaysOverdue(job.followUpDate) : 0;
              return (
                <button
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-amber-50/50 dark:bg-amber-400/5 border border-amber-100 dark:border-amber-400/15 hover:border-amber-300 dark:hover:border-amber-400/40 transition-colors duration-150"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    <span className="font-medium">{job.companyName}</span>
                    <span className="text-slate-400 dark:text-slate-500"> · {job.jobTitle}</span>
                  </span>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400 shrink-0 ml-3">
                    {status === 'overdue' ? `${daysOverdue}d overdue` : 'Due today'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent notes */}
      {recentNotes.length > 0 && (
        <div className="bg-white dark:bg-bg-card dark:border dark:border-neon-violet/10 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Recent notes
          </p>
          <div className="space-y-2">
            {recentNotes.map(note => (
              <div key={note.id} className="bg-slate-50 dark:bg-bg-secondary rounded-lg px-3 py-2 border border-slate-100 dark:border-neon-violet/10">
                <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{note.text}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatNoteTimestamp(note.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayView;
