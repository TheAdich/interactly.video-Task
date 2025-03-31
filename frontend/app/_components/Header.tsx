'use client'
import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
function Header() {
    const currentUrl = useSearchParams();
    const [token, setToken] = React.useState<any>(null);
    const router = useRouter();
    const handleSignOut = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/')
        }
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token') ? localStorage.getItem('token')! : null;
            setToken(token);
        }
    }, [currentUrl])

    return (
        <header className="bg-white shadow-sm  border-solid border-b border-t-0 border-l-0 border-r-0 border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-indigo-600">Interview Scheduler</h1>
                {token &&
                    <button
                        onClick={() => {/* Handle sign out */ }}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span onClick={handleSignOut}>Sign Out</span>
                    </button>
                }
            </div>
        </header>
    );
}

export default Header;