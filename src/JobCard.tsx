import React, { useState } from 'react';
import type { InterviewEvent, JobApplication } from './types';
import { getFollowUpStatus } from './utils/followUp';
import { sortEvents, isPastEvent, getNextUpcomingEvent, formatEventDateTime } from './utils/events';

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: number) => void;
  isExpanded: boolean;
  onToggleDetails: (id: number) => void;
  onAddNote: (jobId: number, text: string) => void;
  onDeleteNote: (jobId: number, noteId: number) => void;
  onAddEvent: (jobId: number, event: Omit<InterviewEvent, 'id'>) => void;
  onDeleteEvent: (jobId: number, eventId: number) => void;
}

const EVENT_TYPES: InterviewEvent['type'][] = ['Phone Screen', 'Technical', 'Onsite', 'Final', 'Other'];

const JobCard: React.FC<JobCardProps> = ({
  job,
  onEdit,
  onDelete,
  isExpanded,
  onToggleDetails,
  onAddNote,
  onDeleteNote,
  onAddEvent,
  onDeleteEvent
}) => {
  const [noteText, setNoteText] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventType, setEventType] = useState<InterviewEvent['type']>('Phone Screen');
  const [eventLocation, setEventLocation] = useState('');

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'Applied':
        return 'bg-violet-50 dark:bg-neon-violet/10 text-violet-700 dark:text-neon-violet-light border-violet-200 dark:border-neon-violet/30';
      case 'Interview':
        return 'bg-amber-50 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-400/30';
      case 'Offer':
        return 'bg-emerald-50 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/30';
      case 'Rejected':
        return 'bg-pink-50 dark:bg-neon-pink/10 text-pink-600 dark:text-neon-pink border-pink-200 dark:border-neon-pink/30';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusAccent = (status: JobApplication['status']) => {
    switch (status) {
      case 'Applied':   return 'border-l-violet-400 dark:border-l-neon-violet';
      case 'Interview': return 'border-l-amber-400';
      case 'Offer':     return 'border-l-emerald-400';
      case 'Rejected':  return 'border-l-pink-400 dark:border-l-neon-pink';
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

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) return;
    onAddEvent(job.id, {
      date: eventDate,
      time: eventTime || undefined,
      type: eventType,
      location: eventLocation || undefined,
    });
    setEventDate('');
    setEventTime('');
    setEventType('Phone Screen');
    setEventLocation('');
  };

  const notes = job.notes ?? [];
  const events = job.events ?? [];
  const followUpStatus = getFollowUpStatus(job.followUpDate);
  const nextEvent = getNextUpcomingEvent(events);
  const detailsPartsCount = [
    notes.length > 0 ? `${notes.length} note${notes.length !== 1 ? 's' : ''}` : null,
    events.length > 0 ? `${events.length} interview${events.length !== 1 ? 's' : ''}` : null,
  ].filter(Boolean);

  return (
    <div className={`bg-white dark:bg-bg-card dark:backdrop-blur border border-gray-200 dark:border-neon-violet/15 border-l-4 ${getStatusAccent(job.status)} rounded-xl p-5 shadow-sm hover:shadow-md dark:hover:border-neon-cyan/30 transition-shadow duration-200 relative`}>
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => onEdit(job)}
          className="text-gray-400 dark:text-slate-500 hover:text-neon-violet dark:hover:text-neon-cyan transition-colors duration-200"
          title="Edit application"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(job.id)}
          className="text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-neon-pink transition-colors duration-200"
          title="Delete application"
        >
          🗑️
        </button>
      </div>

      {/* Job Content */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-0.5 pr-16">
          {job.companyName}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {job.jobTitle}
        </p>
      </div>

      <div className="mb-3 space-y-0.5">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Applied {formatDate(job.dateApplied)}
        </p>
        {job.salary && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
            {job.salary}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center mb-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(job.status)}`}
        >
          {job.status}
        </span>
        {(followUpStatus === 'overdue' || followUpStatus === 'due-today') && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-50 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-400/30">
            ⏰ {followUpStatus === 'overdue' ? 'Follow up overdue' : 'Follow up due today'}
          </span>
        )}
        {nextEvent && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-cyan-50 dark:bg-neon-cyan/10 text-cyan-700 dark:text-neon-cyan border-cyan-200 dark:border-neon-cyan/30">
            📅 {nextEvent.type} · {formatEventDateTime(nextEvent)}
          </span>
        )}
        <span className="flex-1" />
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neon-violet dark:text-neon-cyan hover:underline"
          >
            View posting ↗
          </a>
        )}
      </div>

      {/* Details Section */}
      <div className="border-t border-slate-100 dark:border-neon-violet/10 pt-3">
        <button
          onClick={() => onToggleDetails(job.id)}
          className="text-xs text-neon-violet dark:text-neon-cyan hover:underline font-medium mb-2"
        >
          {isExpanded ? 'Hide Details' : `View Details${detailsPartsCount.length > 0 ? ` · ${detailsPartsCount.join(' · ')}` : ''}`}
        </button>
        {isExpanded && (
            <div className="space-y-4">
              {job.details && (
                <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-bg-secondary p-3 rounded-lg leading-relaxed">
                  {job.details}
                </div>
              )}

              {/* Interviews */}
              <div className="space-y-2">
                {events.length > 0 && (
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Interviews</p>
                )}
                {sortEvents(events).map(event => (
                  <div key={event.id} className={`flex gap-2 items-start group ${isPastEvent(event) ? 'opacity-50' : ''}`}>
                    <div className="flex-1 bg-slate-50 dark:bg-bg-secondary rounded-lg px-3 py-2 border border-slate-100 dark:border-neon-violet/10">
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        {event.type}
                        {event.location ? ` · ${event.location}` : ''}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatEventDateTime(event)}</p>
                    </div>
                    <button
                      onClick={() => onDeleteEvent(job.id, event.id)}
                      className="text-gray-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-neon-pink transition-colors duration-150 opacity-0 group-hover:opacity-100 mt-1 text-xs"
                      title="Delete interview"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <form onSubmit={handleEventSubmit} className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="text-sm px-2 py-1.5 border border-slate-200 dark:border-neon-violet/20 rounded-lg bg-slate-50 dark:bg-bg-secondary text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-violet dark:focus:ring-neon-cyan"
                    required
                  />
                  <input
                    type="time"
                    value={eventTime}
                    onChange={e => setEventTime(e.target.value)}
                    className="text-sm px-2 py-1.5 border border-slate-200 dark:border-neon-violet/20 rounded-lg bg-slate-50 dark:bg-bg-secondary text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-violet dark:focus:ring-neon-cyan"
                  />
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value as InterviewEvent['type'])}
                    className="text-sm px-2 py-1.5 border border-slate-200 dark:border-neon-violet/20 rounded-lg bg-slate-50 dark:bg-bg-secondary text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-violet dark:focus:ring-neon-cyan"
                  >
                    {EVENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={e => setEventLocation(e.target.value)}
                    placeholder="Location / link (optional)"
                    className="text-sm px-2 py-1.5 border border-slate-200 dark:border-neon-violet/20 rounded-lg bg-slate-50 dark:bg-bg-secondary text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-violet dark:focus:ring-neon-cyan placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={!eventDate}
                    className="col-span-2 text-sm px-3 py-1.5 bg-neon-violet hover:bg-neon-indigo text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Add Interview
                  </button>
                </form>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                {notes.length > 0 && (
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Activity</p>
                )}
                {[...notes].reverse().map(note => (
                  <div key={note.id} className="flex gap-2 items-start group">
                    <div className="flex-1 bg-slate-50 dark:bg-bg-secondary rounded-lg px-3 py-2 border border-slate-100 dark:border-neon-violet/10">
                      <p className="text-sm text-slate-700 dark:text-slate-200">{note.text}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatNoteTimestamp(note.timestamp)}</p>
                    </div>
                    <button
                      onClick={() => onDeleteNote(job.id, note.id)}
                      className="text-gray-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-neon-pink transition-colors duration-150 opacity-0 group-hover:opacity-100 mt-1 text-xs"
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
                    className="flex-1 text-sm px-3 py-1.5 border border-slate-200 dark:border-neon-violet/20 rounded-lg bg-slate-50 dark:bg-bg-secondary text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-violet dark:focus:ring-neon-cyan focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="text-sm px-3 py-1.5 bg-neon-violet hover:bg-neon-indigo text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default JobCard;
