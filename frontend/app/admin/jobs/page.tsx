'use client'
import React, { useEffect } from 'react';
import { Calendar, Users } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from "lucide-react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
interface Candidate {
    username: string,
    email: string,
    phoneno: string,
    current_ctc: string,
    expected_ctc: string,
    notice_period: string,
    created_at: string
}

interface Job {
    id: number;
    title: string;
    company: string;
    created_at: string;
    description: string;
    requirements: string;
    candidates?: Candidate[];
}

function JobDetails() {
    const router = useRouter();
    const [job, setJob] = React.useState<Job>();
    const [candidates, setCandidates] = React.useState<Candidate[]>([]);
    const searchParams = useSearchParams();
    const jobId = searchParams.get('id');
    useEffect(() => {
        if (!jobId) return;
        const getJobById = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/job/getById?id=${jobId}`);
                if (res.data) {
                    setJob(res.data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        getJobById();
        const getCandidates = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/job/getAllCandidate?id=${jobId}`);
                if (res.data) {
                    setCandidates(res.data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        getCandidates();
    }, [jobId])
    return (

        <div className="bg-gray-50 shadow-md p-8 w-full min-h-dvh">

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{job?.title}</h2>
                <div className="flex items-center space-x-4 text-gray-600">
                    <span>{job?.company}</span>
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Posted on {job && new Date(job?.created_at).toLocaleDateString('en-GB')}</span>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="flex ml-auto items-center gap-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>

            </div>

            <div className="mb-8 bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{job?.description}</p>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-line">{job?.requirements}</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Candidates</h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-5 h-5" />
                        <span>{candidates.length} applicants</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {candidates.map((candidate) => (
                        <div key={candidate.username} className="bg-white shadow-md rounded-lg p-4 flex flex-col space-y-2">
                            <h4 className="text-lg font-semibold text-gray-900">{candidate.username}</h4>
                            <p className="text-gray-700">Email: {candidate.email}</p>
                            <p className="text-gray-700">Phone: {candidate.phoneno}</p>
                            <p className="text-gray-700">Current CTC: {candidate.current_ctc}</p>
                            <p className="text-gray-700">Expected CTC: {candidate.expected_ctc}</p>
                            <p className="text-gray-700">Notice Period: {candidate.notice_period}</p>
                            <p className="text-gray-500 text-sm">Interview on {new Date(candidate.created_at).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default JobDetails;