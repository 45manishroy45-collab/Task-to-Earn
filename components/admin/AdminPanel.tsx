import React, { useState } from 'react';
import AdminUsersScreen from './AdminUsersScreen';
import AdminWithdrawalsScreen from './AdminWithdrawalsScreen';
import { User, Withdrawal } from '../../types';
import { LogoutIcon, UserIcon, WalletIcon } from '../icons/Icons';

interface AdminPanelProps {
    users: User[];
    withdrawals: Withdrawal[];
    approveWithdrawal: (id: string) => void;
    sendBonusToUser: (email: string, amount: number) => void;
    handleLogout: () => void;
}

type AdminScreen = 'users' | 'withdrawals';

const AdminPanel: React.FC<AdminPanelProps> = ({ users, withdrawals, approveWithdrawal, sendBonusToUser, handleLogout }) => {
    const [activeScreen, setActiveScreen] = useState<AdminScreen>('users');

    const renderScreen = () => {
        switch (activeScreen) {
            case 'users':
                return <AdminUsersScreen users={users} sendBonusToUser={sendBonusToUser} />;
            case 'withdrawals':
                return <AdminWithdrawalsScreen withdrawals={withdrawals} approveWithdrawal={approveWithdrawal} />;
            default:
                return <AdminUsersScreen users={users} sendBonusToUser={sendBonusToUser} />;
        }
    };
    
    const NavButton: React.FC<{ screen: AdminScreen, label: string, Icon: React.FC<{ className: string }> }> = ({ screen, label, Icon }) => {
        const isActive = activeScreen === screen;
        return (
            <button
                onClick={() => setActiveScreen(screen)}
                className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
            >
                <Icon className="w-6 h-6 mb-1" />
                <span>{label}</span>
            </button>
        );
    };

    return (
        <div className="bg-gray-800 text-white h-screen flex flex-col font-sans max-w-sm mx-auto border-gray-600 border">
            <header className="flex-shrink-0 bg-gray-900 p-4 flex justify-between items-center border-b border-gray-700">
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 p-2 flex items-center">
                    <LogoutIcon className="w-5 h-5 mr-1"/> Logout
                </button>
            </header>
            <main className="flex-1 overflow-y-auto">
                {renderScreen()}
            </main>
            <footer className="flex-shrink-0">
                 <nav className="w-full bg-gray-900 border-t border-gray-700 flex justify-around">
                    <NavButton screen="users" label="Users" Icon={UserIcon} />
                    <NavButton screen="withdrawals" label="History" Icon={WalletIcon} />
                </nav>
            </footer>
        </div>
    );
};

export default AdminPanel;