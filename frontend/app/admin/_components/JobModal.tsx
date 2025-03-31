'use client'
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateJobModal({ isOpen, onClose }: CreateJobModalProps) {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
      setUser(user);
    }
  }, [])
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    clientId:null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobData.title || !jobData.company || !jobData.description || !jobData.requirements) {
      alert('Please fill all fields');
      return;
    }
    if (user) {
      jobData.clientId = user.id;
    }

    try {

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/job/createJob`, jobData);
    } catch (err) {
      console.log(err);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Job Posting</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={jobData.company}
              onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
              className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <textarea
              value={jobData.requirements}
              onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
              className="w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-32"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Job Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobModal;