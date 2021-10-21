import React, { useEffect, useState } from 'react';
import {
    ClaimItem,
    EarnSection,
    FullRow,
    MaxButton,
    MaxButtonContainer,
    SectionContentContainer,
    SectionHeader,
} from '../../components';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import { Button, FlexDiv, FlexDivCentered, GradientText } from '../../../../../theme/common';
import NumericInput from '../../../Market/components/NumericInput';
import { InputLabel } from '../../../Market/components';
import useThalesBalanceQuery from '../../../../../queries/walletBalances/useThalesBalanceQuery';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { ethers } from 'ethers';
import { bigNumberFormatter, getAddress } from '../../../../../utils/formatters/ethers';
import { APPROVAL_EVENTS } from '../../../../../constants/events';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';
import NetworkFees from '../../../components/NetworkFees';
import { formatGasLimit } from '../../../../../utils/network';
import { refetchUserTokenTransactions } from 'utils/queryConnector';
import styled from 'styled-components';
import ComingSoon from 'components/ComingSoon';
import { dispatchMarketNotification } from 'utils/options';

type Properties = {
    thalesStaked: string;
    setThalesStaked: (staked: string) => void;
    balance: string;
    setBalance: (staked: string) => void;
    isUnstaking: boolean;
};

const Stake: React.FC<Properties> = ({ thalesStaked, setThalesStaked, isUnstaking, balance, setBalance }) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const [amountToStake, setAmountToStake] = useState<number | string>(0);
    const [isAllowingStake, setIsAllowingStake] = useState<boolean>(false);
    const [isStaking, setIsStaking] = useState<boolean>(false);
    const [hasStakeAllowance, setStakeAllowance] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const { stakingThalesContract } = snxJSConnector as any;

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setBalance(thalesBalanceQuery.data.balance);
        }
    }, [thalesBalanceQuery.isSuccess, thalesBalanceQuery.data]);

    useEffect(() => {
        if (!!stakingThalesContract) {
            const { thalesTokenContract } = snxJSConnector as any;
            const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = stakingThalesContract.address;
            const getAllowance = async () => {
                try {
                    const allowance = await thalesTokenContractWithSigner.allowance(walletAddress, addressToApprove);
                    setStakeAllowance(!!bigNumberFormatter(allowance));
                } catch (e) {
                    console.log(e);
                }
            };

            const registerAllowanceListener = () => {
                thalesTokenContractWithSigner.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                    if (owner === walletAddress && spender === getAddress(addressToApprove)) {
                        setStakeAllowance(true);
                        setIsAllowingStake(false);
                    }
                });
            };
            if (isWalletConnected) {
                getAllowance();
                registerAllowanceListener();
            }
            return () => {
                thalesTokenContractWithSigner.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
            };
        }
    }, [walletAddress, isWalletConnected, hasStakeAllowance, stakingThalesContract]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const amount = ethers.utils.parseEther(amountToStake.toString());
            try {
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const gasEstimate = await stakingThalesContractWithSigner.estimateGas.stake(amount);
                setGasLimit(formatGasLimit(gasEstimate, networkId));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!amountToStake || isStaking || !!stakingThalesContract) return;
        fetchGasLimit();
    }, [amountToStake, isStaking, hasStakeAllowance, walletAddress]);

    const getStakeButton = () => {
        if (!hasStakeAllowance) {
            return (
                <Button disabled={isAllowingStake} onClick={handleAllowance} className="primary">
                    {!isAllowingStake
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: THALES_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: THALES_CURRENCY,
                          })}
                </Button>
            );
        }

        return (
            <Button
                disabled={!amountToStake || isStaking || isUnstaking}
                onClick={handleStakeThales}
                className="primary"
            >
                {!isStaking
                    ? `${t('options.earn.thales-staking.stake.stake')} ${formatCurrencyWithKey(
                          THALES_CURRENCY,
                          amountToStake
                      )}`
                    : `${t('options.earn.thales-staking.stake.staking')} ${formatCurrencyWithKey(
                          THALES_CURRENCY,
                          amountToStake
                      )}...`}
            </Button>
        );
    };

    const handleStakeThales = async () => {
        try {
            setTxErrorMessage(null);
            setIsStaking(true);
            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
            const toStake = ethers.utils.parseEther(amountToStake.toString());
            const tx = await stakingThalesContractWithSigner.stake(toStake, {
                gasLimit,
            });
            const txResult = await tx.wait();

            if (txResult && txResult.events) {
                dispatchMarketNotification(t('options.earn.thales-staking.stake.confirmation-message'));
                const rawData = txResult.events[txResult.events?.length - 1];
                if (rawData && rawData.decode) {
                    const netThalesBalance = ethers.utils
                        .parseEther(balance)
                        .sub(ethers.utils.parseEther(amountToStake.toString()));
                    const netThalesStaked = ethers.utils
                        .parseEther(thalesStaked)
                        .add(ethers.utils.parseEther(amountToStake.toString()));
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setBalance(ethers.utils.formatEther(netThalesBalance));
                    setAmountToStake(0);
                    setThalesStaked(ethers.utils.formatEther(netThalesStaked));
                    setIsStaking(false);
                }
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsStaking(false);
        }
    };

    const handleAllowance = async () => {
        const { thalesTokenContract } = snxJSConnector as any;
        const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);

        const addressToApprove = stakingThalesContract.address;
        try {
            setIsAllowingStake(true);
            const gasEstimate = await thalesTokenContractWithSigner.estimateGas.approve(
                addressToApprove,
                ethers.constants.MaxUint256
            );
            const tx = (await thalesTokenContractWithSigner.approve(addressToApprove, ethers.constants.MaxUint256, {
                gasLimit: formatGasLimit(gasEstimate, networkId),
            })) as ethers.ContractTransaction;

            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setStakeAllowance(true);
                setIsAllowingStake(false);
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsAllowingStake(false);
        }
    };

    const tokenStakingDisabled = process.env.REACT_APP_TOKEN_STAKING_DISABLED === 'true';

    return (
        <EarnSection
            spanOnTablet={5}
            orderOnMobile={1}
            orderOnTablet={1}
            style={{ gridColumn: 'span 3', gridRow: 'span 2' }}
        >
            <SectionHeader>{t('options.earn.thales-staking.stake.stake')}</SectionHeader>
            {tokenStakingDisabled && <ComingSoon />}
            {!tokenStakingDisabled && (
                <SectionContentContainer style={{ height: '100%' }}>
                    <StyledClaimItem>
                        <BalanceTitle>{t('options.earn.thales-staking.stake.available-to-stake')}:</BalanceTitle>
                        <GradientText
                            gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                            fontSize={25}
                            fontWeight={600}
                        >
                            {formatCurrencyWithKey(THALES_CURRENCY, balance)}
                        </GradientText>
                    </StyledClaimItem>
                    <FlexDiv style={{ paddingBottom: '15px' }}>
                        <NumericInput
                            style={{ flex: 1, padding: '15px 0px 0 20px', maxWidth: '60%' }}
                            value={amountToStake}
                            onChange={(_, value) => {
                                if (+value <= +balance) {
                                    setAmountToStake(value);
                                }
                            }}
                            step="0.01"
                            max={balance.toString()}
                            disabled={isStaking || isUnstaking}
                        />
                        <InputLabel>{t('options.earn.thales-staking.stake.amount-to-stake')}</InputLabel>
                        <MaxButtonContainer>
                            <MaxButton
                                disabled={isStaking || isUnstaking}
                                onClick={() => {
                                    setAmountToStake(balance);
                                }}
                            >
                                {t('common.max')}
                            </MaxButton>
                        </MaxButtonContainer>
                    </FlexDiv>
                    <NetworkFees gasLimit={gasLimit} disabled={isStaking} />
                    <StakeButtonDiv>{getStakeButton()}</StakeButtonDiv>
                    <FullRow>
                        <ValidationMessage
                            showValidation={txErrorMessage !== null}
                            message={txErrorMessage}
                            onDismiss={() => setTxErrorMessage(null)}
                        />
                    </FullRow>
                </SectionContentContainer>
            )}
        </EarnSection>
    );
};

const BalanceTitle = styled.span`
    font-size: 16px;
    padding-bottom: 8px;
`;

const StakeButtonDiv = styled(FlexDivCentered)`
    padding-top: 40px;
    @media (max-width: 1024px) {
        padding-top: 15px;
    }
`;

const StyledClaimItem = styled(ClaimItem)`
    @media (max-width: 1024px) {
        padding-top: 15px;
        padding-bottom: 67px;
    }
    @media (max-width: 767px) {
        padding-top: 0px;
        padding-bottom: 0px;
    }
`;

export default Stake;
