export interface JobApplication {
  id: number;
  companyName: string;
  jobTitle: string;
  dateApplied: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  details: string;
} 