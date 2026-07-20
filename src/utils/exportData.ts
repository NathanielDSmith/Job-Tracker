import type { GeneralNote, JobApplication } from '../types';

export const exportData = (jobApplications: JobApplication[], generalNotes: GeneralNote[]) => {
  const payload = {
    exportedAt: new Date().toISOString(),
    jobApplications,
    generalNotes,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `job-tracker-export-${dateStamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
