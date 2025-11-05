import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import CaptchaScreen from './components/CaptchaScreen';
import SurveyScreen from './components/SurveyScreen';
import LudoScreen from './components/LudoScreen';
import ReferralScreen from './components/ReferralScreen';
import ProfileScreen from './components/ProfileScreen';
import WithdrawScreen from './components/WithdrawScreen';
import WithdrawalHistoryScreen from './components/WithdrawalHistoryScreen';
import SupportChatScreen from './components/SupportChatScreen';
import AdBanner from './components/AdBanner'; // Import the new AdBanner component
import { Screen, Profile, Withdrawal, Survey } from './types';
import { initialSurveys } from './data/surveys';

const App: React.FC = () => {
    // App State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
    const [wallet, setWallet] = useState(150);
    const [profile, setProfile] = useState<Profile>({
        name: 'Guest User',
        email: 'guest@example.com',
        address: '',
        upi: '',
    });
    const [surveys] = useState<Survey[]>(initialSurveys);
    const [withdrawalHistory, setWithdrawalHistory] = useState<Withdrawal[]>([
        { id: 'w1', amount: 50, destination: 'user@upi', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'Approved' },
        { id: 'w2', amount: 100, destination: 'user@upi', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'Pending' },
    ]);
    const [taskInfo, setTaskInfo] = useState({
        count: 0,
        limitTimestamp: null as number | null,
    });
    const TASK_LIMIT = 5;
    const TASK_COOLDOWN_HOURS = 24;

    // Handlers
    const handleLogin = (email: string, pass: string) => {
        // Mock login
        if (email && pass) {
            setProfile(prev => ({...prev, name: 'John Doe', email: email}));
            setIsLoggedIn(true);
            return { success: true };
        }
        return { success: false, error: 'Invalid credentials' };
    };

    const handleRegister = (name: string, email: string, pass: string) => {
        // Mock register
        if (name && email && pass) {
            setProfile({ name, email, address: '', upi: '' });
            setIsLoggedIn(true);
            return { success: true };
        }
        return { success: false, error: 'Registration failed' };
    };

    const handleGoogleLogin = () => {
         setProfile(prev => ({...prev, name: 'John Doe', email: 'john.doe@google.com'}));
         setIsLoggedIn(true);
         return { success: true };
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setActiveScreen(Screen.Home);
        setProfile({ name: 'Guest User', email: 'guest@example.com', address: '', upi: '' });
    };

    const handleTaskCompletion = (amount: number) => {
        if (taskInfo.limitTimestamp) return;

        setWallet(prev => prev + amount);
        const newCount = taskInfo.count + 1;
        if (newCount >= TASK_LIMIT) {
            setTaskInfo({ count: newCount, limitTimestamp: Date.now() });
        } else {
            setTaskInfo({ count: newCount, limitTimestamp: null });
        }
    };
    
     useEffect(() => {
        if (taskInfo.limitTimestamp) {
            const checkCooldown = () => {
                const now = Date.now();
                const endTime = taskInfo.limitTimestamp! + TASK_COOLDOWN_HOURS * 60 * 60 * 1000;
                if (now >= endTime) {
                    setTaskInfo({ count: 0, limitTimestamp: null });
                }
            };
            checkCooldown(); // Check immediately
            const timer = setInterval(checkCooldown, 1000 * 60); // Check every minute
            return () => clearInterval(timer);
        }
    }, [taskInfo.limitTimestamp]);

    const requestWithdrawal = (amount: number, destination: string) => {
        if (wallet >= amount) {
            setWallet(prev => prev - amount);
            const newWithdrawal: Withdrawal = {
                id: `w${Date.now()}`,
                amount,
                destination,
                date: new Date(),
                status: 'Pending',
            };
            setWithdrawalHistory(prev => [newWithdrawal, ...prev]);
            return { success: true };
        }
        return { success: false, error: 'Insufficient funds' };
    };
    

    const renderScreen = () => {
        switch (activeScreen) {
            case Screen.Home:
                return <HomeScreen wallet={wallet} setActiveScreen={setActiveScreen} />;
            case Screen.Captcha:
                return <CaptchaScreen handleTaskCompletion={handleTaskCompletion} taskInfo={taskInfo} setActiveScreen={setActiveScreen} />;
            case Screen.Survey:
                return <SurveyScreen surveys={surveys} handleTaskCompletion={handleTaskCompletion} taskInfo={taskInfo} setActiveScreen={setActiveScreen} />;
            case Screen.Ludo:
                return <LudoScreen wallet={wallet} setWallet={setWallet} setActiveScreen={setActiveScreen} />;
            case Screen.Referral:
                return <ReferralScreen profile={profile} setActiveScreen={setActiveScreen} />;
            case Screen.Withdraw:
                return <WithdrawScreen wallet={wallet} profile={profile} requestWithdrawal={requestWithdrawal} setActiveScreen={setActiveScreen} />;
            case Screen.Profile:
                return <ProfileScreen profile={profile} setProfile={setProfile} handleLogout={handleLogout} setActiveScreen={setActiveScreen} />;
            case Screen.WithdrawalHistory:
                return <WithdrawalHistoryScreen history={withdrawalHistory} setActiveScreen={setActiveScreen} />;
             case Screen.SupportChat:
                return <SupportChatScreen withdrawalHistory={withdrawalHistory} surveys={surveys} setActiveScreen={setActiveScreen} wallet={wallet} taskInfo={taskInfo} />;
            default:
                return <HomeScreen wallet={wallet} setActiveScreen={setActiveScreen} />;
        }
    };

    if (!isLoggedIn) {
        return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} onGoogleLogin={handleGoogleLogin} />;
    }

    return (
        <div className="bg-gray-800 text-white h-screen flex flex-col font-sans max-w-sm mx-auto border-gray-600 border pt-[50px]">
            <AdBanner />
            <main className="flex-1 overflow-y-auto p-4">
                {renderScreen()}
            </main>
            <footer className="flex-shrink-0">
                <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            </footer>
        </div>
    );
};

export default App;