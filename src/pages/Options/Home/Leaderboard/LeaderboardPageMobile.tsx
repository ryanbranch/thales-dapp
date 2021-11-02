import chartActiveIcon from 'assets/images/footer-nav/chart-active.svg';
import chartIcon from 'assets/images/footer-nav/chart.svg';
import orderbookActiveIcon from 'assets/images/footer-nav/orderbook-active.svg';
import orderbookIcon from 'assets/images/footer-nav/orderbook.svg';
import tradeActiveIcon from 'assets/images/footer-nav/trade-active.svg';
import tradeIcon from 'assets/images/footer-nav/trade.svg';
import transactionsActiveIcon from 'assets/images/footer-nav/transactions-active.svg';
import transactionsIcon from 'assets/images/footer-nav/transactions.svg';
import React from 'react';
import styled from 'styled-components';
import { FlexDiv, FlexDivRowCentered, Image } from 'theme/common';
import LeaderboardTable from './LeaderboardTable';
import './media.scss';
import Profile from './Profile';
import Trades from './Trades';
import TradingCompetition from './TradingCompetition';

type LeaderboardPageMobileProps = {
    displayNamesMap: Map<string, string>;
    setSelectedTab: any;
    selectedTab: string;
};

const LeaderboardPageMobile: React.FC<LeaderboardPageMobileProps> = ({
    displayNamesMap,
    selectedTab,
    setSelectedTab,
}) => {
    return (
        <MainContentContainer className="leaderboard-content-mobile">
            <WidgetsContainer>
                {selectedTab === 'trading-competition' && <TradingCompetition displayNamesMap={displayNamesMap} />}
                {selectedTab === 'leaderboard' && <LeaderboardTable displayNamesMap={displayNamesMap} />}
                {selectedTab === 'profile' && <Profile displayNamesMap={displayNamesMap} />}
                {selectedTab === 'trades' && <Trades />}
            </WidgetsContainer>
            <NavFooter>
                <Icon
                    onClick={setSelectedTab.bind(this, 'trading-competition')}
                    src={selectedTab === 'trading-competition' ? tradeActiveIcon : tradeIcon}
                />
                <Icon
                    onClick={setSelectedTab.bind(this, 'leaderboard')}
                    src={selectedTab === 'leaderboard' ? orderbookActiveIcon : orderbookIcon}
                />

                <Icon
                    onClick={setSelectedTab.bind(this, 'profile')}
                    src={selectedTab === 'profile' ? transactionsActiveIcon : transactionsIcon}
                />

                <Icon
                    onClick={setSelectedTab.bind(this, 'trades')}
                    src={selectedTab === 'trades' ? chartActiveIcon : chartIcon}
                />
            </NavFooter>
        </MainContentContainer>
    );
};

const MainContentContainer = styled.div`
    padding-top: 5px;
    overflow: hidden;
`;

// const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
//     position: absolute;
//     top: 0;
//     left: ${(props) => props.index * 25 + '% '};
//     background: linear-gradient(90deg, #141874, #04045a);
//     width: 25%;
//     z-index: ${(props) => (props.isActive ? 5 : 4 - props.index)};
//     transition: 0.5s;
//     transition-property: color;
//     height: 50px;
//     border-radius: 15px 15px 0 0;
//     font-style: normal;
//     font-weight: 600;
//     font-size: 16px;
//     line-height: 40px;
//     text-align: center;
//     letter-spacing: 0.15px;
//     color: rgb(116, 139, 198);
//     border-left: 1px solid rgba(116, 139, 198, 0.5);
//     border-right: 1px solid rgba(116, 139, 198, 0.5);
//     border-top: 1px solid rgba(116, 139, 198, 0.5);
//     user-select: none;
//     &.selected:not(.disabled) {
//         background: #121776;
//         transition: 0.2s;
//         color: #f6f6fe;
//         font-size: 20px;
//         font-weight: 700;
//         transform: scale(1.1) translateY(-1px);
//         border-top: 1px solid rgba(202, 145, 220, 0.2);
//         border-left: 1px solid rgba(202, 145, 220, 0.2);
//         border-right: 1px solid rgba(202, 145, 220, 0.2);
//     }
//     &:hover:not(.selected):not(.disabled) {
//         cursor: pointer;
//         color: #00f9ff;
//     }
//     img {
//         margin-left: 10px;
//         margin-bottom: 5px;
//     }
//     &.disabled {
//         color: rgb(116, 139, 198, 0.4);
//         border-left: 1px solid rgba(116, 139, 198, 0.1);
//         border-right: 1px solid rgba(116, 139, 198, 0.1);
//         border-top: 1px solid rgba(116, 139, 198, 0.1);
//         background: linear-gradient(90deg, #141874, #10126c);
//     }
// `;

const WidgetsContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: 20px;
    padding: 16px 10px;
    border: 1px solid rgba(202, 145, 220, 0.2);
    border-radius: 15px;
    background: #121776;
    z-index: 0;
`;

export const Row = styled(FlexDiv)`
    color: #f6f6fe;
    line-height: 16px;
    font-weight: 600;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
    background-color: #04045a;
    padding-left: 20px;
`;

const NavFooter = styled(FlexDivRowCentered)`
    height: 88px;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #04045a;
    border-radius: 20px 20px 0 0;
    border-top: 1px solid #ca91dc;
    width: 100%;
    padding: 0 65px;
    z-index: 1000;
`;

const Icon = styled(Image)`
    width: 24px;
    height: 26px;
`;

export default LeaderboardPageMobile;
