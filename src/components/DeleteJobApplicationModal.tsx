import React from "react";

interface DeleteJobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void; 
  isDeleting?: boolean;
  error?: string;
  jobApplicationTitle?: string;
  jobApplicationId?: number;
}

const DeleteJobApplicationModal: React.FC<DeleteJobApplicationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  jobApplicationTitle,
  isDeleting = false,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Delete Job Application
        </h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete
          {jobApplicationTitle ? (
            <>
              {' '}
              <span className="font-bold">{jobApplicationTitle}</span>
            </>
          ) : (
            ' this job application'
          )}?
          This action cannot be undone.
        </p>
        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteJobApplicationModal;
