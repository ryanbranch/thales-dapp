import React, { useMemo, useState } from 'react';
import { OptionsMarkets } from 'types/options';
import { useTranslation } from 'react-i18next';
import { FlexDiv, FlexDivCentered, Image, Text } from 'theme/common';
import MarketCard from '../MarketCard';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import useInterval from 'hooks/useInterval';
import previous from 'assets/images/previous-page.svg';
import next from 'assets/images/next-page.svg';
import coins from 'assets/images/coins-mono.png';

type HotMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

export const HotMarkets: React.FC<HotMarketsProps> = ({ optionsMarkets }) => {
    const { t } = useTranslation();
    const [currentMarket, setCurrentMarket] = useState(0);
    const [shouldUseInterval, setShoudUseInterval] = useState(true);

    const currentMarkets = useMemo(() => {
        const markets = [];
        markets.push(
            currentMarket - 1 < 0 ? optionsMarkets[optionsMarkets.length - 1] : optionsMarkets[currentMarket - 1]
        );
        markets.push(optionsMarkets[currentMarket]);
        for (let index = 1; index < 4; index++) {
            markets.push(
                currentMarket + index > optionsMarkets.length - 1
                    ? optionsMarkets[currentMarket + index - optionsMarkets.length]
                    : optionsMarkets[currentMarket + index]
            );
        }

        return markets;
    }, [currentMarket]);

    useInterval(() => {
        if (shouldUseInterval) {
            document.getElementById('market-cards-wrapper')?.classList.add('next');
            setTimeout(() => {
                document.getElementById('market-cards-wrapper')?.classList.remove('next');
                setCurrentMarket(() => {
                    return currentMarket === optionsMarkets.length - 1 ? 0 : currentMarket + 1;
                });
            }, 1000);
        }
    }, 5000);

    return (
        <Wrapper id="hot-markets">
            <Text className="text-xxl palge-grey">{t('options.home.explore-markets.discover')}</Text>
            <FlexDivCentered className="hot-markets__desktop">
                <Arrow
                    onClick={() => {
                        setShoudUseInterval(false);
                        document.getElementById('market-cards-wrapper')?.classList.add('previous');
                        setTimeout(() => {
                            document.getElementById('market-cards-wrapper')?.classList.remove('previous');
                            setCurrentMarket(currentMarket === 0 ? optionsMarkets.length - 1 : currentMarket - 1);
                        }, 1000);
                    }}
                    src={previous}
                ></Arrow>
                <div style={{ width: 1020, overflow: 'hidden' }}>
                    <Cards id="market-cards-wrapper">
                        {currentMarkets.map((optionsMarket, index) => {
                            return <MarketCard key={index} optionMarket={optionsMarket} />;
                        })}
                    </Cards>
                </div>

                <Arrow
                    onClick={() => {
                        setShoudUseInterval(false);
                        document.getElementById('market-cards-wrapper')?.classList.add('next');
                        setTimeout(() => {
                            document.getElementById('market-cards-wrapper')?.classList.remove('next');
                            setCurrentMarket(currentMarket === optionsMarkets.length - 1 ? 0 : currentMarket + 1);
                        }, 1000);
                    }}
                    src={next}
                ></Arrow>
            </FlexDivCentered>
            <FlexDiv className="hot-markets__mobile">
                <MarketCard optionMarket={currentMarkets[0]}></MarketCard>
                <Image src={coins}></Image>
            </FlexDiv>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumn)`
    padding: 50px 110px;
    position: relative;
    max-height: 490px;
`;

const Arrow = styled(Image)`
    width: 24px;
    height: 40px;
    margin: 0 10px;
    cursor: pointer;
`;

const Cards = styled(FlexDiv)`
    position: relative;
    left: -340px;
    &.next {
        transition: left 1s;
        left: -680px;
    }
    &.previous {
        transition: left 1s;
        left: 0;
    }
`;

export default HotMarkets;
