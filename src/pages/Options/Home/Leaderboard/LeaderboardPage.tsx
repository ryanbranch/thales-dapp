import React from 'react';
import ROUTES from 'constants/routes';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Background, Button, FlexDivCentered, FlexDivColumn, Image, Text, Wrapper } from 'theme/common';
import MarketHeader from '../MarketHeader';
import LeaderboardTable from './LeaderboardTable';
import TradingCompetition from './TradingCompetition';
import twitter from 'assets/images/twitter.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';

const LeaderboardPage: React.FC = () => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [selectedTab, setSelectedTab] = useState('trading-competition');
    const [accVerified, setAccVerified] = useState(false);

    const optionsTabContent: Array<{
        id: string;
        name: string;
        disabled: boolean;
    }> = useMemo(
        () => [
            {
                id: 'trading-competition',
                name: t('options.leaderboard.trading-competition.tab-title'),
                disabled: false,
            },
            {
                id: 'leaderboard',
                name: t('options.leaderboard.board.tab-title'),
                disabled: false,
            },
            {
                id: 'profile',
                name: t('options.leaderboard.profile.tab-title'),
                disabled: false,
            },
        ],
        [t]
    );

    const tweetUrl = useMemo(() => {
        if (walletAddress) {
            const url = 'http://localhost:3002/auth/' + walletAddress;
            fetch(url).then(async (result) => {
                if ((await result.text()) === 'true') {
                    console.log('verify');
                    setAccVerified(true);
                }
            });

            return 'https://twitter.com/intent/tweet?text=' + TWEET_TEXT + walletAddress;
        } else {
            return '';
        }
    }, [walletAddress]);

    const checkAddress = async () => {
        window.open(tweetUrl, '_blank');
        let attempt = 0;
        const intervalId = setInterval(async () => {
            attempt = attempt + 1;
            if (attempt > 5) {
                console.log('clear');
                clearInterval(intervalId);
            }
            const baseUrl = 'http://localhost:3002/twitter/' + walletAddress;
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            console.log(result);
            if (result) {
                console.log('clear');
                setAccVerified(true);
                clearInterval(intervalId);
            }
        }, 5000);
    };

    return (
        <Background style={{ minHeight: '100vh' }}>
            <Wrapper>
                <FlexDivColumn className="leaderboard">
                    <MarketHeader route={ROUTES.Options.Leaderboard} />
                    {walletAddress && !accVerified && (
                        <Button
                            className="primary"
                            style={{
                                alignSelf: 'center',
                                margin: '40px auto',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            onClick={checkAddress}
                        >
                            <Image src={twitter} style={{ height: 32, width: 32, marginRight: 8 }}></Image>
                            <Text className="text-m pale-grey bold">Verify Account</Text>
                        </Button>
                    )}
                </FlexDivColumn>

                <FlexDivColumn>
                    <LeaderboardTitle className="pale-grey">Leaderboards</LeaderboardTitle>
                    <MainContentContainer>
                        <OptionsTabContainer>
                            {optionsTabContent.map((tab, index) => (
                                <OptionsTab
                                    isActive={tab.id === selectedTab}
                                    key={index}
                                    index={index}
                                    onClick={() => (tab.disabled ? {} : setSelectedTab(tab.id))}
                                    className={`${tab.id === selectedTab ? 'selected' : ''} ${
                                        tab.disabled ? 'disabled' : ''
                                    }`}
                                >
                                    {`${tab.name} ${tab.disabled ? `(${t('common.coming-soon').toLowerCase()})` : ''}`}
                                </OptionsTab>
                            ))}
                        </OptionsTabContainer>
                        <WidgetsContainer>
                            {selectedTab === 'trading-competition' && <TradingCompetition />}
                            {selectedTab === 'leaderboard' && <LeaderboardTable />}
                            {/* {selectedTab === 'profile' && <Profile />} */}
                        </WidgetsContainer>
                    </MainContentContainer>
                </FlexDivColumn>
            </Wrapper>
        </Background>
    );
};

const TWEET_TEXT = 'Please let me join the Thales trading competition with address ';

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
    color: rgb(116, 139, 198);
    border-left: 1px solid rgba(116, 139, 198, 0.5);
    border-right: 1px solid rgba(116, 139, 198, 0.5);
    border-top: 1px solid rgba(116, 139, 198, 0.5);
    user-select: none;
    &.selected:not(.disabled) {
        background: #121776;
        transition: 0.2s;
        color: #f6f6fe;
        transform: scale(1.1) translateY(-1px);
        border-top: 1px solid rgba(202, 145, 220, 0.2);
        border-left: 1px solid rgba(202, 145, 220, 0.2);
        border-right: 1px solid rgba(202, 145, 220, 0.2);
    }
    &:hover:not(.selected):not(.disabled) {
        cursor: pointer;
        color: #00f9ff;
    }
    img {
        margin-left: 10px;
        margin-bottom: 5px;
    }
    &.disabled {
        color: rgb(116, 139, 198, 0.4);
        border-left: 1px solid rgba(116, 139, 198, 0.1);
        border-right: 1px solid rgba(116, 139, 198, 0.1);
        border-top: 1px solid rgba(116, 139, 198, 0.1);
        background: linear-gradient(90deg, #141874, #10126c);
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

const LeaderboardTitle = styled(Text)`
    font-size: 39px;
    padding: 30px;
    font-weight: 600;
`;

export default LeaderboardPage;
