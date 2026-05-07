import React, { useState, useEffect } from 'react';
import type { JobApplication, Note } from './types';
import JobForm from './JobForm';
import JobCard from './JobCard';

const STORAGE_KEY = 'jobApplications';

const JobTracker: React.FC = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobApplication['status'] | 'All'>('All');
  const [editFormData, setEditFormData] = useState({
    companyName: '',
    jobTitle: '',
    dateApplied: '',
    status: 'Applied' as JobApplication['status'],
    details: '',
    url: '',
    salary: ''
  });
  const [editError, setEditError] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedJobs = localStorage.getItem(STORAGE_KEY);

    if (savedJobs && savedJobs !== '[]') {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        if (parsedJobs && parsedJobs.length > 0) {
          setJobApplications(parsedJobs);
          return;
        }
      } catch {
        // corrupted data — fall through to defaults
      }
    }

    loadDefaultData();
  }, []);

  // Save data to localStorage whenever jobApplications changes
  useEffect(() => {
    if (jobApplications.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobApplications));
    }
  }, [jobApplications]);

  const loadDefaultData = () => {
    const defaultJobs: JobApplication[] = [
      {
        id: 1,
        companyName: 'TechCorp Solutions',
        jobTitle: 'Senior Frontend Developer',
        dateApplied: '2024-01-15',
        status: 'Interview',
        details: 'Applied through LinkedIn. Had initial phone screening with HR manager Sarah Johnson. Technical interview scheduled for next week with the engineering team. Company focuses on fintech solutions and uses React/TypeScript stack.'
      },
      {
        id: 2,
        companyName: 'StartupXYZ',
        jobTitle: 'Full Stack Engineer',
        dateApplied: '2024-01-10',
        status: 'Applied',
        details: 'Found through AngelList job board. Remote-first company with flexible hours. Tech stack includes Node.js, React, and PostgreSQL. Team of 15 developers, Series A funding.'
      },
      {
        id: 3,
        companyName: 'BigTech Inc.',
        jobTitle: 'React Developer',
        dateApplied: '2024-01-05',
        status: 'Offer',
        details: 'Completed all interview rounds successfully! Received offer letter with competitive salary ($120k base + equity). Benefits include health insurance, 401k matching, and unlimited PTO. Start date: February 1st.'
      },
      {
        id: 4,
        companyName: 'Digital Agency Pro',
        jobTitle: 'Frontend Developer',
        dateApplied: '2024-01-12',
        status: 'Rejected',
        details: 'Applied for agency position. Had technical interview but they were looking for someone with more Vue.js experience. Good feedback received, will keep in touch for future opportunities.'
      },
      {
        id: 5,
        companyName: 'E-commerce Platform',
        jobTitle: 'Senior UI/UX Developer',
        dateApplied: '2024-01-08',
        status: 'Interview',
        details: 'Second round interview completed. Met with design team and product manager. Discussed portfolio and previous e-commerce projects. Final decision expected by end of week.'
      },
      {
        id: 6,
        companyName: 'Healthcare Tech',
        jobTitle: 'React Native Developer',
        dateApplied: '2024-01-03',
        status: 'Applied',
        details: 'Healthcare startup focused on patient management apps. Remote position with occasional office visits. Tech stack: React Native, Firebase, TypeScript. Mission-driven company.'
      }
    ];
    setJobApplications(defaultJobs);
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    loadDefaultData();
  };

  const handleAddJob = (jobData: Omit<JobApplication, 'id'>) => {
    const newJob: JobApplication = {
      id: Date.now(),
      ...jobData
    };
    setJobApplications(prev => [...prev, newJob]);
  };

  const handleDelete = (id: number) => {
    setJobApplications(prev => prev.filter(job => job.id !== id));
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleAddNote = (jobId: number, text: string) => {
    const note: Note = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString()
    };
    setJobApplications(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, notes: [...(job.notes ?? []), note] }
        : job
    ));
  };

  const handleDeleteNote = (jobId: number, noteId: number) => {
    setJobApplications(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, notes: (job.notes ?? []).filter(n => n.id !== noteId) }
        : job
    ));
  };

  const handleEdit = (job: JobApplication) => {
    setEditingId(job.id);
    setEditFormData({
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      dateApplied: job.dateApplied,
      status: job.status,
      details: job.details,
      url: job.url ?? '',
      salary: job.salary ?? ''
    });
  };

  const handleSaveEdit = () => {
    if (!editFormData.companyName || !editFormData.jobTitle || !editFormData.dateApplied) {
      setEditError('Company name, job title, and date applied are required.');
      return;
    }
    setEditError('');

    setJobApplications(prev => prev.map(job => 
      job.id === editingId ? { ...job, ...editFormData } : job
    ));

    setEditingId(null);
    setEditFormData({
      companyName: '',
      jobTitle: '',
      dateApplied: '',
      status: 'Applied',
      details: '',
      url: '',
      salary: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditError('');
    setEditFormData({
      companyName: '',
      jobTitle: '',
      dateApplied: '',
      status: 'Applied',
      details: '',
      url: '',
      salary: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleDetails = (id: number) => {
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const statusCounts = {
    All: jobApplications.length,
    Applied: jobApplications.filter(j => j.status === 'Applied').length,
    Interview: jobApplications.filter(j => j.status === 'Interview').length,
    Offer: jobApplications.filter(j => j.status === 'Offer').length,
    Rejected: jobApplications.filter(j => j.status === 'Rejected').length,
  };

  const filteredApplications = jobApplications.filter(job => {
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || job.companyName.toLowerCase().includes(q) || job.jobTitle.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Job Application Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Keep your job search organized in one place</p>
        </div>
        <button
          onClick={resetToDefaultData}
          className="text-xs bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-gray-500 transition-colors duration-150"
          title="Reset to default data"
        >
          🔄 Reset
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Applied', count: statusCounts.Applied, bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
          { label: 'Interview', count: statusCounts.Interview, bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
          { label: 'Offer', count: statusCounts.Offer, bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
          { label: 'Rejected', count: statusCounts.Rejected, bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-500' },
        ].map(({ label, count, bg, border, text }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl px-4 py-3 text-center`}>
            <p className={`text-2xl font-bold ${text}`}>{count}</p>
            <p className={`text-xs font-medium ${text} opacity-75`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Add New Job Form */}
      <JobForm onSubmit={handleAddJob} />

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by company or job title..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm placeholder-gray-400"
        />
        <div className="flex flex-wrap gap-2">
          {(['All', 'Applied', 'Interview', 'Offer', 'Rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {s} <span className="opacity-60">({statusCounts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Job Applications List */}
      {filteredApplications.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm">No applications match your search.</p>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredApplications.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isExpanded={expandedDetails.has(job.id)}
            onToggleDetails={toggleDetails}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        ))}
      </div>

      {/* Edit Modal Overlay */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Application</h2>
              {editError && (
                <p className="text-sm text-red-600 mb-2">{editError}</p>
              )}
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="edit-companyName"
                      name="companyName"
                      value={editFormData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      id="edit-jobTitle"
                      name="jobTitle"
                      value={editFormData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-dateApplied" className="block text-sm font-medium text-gray-700 mb-1">
                      Date Applied *
                    </label>
                    <input
                      type="date"
                      id="edit-dateApplied"
                      name="dateApplied"
                      value={editFormData.dateApplied}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="edit-status"
                      name="status"
                      value={editFormData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-salary" className="block text-sm font-medium text-gray-700 mb-1">
                      Salary / Range
                    </label>
                    <input
                      type="text"
                      id="edit-salary"
                      name="salary"
                      value={editFormData.salary}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                      placeholder="e.g. $80k–$100k"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Posting URL
                  </label>
                  <input
                    type="url"
                    id="edit-url"
                    name="url"
                    value={editFormData.url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-details" className="block text-sm font-medium text-gray-700 mb-1">
                    Details
                  </label>
                  <textarea
                    id="edit-details"
                    name="details"
                    value={editFormData.details}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                    placeholder="Add any additional details about the application..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 text-sm font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-slate-100 text-slate-600 py-2 px-4 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracker; 