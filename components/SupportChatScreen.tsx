import React, { useState, useEffect, useRef } from 'react';
import { Screen, Withdrawal, Survey } from '../types';
import { BotIcon, SendIcon } from './icons/Icons';

interface SupportChatScreenProps {
    withdrawalHistory: Withdrawal[];
    surveys: Survey[];
    setActiveScreen: (screen: Screen) => void;
    wallet: number;
    taskInfo: { count: number; limitTimestamp: number | null };
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    actions?: { text: string; onClick: () => void; }[];
}

const TASK_COOLDOWN_HOURS = 24;

const SupportChatScreen: React.FC<SupportChatScreenProps> = ({ withdrawalHistory, surveys, setActiveScreen, wallet, taskInfo }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    useEffect(() => {
        setMessages([
            {
                id: 1,
                sender: 'bot',
                text: "Hello! I'm your AI assistant. How can I help you today? You can ask me about 'withdrawal status', 'my balance', or to 'start a survey'.",
            }
        ]);
    }, []);
    
    const formatTimeRemaining = (timestamp: number): string => {
        const now = Date.now();
        const endTime = timestamp + TASK_COOLDOWN_HOURS * 60 * 60 * 1000;
        const remaining = endTime - now;
        if (remaining <= 0) return 'now';
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        return `in approximately ${hours}h ${minutes}m`;
    };

    const processUserMessage = (text: string) => {
        setIsTyping(true);
        const lowerCaseText = text.toLowerCase();

        setTimeout(() => {
            let botResponse: Partial<Message> = { sender: 'bot' };

            if (lowerCaseText.includes('status') || lowerCaseText.includes('withdrawal')) {
                if (withdrawalHistory.length === 0) {
                    botResponse.text = "You don't have any withdrawal history yet.";
                } else {
                    const last = withdrawalHistory[0];
                    botResponse.text = `Your latest withdrawal of ₹${last.amount} to ${last.destination} is currently ${last.status}.`;
                }
            } else if (lowerCaseText.includes('survey') || lowerCaseText.includes('captcha') || lowerCaseText.includes('task')) {
                 if (taskInfo.limitTimestamp) {
                    botResponse.text = `You've reached your daily task limit. You can do more tasks ${formatTimeRemaining(taskInfo.limitTimestamp)}.`;
                } else {
                    botResponse.text = "You can complete surveys and captchas now. Just head to the Home screen to start!";
                    botResponse.actions = [{text: "Go to Home", onClick: () => setActiveScreen(Screen.Home)}]
                }
            } else if (lowerCaseText.includes('balance')) {
                botResponse.text = `Your current balance is ₹${wallet}.`;
            }
            else if (lowerCaseText.includes('survey')) {
                if (surveys.length === 0) {
                     botResponse.text = "Sorry, there are no surveys available right now.";
                } else {
                    botResponse.text = "Sure, here are the available surveys. Please select one to start:";
                    botResponse.actions = surveys.map(s => ({
                        text: s.q,
                        onClick: () => setActiveScreen(Screen.Survey)
                    }));
                }
            } else {
                botResponse.text = "I'm sorry, I can only help with 'withdrawal status' or 'surveys'. For other issues, please contact our human support team.";
            }

            setMessages(prev => [...prev, { ...botResponse, id: Date.now() } as Message]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;
        const userMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        processUserMessage(inputValue);
        setInputValue('');
    };

    const handleActionClick = (onClick: () => void) => {
        onClick();
    };

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <button onClick={() => setActiveScreen(Screen.Profile)} className="text-gray-300 hover:text-white p-2 -ml-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-center flex-grow text-gray-200">AI Support</h1>
                <div className="w-6"></div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-white" /></div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                            <p className="text-white text-sm">{msg.text}</p>
                            {msg.actions && (
                                <div className="mt-3 space-y-2 border-t border-gray-600 pt-2">
                                    {msg.actions.map((action, index) => (
                                        <button key={index} onClick={() => handleActionClick(action.onClick)} className="w-full text-left text-sm text-blue-300 bg-gray-600/50 hover:bg-gray-600 p-2 rounded-lg transition-colors">
                                           {action.text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                 {isTyping && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-white" /></div>
                        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-700 rounded-bl-none">
                           <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-medium"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow"></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex items-center space-x-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-3 flex-shrink-0 transition-colors">
                    <SendIcon className="w-6 h-6"/>
                </button>
            </div>
            
            <style>{`
                .animate-pulse-fast { animation: pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .animate-pulse-medium { animation: pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.2s; }
                .animate-pulse-slow { animation: pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.4s; }
            `}</style>
        </div>
    );
};

export default SupportChatScreen;