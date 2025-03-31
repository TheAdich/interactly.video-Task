import React from 'react';
import { Calendar, Users } from 'lucide-react';

interface JobCardProps {
    id: number;
    title: string;
    company: string;
    created_at: string;
    description: string;
    requirements: string;
  onClick: () => void;
}

function JobCard({ id, title, company, created_at, onClick }: JobCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{company}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Date Posted: {new Date(created_at).toLocaleDateString('en-GB')}</span>
        </div>
        
      </div>
    </div>
  );
}

export default JobCard;