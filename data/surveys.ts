import { Survey } from '../types';

export const initialSurveys: Survey[] = [
    {
        id: 's1',
        q: 'What is your preferred mode of online payment?',
        a: ['UPI (Google Pay, PhonePe, etc.)', 'Credit/Debit Card', 'Net Banking', 'Wallets (Paytm, etc.)'],
    },
    {
        id: 's2',
        q: 'How often do you shop online in a month?',
        a: ['Rarely, only when necessary', '1-2 times', '3-5 times', 'More than 5 times'],
    },
    {
        id: 's3',
        q: 'What is your favorite social media platform?',
        a: ['Instagram', 'Facebook', 'Twitter / X', 'LinkedIn'],
    },
    {
        id: 's4',
        q: 'Which type of mobile games do you enjoy the most?',
        a: ['Puzzle & Strategy', 'Action & Adventure', 'Casual (like Ludo, Candy Crush)', 'Sports & Racing'],
    },
];
