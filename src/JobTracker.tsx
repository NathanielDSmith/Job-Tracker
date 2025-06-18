import React, { useState, useEffect } from 'react';
import type { JobApplication } from './types';
import JobForm from './JobForm';
import JobCard from './JobCard';

const STORAGE_KEY = 'jobApplications';

const JobTracker: React.FC = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Set<number>>(new Set());
  const [editFormData, setEditFormData] = useState({
    companyName: '',
    jobTitle: '',
    dateApplied: '',
    status: 'Applied' as JobApplication['status'],
    details: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedJobs = localStorage.getItem(STORAGE_KEY);
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        setJobApplications(parsedJobs);
      } catch (error) {
        console.error('Error loading jobs from localStorage:', error);
        // If there's an error parsing, load default data
        loadDefaultData();
      }
    } else {
      // If no saved data, load default sample data
      loadDefaultData();
    }
  }, []);

  // Save data to localStorage whenever jobApplications changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobApplications));
  }, [jobApplications]);

  const loadDefaultData = () => {
    const defaultJobs: JobApplication[] = [
      {
        id: 1,
        companyName: 'TechCorp Inc.',
        jobTitle: 'Senior Frontend Developer',
        dateApplied: '2024-01-15',
        status: 'Interview',
        details: 'Applied through LinkedIn. Had initial phone screening with HR. Technical interview scheduled for next week.'
      },
      {
        id: 2,
        companyName: 'StartupXYZ',
        jobTitle: 'Full Stack Engineer',
        dateApplied: '2024-01-10',
        status: 'Applied',
        details: 'Found through job board. Company focuses on fintech solutions. Remote position available.'
      },
      {
        id: 3,
        companyName: 'BigTech Solutions',
        jobTitle: 'React Developer',
        dateApplied: '2024-01-05',
        status: 'Offer',
        details: 'Completed all interview rounds. Received offer letter with competitive salary and benefits package.'
      }
    ];
    setJobApplications(defaultJobs);
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

  const handleEdit = (job: JobApplication) => {
    setEditingId(job.id);
    setEditFormData({
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      dateApplied: job.dateApplied,
      status: job.status,
      details: job.details
    });
  };

  const handleSaveEdit = () => {
    if (!editFormData.companyName || !editFormData.jobTitle || !editFormData.dateApplied) {
      alert('Please fill in all required fields');
      return;
    }

    setJobApplications(prev => prev.map(job => 
      job.id === editingId ? { ...job, ...editFormData } : job
    ));

    setEditingId(null);
    setEditFormData({
      companyName: '',
      jobTitle: '',
      dateApplied: '',
      status: 'Applied',
      details: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      companyName: '',
      jobTitle: '',
      dateApplied: '',
      status: 'Applied',
      details: ''
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Job Application Tracker
      </h1>
      
      {/* Add New Job Form */}
      <JobForm onSubmit={handleAddJob} />
      
      {/* Job Applications List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobApplications.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isExpanded={expandedDetails.has(job.id)}
            onToggleDetails={toggleDetails}
          />
        ))}
      </div>

      {/* Edit Modal Overlay */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Application</h2>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any additional details about the application..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
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