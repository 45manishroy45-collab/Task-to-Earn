
export enum Screen {
    Home,
    Withdraw,
    Profile,
    Captcha,
    Survey,
    Ludo,
    Referral,
    WithdrawalHistory,
    SupportChat
}

export interface Profile {
    name: string;
    email: string;
    address: string;
    upi: string;
}

export interface Survey {
    id: string;
    q: string; // question
    a: string[]; // answers
}

export interface Withdrawal {
    id: string;
    amount: number;
    destination: string;
    date: Date;
    status: 'Pending' | 'Approved' | 'Failed';
}

// Types for Ludo Game
export type LudoPlayerColor = 'red' | 'green' | 'blue' | 'yellow';

export interface LudoPlayer {
    color: LudoPlayerColor;
    name: string;
    isCPU: boolean;
}

export interface GameState {
    players: LudoPlayer[];
    currentPlayerIndex: number;
    diceValue: number | null;
    message: string;
    isRolling: boolean;
    winner: LudoPlayerColor | null;
}
