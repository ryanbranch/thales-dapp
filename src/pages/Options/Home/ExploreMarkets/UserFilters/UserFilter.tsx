import React from 'react';
import styled from 'styled-components';

type UserFilterProps = {
    img?: string;
    text?: string;
    className?: string;
    onClick?: (param: any) => void;
};

const UserFilter: React.FC<UserFilterProps> = ({ img, text, className, onClick }) => {
    return (
        <FiltersWrapper className={className} onClick={onClick}>
            <BackgroundWrapper>
                <FiltersIcon src={img} />
                <FiltersText>{text}</FiltersText>
            </BackgroundWrapper>
        </FiltersWrapper>
    );
};

const FiltersWrapper = styled.div`
    position: relative;
    border-radius: 20px;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    &.selected,
    &:hover {
        background: #00f9ff;
    }
    margin: 24px;
`;

const BackgroundWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    background: #1c1a71;
    border-radius: 20px;
    height: 135px;
    max-width: 150px;
    min-width: 150px;
    margin: 2px;
    cursor: pointer;
    &.disabled {
        pointer-events: none;
        &:after {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: 100%;
            height: 100%;
            background: rgba(31, 31, 31, 0.4);
            border-radius: 24px;
        }
    }
`;

const FiltersIcon = styled.img`
    display: block;
    position: relative;
    width: 90px;
    height: 90px;
`;

const FiltersText = styled.p`
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    color: #f6f6fe;
`;

export default UserFilter;
