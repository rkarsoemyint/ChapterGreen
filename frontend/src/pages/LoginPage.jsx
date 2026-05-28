import { toast } from 'react-toastify';
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                login(response.data.data); 

                toast.success(`Welcome back, ${response.data.data.name || 'User'}!`);

                setTimeout(() => {
                    navigate('/');
                }, 500);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#2d5a5a]">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Login to manage your books and orders</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </>
                        )}
                    </button>

                    
<div className="mt-6 border-t border-gray-100 pt-4">
  <p className="text-xs font-medium text-gray-400 mb-2 text-center">
    Quick Testing Accounts (Click to auto-fill)
  </p>
  
  <div className="grid grid-cols-2 gap-2">
    
    <button
      type="button"
      onClick={() => {
        setEmail("admin@gmail.com");
        setPassword("admin123");
      }}
      className="flex flex-col items-center justify-center p-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors text-left group"
    >
      <span className="text-xs font-bold text-red-700">Admin Account</span>
      <span className="text-[11px] text-red-600 font-mono mt-0.5">Click to Fill</span>
    </button>

    
    <button
      type="button"
      onClick={() => {
        setEmail("user1@gmail.com");
        setPassword("user123");
      }}
      className="flex flex-col items-center justify-center p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-left group"
    >
      <span className="text-xs font-bold text-blue-700">User Account</span>
      <span className="text-[11px] text-blue-600 font-mono mt-0.5">Click to Fill</span>
    </button>
  </div>
</div>
                </form>

                <p className="text-center mt-6 text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-green-600 font-semibold hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;