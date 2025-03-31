import React from 'react';
import { X, Calendar, Users } from 'lucide-react';

interface JobOverlayProps {
  job: {
    id: number;
  title: string;
  company: string;
  created_at: string;
  description: string;
  requirements: string;
  };
  onClose: () => void;
  onApply: () => void;
  isApplied: boolean;
}

function JobOverlay({ job, onClose, onApply, isApplied }: JobOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>{job.company}</span>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Posted on {new Date(job?.created_at).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Close
            </button>
            <button
              onClick={onApply}
              disabled={isApplied}
              className={`px-6 py-2 rounded-md ${
                isApplied
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobOverlay;