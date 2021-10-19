import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import { CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
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
import ethBurnedOracleInstance from 'utils/contracts/ethBurnedOracleInstance';
import { OptionsMarketInfo } from 'types/options';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import SPAAnchor from '../../../../../../components/SPAAnchor';

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
        const fetchMarketData = async () => {
            if (marketQuery.isSuccess && marketQuery.data) {
                if (marketQuery.data.customMarket) {
                    try {
                        const sportFeedContract = new ethers.Contract(
                            marketQuery.data.oracleAdress,
                            sportFeedOracleContract.abi,
                            (snxJSConnector as any).provider
                        );
                        const data: any = await Promise.all([
                            sportFeedContract.targetName(),
                            sportFeedContract.eventName(),
                            sportFeedContract.targetOutcome(),
                        ]);
                        setOptionsMarket({
                            ...marketQuery.data,
                            country: data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0],
                            eventName: data[1],
                            outcome: data[2],
                        });
                    } catch (e) {
                        const sportFeedContract = new ethers.Contract(
                            marketQuery.data.oracleAdress,
                            ethBurnedOracleInstance.abi,
                            (snxJSConnector as any).provider
                        );
                        const data: any = await Promise.all([
                            sportFeedContract.targetName(),
                            sportFeedContract.eventName(),
                            sportFeedContract.targetOutcome(),
                        ]);
                        setOptionsMarket({
                            ...marketQuery.data,
                            country: data[0] === 'ETH/BTC Flippening Market' ? 'ETH/BTC market cap ratio' : data[0],
                            eventName: data[1],
                            outcome:
                                data[1] === 'Flippening Markets' || data[1] === 'ETH/BTC market cap ratio'
                                    ? bigNumberFormatter(data[2]).toString()
                                    : Number(data[2]).toString(),
                        });
                    }
                } else {
                    setOptionsMarket(marketQuery.data);
                }
            }
        };
        fetchMarketData();
    }, [marketQuery.isSuccess]);

    return (
        <FlexDiv className="leaderboard__profile__rowBorder">
            <FlexDivColumnCentered className="leaderboard__profile__rowBackground leaderboard__profile__rowBackground--left">
                <SPAAnchor
                    style={{
                        pointerEvents: market.phase !== 'expiry' ? 'auto' : 'none',
                    }}
                    path={buildOptionsMarketLink(market.address)}
                >
                    {market.customMarket ? (
                        <>
                            {countryToCountryCode(optionsMarket?.country as string) && (
                                <ReactCountryFlag
                                    countryCode={countryToCountryCode(optionsMarket?.country as string)}
                                    style={{ width: 50, height: 50, marginRight: 0, marginLeft: 32 }}
                                    svg
                                />
                            )}
                            {!countryToCountryCode(optionsMarket?.country as string) && (
                                <CustomIcon
                                    style={{ marginLeft: 32, width: 50, height: 50 }}
                                    src={eventToIcon(optionsMarket?.eventName as string)}
                                ></CustomIcon>
                            )}
                            <CryptoName style={{ marginTop: 8, marginLeft: 32 }}>
                                {market.country ? market.country : optionsMarket?.country}
                            </CryptoName>
                        </>
                    ) : (
                        <>
                            <CurrencyIcon
                                currencyKey={market.currencyKey}
                                synthIconStyle={{ width: 50, height: 50, marginRight: 0, marginLeft: 32 }}
                            />
                            <CryptoName style={{ marginTop: 8, marginLeft: 32 }}>
                                {getSynthName(market.currencyKey)}
                            </CryptoName>
                            <CryptoKey style={{ marginLeft: 32 }}>{optionsMarket?.asset}</CryptoKey>
                        </>
                    )}
                </SPAAnchor>
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
                <Row className="text-profile-data">
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.strikePrice)}</Text>
                    <Text style={{ flex: 2 }}>{formatCurrencyWithSign(USD_SIGN, market.poolSize)}</Text>
                    <Text style={{ flex: 1 }}>{formatShortDate(market.maturityDate)}</Text>
                </Row>
                <Row className="text-ms leaderboard__profile__rowBackground__columns">
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.common.tx-status')}
                    </Text>
                    <Text className="bold" style={{ flex: 2 }}>
                        {t('options.leaderboard.profile.common.amount')}
                    </Text>
                    <Text className="bold" style={{ flex: 1 }}>
                        {t('options.leaderboard.profile.common.timestamp')}
                    </Text>
                </Row>
                {!showAll && (
                    <Row className="text-profile-data" style={usersMints.length === 1 ? { paddingBottom: 16 } : {}}>
                        <Text style={{ flex: 2 }}>
                            <ViewEtherscanLink hash={usersMints[0].hash} />
                        </Text>
                        <Text style={{ flex: 2 }}>{usersMints[0].amount}</Text>
                        <Text style={{ flex: 1 }}>{formatTxTimestamp(new Date(usersMints[0].timestamp))}</Text>
                    </Row>
                )}
                <RowScrollable>
                    {showAll &&
                        usersMints?.map((mint, index) => (
                            <Row className="text-profile-data" key={index} style={{ width: '126.3%' }}>
                                <Text style={{ flex: 1 }}>
                                    <ViewEtherscanLink hash={mint.hash} />
                                </Text>
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
                                style={{ background: 'transparent', padding: '24px 24px' }}
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
    ::-webkit-scrollbar {
        width: 5px;
    }
`;

export const CustomIcon = styled(Image)`
    margin-right: 0px;
    width: 100px;
    height: 100px;
`;

export default UsersMints;
