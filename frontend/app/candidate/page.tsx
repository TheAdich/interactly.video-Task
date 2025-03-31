'use client'
import React, { useState, useEffect } from 'react';
import { BriefcaseIcon } from 'lucide-react';

import { useRouter } from 'next/navigation';
import JobCard from './_components/JobCard';
import JobOverlay from './_components/JobOverlay';
import axios from 'axios';

interface Job {
  id: number;
  title: string;
  company: string;
  created_at: string;
  description: string;
  requirements: string;
}



function App() {

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'applied'>('all');
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
      setUser(user);
      if (user.role !== 'candidate') {
        router.push('/admin');
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      const getAllJobs = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/job/getAllJobs/${user.id}`);
          if (res.data) {
            //console.log(res.data);
            setJobs(res.data);
          }
        } catch (err) {
          console.log(err);
        }
      }
      getAllJobs();

      const getAppliedJobs = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/job/appliedJobs/${user.id}`);
          if (res.data) {
            //console.log(res.data);
            setAppliedJobs(res.data.map((job: Job) => job.id));
          }
        } catch (err) {
          console.log(err);
        }

      }
      getAppliedJobs();

    }
  }, [user])

  const handleApply = (jobId: number) => {
    router.push(`/candidate/faq?id=${jobId}`);
  };

  const displayJobs = activeTab === 'all'
    ? jobs
    : jobs.filter(job => appliedJobs.includes(job.id));

  return (
    <div className="min-h-screen bg-gray-50">


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            <BriefcaseIcon className="w-5 h-5" />
            <span>All Jobs</span>
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'applied'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            <span>Applied Jobs ({appliedJobs.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map((job) => (
            <JobCard
              key={job.id}
              {...job}
              isApplied={appliedJobs.includes(job.id)}
              onClick={() => setSelectedJobId(job.id)}
            />
          ))}
        </div>
      </main>

      {selectedJobId && (
        <JobOverlay
          job={jobs.find(job => job.id === selectedJobId)!}
          onClose={() => setSelectedJobId(null)}
          onApply={() => handleApply(selectedJobId)}
          isApplied={appliedJobs.includes(selectedJobId)}
        />
      )}
    </div>
  );
}

export default App;