import React, { useState } from 'react';
import type { JobApplication } from './types';
import { useJobApplications } from './hooks/useJobApplications';
import { getFollowUpStatus, getDaysOverdue } from './utils/followUp';
import JobForm from './JobForm';
import JobCard from './JobCard';
import EditModal from './components/EditModal';
import CalendarView from './components/CalendarView';

interface JobTrackerProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const JobTracker: React.FC<JobTrackerProps> = ({ theme, toggleTheme }) => {
  const { jobApplications, addJob, deleteJob, editJob, addNote, deleteNote, addEvent, deleteEvent } = useJobApplications();
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobApplication['status'] | 'All'>('All');
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const handleDelete = (id: number) => {
    deleteJob(id);
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleSaveEdit = (id: number, updates: Omit<JobApplication, 'id' | 'notes' | 'events'>) => {
    editJob(id, updates);
    setEditingJob(null);
  };

  const toggleDetails = (id: number) => {
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const statusCounts = {
    All: jobApplications.length,
    Applied: jobApplications.filter(j => j.status === 'Applied').length,
    Interview: jobApplications.filter(j => j.status === 'Interview').length,
    Offer: jobApplications.filter(j => j.status === 'Offer').length,
    Rejected: jobApplications.filter(j => j.status === 'Rejected').length,
  };

  const filteredApplications = jobApplications.filter(job => {
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || job.companyName.toLowerCase().includes(q) || job.jobTitle.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const dueApplications = jobApplications
    .filter(job => {
      const status = getFollowUpStatus(job.followUpDate);
      return status === 'overdue' || status === 'due-today';
    })
    .sort((a, b) => (a.followUpDate ?? '').localeCompare(b.followUpDate ?? ''));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-neon">
            Job Application Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Keep your job search organized in one place</p>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="shrink-0 w-10 h-10 rounded-full border border-slate-200 dark:border-neon-violet/30 bg-white dark:bg-bg-card flex items-center justify-center text-lg hover:border-neon-violet dark:hover:border-neon-cyan transition-colors duration-150"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Follow-up reminders */}
      {dueApplications.length > 0 && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/25 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            {dueApplications.length} application{dueApplications.length !== 1 ? 's' : ''} due for follow-up
          </p>
          <div className="space-y-1.5">
            {dueApplications.map(job => {
              const status = getFollowUpStatus(job.followUpDate);
              const daysOverdue = job.followUpDate ? getDaysOverdue(job.followUpDate) : 0;
              return (
                <button
                  key={job.id}
                  onClick={() => setEditingJob(job)}
                  className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-white dark:bg-bg-card border border-amber-100 dark:border-amber-400/15 hover:border-amber-300 dark:hover:border-amber-400/40 transition-colors duration-150"
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

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Applied', count: statusCounts.Applied, bg: 'bg-violet-50 dark:bg-neon-violet/10', border: 'border-violet-100 dark:border-neon-violet/20', text: 'text-violet-700 dark:text-neon-violet-light' },
          { label: 'Interview', count: statusCounts.Interview, bg: 'bg-amber-50 dark:bg-amber-400/10', border: 'border-amber-100 dark:border-amber-400/20', text: 'text-amber-700 dark:text-amber-400' },
          { label: 'Offer', count: statusCounts.Offer, bg: 'bg-emerald-50 dark:bg-emerald-400/10', border: 'border-emerald-100 dark:border-emerald-400/20', text: 'text-emerald-700 dark:text-emerald-400' },
          { label: 'Rejected', count: statusCounts.Rejected, bg: 'bg-pink-50 dark:bg-neon-pink/10', border: 'border-pink-100 dark:border-neon-pink/20', text: 'text-pink-600 dark:text-neon-pink' },
        ].map(({ label, count, bg, border, text }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl px-4 py-3 text-center`}>
            <p className={`text-2xl font-bold font-mono ${text}`}>{count}</p>
            <p className={`text-xs font-medium ${text} opacity-75`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Add New Job Form */}
      <JobForm onSubmit={addJob} />

      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        {(['list', 'calendar'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 capitalize ${
              view === v
                ? 'bg-neon-violet text-white border-neon-violet'
                : 'bg-slate-50 dark:bg-bg-secondary text-slate-600 dark:text-slate-300 border-slate-200 dark:border-neon-violet/20 hover:border-neon-violet dark:hover:border-neon-cyan hover:text-neon-violet dark:hover:text-neon-cyan'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'calendar' ? (
        <CalendarView jobApplications={jobApplications} onSelectJob={setEditingJob} />
      ) : (
        <>
          {/* Search and Filter */}
          <div className="bg-white dark:bg-bg-card dark:border dark:border-neon-violet/10 border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by company or job title..."
              className="w-full px-4 py-2 border border-gray-200 dark:border-neon-violet/20 rounded-lg bg-slate-50 dark:bg-bg-secondary text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-violet dark:focus:ring-neon-cyan focus:border-transparent text-sm placeholder-gray-400 dark:placeholder-slate-500"
            />
            <div className="flex flex-wrap gap-2">
              {(['All', 'Applied', 'Interview', 'Offer', 'Rejected'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
                    statusFilter === s
                      ? 'bg-neon-violet text-white border-neon-violet'
                      : 'bg-slate-50 dark:bg-bg-secondary text-slate-600 dark:text-slate-300 border-slate-200 dark:border-neon-violet/20 hover:border-neon-violet dark:hover:border-neon-cyan hover:text-neon-violet dark:hover:text-neon-cyan'
                  }`}
                >
                  {s} <span className="opacity-60">({statusCounts[s]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Job Applications List */}
          {filteredApplications.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                {jobApplications.length === 0
                  ? 'No applications yet — add one above to get started.'
                  : 'No applications match your search.'}
              </p>
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={setEditingJob}
                onDelete={handleDelete}
                isExpanded={expandedDetails.has(job.id)}
                onToggleDetails={toggleDetails}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
                onAddEvent={addEvent}
                onDeleteEvent={deleteEvent}
              />
            ))}
          </div>
        </>
      )}

      {editingJob && (
        <EditModal
          job={editingJob}
          onSave={handleSaveEdit}
          onCancel={() => setEditingJob(null)}
        />
      )}
    </div>
  );
};

export default JobTracker;
