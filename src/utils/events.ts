import type { InterviewEvent } from '../types';

const dateTimeKey = (event: InterviewEvent) => `${event.date}T${event.time ?? '00:00'}`;

export const sortEvents = (events: InterviewEvent[]): InterviewEvent[] =>
  [...events].sort((a, b) => dateTimeKey(a).localeCompare(dateTimeKey(b)));

const nowKey = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

export const isPastEvent = (event: InterviewEvent): boolean => dateTimeKey(event) < nowKey();

export const getNextUpcomingEvent = (events?: InterviewEvent[]): InterviewEvent | null => {
  if (!events || events.length === 0) return null;
  const upcoming = sortEvents(events).filter(e => !isPastEvent(e));
  return upcoming[0] ?? null;
};

export const formatEventDateTime = (event: InterviewEvent): string => {
  const date = new Date(`${event.date}T${event.time ?? '00:00'}:00`);
  const datePart = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (!event.time) return datePart;
  const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
};
