'use client'
import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


function Login() {
  const router = useRouter();
 
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.username || !formData.password) {
      return;
    }
    // Handle login logic here
    const res=await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/login`, formData);
      if(res.data){
        const token=res.data.token;
        if(typeof window !== 'undefined'){
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        const role=res.data.user.role;
        router.push(role==='admin'?'/admin':'/candidate');
      }
    //console.log('Login:', formData);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-black">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent text-black rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <LogIn className="w-5 h-5" />
          <span>Sign In</span>
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={()=>router.push('/register')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register now
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;