import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import { DisplayContentsAnchor } from 'pages/Options/Home/MarketsTable/components';
import { countryToCountryCode, eventToIcon } from 'pages/Options/Home/MarketsTable/MarketsTable';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumnCentered, Text, Image } from 'theme/common';
import { formatShortDate, formatTxTimestamp } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink } from 'utils/routes';
import snxJSConnector, { getSynthName } from 'utils/snxJSConnector';
import ReactCountryFlag from 'react-country-flag';
import '../media.scss';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { ethers } from 'ethers';
import { RootState } from 'redux/rootReducer';
import sportFeedOracleContract from 'utils/contracts/sportFeedOracleInstance';
import { OptionsMarketInfo } from 'types/options';

type UsersMintsProps = {
    usersMints: any[];
    market: any;
};

const UsersMints: React.FC<UsersMintsProps> = ({ usersMints, market }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [showAll, setShowAll] = useState<boolean>(false);
    const [optionsMarket, setOptionsMarket] = useState<OptionsMarketInfo | null>(null);

    const marketQuery = useBinaryOptionsMarketQuery(market.address, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (marketQuery.isSuccess && marketQuery.data) {
            if (marketQuery.data.customMarket) {
                const sportFeedContract = new ethers.Contract(
                    marketQuery.data.oracleAdress,
                    sportFeedOracleContract.abi,
                    (snxJSConnector as any).provider
                );
                Promise.all([
                    sportFeedContract.targetName(),
                    sportFeedContract.eventName(),
                    sportFeedContract.targetOutcome(),
                ]).then((data) => {
                    setOptionsMarket({ ...marketQuery.data, country: data[0], eventName: data[1], outcome: data[2] });
                });
            } else {
                setOptionsMarket(marketQuery.data);
            }
        }
    }, [marketQuery.isSuccess]);

    return (
        <FlexDiv className="leaderboard__profile__rowBorder">
            <FlexDivColumnCentered className="leaderboard__profile__rowBackground leaderboard__profile__rowBackground--left">
                <DisplayContentsAnchor
                    style={{
                        pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                    }}
                    href={buildOptionsMarketLink(market.address)}
                >
                    {market.customMarket ? (
                        <>
                            {countryToCountryCode(optionsMarket?.country as string) && (
                                <ReactCountryFlag
                                    countryCode={countryToCountryCode(optionsMarket?.country as string)}
                                    style={{ width: 50, height: 50, marginRight: 0 }}
                                    svg
                                />
                            )}
                            {!countryToCountryCode(optionsMarket?.country as string) && (
                                <CustomIcon src={eventToIcon(optionsMarket?.eventName as string)}></CustomIcon>
                            )}
                            {market.country}
                        </>
                    ) : (
                        <>
                            <CurrencyIcon
                                currencyKey={market.currencyKey}
                                synthIconStyle={{ width: 50, height: 50, marginRight: 0 }}
                            />
                            <CryptoName style={{ marginTop: 8 }}>{getSynthName(market.currencyKey)}</CryptoName>
                            <CryptoKey>{market.asset}</CryptoKey>
                        </>
                    )}
                </DisplayContentsAnchor>
            </FlexDivColumnCentered>
            <FlexDivColumnCentered className="text-ms leaderboard__profile__rowBackground leaderboard__profile__rowBackground--right">
                <Row>
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.markets.strike-price')}
                    </Text>
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.markets.pool-size')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.markets.maturity-date')}
                    </Text>
                </Row>
                <Row className="text-m">
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                    <Text style={{ flex: 1 }}>{formatShortDate(market.maturityDate)}</Text>
                </Row>
                <Row className="text-ms leaderboard__profile__rowBackground__columns">
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.common.amount')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.common.timestamp')}
                    </Text>
                </Row>
                {!showAll && (
                    <Row className="text-m" style={usersMints.length === 1 ? { paddingBottom: 16 } : {}}>
                        <Text style={{ flex: 1 }}>{usersMints[0].amount}</Text>
                        <Text style={{ flex: 1 }}>{formatTxTimestamp(new Date(usersMints[0].timestamp))}</Text>
                    </Row>
                )}
                <RowScrollable>
                    {showAll &&
                        usersMints?.map((mint, index) => (
                            <Row className="text-m" key={index} style={{ width: '106.5%' }}>
                                <Text style={{ flex: 1 }}>{mint.amount}</Text>
                                <Text style={{ flex: 1 }}>{formatTxTimestamp(new Date(mint.timestamp))}</Text>
                            </Row>
                        ))}
                </RowScrollable>

                {usersMints.length > 1 && (
                    <Row>
                        <Text style={{ flex: 3 }}></Text>
                        <FlexDivColumnCentered className="text-ms leaderboard__profile__rowBackground__buttonContainer">
                            <Button
                                className="primary"
                                style={{ background: 'transparent', padding: '24px 35px' }}
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll
                                    ? t('options.leaderboard.profile.common.view-less')
                                    : t('options.leaderboard.profile.common.view-more')}
                            </Button>
                        </FlexDivColumnCentered>

                        <Text style={{ flex: 4 }}></Text>
                    </Row>
                )}
            </FlexDivColumnCentered>
        </FlexDiv>
    );
};

export const CryptoKey = styled.p`
    font-family: Inter !important;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: #808191;
`;

export const Row = styled(FlexDiv)`
    color: #f6f6fe;
    line-height: 16px;
    font-weight: 600;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
`;

export const RowScrollable = styled(FlexDiv)`
    flex-direction: column;
    overflow-x: hidden;
    max-height: 245px;
    max-width: 95%;
`;

export const CustomIcon = styled(Image)`
    margin-right: 0px;
    width: 100px;
    height: 100px;
`;

export default UsersMints;
