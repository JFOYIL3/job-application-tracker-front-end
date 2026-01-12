import React from "react";
import type { JobApplication as JobApplicationType } from '../../types/JobApplicationType'

interface JobApplicationCardProps {
  jobApplication: JobApplicationType;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setJobApplicationToDelete: (jobApplication: JobApplicationType) => void;
  setJobApplicationToEdit: (jobApplication: JobApplicationType) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
}

interface SalaryRange {
  low_end?: number;
  high_end?: number;
  lowEnd?: number;
  highEnd?: number;
}

const JobApplicationCard: React.FC<JobApplicationCardProps> = ({ jobApplication, setIsDeleteModalOpen, setJobApplicationToDelete, setJobApplicationToEdit, setIsEditModalOpen }) => {
  // Handle both camelCase and snake_case from API
  const jobApp = jobApplication as JobApplicationType & { salary_range?: SalaryRange };
  const salaryRange: SalaryRange | undefined = jobApplication.salaryRange || jobApp.salary_range;
  
  // Debug: log the job application data to see structure
  console.log('Job Application Data:', jobApplication);
  console.log('Salary Range:', salaryRange);
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'offers':
        return 'bg-green-100 text-green-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'graveyard':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Applied';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("handle delete");
    setJobApplicationToDelete(jobApplication);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("handle edit");
    setJobApplicationToEdit(jobApplication);
    setIsEditModalOpen(true);
  };

  // Get priority value (clamped between 0 and 5)
  const priority = jobApplication.priority ?? 0;
  const maxPriority = 5;
  const priorityValue = Math.min(Math.max(priority, 0), maxPriority);

  // Handle both camelCase and snake_case for links
  const jobAppWithLinks = jobApplication as JobApplicationType & { links?: string[] };
  const links = jobApplication.links || jobAppWithLinks.links || [];
  const validLinks = links.filter(link => link && link.trim() !== '');

  // Format createdAt timestamp
  const formatCreatedAt = (createdAt?: string | Date) => {
    if (!createdAt) return null;
    const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    if (isNaN(date.getTime())) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  return (
    <div className="relative group border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* CreatedAt timestamp at top right */}
      {jobApplication.createdAt && (
        <div className="absolute top-2 right-2 text-xs text-gray-400 z-10">
          {formatCreatedAt(jobApplication.createdAt)}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{jobApplication.title}</h3>
      <p className="text-gray-600 font-medium mb-2">{jobApplication.company}</p>
      {jobApplication.location && (
        <p className="text-gray-500 text-sm mb-1">📍 {jobApplication.location}</p>
      )}
      {salaryRange && (() => {
        const low = salaryRange.low_end || salaryRange.lowEnd || 0;
        const high = salaryRange.high_end || salaryRange.highEnd || 0;
        const hasValidRange = low > 0 || high > 0;
        
        if (!hasValidRange) return null;
        
        let rangeText = '';
        if (low > 0 && high > 0) {
          rangeText = `$${low.toLocaleString()} - $${high.toLocaleString()}`;
        } else if (high > 0) {
          rangeText = `Up to $${high.toLocaleString()}`;
        } else if (low > 0) {
          rangeText = `From $${low.toLocaleString()}`;
        }
        
        return (
          <p className="text-gray-500 text-sm mb-2">
            💰 {rangeText}
          </p>
        );
      })()}
      {validLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {validLinks.map((link, index) => {
            const displayUrl = link.length > 40 ? `${link.substring(0, 40)}...` : link;
            return (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
              >
                🔗 {displayUrl}
              </a>
            );
          })}
        </div>
      )}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(jobApplication.status)}`}>
            {formatStatus(jobApplication.status)}
          </span>
          {priorityValue > 0 && (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: maxPriority }).map((_, index) => (
                <span
                  key={index}
                  className={`text-sm ${
                    index < priorityValue
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Edit and Delete buttons at bottom right */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditClick}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            aria-label="Edit application"
          >
            Edit
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={handleDeleteClick}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            aria-label="Delete application"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationCard;
