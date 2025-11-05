import React from 'react';
import { Screen } from '../types';
import { CaptchaIcon, SurveyIcon, WithdrawIcon, ReferralIcon, LudoIcon } from './icons/Icons';

interface HomeScreenProps {
    wallet: number;
    setActiveScreen: (screen: Screen) => void;
}

const TaskCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    bgColor: string;
}> = ({ title, description, icon, onClick, bgColor }) => (
    <button
        onClick={onClick}
        className={`w-full p-3 rounded-lg flex items-center space-x-3 text-left transition-transform duration-200 hover:scale-105 ${bgColor}`}
    >
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <h3 className="font-bold text-base text-white">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
        </div>
    </button>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ wallet, setActiveScreen }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center p-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <h2 className="text-base font-medium text-blue-100">Your Balance</h2>
                <p className="text-4xl font-bold text-white tracking-tight">₹{wallet}</p>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-200 px-2">Earn Money</h3>
                <TaskCard
                    title="Solve Captcha"
                    description="Earn ₹10 for each correct captcha"
                    icon={<CaptchaIcon className="w-7 h-7 text-white"/>}
                    onClick={() => setActiveScreen(Screen.Captcha)}
                    bgColor="bg-green-600/80 hover:bg-green-600"
                />
                <TaskCard
                    title="Take a Survey"
                    description="Earn ₹5 for completing a survey"
                    icon={<SurveyIcon className="w-7 h-7 text-white"/>}
                    onClick={() => setActiveScreen(Screen.Survey)}
                    bgColor="bg-purple-600/80 hover:bg-purple-600"
                />
                <TaskCard
                    title="Play Ludo"
                    description="Win and double your money"
                    icon={<LudoIcon className="w-7 h-7 text-white"/>}
                    onClick={() => setActiveScreen(Screen.Ludo)}
                    bgColor="bg-pink-600/80 hover:bg-pink-600"
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-200 px-2">More Options</h3>
                <TaskCard
                    title="Refer & Earn"
                    description="Share your code with friends"
                    icon={<ReferralIcon className="w-7 h-7 text-white"/>}
                    onClick={() => setActiveScreen(Screen.Referral)}
                    bgColor="bg-yellow-600/80 hover:bg-yellow-600"
                />
                 <TaskCard
                    title="Withdraw Funds"
                    description="Transfer earnings to your account"
                    icon={<WithdrawIcon className="w-7 h-7 text-white"/>}
                    onClick={() => setActiveScreen(Screen.Withdraw)}
                    bgColor="bg-red-600/80 hover:bg-red-600"
                />
            </div>
        </div>
    );
};

export default HomeScreen;