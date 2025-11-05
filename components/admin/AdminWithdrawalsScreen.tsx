import React from 'react';
import { Withdrawal } from '../../types';

interface AdminWithdrawalsScreenProps {
    withdrawals: Withdrawal[];
    approveWithdrawal: (id: string) => void;
}

const AdminWithdrawalsScreen: React.FC<AdminWithdrawalsScreenProps> = ({ withdrawals, approveWithdrawal }) => {
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'Pending');

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Pending Withdrawals</h2>
            {pendingWithdrawals.length === 0 ? (
                <p className="text-gray-400">No pending withdrawals.</p>
            ) : (
                <div className="space-y-4">
                    {pendingWithdrawals.map(item => (
                        <div key={item.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold text-lg text-white">₹{item.amount}</p>
                                <p className="text-sm text-gray-400">To: {item.destination}</p>
                                <p className="text-sm text-gray-500">From: {item.userEmail}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.date.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => approveWithdrawal(item.id)}
                                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                Approve
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminWithdrawalsScreen;