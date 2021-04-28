import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { getIsAppReady } from 'redux/modules/app';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import { RootState } from 'redux/rootReducer';
import { getTransactionPrice } from 'utils/network';
import SelectGasMenu from 'components/SelectGasMenu';
import { getCustomGasPrice, getGasSpeed } from 'redux/modules/wallet';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { Text } from 'theme/common';

type NetworkFeesProps = {
    gasLimit: number | null;
};

const NetworkFees: React.FC<NetworkFeesProps> = ({ gasLimit }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPrice = useMemo(
        () =>
            customGasPrice !== null
                ? customGasPrice
                : ethGasPriceQuery.data != null
                ? ethGasPriceQuery.data[gasSpeed]
                : null,
        [customGasPrice, ethGasPriceQuery.data, gasSpeed]
    );
    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, SYNTHS_MAP.sETH, null);

    const { t } = useTranslation();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase' }}>
                <Text className="text-xs dark bold capitalize">{t('common.network-fee-gas')}</Text>
                <Text className="text-xs dark bold capitalize">
                    {formatCurrencyWithSign(USD_SIGN, getTransactionPrice(gasPrice, gasLimit, ethRate))}
                </Text>
            </div>
            <div
                style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', marginTop: 10 }}
            >
                <Text className="text-xs dark bold capitalize">{t('common.gas-price-gwei')}</Text>
                <SelectGasMenu gasPrice={gasPrice} />
            </div>
        </div>
    );
};

export default NetworkFees;
