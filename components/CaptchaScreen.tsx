import React, { useState, useEffect, useCallback } from 'react';
import { Screen } from '../types';

interface CaptchaScreenProps {
    handleTaskCompletion: (amount: number) => void;
    taskInfo: { count: number; limitTimestamp: number | null };
    setActiveScreen: (screen: Screen) => void;
}

const TASK_COOLDOWN_HOURS = 24;

const CaptchaScreen: React.FC<CaptchaScreenProps> = ({ handleTaskCompletion, taskInfo, setActiveScreen }) => {
    const [captcha, setCaptcha] = useState('');
    const [input, setInput] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [timeRemaining, setTimeRemaining] = useState('');

    const hasReachedLimit = taskInfo.limitTimestamp !== null;

    useEffect(() => {
        // Fix: Changed NodeJS.Timeout to number for browser compatibility.
        let interval: number | undefined;
        if (hasReachedLimit) {
            const updateRemainingTime = () => {
                const now = Date.now();
                const endTime = taskInfo.limitTimestamp! + TASK_COOLDOWN_HOURS * 60 * 60 * 1000;
                const remaining = endTime - now;

                if (remaining <= 0) {
                    setTimeRemaining('0h 0m');
                    // In a real app, you might want to refresh the state from the parent here.
                    // For now, the user can navigate back and forth to reset.
                    clearInterval(interval);
                    return;
                }
                const hours = Math.floor(remaining / (1000 * 60 * 60));
                const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(`${hours}h ${minutes}m`);
            };
            updateRemainingTime();
            interval = setInterval(updateRemainingTime, 60000); // Update every minute
        }
        return () => clearInterval(interval);
    }, [taskInfo.limitTimestamp, hasReachedLimit]);

    const generateCaptcha = useCallback(() => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let str = "";
        for (let i = 0; i < 5; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        setCaptcha(str);
    }, []);

    useEffect(() => {
        if (!hasReachedLimit) {
            generateCaptcha();
        }
    }, [generateCaptcha, hasReachedLimit]);

    const handleSubmit = () => {
        if (input.trim().toUpperCase() === captcha) {
            handleTaskCompletion(10);
            setMessage({ text: '✅ Correct! ₹10 added to your wallet.', type: 'success' });
        } else {
            setMessage({ text: '❌ Wrong captcha! Please try again.', type: 'error' });
        }
        setInput('');
        generateCaptcha();
    };

    if (hasReachedLimit) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-4">
                 <div className="flex w-full justify-start absolute top-4 left-4">
                    <button onClick={() => setActiveScreen(Screen.Home)} className="text-gray-300 hover:text-white p-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-yellow-300">Daily Limit Reached</h1>
                <p className="mb-8 text-gray-400">You've completed your tasks for the day. Please come back later.</p>
                <div className="bg-gray-700 p-6 rounded-lg">
                    <p className="text-lg text-gray-300">Next tasks available in:</p>
                    <p className="text-4xl font-bold text-white mt-2">{timeRemaining}</p>
                </div>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col items-center h-full text-center p-4 relative">
             <div className="flex w-full justify-start absolute top-0 left-0">
                <button onClick={() => setActiveScreen(Screen.Home)} className="text-gray-300 hover:text-white p-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-blue-300 mt-8">Solve Captcha</h1>
            <p className="mb-8 text-gray-400">Type the characters you see below to earn money.</p>
            
            <div className="bg-gray-900 p-4 rounded-lg mb-6 w-full max-w-xs">
                <div className="select-none text-center text-4xl font-bold tracking-[.25em] text-white font-mono bg-gray-700 py-3 rounded">
                    {captcha}
                </div>
            </div>

            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter captcha"
                className="w-full max-w-xs p-3 mb-4 text-center text-lg bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                autoCapitalize="off"
                autoCorrect="off"
            />
            
            <div className="flex space-x-4 w-full max-w-xs">
                <button onClick={generateCaptcha} className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors">
                    Next
                </button>
                <button onClick={handleSubmit} className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
                    Submit
                </button>
            </div>
            
            {message && (
                <p className={`mt-6 text-sm font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default CaptchaScreen;