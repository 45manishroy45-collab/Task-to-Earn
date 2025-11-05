
import React from 'react';
import { LudoPlayer } from '../types';

interface LudoBoardProps {
    players: LudoPlayer[];
}

const PlayerInfo: React.FC<{ player: LudoPlayer }> = ({ player }) => (
    <div className="flex items-center space-x-2">
        <div className={`w-4 h-4 rounded-full bg-${player.color}-500`}></div>
        <span className="text-sm font-medium">{player.name}</span>
    </div>
);

const LudoBoard: React.FC<LudoBoardProps> = ({ players }) => {
    // This is a simplified, static representation of a Ludo board.
    // In a real game, piece positions would be dynamic.
    const colors = ['red', 'blue', 'green', 'yellow'];
    
    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 w-full max-w-sm">
                {players.map(p => <PlayerInfo key={p.color} player={p}/>)}
            </div>
            <div className="relative w-72 h-72 bg-gray-900 border-2 border-gray-600 grid grid-cols-15 grid-rows-15">
                {/* Simplified static board drawing */}
                {colors.map((color, i) => {
                    const positions = [
                        'top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'
                    ];
                    const textColors = ['red', 'blue', 'green', 'yellow'];
                    return (
                        <div key={color} className={`absolute w-28 h-28 bg-${color}-600 ${positions[i]} flex items-center justify-center`}>
                           <div className={`w-20 h-20 bg-gray-800 rounded-lg text-${textColors[i]}-300 flex items-center justify-center font-bold text-2xl`}>
                               {color.charAt(0).toUpperCase()}
                           </div>
                        </div>
                    );
                })}

                {/* Center home */}
                <div className="absolute top-28 left-28 w-16 h-16 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 transform rotate-45"></div>

                {/* Paths */}
                <div className="absolute top-0 left-28 w-16 h-72 bg-gray-700"></div>
                <div className="absolute top-28 left-0 w-72 h-16 bg-gray-700"></div>
            </div>
        </div>
    );
};

export default LudoBoard;
