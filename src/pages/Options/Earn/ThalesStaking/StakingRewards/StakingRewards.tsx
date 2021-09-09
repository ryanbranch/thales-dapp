import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FlexDivColumn, FlexDivColumnCentered, GradientText } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import useOngoingAirdropQuery from 'queries/walletBalances/useOngoingAirdropQuery';
import { ethers } from 'ethers';
import { StakingReward } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { refetchOngoingAirdrop, refetchUserTokenTransactions } from 'utils/queryConnector';
import {
    ButtonContainer,
    ClaimMessage,
    EarnSection,
    PieChartCenterDiv,
    PieChartCenterText,
    PieChartContainer,
    SectionContentContainer,
    SectionHeader,
    LearnMore,
    StyledMaterialTooltip,
} from '../../components';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { Cell, Pie, PieChart } from 'recharts';
import styled from 'styled-components';
import { bigNumberFormatter } from '../../../../../utils/formatters/ethers';

type Properties = {
    escrowedBalance: number;
    setEscrowedBalance: (escrowed: number) => void;
};

const StakingRewards: React.FC<Properties> = ({ escrowedBalance, setEscrowedBalance }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [ongoingAirdrop, setOngoingAirdrop] = useState<StakingReward | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const isClaimAvailable =
        ongoingAirdrop &&
        ongoingAirdrop.reward &&
        ongoingAirdrop.hasClaimRights &&
        !ongoingAirdrop.claimed &&
        !ongoingAirdrop.isClaimPaused;

    const ongoingAirdropQuery = useOngoingAirdropQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

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

    useEffect(() => {
        if (ongoingAirdropQuery.isSuccess && ongoingAirdropQuery.data) {
            setOngoingAirdrop(ongoingAirdropQuery.data);
        }
    }, [ongoingAirdropQuery.isSuccess, ongoingAirdropQuery.data]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            if (ongoingAirdrop && ongoingAirdrop.reward) {
                const { ongoingAirdropContract } = snxJSConnector as any;
                try {
                    const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect(
                        (snxJSConnector as any).signer
                    );
                    const gasEstimate = await ongoingAirdropContractWithSigner.estimateGas.claim(
                        ongoingAirdrop.reward.index,
                        ongoingAirdrop.reward.rawBalance,
                        ongoingAirdrop.reward.proof
                    );
                    setGasLimit(normalizeGasLimit(Number(gasEstimate)));
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (!isWalletConnected || !isClaimAvailable) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable]);

    const handleClaimOngoingAirdrop = async () => {
        if (isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward && gasPrice !== null) {
            const { ongoingAirdropContract } = snxJSConnector as any;
            try {
                setIsClaiming(true);
                const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect((snxJSConnector as any).signer);
                const tx = (await ongoingAirdropContractWithSigner.claim(
                    ongoingAirdrop.reward.index,
                    ongoingAirdrop.reward.rawBalance,
                    ongoingAirdrop.reward.proof,
                    {
                        gasPrice: gasPriceInWei(gasPrice),
                        gasLimit,
                    }
                )) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    refetchOngoingAirdrop(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setOngoingAirdrop({
                        ...ongoingAirdrop,
                        claimed: true,
                    });
                    setEscrowedBalance(escrowedBalance + bigNumberFormatter(ongoingAirdrop.reward.rawBalance));
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const pieData = useMemo(() => {
        if (!isClaimAvailable) {
            return [{ name: 'No data', value: 100, color: '#748bc6' }];
        }
        return [
            {
                name: 'Thales',
                value:
                    isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward
                        ? ongoingAirdrop.reward.stakingBalance
                        : 0,
            },
            {
                name: 'SNX',
                value:
                    isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.snxBalance : 0,
                color: '#00D1FF',
            },
        ];
    }, [ongoingAirdrop]);

    const stakingBalance =
        isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.stakingBalance : 0;
    const snxBalance =
        isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.snxBalance : 0;
    const balance = isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.balance : 0;
    const previousBalance =
        isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.previousBalance : 0;

    return (
        <EarnSection style={{ gridColumn: 'span 7', gridRow: 'span 3' }}>
            <SectionHeader>{t('options.earn.thales-staking.staking-rewards.title')}</SectionHeader>
            <SectionContentContainer>
                <PieChartContainer style={{ alignItems: 'flex-end', marginBottom: '77px' }}>
                    <FlexDivColumnCentered style={{ marginRight: '30px', alignSelf: 'center' }}>
                        <StakingRewardsAmountContainer
                            style={{ marginRight: '30px' }}
                            gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                        >
                            <StakingRewardsAmount>
                                <StakingRewardsTitle>
                                    {t('options.earn.thales-staking.staking-rewards.amount-to-claim-thales')}
                                </StakingRewardsTitle>
                                <GradientText
                                    gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                    fontSize={25}
                                    fontWeight={600}
                                >
                                    {formatCurrencyWithKey(THALES_CURRENCY, stakingBalance)}
                                </GradientText>
                            </StakingRewardsAmount>
                        </StakingRewardsAmountContainer>
                    </FlexDivColumnCentered>
                    <PieChart height={300} width={300}>
                        <defs>
                            <linearGradient
                                id={`thalesGradient`}
                                gradientTransform="translate(1, 0) rotate(200) scale(0.6)"
                            >
                                <stop offset="0%" stopColor={'#3936C7'} />
                                <stop offset="100%" stopColor={'#2D83D2'} />
                            </linearGradient>
                        </defs>
                        <Pie
                            isAnimationActive={false}
                            blendStroke={true}
                            data={pieData}
                            dataKey={'value'}
                            outerRadius={150}
                            innerRadius={115}
                            startAngle={-270}
                            endAngle={90}
                        >
                            {pieData.map((slice, index) => (
                                <Cell key={index} fill={slice.color || 'url(#thalesGradient)'} />
                            ))}
                        </Pie>
                    </PieChart>
                    <FlexDivColumnCentered style={{ marginLeft: '30px', alignSelf: 'center' }}>
                        <StakingRewardsAmountContainer style={{ marginLeft: '30px' }} gradient="#00D1FF">
                            <StakingRewardsAmount>
                                <StakingRewardsTitle>
                                    {t('options.earn.thales-staking.staking-rewards.amount-to-claim-snx')}
                                </StakingRewardsTitle>
                                <GradientText
                                    gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                    fontSize={25}
                                    fontWeight={600}
                                >
                                    {formatCurrencyWithKey(THALES_CURRENCY, snxBalance)}
                                </GradientText>
                            </StakingRewardsAmount>
                        </StakingRewardsAmountContainer>
                    </FlexDivColumnCentered>
                    <PieChartCenterDiv>
                        <FlexDivColumnCentered>
                            <PieChartCenterText>Total</PieChartCenterText>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={20}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, balance)}
                            </GradientText>
                        </FlexDivColumnCentered>
                        <FlexDivColumnCentered style={{ marginTop: 30, marginBottom: 30 }}>
                            <PieChartCenterText>From previous period</PieChartCenterText>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={20}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, previousBalance)}
                            </GradientText>
                        </FlexDivColumnCentered>
                    </PieChartCenterDiv>
                    <LearnMore>
                        <StyledMaterialTooltip
                            arrow={true}
                            title="Rewards are distributed weekly. If you dont claim in a given week, your rewards are carried over and made available to you for next week. Claimed rewards are subject to a 10 weeks vesting period. During the vesting period your escrowed amount will be included in your staked amount and thus effectively earning you more voting power and rewards."
                        >
                            <span>Learn more</span>
                        </StyledMaterialTooltip>
                    </LearnMore>
                </PieChartContainer>
                <NetworkFees gasLimit={gasLimit} disabled={isClaiming} />
                <ButtonContainer>
                    <Button
                        onClick={handleClaimOngoingAirdrop}
                        disabled={!isClaimAvailable || isClaiming}
                        className="primary"
                    >
                        {isClaiming
                            ? t('options.earn.thales-staking.staking-rewards.claiming') +
                              ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}...`
                            : t('options.earn.thales-staking.staking-rewards.claim') +
                              ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}`}
                    </Button>
                    {ongoingAirdrop && ongoingAirdrop.isClaimPaused && (
                        <ClaimMessage>{t('options.earn.thales-staking.staking-rewards.paused-message')}</ClaimMessage>
                    )}
                    {ongoingAirdrop && !ongoingAirdrop.isClaimPaused && !ongoingAirdrop.hasClaimRights && (
                        <ClaimMessage>
                            {t('options.earn.thales-staking.staking-rewards.not-eligible-message')}
                        </ClaimMessage>
                    )}
                    {ongoingAirdrop &&
                        ongoingAirdrop.hasClaimRights &&
                        !ongoingAirdrop.isClaimPaused &&
                        ongoingAirdrop.claimed && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.claimed-message')}
                            </ClaimMessage>
                        )}
                </ButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentContainer>
        </EarnSection>
    );
};

const StakingRewardsAmountContainer = styled.div<{ gradient: string }>`
    position: relative;
    background: ${(props) => props.gradient};
    border-radius: 15px;
    margin-bottom: 20px;
`;

const StakingRewardsAmount = styled(FlexDivColumn)`
    position: relative;
    background: #04045a;
    margin: 2px;
    border-radius: 15px;
    padding: 15px;
    text-align: center;
`;

const StakingRewardsTitle = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 10px;
`;

export default StakingRewards;