import React, { useState, useEffect } from 'react';
import type { JobApplication } from '../types/JobApplicationType';

interface EditJobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobApplication: JobApplication | null;
  onSubmit: (updated: {
    id: string;
    title: string;
    company: string;
    salaryRange?: { high_end: number; low_end: number };
    location?: string;
    links?: string[];
    priority?: number;
    status?: string;
    expiration?: number;
  }) => Promise<void>;
}

const EditJobApplicationModal: React.FC<EditJobApplicationModalProps> = ({
  isOpen,
  onClose,
  jobApplication,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [salaryRange, setSalaryRange] = useState({ high_end: 0, low_end: 0 });
  const [location, setLocation] = useState('');
  const [links, setLinks] = useState<string[]>(['']);
  const [priority, setPriority] = useState(1);
  const [expiration, setExpiration] = useState<number>(0);
  const [status, setStatus] = useState('applied');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (jobApplication) {
      setTitle(jobApplication.title || '');
      setCompany(jobApplication.company || '');
      setSalaryRange(jobApplication.salaryRange || { high_end: 0, low_end: 0 });
      setLocation(jobApplication.location || '');
      setLinks(jobApplication.links && jobApplication.links.length > 0 ? jobApplication.links : ['']);
      setPriority(jobApplication.priority ?? 1);
      setStatus(jobApplication.status ?? 'applied');
      setExpiration((jobApplication as any).expiration ?? 0);
      setError(null);
    }
  }, [jobApplication, isOpen]);

  const addLink = () => {
    setLinks([...links, '']);
  };

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
    } else {
      setLinks(['']);
    }
  };

  const updateLink = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !company.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (!jobApplication) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        id: jobApplication.id,
        title,
        company,
        salaryRange,
        location,
        links,
        priority,
        status,
        expiration,
      });
      setIsSubmitting(false);
      handleClose();
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to update job application. Please try again.');
      // Optionally log error
    }
  };

  if (!isOpen || !jobApplication) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl border-2 border-gray-200 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Edit Job Application</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <form id="edit-job-application-form" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                  required
                  placeholder="e.g. OpenAI"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Low End
                  </label>
                  <input
                    type="number"
                    value={salaryRange.low_end}
                    onChange={e => setSalaryRange({ ...salaryRange, low_end: Number(e.target.value) })}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                    min="0"
                    step="1"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary High End
                  </label>
                  <input
                    type="number"
                    value={salaryRange.high_end}
                    onChange={e => setSalaryRange({ ...salaryRange, high_end: Number(e.target.value) })}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                    min="0"
                    step="1"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                  placeholder="e.g. San Francisco, Remote"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starValue = index + 1;
                    const isFilled = starValue <= priority;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setPriority(starValue)}
                        disabled={isSubmitting}
                        className={`
                          text-2xl transition-all duration-150
                          ${isFilled ? 'text-yellow-500' : 'text-gray-300'}
                          hover:scale-110
                          disabled:opacity-50 disabled:cursor-not-allowed
                          focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 rounded
                        `}
                        aria-label={`Set priority to ${starValue}`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
                {priority > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{priority} out of 5</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offers">Offers</option>
                  <option value="rejected">Rejected</option>
                  <option value="graveyard">Graveyard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration (Days)
                </label>
                <input
                  type="number"
                  value={expiration || ''}
                  onChange={e => setExpiration(Number(e.target.value) || 0)}
                  disabled={isSubmitting}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Links
                </label>
                {links.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={link}
                      onChange={e => updateLink(index, e.target.value)}
                      disabled={isSubmitting}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                      placeholder="https://example.com"
                    />
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        disabled={isSubmitting}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLink}
                  disabled={isSubmitting}
                  className="mt-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                >
                  + Add Another Link
                </button>
              </div>
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJobApplicationModal;
