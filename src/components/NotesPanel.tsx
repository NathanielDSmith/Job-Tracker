import React, { useState } from 'react';
import type { GeneralNote } from '../types';

interface NotesPanelProps {
  notes: GeneralNote[];
  onAddNote: (text: string) => void;
  onDeleteNote: (id: number) => void;
}

const formatTimestamp = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const NotesPanel: React.FC<NotesPanelProps> = ({ notes, onAddNote, onDeleteNote }) => {
  const [noteText, setNoteText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = noteText.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setNoteText('');
  };

  const sorted = [...notes].reverse();

  return (
    <div className="bg-white dark:bg-bg-card dark:border dark:border-neon-violet/10 border border-gray-200 rounded-xl p-4 mb-6">
      <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-4">General Notes</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Add a note (recruiter contacts, prep, anything)..."
          className="flex-1 text-sm px-3 py-2 border border-slate-200 dark:border-neon-violet/20 rounded-lg bg-slate-50 dark:bg-bg-secondary text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-violet dark:focus:ring-neon-cyan focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={!noteText.trim()}
          className="text-sm px-4 py-2 bg-neon-violet hover:bg-neon-indigo text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Add
        </button>
      </form>

      {sorted.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-8">
          No notes yet — add one above.
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map(note => (
            <div key={note.id} className="flex gap-2 items-start group">
              <div className="flex-1 bg-slate-50 dark:bg-bg-secondary rounded-lg px-3 py-2 border border-slate-100 dark:border-neon-violet/10">
                <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{note.text}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatTimestamp(note.timestamp)}</p>
              </div>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="text-gray-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-neon-pink transition-colors duration-150 opacity-0 group-hover:opacity-100 mt-1 text-xs"
                title="Delete note"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPanel;
