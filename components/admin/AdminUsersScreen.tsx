import React from 'react';
import { User } from '../../types';

interface AdminUsersScreenProps {
    users: User[];
    sendBonusToUser: (email: string, amount: number) => void;
}

const AdminUsersScreen: React.FC<AdminUsersScreenProps> = ({ users, sendBonusToUser }) => {
    const handleSendBonus = (email: string) => {
        const amountStr = prompt(`Enter bonus amount for ${email}:`);
        if (amountStr) {
            const amount = parseInt(amountStr, 10);
            if (!isNaN(amount) && amount > 0) {
                sendBonusToUser(email, amount);
                alert(`Bonus of ₹${amount} sent to ${email}`);
            } else {
                alert("Invalid amount.");
            }
        }
    };

    // Filter out the admin user from the list
    const regularUsers = users.filter(u => u.email !== '45kumarmanish45@gmail.com');

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Registered Users ({regularUsers.length})</h2>
            <div className="space-y-4">
                {regularUsers.map(user => (
                    <div key={user.email} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <p className="text-sm text-gray-300 mt-1">Balance: ₹{user.wallet}</p>
                        </div>
                        <button
                            onClick={() => handleSendBonus(user.email)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Send Bonus
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsersScreen;