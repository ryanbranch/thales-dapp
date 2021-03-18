import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { OptionsMarkets } from 'types/options';
import { getPhaseAndEndDate } from '../../utils/options';
import snxJSConnector from '../../utils/snxJSConnector';
import { ContractWrappers } from '@0x/contract-wrappers';

declare const window: any;
const contractWrappers = new ContractWrappers(window.ethereum, {
    chainId: snxJSConnector.contractSettings.networkId,
});

const useBinaryOptionsMarketsQuery = (networkId: number, options?: UseQueryOptions<OptionsMarkets>) => {
    const {
        snxJS: { sUSD },
    } = snxJSConnector as any;
    return useQuery<OptionsMarkets>(
        QUERY_KEYS.BinaryOptions.Markets,
        async () => {
            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
            });
            for (const o of optionsMarkets) {
                if ('trading' == getPhaseAndEndDate(o.biddingEndDate, o.maturityDate, o.expiryDate).phase) {
                    let isV4 = true;
                    let baseUrl = 'https://api.0x.org/sra/v4/';
                    if (snxJSConnector.contractSettings.networkId == 42) {
                        isV4 = false;
                        baseUrl = 'https://kovan.api.0x.org/sra/v3/';
                    }
                    if (isV4) {
                        let response = await fetch(
                            baseUrl + `orderbook?baseToken=` + o.longAddress + '&quoteToken=' + sUSD.contract.address
                        );
                        let responseJ = await response.json();
                        const totalLong = responseJ.bids.total + responseJ.asks.total;
                        o.orders = [];
                        if (responseJ.asks.records && responseJ.asks.records.length > 0) {
                            o.orders.push(responseJ.asks.records);
                        }
                        if (responseJ.bids.records && responseJ.bids.records.length > 0) {
                            o.orders.push(responseJ.bids.records);
                        }

                        response = await fetch(
                            baseUrl + `orderbook?baseToken=` + o.shortAddress + '&quoteToken=' + sUSD.contract.address
                        );
                        responseJ = await response.json();

                        if (responseJ.asks.records && responseJ.asks.records.length > 0) {
                            o.orders.push(responseJ.asks.records);
                        }
                        if (responseJ.bids.records && responseJ.bids.records.length > 0) {
                            o.orders.push(responseJ.bids.records);
                        }

                        const totalShort = responseJ.bids.total + responseJ.asks.total;

                        o.openOrders = totalLong + totalShort;
                    } else {
                        let makerAssetData = await contractWrappers.devUtils
                            .encodeERC20AssetData(o.longAddress)
                            .callAsync();
                        const takerAssetData = await contractWrappers.devUtils
                            .encodeERC20AssetData(sUSD.contract.address)
                            .callAsync();

                        let response = await fetch(
                            baseUrl + `orderbook?baseAssetData=` + makerAssetData + '&quoteAssetData=' + takerAssetData
                        );
                        let responseJ = await response.json();
                        const totalLong = responseJ.bids.total + responseJ.asks.total;
                        o.orders = [];
                        if (responseJ.asks.records && responseJ.asks.records.length > 0) {
                            o.orders.push(responseJ.asks.records);
                        }
                        if (responseJ.bids.records && responseJ.bids.records.length > 0) {
                            o.orders.push(responseJ.bids.records);
                        }

                        makerAssetData = await contractWrappers.devUtils
                            .encodeERC20AssetData(o.shortAddress)
                            .callAsync();

                        response = await fetch(
                            baseUrl + `orderbook?baseAssetData=` + makerAssetData + '&quoteAssetData=' + takerAssetData
                        );
                        responseJ = await response.json();

                        if (responseJ.asks.records && responseJ.asks.records.length > 0) {
                            o.orders.push(responseJ.asks.records);
                        }
                        if (responseJ.bids.records && responseJ.bids.records.length > 0) {
                            o.orders.push(responseJ.bids.records);
                        }

                        const totalShort = responseJ.bids.total + responseJ.asks.total;

                        o.openOrders = totalLong + totalShort;
                    }
                }
            }

            return optionsMarkets;
        },
        options
    );
};

export default useBinaryOptionsMarketsQuery;
