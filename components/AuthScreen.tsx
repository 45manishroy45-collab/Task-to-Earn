import React, { useState } from 'react';
import { EyeOpenIcon, EyeClosedIcon } from './icons/Icons';

interface AuthScreenProps {
    onLogin: (email: string, pass: string) => { success: boolean, error?: string };
    onRegister: (name: string, email: string, pass: string) => { success: boolean, error?: string };
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let result;
        if (isLogin) {
            result = onLogin(email, password);
        } else {
            result = onRegister(name, email, password);
        }
        if (result && !result.success) {
            setError(result.error || 'An unknown error occurred.');
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8 animate-fade-in-up">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-400">MicroTask Wallet</h1>
                    <p className="text-gray-400 mt-2">
                        {isLogin ? 'Welcome back! Sign in to continue.' : 'Create an account to start earning.'}
                    </p>
                </div>

                <div className="flex bg-gray-900 rounded-lg p-1">
                    <button onClick={() => { setIsLogin(true); setError(''); }} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${isLogin ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                        Sign In
                    </button>
                    <button onClick={() => { setIsLogin(false); setError(''); }} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${!isLogin ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                        Sign Up
                    </button>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                    )}
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-gray-400 hover:text-white">
                            {showPassword ? <EyeClosedIcon className="w-6 h-6" /> : <EyeOpenIcon className="w-6 h-6" />}
                        </button>
                    </div>
                    
                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
                             <p className="text-red-300 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthScreen;