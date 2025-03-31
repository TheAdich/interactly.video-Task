'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import JobCard from './_components/JobCard';
import CreateJobModal from './_components/JobModal';
import axios from 'axios';

interface Job {
    id: number;
    title: string;
    company: string;
    created_at: string;
    description: string;
    requirements: string;
}

const Admin = () => {
    const currentUrl = useSearchParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

            //console.log(user);
            if (user.role === 'candidate') {
                router.push('/candidate');
            }
            setUser(user);
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
                }
                catch (err) {
                    console.log(err);
                }
            }
                getAllJobs();
            }
        }, [user, currentUrl])

    const handleJobSelect = (jobId: number) => {
        router.push(`/admin/jobs?id=${jobId}`);
    }



    return (
        <div className="min-h-screen bg-gray-50">


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Job Openings</h2>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Job Posting</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            {...job}
                            onClick={() => handleJobSelect(job.id)}
                        />
                    ))}
                </div>

            </main>

            <CreateJobModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}

            />
        </div>
    );
}
export default Admin;