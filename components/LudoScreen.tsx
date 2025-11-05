
import React, { useState } from 'react';
import { Screen, GameState, LudoPlayer } from '../types';
import LudoBoard from './LudoBoard';
import { LudoIcon } from './icons/Icons';

interface LudoScreenProps {
    wallet: number;
    setWallet: (wallet: number | ((prevWallet: number) => number)) => void;
    setActiveScreen: (screen: Screen) => void;
}

const initialPlayers: LudoPlayer[] = [
    { color: 'red', name: 'You', isCPU: false },
    { color: 'green', name: 'CPU 1', isCPU: true },
    { color: 'blue', name: 'CPU 2', isCPU: true },
    { color: 'yellow', name: 'CPU 3', isCPU: true },
];

const LudoScreen: React.FC<LudoScreenProps> = ({ wallet, setWallet, setActiveScreen }) => {
    const [bet, setBet] = useState(10);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameState, setGameState] = useState<GameState>({
        players: initialPlayers,
        currentPlayerIndex: 0,
        diceValue: null,
        message: 'Place your bet to start.',
        isRolling: false,
        winner: null,
    });

    const handlePlaceBet = () => {
        if (wallet < bet) {
            setGameState(prev => ({ ...prev, message: "Not enough funds to place this bet." }));
            return;
        }
        setWallet(prev => prev - bet);
        setGameStarted(true);
        setGameState(prev => ({ ...prev, message: "Roll the dice!", diceValue: null }));
    };

    const handleRollDice = () => {
        if (gameState.isRolling || gameState.winner) return;

        setGameState(prev => ({ ...prev, isRolling: true }));

        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            // Simplified game logic: just cycle through players and declare a winner randomly
            const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

            if (Math.random() > 0.95 && gameState.currentPlayerIndex === 0) { // Randomly win
                setGameState(prev => ({
                    ...prev,
                    diceValue: roll,
                    isRolling: false,
                    winner: 'red',
                    message: `You rolled a ${roll} and won! You won ₹${bet * 2}!`,
                }));
                setWallet(prev => prev + (bet * 2));
            } else if (Math.random() > 0.9) { // Randomly lose
                 const winnerIndex = Math.floor(Math.random() * 3) + 1;
                 const winnerColor = gameState.players[winnerIndex].color;
                 setGameState(prev => ({
                    ...prev,
                    diceValue: roll,
                    isRolling: false,
                    winner: winnerColor,
                    message: `You rolled a ${roll}. ${gameState.players[winnerIndex].name} won! You lost ₹${bet}.`,
                }));
            } else {
                setGameState(prev => ({
                    ...prev,
                    currentPlayerIndex: nextPlayerIndex,
                    diceValue: roll,
                    isRolling: false,
                    message: `You rolled a ${roll}. Now it's ${gameState.players[nextPlayerIndex].name}'s turn.`,
                }));
            }
        }, 1000);
    };
    
    const playAgain = () => {
        setGameStarted(false);
        setBet(10);
        setGameState({
            players: initialPlayers,
            currentPlayerIndex: 0,
            diceValue: null,
            message: 'Place your bet to start.',
            isRolling: false,
            winner: null,
        });
    }

    const Dice: React.FC<{ value: number | null, isRolling: boolean }> = ({ value, isRolling }) => (
        <div className={`w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl font-bold text-black transition-transform duration-500 ${isRolling ? 'animate-spin' : ''}`}>
            {value || '?'}
        </div>
    );

    if (!gameStarted) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 relative">
                 <div className="flex w-full justify-start absolute top-4 left-4">
                    <button onClick={() => setActiveScreen(Screen.Home)} className="text-gray-300 hover:text-white p-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                </div>
                <LudoIcon className="w-24 h-24 text-pink-400 mb-4"/>
                <h1 className="text-3xl font-bold mb-2 text-pink-300">Play Ludo & Win</h1>
                <p className="mb-8 text-gray-400">Place your bet and win double!</p>
                <div className="bg-gray-700 p-6 rounded-lg w-full max-w-sm">
                    <p className="text-gray-300">Current Balance: <span className="font-bold text-white">₹{wallet}</span></p>
                    <label className="block text-sm font-medium text-gray-300 mt-4 mb-2">Bet Amount</label>
                    <input type="number" value={bet} onChange={e => setBet(Math.max(10, parseInt(e.target.value) || 10))} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-center" />
                    <button onClick={handlePlaceBet} className="mt-6 w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Place Bet & Play
                    </button>
                    {gameState.message !== 'Place your bet to start.' && <p className="text-red-400 mt-4 text-sm">{gameState.message}</p>}
                </div>
            </div>
        )
    }

    return (
        <div className="p-2 flex flex-col h-full items-center">
             <div className="w-full flex justify-start">
                <button onClick={() => setActiveScreen(Screen.Home)} className="text-gray-300 hover:text-white p-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
            </div>
            <LudoBoard players={gameState.players} />
            <div className="mt-4 p-4 bg-gray-700 rounded-lg w-full max-w-sm flex flex-col items-center">
                <p className="text-sm font-semibold text-center mb-4 min-h-[40px]">{gameState.message}</p>
                 <div className="flex items-center justify-around w-full">
                    <Dice value={gameState.diceValue} isRolling={gameState.isRolling} />
                    {gameState.winner ? (
                        <button onClick={playAgain} className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg">
                            Play Again
                        </button>
                    ) : (
                         <button onClick={handleRollDice} disabled={gameState.isRolling} className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 px-6 rounded-lg disabled:bg-gray-500">
                            Roll Dice
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LudoScreen;
