'use client'
import { useSpeechSynthesis } from 'react-speech-kit';
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

type Question = {
    id: number;
    text: string;
    type: 'affirmation' | 'notice_period' | 'current_ctc' | 'date' | 'expected_ctc';
};

type ExtractedData = {
    value?: number | string | boolean | Date;
    unit?: string;
    valid?: boolean;
};

type Answer = {
    question: Question;
    answer: string;
    extracted?: ExtractedData;
};

const questions: Question[] = [
    { id: 1, text: "Are you interested in this role?", type: "affirmation" },
    { id: 2, text: "What is your current notice period?", type: "notice_period" },
    { id: 3, text: "Can you share your current CTC?", type: "current_ctc" },
    { id: 4, text: "Can you share your expected CTC?", type: "expected_ctc" },
    { id: 5, text: "When are you available for an interview next week?", type: "date" }
];

function App() {
    const [user, setUser] = useState<any>(null);
    const searchParams = useSearchParams();
    const jobId = searchParams.get('id');
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [partialTranscript, setPartialTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
    const recognitionRef = useRef<any | null>(null);
    const { speak, voices, speaking } = useSpeechSynthesis();
    const [formData, setFormData] = useState<Record<string, any>>({});





    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            setTranscript(finalTranscript);
            setPartialTranscript(interimTranscript);
        };

        recognition.onerror = (event: any) => {
            setError(`Error occurred in recognition: ${event.error}`);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        if (typeof window !== undefined) {
            const user = localStorage.getItem('user');
            if (user) {
                setUser(JSON.parse(user || ''));
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };

        
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            setError('Speech recognition is not supported.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setError(null);
            setPartialTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleVoiceSubmit = async () => {
        //console.log(currentQuestionId);
        if (!transcript) return;
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/faq/answer`, {
                questionId: currentQuestionId,
                answer: transcript,
            })
            if (res.data.extracted) {
                if (res.data.extracted.valid) {
                    setFormData((prev) => ({
                        ...prev,
                        [currentQuestion?.type || 'unknown']: res.data.extracted.value + (res.data.extracted?.unit || ''),
                    }));
                    setCurrentQuestionId(currentQuestionId + 1);
                    setTranscript('');
                    setPartialTranscript('');

                } else {
                    if (currentQuestionId === 1) {
                        setCurrentQuestionId(questions.length + 1);
                    }
                    else if (currentQuestionId === 5) {
                        askQuestion('We have an another interview schedule at this time. Atleast One hour gap is required for the next interview.');
                    }
                    else {
                        askQuestion("Please answer the question correctly.");
                    }
                }
            }
            else {
                askQuestion("Please answer the question correctly.");
            }
        } catch (err) {
            askQuestion('Could not Process the response try again!')
            console.log(err);
        }
        //console.log('Submitted:', transcript);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Speech Recognition</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const askQuestion = (text: string) => {
        //console.log('Asking question:', text);
        speak({
            text,

        });
    };

    const createAppointment = async () => {
        //console.log(formData);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/appointment/create`, {
                jobId,
                username: user?.username,
                affirmation: formData.affirmation,
                notice_period: formData.notice_period,
                current_ctc: formData.current_ctc,
                expected_ctc: formData.expected_ctc,
                date: formData.date
            })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!voices.length) return;
        //console.log('Current Question ID:', currentQuestionId);
        if (currentQuestionId > 1 && currentQuestionId <= questions.length) {
            const question = questions.find(q => q.id === currentQuestionId);
            if (question) {
                askQuestion(question.text);
            }
        }

        else if (currentQuestionId > questions.length) {

            askQuestion('Thank you for your responses! have a nice day!');
            createAppointment();
            setTimeout(() => {
                router.push('/candidate');
            }, 4000);
        }
    }, [currentQuestionId, voices])



    const currentQuestion = questions.find(q => q.id === currentQuestionId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl p-8">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {currentQuestion ? currentQuestion.text : "Thank you for your responses!"}
                        </h1>
                        <div className="h-1 w-20 bg-indigo-500 rounded"></div>
                    </div>

                    {currentQuestion && (
                        <div className="mb-4">
                            <p className="text-gray-600 text-sm">Question {currentQuestionId} of {questions.length}</p>
                        </div>
                    )}
                    {currentQuestion &&
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">

                                    <button
                                        onClick={toggleListening}
                                        disabled={speaking}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${isListening
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                            }`}
                                    >
                                        {isListening ? (
                                            <>
                                                <MicOff size={20} /> Stop Listening
                                            </>
                                        ) : (
                                            <>
                                                <Mic size={20} /> Start Speaking
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-700 min-h-[50px] p-4 bg-white rounded-lg border border-gray-200">
                                        {transcript || "Your final answer will appear here..."}
                                    </p>
                                    {partialTranscript && (
                                        <p className="text-gray-500 text-sm min-h-[50px] p-4 bg-white rounded-lg border border-gray-200">
                                            {partialTranscript}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleVoiceSubmit}
                                disabled={!transcript}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${transcript
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Send size={20} />
                                Submit Text
                            </button>

                            {transcript && (
                                <button
                                    onClick={() => {
                                        setTranscript('');
                                        setPartialTranscript('');
                                    }}
                                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Clear Text
                                </button>
                            )}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;