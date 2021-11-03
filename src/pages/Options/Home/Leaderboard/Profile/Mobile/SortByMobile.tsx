import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';

import arrowDown from 'assets/images/filters/arrow-down.svg';
import { useTranslation } from 'react-i18next';

const SortWrapper = styled(FlexDiv)`
    width: 100%;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #f6f6fa;
    margin-bottom: 22px;
    margin-left: 20px;
    &:before {
        content: url(${arrowDown});
        position: absolute;
        right: 16px;
        transform: scale(0.9);
    }
`;

const TextWrapper = styled.p`
    height: 40px;
    width: 100%;
    border-radius: 23px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 16px;
    line-height: 38px;
    padding: 0 10px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    padding-left: 20px;
    margin: 1px;
    &::placeholder {
        font-size: 16px;
        color: #f6f6f6;
        opacity: 0.7;
    }
`;

type SortByMobileProps = {
    filter: string | undefined;
    onClick: () => void;
};

export const SortByMobile: React.FC<SortByMobileProps> = ({ filter, onClick, children }) => {
    const { t } = useTranslation();
    return (
        <>
            <SortWrapper className="" onClick={onClick}>
                <TextWrapper>
                    {t(`options.filters-labels.sort-by`)}: {filter}
                </TextWrapper>
                {children}
            </SortWrapper>
        </>
    );
};
