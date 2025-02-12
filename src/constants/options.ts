import { Phase, OptionSide } from '../types/options';

export const PHASE: Record<Phase, number> = {
    trading: 0,
    maturity: 1,
    expiry: 2,
};

export const SIDE: Record<OptionSide | number, number | OptionSide> = {
    long: 0,
    short: 1,
    0: 'long',
    1: 'short',
};

export const PHASES = ['trading', 'maturity', 'expiry'] as Phase[];
export const PHASES_CARDS = ['trading', 'maturity'] as Phase[];

export const SLIPPAGE_THRESHOLD = 0.1;

export const AMOUNT_PERCENTAGE = [25, 50, 75, 100];
export const SLIPPAGE_PERCENTAGE = [0.5, 1];

export enum OrderPeriod {
    TEN_MINUTES = 'TEN_MINUTES',
    ONE_HOUR = 'ONE_HOUR',
    ONE_DAY = 'ONE_DAY',
    ONE_WEEK = 'ONE_WEEK',
    TRADING_END = 'TRADING_END',
    CUSTOM = 'CUSTOM',
}

export const ORDER_PERIOD_IN_SECONDS: Record<OrderPeriod, number> = {
    TEN_MINUTES: 600,
    ONE_HOUR: 3600,
    ONE_DAY: 86400,
    ONE_WEEK: 604800,
    TRADING_END: 0,
    CUSTOM: 0,
};

export type OrderPeriodItem = {
    value: OrderPeriod;
    i18nLabel: string;
};

export const ORDER_PERIOD_ITEMS_MAP: OrderPeriodItem[] = [
    {
        value: OrderPeriod.TEN_MINUTES,
        i18nLabel: 'options.common.order-periods.10M',
    },
    {
        value: OrderPeriod.ONE_HOUR,
        i18nLabel: 'options.common.order-periods.1H',
    },
    {
        value: OrderPeriod.ONE_DAY,
        i18nLabel: 'options.common.order-periods.1D',
    },
    {
        value: OrderPeriod.ONE_WEEK,
        i18nLabel: 'options.common.order-periods.1W',
    },
    {
        value: OrderPeriod.TRADING_END,
        i18nLabel: 'options.common.order-periods.trading-end',
    },
];

export enum OrderbookFilterEnum {
    ALL = 'all',
    BUY = 'buy',
    SELL = 'sell',
}
export enum Zero0xErrorCode {
    VALIDATION_FAILED = 100,
    TRANSACTION_INVALID = 105,
}

export enum Zero0xErrorReason {
    MATCHED_MY_OWN_ORDERS = 'IncompleteTransformERC20Error',
    MAKER_WALLET_INSUFFICIENT_BALANCE = 'WalletExecuteDelegateCallFailedError',
    TAKER_WALLET_INSUFFICIENT_BALANCE = 'SpenderERC20TransferFromFailedError',
}

export const ORDERBOOK_AMOUNT_THRESHOLD = 0.01;

export const INCLUDE_MINTING_FEES = true;
