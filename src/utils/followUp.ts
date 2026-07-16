export type FollowUpStatus = 'overdue' | 'due-today' | 'upcoming' | null;

const todayISO = () => new Date().toISOString().slice(0, 10);

export const getFollowUpStatus = (followUpDate?: string): FollowUpStatus => {
  if (!followUpDate) return null;
  const today = todayISO();
  if (followUpDate < today) return 'overdue';
  if (followUpDate === today) return 'due-today';
  return 'upcoming';
};

export const getDaysOverdue = (followUpDate: string): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const due = new Date(`${followUpDate}T00:00:00`);
  const today = new Date(`${todayISO()}T00:00:00`);
  return Math.round((today.getTime() - due.getTime()) / msPerDay);
};
