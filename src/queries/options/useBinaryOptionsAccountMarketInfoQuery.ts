import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { AccountMarketInfo } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';

const useBinaryOptionsAccountMarketInfoQuery = (
    marketAddress: string,
    walletAddress: string,
    options?: UseQueryOptions<AccountMarketInfo>
) => {
    return useQuery<AccountMarketInfo>(
        QUERY_KEYS.BinaryOptions.AccountMarketInfo(marketAddress, walletAddress),
        async () => {
            const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getAccountMarketData(
                marketAddress,
                walletAddress
            );
            console.log(result);
            return {
                long: bigNumberFormatter(result.balances.long),
                short: bigNumberFormatter(result.balances.short),
            };
        },
        options
    );
};

export default useBinaryOptionsAccountMarketInfoQuery;
