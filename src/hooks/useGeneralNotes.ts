import { useEffect, useState } from 'react';
import type { GeneralNote } from '../types';

const STORAGE_KEY = 'generalNotes';

export const useGeneralNotes = () => {
  const [generalNotes, setGeneralNotes] = useState<GeneralNote[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setGeneralNotes(parsed);
        }
      } catch {
        // corrupted data — start fresh
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(generalNotes));
  }, [generalNotes]);

  const addNote = (text: string) => {
    const note: GeneralNote = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
    };
    setGeneralNotes(prev => [...prev, note]);
  };

  const deleteNote = (id: number) => {
    setGeneralNotes(prev => prev.filter(n => n.id !== id));
  };

  return { generalNotes, addNote, deleteNote };
};
