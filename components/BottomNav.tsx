
import React from 'react';
import { Screen } from '../types';
import { HomeIcon, UserIcon, WalletIcon } from './icons/Icons';

interface BottomNavProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

const NavButton: React.FC<{
    screen: Screen;
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
    Icon: React.FC<{ className: string }>;
    label: string;
}> = ({ screen, activeScreen, setActiveScreen, Icon, label }) => {
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

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
    return (
        <nav className="w-full bg-gray-900 border-t border-gray-700 flex justify-around">
            <NavButton screen={Screen.Home} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Icon={HomeIcon} label="Home" />
            <NavButton screen={Screen.Withdraw} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Icon={WalletIcon} label="Withdraw" />
            <NavButton screen={Screen.Profile} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Icon={UserIcon} label="Profile" />
        </nav>
    );
};

export default BottomNav;
