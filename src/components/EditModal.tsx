import React, { useState } from 'react';
import type { JobApplication } from '../types';

interface EditModalProps {
  job: JobApplication;
  onSave: (id: number, updates: Omit<JobApplication, 'id' | 'notes'>) => void;
  onCancel: () => void;
}

const inputClasses =
  'w-full px-3 py-2 border border-slate-200 dark:border-neon-violet/20 rounded-lg bg-slate-50 dark:bg-bg-secondary text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-violet dark:focus:ring-neon-cyan focus:border-transparent text-sm placeholder-gray-400 dark:placeholder-slate-500';

const labelClasses = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

const EditModal: React.FC<EditModalProps> = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: job.companyName,
    jobTitle: job.jobTitle,
    dateApplied: job.dateApplied,
    status: job.status,
    details: job.details,
    url: job.url ?? '',
    salary: job.salary ?? '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.jobTitle || !formData.dateApplied) {
      setError('Company name, job title, and date applied are required.');
      return;
    }
    setError('');
    onSave(job.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-bg-card dark:border dark:border-neon-violet/20 rounded-xl shadow-xl dark:shadow-neon-violet/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Edit Application</h2>
          {error && <p className="text-sm text-red-600 dark:text-neon-pink mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-companyName" className={labelClasses}>Company Name *</label>
                <input
                  type="text"
                  id="edit-companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-jobTitle" className={labelClasses}>Job Title *</label>
                <input
                  type="text"
                  id="edit-jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-dateApplied" className={labelClasses}>Date Applied *</label>
                <input
                  type="date"
                  id="edit-dateApplied"
                  name="dateApplied"
                  value={formData.dateApplied}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-status" className={labelClasses}>Status</label>
                <select
                  id="edit-status"
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
                <label htmlFor="edit-salary" className={labelClasses}>Salary / Range</label>
                <input
                  type="text"
                  id="edit-salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="e.g. $80k–$100k"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-url" className={labelClasses}>Job Posting URL</label>
              <input
                type="url"
                id="edit-url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="edit-details" className={labelClasses}>Details</label>
              <textarea
                id="edit-details"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={4}
                className={inputClasses}
                placeholder="Add any additional details about the application..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-neon-violet hover:bg-neon-indigo text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-violet focus:ring-offset-2 dark:focus:ring-offset-bg-card transition-colors duration-200 text-sm font-medium"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-slate-100 dark:bg-bg-secondary text-slate-600 dark:text-slate-300 py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-bg-card transition-colors duration-200 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
