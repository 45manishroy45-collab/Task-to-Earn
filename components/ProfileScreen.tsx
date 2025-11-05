import React, { useState } from 'react';
import { Profile, Screen } from '../types';
import { EditIcon, HistoryIcon, SupportIcon, LogoutIcon, ChevronRightIcon } from './icons/Icons';

interface ProfileScreenProps {
    profile: Profile;
    setProfile: (profile: Profile) => void;
    handleLogout: () => void;
    setActiveScreen: (screen: Screen) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, setProfile, handleLogout, setActiveScreen }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        upi: '',
    });
    const [message, setMessage] = useState('');

    const handleSave = () => {
        setProfile({ ...profile, ...formData });
        setMessage('✅ Profile saved successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleEditClick = () => {
        // Explicitly set form data from props when editing starts
        // to ensure the form has the most current data.
        setFormData({
            name: profile.name,
            address: profile.address,
            upi: profile.upi,
        });
        setIsEditing(true);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const InputField: React.FC<{
        label: string;
        name: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        placeholder: string;
        type?: string;
    }> = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
        </div>
    );

    const ProfileOption: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; isDestructive?: boolean }> = ({ icon, label, onClick, isDestructive }) => (
        <button onClick={onClick} className={`w-full flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors ${isDestructive ? 'text-red-400' : 'text-gray-200'}`}>
            {icon}
            <span className="ml-4 font-medium">{label}</span>
            {!isDestructive && <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400" />}
        </button>
    );
    
    if (isEditing) {
        return (
             <div className="p-4 animate-fade-in">
                <div className="flex items-center mb-6">
                    <button onClick={() => setIsEditing(false)} className="text-gray-300 hover:text-white p-2 -ml-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-center flex-grow text-gray-200">Edit Profile</h1>
                    <div className="w-6"></div>
                </div>
                <div className="space-y-6">
                    <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name"/>
                    <InputField label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter your address"/>
                    <InputField label="UPI ID" name="upi" value={formData.upi} onChange={handleInputChange} placeholder="yourname@bank"/>
                    <div className="flex space-x-4">
                        <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">Save Changes</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 animate-fade-in">
            <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center">
                     <span className="text-4xl font-bold">{profile.name.charAt(0)}</span>
                </div>
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                <p className="text-gray-400">{profile.email}</p>
            </div>
            
            {message && <p className="mb-4 text-center text-green-400">{message}</p>}

            <div className="space-y-4">
                <ProfileOption icon={<EditIcon className="w-6 h-6"/>} label="Edit Profile" onClick={handleEditClick} />
                <ProfileOption icon={<HistoryIcon className="w-6 h-6"/>} label="Withdrawal History" onClick={() => setActiveScreen(Screen.WithdrawalHistory)} />
                <ProfileOption icon={<SupportIcon className="w-6 h-6"/>} label="Customer Support" onClick={() => setActiveScreen(Screen.SupportChat)} />
                <ProfileOption icon={<LogoutIcon className="w-6 h-6"/>} label="Logout" onClick={handleLogout} isDestructive />
            </div>
        </div>
    );
};

export default ProfileScreen;
