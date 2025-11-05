import React, { useState, useEffect } from 'react';
import { Survey, Screen } from '../types';

interface SurveyScreenProps {
    surveys: Survey[];
    handleTaskCompletion: (amount: number) => void;
    taskInfo: { count: number; limitTimestamp: number | null };
    setActiveScreen: (screen: Screen) => void;
}

const TASK_COOLDOWN_HOURS = 24;

const SurveyScreen: React.FC<SurveyScreenProps> = ({ surveys, handleTaskCompletion, taskInfo, setActiveScreen }) => {
    const [sIndex, setSIndex] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState('');

    const hasReachedLimit = taskInfo.limitTimestamp !== null;
    const currentSurvey = surveys[sIndex];

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

    const nextSurvey = () => {
        setSIndex((prevIndex) => (prevIndex + 1) % surveys.length);
    };

    const handleSkip = () => {
        setMessage(null);
        nextSurvey();
    };

    const handleSubmit = () => {
        handleTaskCompletion(5);
        setMessage("✅ Survey submitted! ₹5 has been added to your wallet.");
        setTimeout(() => {
            setMessage(null);
            nextSurvey();
        }, 2000);
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
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-4 relative">
                 <button onClick={() => setActiveScreen(Screen.Home)} className="text-gray-300 hover:text-white p-2 absolute -left-2 top-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-center flex-grow text-purple-300">Take a Survey</h1>
            </div>
            <p className="text-center mb-8 text-gray-400">Answer a quick question to earn ₹5.</p>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg flex-grow flex flex-col justify-between">
                <div>
                    <h4 className="text-xl font-semibold mb-6 text-white">{currentSurvey.q}</h4>
                    <div className="space-y-4">
                        {currentSurvey.a.map((option, index) => (
                            <label key={index} className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                                <input type="radio" name="survey_answer" className="h-5 w-5 text-purple-500 bg-gray-900 border-gray-600 focus:ring-purple-500" />
                                <span className="ml-4 text-gray-200">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    {message && (
                        <p className="mt-6 text-center text-green-400 font-medium">{message}</p>
                    )}
                    <div className={`flex space-x-4 w-full mt-8 ${message ? 'hidden' : 'flex'}`}>
                        <button onClick={handleSkip} className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors">
                            Skip
                        </button>
                        <button onClick={handleSubmit} className="w-1/2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyScreen;