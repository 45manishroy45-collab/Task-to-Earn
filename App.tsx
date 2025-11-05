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
import WelcomeBonusModal from './components/WelcomeBonusModal';
import AdminPanel from './components/admin/AdminPanel';
import { Screen, Profile, Withdrawal, Survey, User } from './types';
import { initialSurveys } from './data/surveys';


const App: React.FC = () => {
    // App State
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
    const [wallet, setWallet] = useState(0); // Default to 0, will be updated on login
    const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);

    const [surveys] = useState<Survey[]>(initialSurveys);
    const [allWithdrawals, setAllWithdrawals] = useState<Withdrawal[]>([]);
    const [taskInfo, setTaskInfo] = useState({
        count: 0,
        limitTimestamp: null as number | null,
    });
    const TASK_LIMIT = 5;
    const TASK_COOLDOWN_HOURS = 24;

    // Helper to update wallet and persist it to the user object
    const updateUserWallet = (newWalletValue: number) => {
        if (!currentUser) return;

        const updatedUser = { ...currentUser, wallet: newWalletValue };
        
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));
        setWallet(newWalletValue);
    };


    // Handlers
    const handleLogin = (email: string, pass: string) => {
        if (email.toLowerCase() === '45kumarmanish45@gmail.com' && pass === '524163') {
            setIsAdmin(true);
            setIsLoggedIn(true);
            setCurrentUser({ 
                name: 'Admin', 
                email: '45kumarmanish45@gmail.com', 
                password_plain: pass,
                address: '', 
                upi: '',
                wallet: 0,
                bonusClaimed: true,
            });
            return { success: true };
        }

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user && user.password_plain === pass) {
            setCurrentUser(user);
            setWallet(user.wallet);
            setIsLoggedIn(true);
            setIsAdmin(false);
            return { success: true };
        }
        return { success: false, error: 'Invalid email or password.' };
    };

    const handleRegister = (name: string, email: string, pass: string) => {
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: 'An account with this email already exists.' };
        }
        
        if (name && email && pass) {
            const newUser: User = { 
                name, 
                email, 
                password_plain: pass,
                address: '', 
                upi: '',
                wallet: 0, // Start with 0 balance
                bonusClaimed: false,
            };
            setUsers(prev => [...prev, newUser]);
            setCurrentUser(newUser);
            setWallet(0); // Set wallet state to 0
            setIsLoggedIn(true);
            setShowWelcomeBonus(true); // Trigger the bonus modal
            return { success: true };
        }
        return { success: false, error: 'Registration failed. Please fill all fields.' };
    };
    
    const handleClaimBonus = () => {
        if (!currentUser) return;
        const bonusAmount = 50;
        const updatedUser = { 
            ...currentUser, 
            wallet: currentUser.wallet + bonusAmount, 
            bonusClaimed: true 
        };

        // Update the main users list
        setUsers(prevUsers => prevUsers.map(u => u.email === updatedUser.email ? updatedUser : u));
        
        // Update the current user state
        setCurrentUser(updatedUser);

        // Sync the wallet prop state
        setWallet(updatedUser.wallet);
        
        // Hide the modal
        setShowWelcomeBonus(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setActiveScreen(Screen.Home);
        setCurrentUser(null);
    };

    const handleTaskCompletion = (amount: number) => {
        if (taskInfo.limitTimestamp) return;

        updateUserWallet(wallet + amount);

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
        if (!currentUser) return { success: false, error: "No user logged in." };
        if (wallet >= amount) {
            updateUserWallet(wallet - amount);
            const newWithdrawal: Withdrawal = {
                id: `w${Date.now()}`,
                amount,
                destination,
                date: new Date(),
                status: 'Pending',
                userEmail: currentUser.email,
            };
            setAllWithdrawals(prev => [newWithdrawal, ...prev]);
            return { success: true };
        }
        return { success: false, error: 'Insufficient funds' };
    };

    const handleProfileUpdate = (newProfileData: Profile) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...newProfileData };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));
    }

    const approveWithdrawal = (withdrawalId: string) => {
        setAllWithdrawals(prev => 
            prev.map(w => 
                w.id === withdrawalId ? { ...w, status: 'Approved' as 'Approved' } : w
            )
        );
    };

    const sendBonusToUser = (userEmail: string, amount: number) => {
        setUsers(prevUsers =>
            prevUsers.map(u => 
                u.email === userEmail ? { ...u, wallet: u.wallet + amount } : u
            )
        );
        if (currentUser?.email === userEmail) {
            setWallet(prev => prev + amount);
        }
    };

    // Specific setter for LudoScreen which might use a callback
    const setWalletForLudo = (value: number | ((prevWallet: number) => number)) => {
        const newWalletValue = typeof value === 'function' ? value(wallet) : value;
        updateUserWallet(newWalletValue);
    };
    
    const renderScreen = () => {
        if (!currentUser) return null;
        const userWithdrawalHistory = allWithdrawals.filter(w => w.userEmail === currentUser.email);
        switch (activeScreen) {
            case Screen.Home:
                return <HomeScreen wallet={wallet} setActiveScreen={setActiveScreen} />;
            case Screen.Captcha:
                return <CaptchaScreen handleTaskCompletion={handleTaskCompletion} taskInfo={taskInfo} setActiveScreen={setActiveScreen} />;
            case Screen.Survey:
                return <SurveyScreen surveys={surveys} handleTaskCompletion={handleTaskCompletion} taskInfo={taskInfo} setActiveScreen={setActiveScreen} />;
            case Screen.Ludo:
                return <LudoScreen wallet={wallet} setWallet={setWalletForLudo} setActiveScreen={setActiveScreen} />;
            case Screen.Referral:
                return <ReferralScreen profile={currentUser} setActiveScreen={setActiveScreen} />;
            case Screen.Withdraw:
                return <WithdrawScreen wallet={wallet} profile={currentUser} requestWithdrawal={requestWithdrawal} setActiveScreen={setActiveScreen} />;
            case Screen.Profile:
                return <ProfileScreen profile={currentUser} setProfile={handleProfileUpdate} handleLogout={handleLogout} setActiveScreen={setActiveScreen} />;
            case Screen.WithdrawalHistory:
                return <WithdrawalHistoryScreen history={userWithdrawalHistory} setActiveScreen={setActiveScreen} />;
             case Screen.SupportChat:
                return <SupportChatScreen withdrawalHistory={userWithdrawalHistory} surveys={surveys} setActiveScreen={setActiveScreen} wallet={wallet} taskInfo={taskInfo} />;
            default:
                return <HomeScreen wallet={wallet} setActiveScreen={setActiveScreen} />;
        }
    };

    if (!isLoggedIn) {
        return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
    }

    if (isAdmin) {
        return (
            <AdminPanel 
                users={users} 
                withdrawals={allWithdrawals} 
                approveWithdrawal={approveWithdrawal} 
                sendBonusToUser={sendBonusToUser}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <div className="bg-gray-800 text-white h-screen flex flex-col font-sans max-w-sm mx-auto border-gray-600 border">
            {showWelcomeBonus && <WelcomeBonusModal onClaim={handleClaimBonus} />}
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