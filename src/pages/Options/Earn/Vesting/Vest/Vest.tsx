import {
    ButtonContainer,
    ClaimItem,
    // ClaimMessage,
    ClaimTitle,
    EarnSection,
    SectionContentContainer,
    SectionHeader,
} from '../../components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, GradientText } from '../../../../../theme/common';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import NetworkFees from '../../../components/NetworkFees';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import useEscrowThalesQuery from '../../../../../queries/staking/useEscrowThalesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { formatGasLimit } from '../../../../../utils/network';
import { ethers } from 'ethers';
import { dispatchMarketNotification } from 'utils/options';
import styled from 'styled-components';

const Vest: React.FC = () => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimable, setClaimable] = useState('0');
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const { escrowThalesContract } = snxJSConnector as any;

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!escrowThalesContract,
    });

    useEffect(() => {
        if (escrowThalesQuery.isSuccess && escrowThalesQuery.data) {
            setClaimable(escrowThalesQuery.data.claimable);
        }
    }, [escrowThalesQuery.isSuccess, escrowThalesQuery.data]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            try {
                const escrowThalesContractWithSigner = escrowThalesContract.connect((snxJSConnector as any).signer);
                const toVest = ethers.utils.parseEther(claimable.toString());
                const gasEstimate = await escrowThalesContractWithSigner.estimateGas.vest(toVest);
                setGasLimit(formatGasLimit(gasEstimate, networkId));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!isWalletConnected || !+claimable || !escrowThalesContract) return;
        fetchGasLimit();
    }, [isWalletConnected, walletAddress, claimable, escrowThalesContract]);

    const handleVest = async () => {
        try {
            setTxErrorMessage(null);
            setIsClaiming(true);
            const escrowThalesContractWithSigner = escrowThalesContract.connect((snxJSConnector as any).signer);
            const toVest = ethers.utils.parseEther(claimable.toString());

            const tx = (await escrowThalesContractWithSigner.vest(toVest, {
                gasLimit,
            })) as ethers.ContractTransaction;
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('options.earn.vesting.vest.confirmation-message'));
                setClaimable('0');
                setIsClaiming(false);
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsClaiming(false);
        }
    };

    const getVestButton = () => {
        return (
            <Button onClick={handleVest} disabled={isClaiming || !+claimable} className="primary">
                {!isClaiming
                    ? t('options.earn.vesting.vest.vest') + ` ${formatCurrencyWithKey(THALES_CURRENCY, claimable)}`
                    : t('options.earn.vesting.vest.vesting') +
                      ` ${formatCurrencyWithKey(THALES_CURRENCY, claimable)}...`}
            </Button>
        );
    };

    return (
        <EarnSection orderOnTablet={1} spanOnTablet={5}>
            <StyledSectionHeader>{t('options.earn.vesting.vest.vesting')}</StyledSectionHeader>
            <SectionContentContainer>
                <StyledClaimItem>
                    <ClaimTitle>{t('options.earn.vesting.vest.available-to-vest')}:</ClaimTitle>
                    <GradientText
                        gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                        fontSize={31}
                        fontWeight={600}
                    >
                        {formatCurrencyWithKey(THALES_CURRENCY, claimable, 0, true)}
                    </GradientText>
                </StyledClaimItem>
                {<NetworkFees gasLimit={gasLimit} disabled={isClaiming} />}
                <ButtonContainer>{getVestButton()}</ButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentContainer>
        </EarnSection>
    );
};

const StyledClaimItem = styled(ClaimItem)`
    @media (max-width: 767px) {
        padding-bottom: 15px;
    }
`;

const StyledSectionHeader = styled(SectionHeader)`
    padding-bottom: 25px;
    @media (min-width: 768px) {
        display: none;
    }
`;

export default Vest;
