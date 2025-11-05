import React, { useState } from 'react';
import { Profile, Screen } from '../types';

interface ReferralScreenProps {
    profile: Profile;
    setActiveScreen: (screen: Screen) => void;
}

const ReferralScreen: React.FC<ReferralScreenProps> = ({ profile, setActiveScreen }) => {
    const [refCode, setRefCode] = useState('');
    const [copied, setCopied] = useState(false);

    const generateAndCopyCode = () => {
        const code = btoa(profile.name || "guest").slice(0, 8).toUpperCase();
        setRefCode(code);
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 relative">
             <div className="flex w-full justify-start absolute top-4 left-4">
                <button onClick={() => setActiveScreen(Screen.Home)} className="text-gray-300 hover:text-white p-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-yellow-300">Refer & Earn</h1>
            <p className="mb-8 text-gray-400 max-w-sm">Share your referral code with friends. When they sign up, you both get a bonus!</p>
            
            <div className="bg-gray-700 p-6 rounded-lg w-full max-w-sm">
                <p className="text-sm text-gray-300 mb-2">Your Referral Code</p>
                <div className="h-16 flex items-center justify-center bg-gray-800 border-2 border-dashed border-gray-500 rounded-lg text-3xl font-bold tracking-widest text-white">
                    {refCode || '********'}
                </div>
            </div>

            <button 
                onClick={generateAndCopyCode} 
                className="mt-8 w-full max-w-sm bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 px-4 rounded-lg transition-colors text-lg"
            >
                {copied ? 'Copied!' : 'Generate & Copy Code'}
            </button>
        </div>
    );
};

export default ReferralScreen;