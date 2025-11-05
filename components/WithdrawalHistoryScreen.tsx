
import React from 'react';
import { Screen, Withdrawal } from '../types';

interface WithdrawalHistoryScreenProps {
    history: Withdrawal[];
    setActiveScreen: (screen: Screen) => void;
}

const StatusBadge: React.FC<{ status: Withdrawal['status'] }> = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-xs font-bold rounded-full';
    const statusClasses = {
        Pending: 'bg-yellow-500/20 text-yellow-300',
        Approved: 'bg-green-500/20 text-green-300',
        Failed: 'bg-red-500/20 text-red-300',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const WithdrawalHistoryScreen: React.FC<WithdrawalHistoryScreenProps> = ({ history, setActiveScreen }) => {
    return (
        <div className="p-4 flex flex-col h-full">
             <div className="flex items-center mb-6">
                <button onClick={() => setActiveScreen(Screen.Profile)} className="text-gray-300 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-center flex-grow text-gray-200">Withdrawal History</h1>
                <div className="w-6"></div>
            </div>

            {history.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
                    <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5-2.5h.01M10 19h.01M4 20h.01M19 12h.01M4 4h.01M14 4h.01M4 9h.01M19 19h.01M10 4h.01M19 4h.01M20 9h.01M14 19h.01M20 14h.01M9 20h.01" />
                    </svg>
                    <p className="font-semibold">No transactions yet</p>
                    <p className="text-sm">Your withdrawal history will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map(item => (
                        <div key={item.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold text-lg text-white">₹{item.amount}</p>
                                <p className="text-sm text-gray-400">{item.destination}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.date.toLocaleString()}</p>
                            </div>
                            <StatusBadge status={item.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WithdrawalHistoryScreen;
