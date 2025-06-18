import React from 'react';
import type { JobApplication } from './types';

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: number) => void;
  isExpanded: boolean;
  onToggleDetails: (id: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onEdit, 
  onDelete, 
  isExpanded, 
  onToggleDetails 
}) => {
  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interview':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Offer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 relative">
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => onEdit(job)}
          className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
          title="Edit application"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(job.id)}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          title="Delete application"
        >
          🗑️
        </button>
      </div>
      
      {/* Job Content */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-1 pr-16">
          {job.companyName}
        </h2>
        <p className="text-gray-600 font-medium">
          {job.jobTitle}
        </p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Applied: {formatDate(job.dateApplied)}
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}
        >
          {job.status}
        </span>
      </div>

      {/* Details Section */}
      {job.details && (
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => onToggleDetails(job.id)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-2"
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
          </button>
          {isExpanded && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {job.details}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard; 