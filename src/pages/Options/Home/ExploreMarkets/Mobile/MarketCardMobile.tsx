import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { Result } from 'pages/Options/Market/components/MarketOverview/MarketOverview';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, FlexDivRow, Image, Text } from 'theme/common';
import { HistoricalOptionsMarketInfo } from 'types/options';
import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { getSynthName } from 'utils/snxJSConnector';
import { CryptoKey, CryptoName } from '../../MarketCard/MarketCard';
import arrowUp from 'assets/images/arrow-up.svg';
import arrowDown from 'assets/images/arrow-down.svg';
import { navigateToOptionsMarket } from 'utils/routes';
import { countryToCountryCode } from '../../MarketsTable/MarketsTable';
import ReactCountryFlag from 'react-country-flag';

type MarketCardMobileProps = {
    optionsMarkets: HistoricalOptionsMarketInfo[];
    exchangeRates: Rates | null;
};

export const MarketCardMobile: React.FC<MarketCardMobileProps> = ({ optionsMarkets, exchangeRates }) => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            {optionsMarkets.map((market: HistoricalOptionsMarketInfo, index) => {
                const currentAssetPrice = exchangeRates?.[market.currencyKey] || 0;
                const strikeAndAssetPriceDifference = getPercentageDifference(currentAssetPrice, market.strikePrice);
                return (
                    <CardWrapper
                        onClick={() => {
                            if (market.phase !== 'expiry') {
                                navigateToOptionsMarket(market.address);
                            }
                        }}
                        className="cardWrapper"
                        key={index}
                    >
                        <Container>
                            <FlexDivRow style={{ marginBottom: 16 }}>
                                {market.customMarket ? (
                                    <ReactCountryFlag
                                        countryCode={countryToCountryCode(market.country as any)}
                                        style={{ width: 32, height: 32, marginRight: 10 }}
                                        svg
                                    />
                                ) : (
                                    <CurrencyIcon
                                        currencyKey={market.currencyKey}
                                        synthIconStyle={{ width: 36, height: 36 }}
                                    />
                                )}

                                <FlexDivColumnCentered>
                                    {market.customMarket ? (
                                        <Text className="text-m pale-grey">{market.country}</Text>
                                    ) : (
                                        <>
                                            <CryptoName style={{ fontSize: 16, marginBottom: 0 }}>
                                                {getSynthName(market.currencyKey)}
                                            </CryptoName>
                                            <CryptoKey style={{ fontSize: 14 }}>{market.asset}</CryptoKey>
                                        </>
                                    )}
                                </FlexDivColumnCentered>
                                <Phase className={market.phase}>{t(`options.phases.${market.phase}`)}</Phase>
                            </FlexDivRow>
                            <FlexDivRow style={{ marginBottom: 8 }}>
                                <FlexDivColumnCentered>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {t('options.home.market-card.strike-price')}
                                    </Text>
                                    <Text className="text-ms pale-grey">
                                        {market.customMarket
                                            ? market.eventName
                                            : formatCurrencyWithSign(USD_SIGN, market.strikePrice)}
                                    </Text>
                                </FlexDivColumnCentered>
                                <FlexDivColumnCentered style={{ textAlign: 'right' }}>
                                    <Text className="text-ms pale-grey">
                                        {t('options.home.market-card.difference-text')}:
                                    </Text>
                                    {currentAssetPrice > market.strikePrice ? (
                                        <DifferenceWrapper>
                                            <Image style={{ width: 14, height: 14 }} src={arrowDown} />
                                            <Text className="text-ms red lh16">
                                                {strikeAndAssetPriceDifference.toFixed(2)}%
                                            </Text>
                                        </DifferenceWrapper>
                                    ) : (
                                        <DifferenceWrapper>
                                            <Image style={{ width: 14, height: 14 }} src={arrowUp} />
                                            <Text className="text-ms green lh16">
                                                {strikeAndAssetPriceDifference.toFixed(2)}%
                                            </Text>
                                        </DifferenceWrapper>
                                    )}
                                </FlexDivColumnCentered>
                            </FlexDivRow>
                            <FlexDivRow style={{ marginBottom: 8 }}>
                                <FlexDivColumnCentered>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {t('options.home.market-card.pool-size')}
                                    </Text>
                                    <Text className="text-ms pale-grey">
                                        {formatCurrencyWithSign(USD_SIGN, market.poolSize)}
                                    </Text>
                                </FlexDivColumnCentered>
                            </FlexDivRow>
                            <FlexDivRow style={{ marginBottom: 8, alignItems: 'flex-start' }}>
                                <FlexDivColumnCentered>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {t('options.home.market-card.time-remaining')}
                                    </Text>
                                    <Text>
                                        <TimeRemaining end={market.timeRemaining} fontSize={14} />
                                    </Text>
                                </FlexDivColumnCentered>
                                <FlexDivColumnCentered style={{ textAlign: 'center' }}>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {t('options.market.overview.current-result-label')}
                                    </Text>
                                    <Result isLong={currentAssetPrice > market.strikePrice}>
                                        {currentAssetPrice < market.strikePrice ? 'SHORT' : 'LONG'}
                                    </Result>
                                </FlexDivColumnCentered>
                                <FlexDivColumnCentered style={{ textAlign: 'right' }}>
                                    <Text className="text-xxs pale-grey" style={{ marginBottom: 2 }}>
                                        {t('options.home.market-card.open-orders')}
                                    </Text>
                                    <Text className="text-ms pale-grey">{market.openOrders}</Text>
                                </FlexDivColumnCentered>
                            </FlexDivRow>
                        </Container>
                    </CardWrapper>
                );
            })}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    margin: 20px 0;
    .cardWrapper:nth-child(even) {
        justify-self: end;
    }
    @media (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
        .cardWrapper {
            justify-self: center !important;
        }
    }
`;

const CardWrapper = styled(FlexDiv)`
    width: 100%;
    align-items: center;
    position: relative;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    height: 192px;
    padding: 1px;
    border-radius: 23px;
    @media (max-width: 768px) {
        max-width: 400px;
    }
`;

const Container = styled.div`
    border-radius: 23px;
    background: #04045a;
    width: 100%;
    height: 100%;
    padding: 14px 30px;
`;

const Phase = styled.p`
    &.trading {
        background: #01b977;
    }
    &.maturity {
        background: #355dff;
    }
    &.expiry {
        background: #c62937;
    }
    border-radius: 15px;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    padding: 10px 34px;
    text-transform: uppercase;
    height: 36px;
`;

const DifferenceWrapper = styled(FlexDivCentered)`
    position: relative;
    height: 0;
    display: flex;
    justify-content: flex-end;
    top: 14px;
`;