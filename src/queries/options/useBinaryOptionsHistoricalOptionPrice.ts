import { useQuery } from 'react-query';
import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsTransactions } from 'types/options';
import { calculateTimestampForPeriod } from 'utils/rates';
import { PERIOD_IN_HOURS, Period } from 'constants/period';

const useBinaryOptionsHistoricalOptionPrice = (marketAddress: string, period: Period = Period.ONE_DAY) => {
    const periodInHours = PERIOD_IN_HOURS[period];

    return useQuery<OptionsTransactions>(QUERY_KEYS.BinaryOptions.OptionPrices(marketAddress, period), () =>
        snxData.binaryOptions.historicalOptionPrice({
            market: marketAddress,
            maxTimestamp: Math.trunc(Date.now() / 1000),
            minTimestamp: calculateTimestampForPeriod(periodInHours),
        })
    );
};

export default useBinaryOptionsHistoricalOptionPrice;