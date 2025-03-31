import React from 'react';
import { Calendar, Users, CheckCircle } from 'lucide-react';

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  created_at: string;
  description: string;
  requirements: string;
  isApplied?: boolean;
  onClick: () => void;
}

function JobCard({ id, title, company, created_at, isApplied, onClick }: JobCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow relative"
    >
      {isApplied && (
        <div className="absolute top-4 right-4 flex items-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Applied</span>
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{company}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(created_at).toLocaleDateString('en-GB')}</span>
        </div>
      </div>
    </div>
  );
}

export default JobCard;