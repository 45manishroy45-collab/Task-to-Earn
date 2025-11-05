import React from 'react';

interface WelcomeBonusModalProps {
    onClaim: () => void;
}

const WelcomeBonusModal: React.FC<WelcomeBonusModalProps> = ({ onClaim }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center mb-4">
                    {/* Gift Icon */}
                    <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
                <p className="text-gray-400 mb-6">
                    You've received a <span className="font-bold text-white">₹50</span> sign-up bonus!
                </p>
                <button 
                    onClick={onClaim} 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default WelcomeBonusModal;
