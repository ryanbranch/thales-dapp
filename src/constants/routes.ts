export const ROUTES = {
    Home: '/',
    Options: {
        Home: '/markets',
        HotMarkets: '/markets?anchor=hot-markets',
        CustomMarkets: '/markets?userFilter2=custom',
        CompetitionMarkets: '/markets?userFilter2=competition',
        Overview: '/markets?anchor=overview',
        CreateMarket: '/markets/create-market',
        MarketMatch: '/markets/:marketAddress',
        Leaderboard: '/markets/leaderboard',
        QuickTrading: '/markets/quick-trading',
        QuickTradingCompetition: '/markets/competition-orders',
        Token: '/token',
    },
};
export default ROUTES;
