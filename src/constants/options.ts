import { Phase, Side } from '../pages/Options/types';

export const PHASE: Record<Phase, number> = {
    bidding: 0,
    trading: 1,
    maturity: 2,
    expiry: 3,
};

export const SIDE: Record<Side | number, number | Side> = {
    long: 0,
    short: 1,
    0: 'long',
    1: 'short',
};

export const PHASES = ['bidding', 'trading', 'maturity', 'expiry'] as Phase[];