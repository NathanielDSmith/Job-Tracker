export interface Note {
  id: number;
  text: string;
  timestamp: string;
}

export interface JobApplication {
  id: number;
  companyName: string;
  jobTitle: string;
  dateApplied: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  details: string;
  url?: string;
  salary?: string;
  notes?: Note[];
} 