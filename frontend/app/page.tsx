'use client'
import React from 'react';
import { Mic, Calendar, Clock, Users, ArrowRight, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
function App() {
  const router=useRouter();
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
      
        <>

          <header className="relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80"
                alt="Background"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  AI-Powered Interview Scheduling
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8">
                  Automate your interview process with our voice-driven scheduling assistant
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => router.push('/register')}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 inline-flex"
                  >
                    <span>Let's Begin</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-50 transition-colors border border-indigo-600 flex items-center justify-center space-x-2 inline-flex"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mic className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-gray-600 text-xl font-semibold mb-4">Voice-Driven Interface</h3>
                  <p className="text-gray-400">Natural conversations with AI to collect candidate information effortlessly</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-gray-600 text-xl font-semibold mb-4">Smart Scheduling</h3>
                  <p className="text-gray-400">Automated appointment booking</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl text-gray-600 font-semibold mb-4">Time Optimization</h3>
                  <p className="text-gray-400">Reduce scheduling conflicts and streamline the interview process</p>
                </div>
              </div>
            </div>
          </section>
        </>
      
    </div>
  );
}

export default App;