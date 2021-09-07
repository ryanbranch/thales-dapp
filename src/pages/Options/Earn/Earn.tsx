import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Background, FlexDivCentered, FlexDivColumn, Text } from '../../../theme/common';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from '../../../constants/routes';
import ThalesStaking from './ThalesStaking';
import SnxStaking from './SnxStaking';
import Vesting from './Vesting';
import LPStaking from './LPStaking';

const EarnPage: React.FC = () => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState('snx-stakers');

    const optionsTabContent: Array<{
        id: string;
        name: string;
    }> = useMemo(
        () => [
            {
                id: 'snx-stakers',
                name: t('options.earn.snx-stakers.tab-title'),
            },
            {
                id: 'thales-staking',
                name: t('options.earn.thales-staking.tab-title'),
            },
            {
                id: 'vesting',
                name: t('options.earn.vesting.tab-title'),
            },
            {
                id: 'lp-staking',
                name: t('options.earn.lp-staking.tab-title'),
            },
        ],
        [t]
    );

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%' }}>
            <Container>
                <FlexDivColumn className="earn">
                    <MarketHeader route={ROUTES.Options.Earn} />
                </FlexDivColumn>
            </Container>
            <Container>
                <MainContent>
                    <EarnTitle className="pale-grey">Earn</EarnTitle>
                    <MainContentContainer>
                        <OptionsTabContainer>
                            {optionsTabContent.map((tab, index) => (
                                <OptionsTab
                                    isActive={tab.id === selectedTab}
                                    key={index}
                                    index={index}
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={tab.id === selectedTab ? 'selected' : ''}
                                >
                                    {tab.name}
                                </OptionsTab>
                            ))}
                        </OptionsTabContainer>
                        <WidgetsContainer>
                            {selectedTab === 'snx-stakers' && <SnxStaking />}
                            {selectedTab === 'thales-staking' && <ThalesStaking />}
                            {selectedTab === 'vesting' && <Vesting />}
                            {selectedTab === 'lp-staking' && <LPStaking />}
                        </WidgetsContainer>
                    </MainContentContainer>
                </MainContent>
            </Container>
        </Background>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
    }
`;

const MainContent = styled(FlexDivColumn)`
    padding: 20px 108px;
`;

const MainContentContainer = styled.div`
    padding-top: 5px;
    overflow: hidden;
`;

const OptionsTabContainer = styled.div`
    height: 50px;
    position: relative;
    width: 95%;
    margin: auto;
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    position: absolute;
    top: 0;
    left: ${(props) => props.index * 24.5 + '% '};
    background: linear-gradient(90deg, #141874, #04045a);
    width: 26%;
    z-index: ${(props) => (props.isActive ? 5 : 4 - props.index)};
    transition: 0.5s;
    transition-property: color;
    height: 50px;
    border-radius: 15px 15px 0 0;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0.15px;
    color: #748bc6;
    border-left: 1px solid rgba(116, 139, 198, 0.5);
    border-right: 1px solid rgba(116, 139, 198, 0.5);
    border-top: 1px solid rgba(116, 139, 198, 0.5);
    user-select: none;
    &.selected {
        background: #121776;
        transition: 0.2s;
        color: #f6f6fe;
        transform: scale(1.1) translateY(-1px);
        border-top: 1px solid rgba(202, 145, 220, 0.2);
        border-left: 1px solid rgba(202, 145, 220, 0.2);
        border-right: 1px solid rgba(202, 145, 220, 0.2);
    }
    &:hover:not(.selected) {
        cursor: pointer;
        color: #00f9ff;
    }
    img {
        margin-left: 10px;
        margin-bottom: 5px;
    }
`;

const WidgetsContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: 20px;
    padding: 20px;
    border: 1px solid rgba(202, 145, 220, 0.2);
    border-radius: 15px;
    background: #121776;
    z-index: 0;
`;

const EarnTitle = styled(Text)`
    font-size: 39px;
    padding: 30px;
    font-weight: 600;
`;

export default EarnPage;
