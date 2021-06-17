import { Modal } from '@material-ui/core';
import styled from 'styled-components';
import { FlexDiv, FlexDivRow } from 'theme/common';
import { ReactComponent as CloseIcon } from 'assets/images/close.svg';

export const StyledModal = styled(Modal)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ModalContainer = styled.div`
    width: 500px;
    background: #04045a;
    border-radius: 23px;
    padding: 20px 30px 30px 30px;
`;

export const ModalHeader = styled(FlexDivRow)`
    margin-bottom: 20px;
`;

export const ModalTitle = styled(FlexDiv)`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #f6f6fe;
`;

export const ModalSummaryContainer = styled.div`
    padding: 10px;
`;

export const CloseIconContainer = styled(CloseIcon)`
    :hover {
        cursor: pointer;
    }
`;