import React, { useState } from 'react';
import type { JobApplication } from './types';

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: number) => void;
  isExpanded: boolean;
  onToggleDetails: (id: number) => void;
  onAddNote: (jobId: number, text: string) => void;
  onDeleteNote: (jobId: number, noteId: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onEdit,
  onDelete,
  isExpanded,
  onToggleDetails,
  onAddNote,
  onDeleteNote
}) => {
  const [noteText, setNoteText] = useState('');

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interview':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Offer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-red-50 text-red-500 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusAccent = (status: JobApplication['status']) => {
    switch (status) {
      case 'Applied':   return 'border-l-blue-400';
      case 'Interview': return 'border-l-amber-400';
      case 'Offer':     return 'border-l-emerald-400';
      case 'Rejected':  return 'border-l-red-400';
      default:          return 'border-l-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNoteTimestamp = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = noteText.trim();
    if (!trimmed) return;
    onAddNote(job.id, trimmed);
    setNoteText('');
  };

  const notes = job.notes ?? [];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${getStatusAccent(job.status)} p-5 hover:shadow-md transition-shadow duration-200 relative`}>
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => onEdit(job)}
          className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
          title="Edit application"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(job.id)}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          title="Delete application"
        >
          🗑️
        </button>
      </div>

      {/* Job Content */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-slate-800 mb-0.5 pr-16">
          {job.companyName}
        </h2>
        <p className="text-slate-500 text-sm">
          {job.jobTitle}
        </p>
      </div>

      <div className="mb-3 space-y-0.5">
        <p className="text-xs text-slate-400">
          Applied {formatDate(job.dateApplied)}
        </p>
        {job.salary && (
          <p className="text-xs text-slate-500 font-medium">
            {job.salary}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(job.status)}`}
        >
          {job.status}
        </span>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-500 hover:text-indigo-700 hover:underline"
          >
            View posting ↗
          </a>
        )}
      </div>

      {/* Details Section */}
      {(job.details || notes.length > 0) && (
        <div className="border-t border-slate-100 pt-3">
          <button
            onClick={() => onToggleDetails(job.id)}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium mb-2"
          >
            {isExpanded ? 'Hide Details' : `View Details${notes.length > 0 ? ` · ${notes.length} note${notes.length !== 1 ? 's' : ''}` : ''}`}
          </button>
          {isExpanded && (
            <div className="space-y-3">
              {job.details && (
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed">
                  {job.details}
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                {notes.length > 0 && (
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Activity</p>
                )}
                {[...notes].reverse().map(note => (
                  <div key={note.id} className="flex gap-2 items-start group">
                    <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                      <p className="text-sm text-slate-700">{note.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatNoteTimestamp(note.timestamp)}</p>
                    </div>
                    <button
                      onClick={() => onDeleteNote(job.id, note.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors duration-150 opacity-0 group-hover:opacity-100 mt-1 text-xs"
                      title="Delete note"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Add Note */}
                <form onSubmit={handleNoteSubmit} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 text-sm px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show note input even when no details, if not expanded */}
      {!job.details && notes.length === 0 && (
        <div className="border-t border-slate-100 pt-3">
          <form onSubmit={handleNoteSubmit} className="flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 text-sm px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!noteText.trim()}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobCard;
