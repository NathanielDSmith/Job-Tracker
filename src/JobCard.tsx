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

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interview':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Offer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 relative">
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
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-1 pr-16">
          {job.companyName}
        </h2>
        <p className="text-gray-600 font-medium">
          {job.jobTitle}
        </p>
      </div>

      <div className="mb-4 space-y-1">
        <p className="text-sm text-gray-500">
          Applied: {formatDate(job.dateApplied)}
        </p>
        {job.salary && (
          <p className="text-sm text-gray-500">
            {job.salary}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}
        >
          {job.status}
        </span>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            View posting ↗
          </a>
        )}
      </div>

      {/* Details Section */}
      {(job.details || notes.length > 0) && (
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => onToggleDetails(job.id)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-2"
          >
            {isExpanded ? 'Hide Details' : `View Details${notes.length > 0 ? ` · ${notes.length} note${notes.length !== 1 ? 's' : ''}` : ''}`}
          </button>
          {isExpanded && (
            <div className="space-y-3">
              {job.details && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {job.details}
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                {notes.length > 0 && (
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Activity</p>
                )}
                {[...notes].reverse().map(note => (
                  <div key={note.id} className="flex gap-2 items-start group">
                    <div className="flex-1 bg-gray-50 rounded-md px-3 py-2">
                      <p className="text-sm text-gray-700">{note.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatNoteTimestamp(note.timestamp)}</p>
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
            </div>
          )}
        </div>
      )}

      {/* Show note input even when no details, if not expanded */}
      {!job.details && notes.length === 0 && (
        <div className="border-t border-gray-100 pt-3">
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
