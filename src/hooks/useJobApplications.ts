import { useEffect, useState } from 'react';
import type { InterviewEvent, JobApplication, Note } from '../types';

const STORAGE_KEY = 'jobApplications';

export const useJobApplications = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const savedJobs = localStorage.getItem(STORAGE_KEY);
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        if (Array.isArray(parsedJobs)) {
          setJobApplications(parsedJobs);
        }
      } catch {
        // corrupted data — start fresh
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobApplications));
  }, [jobApplications]);

  const addJob = (jobData: Omit<JobApplication, 'id'>) => {
    const newJob: JobApplication = {
      id: Date.now(),
      ...jobData,
    };
    setJobApplications(prev => [...prev, newJob]);
  };

  const deleteJob = (id: number) => {
    setJobApplications(prev => prev.filter(job => job.id !== id));
  };

  const editJob = (id: number, updates: Omit<JobApplication, 'id' | 'notes' | 'events'>) => {
    setJobApplications(prev => prev.map(job => (job.id === id ? { ...job, ...updates } : job)));
  };

  const addNote = (jobId: number, text: string) => {
    const note: Note = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
    };
    setJobApplications(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, notes: [...(job.notes ?? []), note] }
        : job
    ));
  };

  const deleteNote = (jobId: number, noteId: number) => {
    setJobApplications(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, notes: (job.notes ?? []).filter(n => n.id !== noteId) }
        : job
    ));
  };

  const addEvent = (jobId: number, event: Omit<InterviewEvent, 'id'>) => {
    const newEvent: InterviewEvent = {
      id: Date.now(),
      ...event,
    };
    setJobApplications(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, events: [...(job.events ?? []), newEvent] }
        : job
    ));
  };

  const deleteEvent = (jobId: number, eventId: number) => {
    setJobApplications(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, events: (job.events ?? []).filter(e => e.id !== eventId) }
        : job
    ));
  };

  return { jobApplications, addJob, deleteJob, editJob, addNote, deleteNote, addEvent, deleteEvent };
};
