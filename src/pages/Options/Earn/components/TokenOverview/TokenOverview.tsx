import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, Image } from 'theme/common';
import styled from 'styled-components';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { SYNTHS_MAP, THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { TokenInfo } from 'types/token';
import { getIsAppReady } from 'redux/modules/app';
import { EMPTY_VALUE } from 'constants/placeholder';
import useTokenInfoQuery from 'queries/token/useTokenInfoQuery';
import thalesTokenIcon from 'assets/images/sidebar/thales-token-white.svg';
import { LightTooltip } from 'pages/Options/Market/components';
import { LINKS } from 'constants/links';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';

export const TokentOverview: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>(undefined);

    const tokenInfoQuery = useTokenInfoQuery({
        enabled: isAppReady,
    });

    useEffect(() => {
        if (tokenInfoQuery.isSuccess && tokenInfoQuery.data) {
            setTokenInfo(tokenInfoQuery.data);
        }
    }, [tokenInfoQuery.isSuccess, tokenInfoQuery.data]);

    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, SYNTHS_MAP.sETH, null);

    return (
        <>
            <Container>
                <ItemContainer>
                    <FlexDivCentered>
                        <CustomIcon src={thalesTokenIcon}></CustomIcon>
                        <CryptoName>{THALES_CURRENCY}</CryptoName>
                    </FlexDivCentered>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t('options.earn.overview.price-label')}</Title>
                    <Content>
                        <LightTooltip title={t('options.earn.overview.price-tooltip')}>
                            <StyledLink href={LINKS.Token.DodoPool} target="_blank" rel="noreferrer">
                                {tokenInfo && ethRate !== null
                                    ? formatCurrencyWithSign(USD_SIGN, tokenInfo.price * ethRate)
                                    : EMPTY_VALUE}
                                <ArrowIcon style={{ marginLeft: 4 }} width="10" height="10" />
                            </StyledLink>
                        </LightTooltip>
                    </Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t('options.earn.overview.circulating-supply-label')}</Title>
                    <Content>
                        {tokenInfo
                            ? formatCurrencyWithKey(THALES_CURRENCY, tokenInfo.circulatingSupply, 0, true)
                            : EMPTY_VALUE}
                    </Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t('options.earn.overview.total-supply-label')}</Title>
                    <Content>
                        {tokenInfo
                            ? formatCurrencyWithKey(THALES_CURRENCY, tokenInfo.totalSupply, 0, true)
                            : EMPTY_VALUE}
                    </Content>
                </ItemContainer>
            </Container>
        </>
    );
};

const ItemContainer: React.FC<{ className?: string }> = (props) => (
    <InnerItemContainer className={props.className ?? ''}>
        <Item>{props.children}</Item>
    </InnerItemContainer>
);

const Container = styled(FlexDiv)`
    background: #04045a;
    border-radius: 16px;
    margin-bottom: 20px;
`;

const InnerItemContainer = styled(FlexDivCentered)`
    flex: 1;
    min-height: 76px;
    &:not(:last-child) {
        border-right: 2px solid rgba(1, 38, 81, 0.5);
    }
    color: #b8c6e5;
`;

const Item = styled(FlexDivColumnCentered)`
    flex: initial;
`;

const Title = styled.p`
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    color: #b8c6e5;
`;

const Content = styled.div<{ fontSize?: number }>`
    font-style: normal;
    font-weight: bold;
    font-size: ${(props) => props.fontSize || 16}px;
    line-height: 18px;
    color: #f6f6fe;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const StyledLink = styled.a`
    color: #f6f6fe;
    &path {
        fill: #f6f6fe;
    }
    &:hover {
        color: #00f9ff;
        & path {
            fill: #00f9ff;
        }
    }
`;

const ArrowIcon = styled(ArrowHyperlinkIcon)``;

const CustomIcon = styled(Image)`
    margin-right: 6px;
    width: 40px;
    height: 40px;
`;

const CryptoName = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
`;

export default TokentOverview;
