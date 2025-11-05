import React, { useState, useEffect } from 'react';
import { Profile, Screen } from '../types';

interface WithdrawScreenProps {
    wallet: number;
    profile: Profile;
    requestWithdrawal: (amount: number, destination: string) => { success: boolean; error?: string };
    setActiveScreen: (screen: Screen) => void;
}

const MIN_WITHDRAWAL_BALANCE = 1000;

const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ wallet, profile, requestWithdrawal, setActiveScreen }) => {
    const [amount, setAmount] = useState('');
    const [upi, setUpi] = useState(profile.upi);
    const [message, setMessage] = useState<{ text: string; type: 'error' } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submittedAmount, setSubmittedAmount] = useState(0);

    const canWithdraw = wallet >= MIN_WITHDRAWAL_BALANCE;

    useEffect(() => {
        setUpi(profile.upi);
    }, [profile.upi]);

    const handleWithdraw = () => {
        setMessage(null);
        if (!canWithdraw) {
            setMessage({ text: `Minimum balance of ₹${MIN_WITHDRAWAL_BALANCE} required to withdraw.`, type: "error" });
            return;
        }
        const amt = parseInt(amount);
        if (isNaN(amt) || amt <= 0) {
            setMessage({ text: "Please enter a valid amount.", type: "error" });
            return;
        }
        if (!upi.trim() || !upi.includes('@')) {
            setMessage({ text: "Please enter a valid UPI ID.", type: "error" });
            return;
        }
        if (amt < 50) {
            setMessage({ text: "Minimum withdrawal amount is ₹50.", type: "error" });
            return;
        }
        if (amt > 1000) {
            setMessage({ text: "Maximum withdrawal limit is ₹1000.", type: "error" });
            return;
        }
        if (amt > wallet) {
            setMessage({ text: "Insufficient balance.", type: "error" });
            return;
        }

        const result = requestWithdrawal(amt, upi);
        
        if (result.success) {
            setSubmittedAmount(amt);
            setIsModalOpen(true);
            setAmount('');
        } else {
            setMessage({ text: result.error || "An unknown error occurred.", type: "error" });
        }
    };
    
    const ConfirmationModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Withdrawal Requested</h2>
                <p className="text-gray-400 mb-6">Your withdrawal request for <span className="font-bold text-white">₹{submittedAmount}</span> has been submitted. Funds will be approved within 24 hours.</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button onClick={() => { setIsModalOpen(false); setActiveScreen(Screen.WithdrawalHistory); }} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors">View History</button>
                    <button onClick={() => setIsModalOpen(false)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">Done</button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {isModalOpen && <ConfirmationModal />}
            <div className="p-4 flex flex-col h-full">
                <div className="flex items-center mb-2 relative">
                    <button onClick={() => setActiveScreen(Screen.Home)} className="text-gray-300 hover:text-white p-2 absolute -left-2 top-1">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-center flex-grow text-red-300">Withdraw</h1>
                </div>
                <p className="text-center text-gray-400 mb-6">Current Balance: <span className="font-bold text-white">₹{wallet}</span></p>
                
                {!canWithdraw && (
                     <div className="my-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
                        <p className="font-medium text-yellow-200">
                            Minimum balance of ₹{MIN_WITHDRAWAL_BALANCE} required to withdraw.
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Min ₹50, Max ₹1000"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none disabled:bg-gray-800 disabled:cursor-not-allowed"
                            disabled={!canWithdraw}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">UPI ID</label>
                        <input
                            type="text"
                            value={upi}
                            onChange={(e) => setUpi(e.target.value)}
                            placeholder="yourname@bank"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none disabled:bg-gray-800 disabled:cursor-not-allowed"
                            disabled={!canWithdraw}
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-center">*Approval time: within 24 hours.</p>
                    
                    {message && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
                            <p className="font-medium text-red-300">
                                {message.text}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleWithdraw}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg disabled:bg-red-800 disabled:cursor-not-allowed"
                        disabled={!amount || !upi || !canWithdraw}
                    >
                        Withdraw Now
                    </button>
                </div>
            </div>
        </>
    );
};

export default WithdrawScreen;