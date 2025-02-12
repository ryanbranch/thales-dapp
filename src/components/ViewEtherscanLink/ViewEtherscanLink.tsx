import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { getEtherscanTxLink } from 'utils/etherscan';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import styled from 'styled-components';

type ViewEtherscanLinkProps = {
    isDisabled?: boolean;
    hash: string;
};

export const ViewEtherscanLink: React.FC<ViewEtherscanLinkProps> = ({ hash }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <>
            <StyledLink href={getEtherscanTxLink(networkId, hash)} target="_blank" rel="noreferrer">
                {t('common.transaction.view')}
                <ArrowIcon width="8" height="8" />
            </StyledLink>
        </>
    );
};

const StyledLink = styled.a`
    color: #f6f6fe;
    &:hover {
        color: #4564ae;
    }
`;

export const ArrowIcon = styled(ArrowHyperlinkIcon)`
    margin-left: 5px;
    ${StyledLink}:hover & path {
        fill: #4564ae;
    }
`;

export default ViewEtherscanLink;
