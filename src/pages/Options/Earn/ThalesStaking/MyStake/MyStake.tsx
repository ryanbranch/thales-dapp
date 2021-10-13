import React, { useEffect, useMemo, useState } from 'react';
import { ClaimMessage, ClaimTitle, EarnSection, EarnSymbol, SectionContent, SectionHeader } from '../../components';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from '../../../../../queries/staking/useEscrowThalesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import { FlexDivColumnCentered, GradientText } from '../../../../../theme/common';
import ComingSoon from 'components/ComingSoon';
import styled from 'styled-components';
import { WEEKLY_REWARDS_THALES } from '../../../../../constants/token';

type Properties = {
    thalesStaked: string;
    setThalesStaked: (staked: string) => void;
    escrowedBalance: number;
    setEscrowedBalance: (escrowed: number) => void;
};

function numberWithCommas(x: string | number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getNumberLabel(labelValue: number) {
    // Nine Zeroes for Billions
    return numberWithCommas(
        Math.abs(Number(labelValue)) >= 1.0e9
            ? Math.round(Math.abs(Number(labelValue)) / 1.0e9) + 'B'
            : // Six Zeroes for Millions
            Math.abs(Number(labelValue)) >= 1.0e6
            ? Math.round(Math.abs(Number(labelValue)) / 1.0e6) + 'M'
            : // Three Zeroes for Thousands
            Math.abs(Number(labelValue)) >= 1.0e3
            ? Math.round(Math.abs(Number(labelValue)) / 1.0e3) + 'K'
            : Math.abs(Number(labelValue))
    );
}

const aprToApy = (interest: number, frequency: number) => ((1 + interest / 100 / frequency) ** frequency - 1) * 100;

const MyStake: React.FC<Properties> = ({ thalesStaked, setThalesStaked, escrowedBalance, setEscrowedBalance }) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const [unstakingAmount, setUnstakingAmount] = useState<string>('0');
    const [fixedPeriodReward, setFixedPeriodReward] = useState<string>('0');
    const [totalStakedAmount, setTotalStakedAmount] = useState<string>('0');
    const [totalEscrowedRewards, setTotalEscrowedRewards] = useState<string>('0');
    const [totalEscrowBalanceNotIncludedInStaking, setTotalEscrowBalanceNotIncludedInStaking] = useState<string>('0');

    const APR = useMemo(
        () =>
            (Number(fixedPeriodReward) * 52 * 100) /
            (Number(totalStakedAmount) + Number(totalEscrowedRewards) - Number(totalEscrowBalanceNotIncludedInStaking)),
        [fixedPeriodReward, totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const APY = useMemo(() => getNumberLabel(aprToApy(APR, 52)), [APR]);

    const totalThalesStaked = useMemo(
        () => Number(totalStakedAmount) + Number(totalEscrowedRewards) - Number(totalEscrowBalanceNotIncludedInStaking),
        [fixedPeriodReward, totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const myStakedShare = useMemo(() => (100 * Number(thalesStaked)) / totalThalesStaked, [
        thalesStaked,
        totalThalesStaked,
    ]);

    const estimatedRewards = useMemo(() => (myStakedShare / 100) * WEEKLY_REWARDS_THALES, [myStakedShare]);

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            const { thalesStaked, unstakingAmount, fixedPeriodReward, totalStakedAmount } = stakingThalesQuery.data;
            setThalesStaked(thalesStaked);
            setUnstakingAmount(unstakingAmount);
            setFixedPeriodReward(fixedPeriodReward);
            setTotalStakedAmount(totalStakedAmount);
        }
        if (escrowThalesQuery.isSuccess && escrowThalesQuery.data) {
            const {
                escrowedBalance,
                totalEscrowedRewards,
                totalEscrowBalanceNotIncludedInStaking,
            } = escrowThalesQuery.data;
            setEscrowedBalance(escrowedBalance);
            setTotalEscrowedRewards(totalEscrowedRewards);
            setTotalEscrowBalanceNotIncludedInStaking(totalEscrowBalanceNotIncludedInStaking);
        }
    }, [stakingThalesQuery.isSuccess, escrowThalesQuery.isSuccess, stakingThalesQuery.data, escrowThalesQuery.data]);

    const tokenStakingDisabled = process.env.REACT_APP_TOKEN_STAKING_DISABLED === 'true';

    const notEligibleForStakingRewards = useMemo(() => {
        return !+thalesStaked && !!+escrowedBalance;
    }, [thalesStaked, escrowedBalance]);

    return (
        <EarnSection
            orderOnMobile={3}
            orderOnTablet={3}
            style={{ gridColumn: 'span 7', gridRow: 'span 1', textAlign: 'center' }}
        >
            <SectionHeader>
                {t('options.earn.thales-staking.my-stake.my-stake')}
                {!tokenStakingDisabled && (
                    <RewardsInfo>
                        <span>APR: {APR.toFixed(2)}%</span> <span>APY: {APY}%</span>
                    </RewardsInfo>
                )}
            </SectionHeader>
            {tokenStakingDisabled && <ComingSoon />}
            {!tokenStakingDisabled && (
                <>
                    <MyStakeContent>
                        <FlexDivColumnCentered>
                            <StyledClaimTitle>
                                {t('options.earn.thales-staking.my-stake.staked-in-contract')}:
                                {!!+unstakingAmount && (
                                    <UnstakingDiv>
                                        <UnstakingTitle>{`${t(
                                            'options.earn.thales-staking.unstake.unstaking'
                                        )} ${formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount)}`}</UnstakingTitle>
                                    </UnstakingDiv>
                                )}
                            </StyledClaimTitle>
                            <GradientText
                                gradient={
                                    notEligibleForStakingRewards
                                        ? '#ffcc00'
                                        : 'linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)'
                                }
                                fontSize={25}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}
                            </GradientText>
                        </FlexDivColumnCentered>
                        <EarnSymbol>+</EarnSymbol>
                        <FlexDivColumnCentered>
                            <StyledClaimTitle>
                                {t('options.earn.thales-staking.my-stake.locked-in-escrow')}:
                            </StyledClaimTitle>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={25}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance)}
                            </GradientText>
                        </FlexDivColumnCentered>
                        <EarnSymbol>=</EarnSymbol>
                        <FlexDivColumnCentered>
                            <StyledClaimTitle>
                                {t('options.earn.thales-staking.my-stake.total-staked')}:
                            </StyledClaimTitle>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={25}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, Number(escrowedBalance) + Number(thalesStaked))}
                            </GradientText>
                        </FlexDivColumnCentered>
                    </MyStakeContent>
                    {notEligibleForStakingRewards && (
                        <ClaimMessage style={{ marginTop: 0 }}>
                            {t('options.earn.thales-staking.my-stake.not-eligible-message')}
                        </ClaimMessage>
                    )}
                    <SectionHeader style={{ fontSize: '18px' }}>
                        {t('options.earn.thales-staking.my-stake.global-staking-stats')}
                    </SectionHeader>
                    <MyStakeContent style={{ paddingTop: '0' }}>
                        <GlobalStatsInfo>
                            <StyledClaimTitle fontSize={15}>
                                {t('options.earn.thales-staking.my-stake.total-thales-staked')}:
                            </StyledClaimTitle>
                            <GradientText
                                gradient={
                                    notEligibleForStakingRewards
                                        ? '#ffcc00'
                                        : 'linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)'
                                }
                                fontSize={23}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, totalThalesStaked)}
                            </GradientText>
                        </GlobalStatsInfo>
                        <GlobalStatsInfo>
                            <StyledClaimTitle fontSize={15}>
                                {t('options.earn.thales-staking.my-stake.my-staked-share')}:
                            </StyledClaimTitle>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={23}
                                fontWeight={600}
                            >
                                {myStakedShare.toFixed(2)}%
                            </GradientText>
                        </GlobalStatsInfo>
                        <GlobalStatsInfo>
                            <StyledClaimTitle fontSize={15}>
                                {t('options.earn.thales-staking.my-stake.estimated-rewards')}:
                            </StyledClaimTitle>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={23}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, estimatedRewards)}
                            </GradientText>
                        </GlobalStatsInfo>
                    </MyStakeContent>
                </>
            )}
        </EarnSection>
    );
};

const MyStakeContent = styled(SectionContent)`
    padding-top: 15px;
    height: 100%;
    @media (max-width: 767px) {
        flex-direction: column;
        padding-top: 45px !important;
    }
`;

const UnstakingDiv = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translate(-50%, -118%);
    display: flex;
    justify-content: center;
`;

const UnstakingTitle = styled.div`
    position: absolute;
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border-radius: 5px;
    padding: 0 5px;
    border: 1px solid #00d1ff;
    font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.4px;
    color: #f6f6fe;
    top: 0;
`;

const StyledClaimTitle = styled(ClaimTitle)<{ fontSize?: number }>`
    position: relative;
    padding-bottom: 10px;
    font-size: ${(props) => (props.fontSize ?? '17') + 'px'};
`;

const RewardsInfo = styled.span`
    font-weight: normal;
    font-size: 18px;
    > * {
        &:nth-child(2) {
            padding-left: 35px;
        }
    }
    @media (max-width: 767px) {
        font-size: 14px;
    }
`;

const GlobalStatsInfo = styled(FlexDivColumnCentered)`
    @media (max-width: 767px) {
        padding-bottom: 20px;
    }
`;

export default MyStake;
