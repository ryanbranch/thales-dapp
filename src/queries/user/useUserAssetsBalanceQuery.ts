import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets, UsersAssets } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';

const useUserAssetsBalanceQuery = (
    markets: OptionsMarkets,
    walletAddress: string,
    options?: UseQueryOptions<UsersAssets[]>
) => {
    return useQuery<UsersAssets[]>(
        QUERY_KEYS.User.Assets(markets, walletAddress),
        async () => {
            return Promise.all(
                markets.map((market) =>
                    (snxJSConnector as any).binaryOptionsMarketDataContract
                        .getAccountMarketData(market.address, walletAddress)
                        .then((result: any) => {
                            return {
                                market,
                                balances: {
                                    long: bigNumberFormatter(result.balances.long),
                                    short: bigNumberFormatter(result.balances.short),
                                },
                            };
                        })
                )
            );
        },
        options
    );
};

export default useUserAssetsBalanceQuery;