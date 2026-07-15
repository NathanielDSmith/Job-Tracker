import React, { useState } from 'react';
import type { JobApplication } from './types';

interface JobFormProps {
  onSubmit: (job: Omit<JobApplication, 'id'>) => void;
}

const inputClasses =
  'w-full px-3 py-2 border border-gray-200 dark:border-neon-violet/20 rounded-lg bg-slate-50 dark:bg-bg-secondary text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-violet dark:focus:ring-neon-cyan focus:border-transparent text-sm placeholder-gray-400 dark:placeholder-slate-500';

const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1';

const JobForm: React.FC<JobFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    dateApplied: '',
    status: 'Applied' as JobApplication['status'],
    details: '',
    url: '',
    salary: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.jobTitle || !formData.dateApplied) {
      setError('Company name, job title, and date applied are required.');
      return;
    }

    setError('');
    onSubmit(formData);
    setFormData({
      companyName: '',
      jobTitle: '',
      dateApplied: '',
      status: 'Applied',
      details: '',
      url: '',
      salary: ''
    });
  };

  return (
    <div className="bg-white dark:bg-bg-card dark:border dark:border-neon-violet/10 rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-4">Add New Application</h2>
      {error && (
        <p className="text-sm text-red-600 dark:text-neon-pink mb-2">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="companyName" className={labelClasses}>
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <label htmlFor="jobTitle" className={labelClasses}>
              Job Title *
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="Enter job title"
              required
            />
          </div>

          <div>
            <label htmlFor="dateApplied" className={labelClasses}>
              Date Applied *
            </label>
            <input
              type="date"
              id="dateApplied"
              name="dateApplied"
              value={formData.dateApplied}
              onChange={handleInputChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="status" className={labelClasses}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={inputClasses}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label htmlFor="salary" className={labelClasses}>
              Salary / Range
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g. $80k–$100k"
            />
          </div>

          <div>
            <label htmlFor="url" className={labelClasses}>
              Job Posting URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="details" className={labelClasses}>
            Details
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            rows={3}
            className={inputClasses}
            placeholder="Add any additional details about the application..."
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-neon-violet hover:bg-neon-indigo text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-violet focus:ring-offset-2 dark:focus:ring-offset-bg-card transition-colors duration-200 text-sm font-medium"
          >
            Add Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
