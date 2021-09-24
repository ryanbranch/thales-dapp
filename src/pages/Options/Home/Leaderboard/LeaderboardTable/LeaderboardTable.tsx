import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    withStyles,
} from '@material-ui/core';
import downSelected from 'assets/images/down-selected.svg';
import down from 'assets/images/down.svg';
import upSelected from 'assets/images/up-selected.svg';
import up from 'assets/images/up.svg';
import { USD_SIGN } from 'constants/currency';
import { TooltipIcon } from 'pages/Options/CreateMarket/components';
import { StyledLink } from 'pages/Options/Market/components/MarketOverview/MarketOverview';
import useLeaderboardQuery, { Leaderboard } from 'queries/options/useLeaderboardQuery';
import useUsersDisplayNamesQuery from 'queries/user/useUsersDisplayNamesQuery';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { Arrow, ArrowsWrapper, TableHeaderLabel } from '../../MarketsTable/components';
import { PaginationWrapper } from '../../MarketsTable/MarketsTable';
import Pagination from '../../MarketsTable/Pagination';
import { SearchInput, SearchWrapper } from '../../SearchMarket/SearchMarket';
import './media.scss';

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const defaultOrderBy = 6; // Volume

const LeaderboardPage: React.FC<any> = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const leaderboardQuery = useLeaderboardQuery(networkId, {
        enabled: isAppReady,
    });
    const leaderboard = leaderboardQuery.data?.leaderboard
        ? leaderboardQuery.data.leaderboard.sort((a, b) => b.volume - a.volume)
        : [];

    const displayNamesQuery = useUsersDisplayNamesQuery({
        enabled: isAppReady,
    });

    const [page, setPage] = useState(0);
    const [searchString, setSearchString] = useState('');
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const numberOfPages = Math.ceil(leaderboard.length / rowsPerPage) || 1;

    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const calcDirection = (cell: HeadCell) => {
        if (orderBy === cell.id) {
            switch (orderDirection) {
                case OrderDirection.NONE:
                    setOrderDirection(OrderDirection.DESC);
                    break;
                case OrderDirection.DESC:
                    setOrderDirection(OrderDirection.ASC);
                    break;
                case OrderDirection.ASC:
                    setOrderDirection(OrderDirection.DESC);
                    setOrderBy(defaultOrderBy);
                    break;
            }
        } else {
            setOrderBy(parseInt(cell.id.toString()));
            setPage(0);
            setOrderDirection(OrderDirection.DESC);
        }
    };

    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages]);

    const displayNamesMap = useMemo(() => (displayNamesQuery.isSuccess ? displayNamesQuery.data : new Map()), [
        displayNamesQuery,
    ]);

    const leaderboardData = useMemo(() => {
        const sortedData = leaderboard.sort((a, b) => {
            if (orderBy === 5) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.trades - a.trades;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.trades - b.trades;
                }
            }
            if (orderBy === 6) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.volume - a.volume;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.volume - b.volume;
                }
            }

            if (orderBy === 7) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.netProfit - a.netProfit;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.netProfit - b.netProfit;
                }
            }

            if (orderBy === 8) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.investment - a.investment;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.investment - b.investment;
                }
            }

            if (orderBy === 9) {
                if (orderDirection === OrderDirection.DESC) {
                    return b.gain - a.gain;
                }
                if (orderDirection === OrderDirection.ASC) {
                    return a.gain - b.gain;
                }
            }
            return 0;
        });
        const data = sortedData.map((leader: any, index: number) => {
            if (orderDirection === OrderDirection.DESC) return { rank: index + 1, ...leader };
            else {
            }
            return { rank: sortedData.length - index, ...leader };
        });
        return data
            .filter((leader) => {
                if (searchString === '') return true;
                if (leader.walletAddress.toLowerCase().includes(searchString.toLowerCase())) {
                    return true;
                }

                const disp = displayNamesMap.get(leader.walletAddress);

                if (disp) {
                    return disp.toLowerCase().includes(searchString.toLowerCase());
                }

                return false;
            })
            .slice(memoizedPage * rowsPerPage, rowsPerPage * (memoizedPage + 1));
    }, [rowsPerPage, memoizedPage, searchString, orderBy, orderDirection, leaderboard]);

    const headCells: HeadCell[] = [
        { id: 1, label: '', sortable: false },
        { id: 2, label: t('options.leaderboard.table.rank-col'), sortable: false },
        { id: 3, label: t('options.leaderboard.table.position-col'), sortable: false },
        { id: 4, label: t('options.leaderboard.table.display-name-col'), sortable: false },
        { id: 5, label: t('options.leaderboard.table.trades-col'), sortable: true },
        { id: 6, label: t('options.leaderboard.table.volume-col'), sortable: true },
        { id: 7, label: t('options.leaderboard.table.netprofit-col'), sortable: true },
        { id: 8, label: t('options.leaderboard.table.investment-col'), sortable: true },
        { id: 9, label: t('options.leaderboard.table.gain-col'), sortable: true },
    ];

    return (
        <FlexDivColumnCentered className="leaderboard__wrapper">
            <FlexDivRow style={{ flexDirection: 'row-reverse' }}>
                <SearchWrapper style={{ alignSelf: 'flex-start', flex: 1, maxWidth: 400, margin: '22px 0' }}>
                    <SearchInput
                        style={{ width: '100%', paddingRight: 40 }}
                        className="leaderboard__search"
                        onChange={(e) => setSearchString(e.target.value)}
                        value={searchString}
                        placeholder={t('options.leaderboard.search-placeholder')}
                    ></SearchInput>
                </SearchWrapper>
            </FlexDivRow>

            <TableContainer
                style={{
                    background: 'transparent',
                    boxShadow: 'none',
                    borderRadius: 0,
                }}
                component={Paper}
            >
                <Table
                    className="leaderboard__table"
                    aria-label="customized table"
                    style={{
                        borderCollapse: 'separate',
                        borderSpacing: '0px 8px',
                    }}
                >
                    <TableHead className="leaderboard__columns" style={{ textTransform: 'uppercase' }}>
                        <TableRow>
                            {headCells.map((cell: HeadCell, index) => {
                                return (
                                    <StyledTableCell
                                        onClick={cell.sortable ? calcDirection.bind(this, cell) : () => {}}
                                        key={index}
                                        style={cell.sortable ? { cursor: 'pointer' } : {}}
                                    >
                                        <TableHeaderLabel
                                            className={`
                                                            ${
                                                                cell.sortable && orderBy === cell.id ? 'selected' : ''
                                                            }  ${
                                                cell.id === 7 ? 'leaderboard__columns__net-profit' : ''
                                            }`}
                                        >
                                            {cell.id === 7 && (
                                                <TooltipIcon
                                                    title={t('options.leaderboard.table.netprofit-col-tooltip')}
                                                ></TooltipIcon>
                                            )}
                                            {cell.label}
                                        </TableHeaderLabel>
                                        {cell.sortable && (
                                            <ArrowsWrapper>
                                                {orderBy === cell.id && orderDirection !== OrderDirection.NONE ? (
                                                    <Arrow
                                                        src={
                                                            orderDirection === OrderDirection.ASC
                                                                ? upSelected
                                                                : downSelected
                                                        }
                                                    />
                                                ) : (
                                                    <>
                                                        <Arrow src={up} />
                                                        <Arrow src={down} />
                                                    </>
                                                )}
                                            </ArrowsWrapper>
                                        )}
                                    </StyledTableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody className="leaderboard__tableBody">
                        {leaderboardData
                            .filter((leader) => leader.walletAddress.toLowerCase() === walletAddress.toLowerCase())
                            .map((leader: any, index: any) => {
                                return (
                                    <StyledTableRow
                                        key={index}
                                        style={{
                                            background:
                                                'linear-gradient(90deg, #3936C7 -10.96%, #2D83D2 46.31%, #23A5DD 103.01%, #35DADB 127.72%)',
                                        }}
                                    >
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell>{(leader as any).rank}</StyledTableCell>
                                        <StyledTableCell>{'position'}</StyledTableCell>
                                        <StyledTableCell>{'Your current rank'}</StyledTableCell>
                                        <StyledTableCell>{leader.trades}</StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, leader.volume, 2)}
                                        </StyledTableCell>
                                        <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                leader.netProfit < 0 ? Math.abs(leader.netProfit) : leader.netProfit,
                                                2
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {formatCurrencyWithSign(USD_SIGN, leader.investment)}
                                        </StyledTableCell>
                                        <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                            {Math.abs(leader.gain).toFixed(1)}%
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        {leaderboardData.map((leader: any, index: any) => {
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell></StyledTableCell>
                                    <StyledTableCell style={{ height: getHeight(leader) }}>
                                        {(leader as any).rank}
                                    </StyledTableCell>
                                    <StyledTableCell>{'position'}</StyledTableCell>
                                    <StyledTableCell>
                                        <StyledLink
                                            href={getEtherscanAddressLink(networkId, leader.walletAddress)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {displayNamesMap.get(leader.walletAddress)
                                                ? displayNamesMap.get(leader.walletAddress)
                                                : leader.walletAddress}
                                        </StyledLink>
                                    </StyledTableCell>
                                    <StyledTableCell>{leader.trades}</StyledTableCell>
                                    <StyledTableCell>
                                        {formatCurrencyWithSign(USD_SIGN, leader.volume, 2)}
                                    </StyledTableCell>
                                    <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                        {formatCurrencyWithSign(
                                            USD_SIGN,
                                            leader.netProfit < 0 ? Math.abs(leader.netProfit) : leader.netProfit,
                                            2
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {formatCurrencyWithSign(USD_SIGN, leader.investment)}
                                    </StyledTableCell>
                                    <StyledTableCell className={`${leader.netProfit < 0 ? 'red' : 'green'}`}>
                                        {Math.abs(leader.gain).toFixed(1)}%
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                    {leaderboard.length !== 0 && (
                        <TableFooter>
                            <TableRow>
                                <PaginationWrapper
                                    rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                                    count={leaderboard.length}
                                    rowsPerPage={rowsPerPage}
                                    page={memoizedPage}
                                    onPageChange={handleChangePage}
                                    ActionsComponent={() => (
                                        <Pagination
                                            page={memoizedPage}
                                            numberOfPages={numberOfPages}
                                            setPage={setPage}
                                        />
                                    )}
                                />
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </TableContainer>
        </FlexDivColumnCentered>
    );
};

interface HeadCell {
    id: keyof Leaderboard[];
    label: string;
    sortable: boolean;
}

export const StyledTableRow = withStyles(() => ({
    root: {
        background: '#04045a',
        '&:last-child': {
            borderBottomLeftRadius: '23px',
            borderBottomRightRadius: '23px',
        },
        '&:last-child > td:first-child': {
            borderBottomLeftRadius: '23px',
            borderTopLeftRadius: '23px !important',
        },
        '&:last-child a:last-child td': {
            borderBottomRightRadius: '23px',
            borderTopRightRadius: '23px !important',
        },
        '&.clickable': {
            cursor: 'pointer',
            '&:hover': {
                background: '#0a0b52',
            },
        },
    },
}))(TableRow);

export const StyledTableCell = withStyles(() => ({
    head: {
        position: 'relative',
        border: 'none',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '16px',
        letterSpacing: ' 0.5px',
        color: '#b8c6e5',
        padding: '13px',
    },
    body: {
        borderTop: '1px solid #CA91DC',
        borderBottom: '1px solid #6AC1D5',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '24px',
        letterSpacing: ' 0.25px',
        color: '#F6F6FE',
        '&:last-child': {
            borderBottomRightRadius: '23px',
            borderTopRightRadius: '23px !important',
            borderRight: '1px solid #6AC1D5',
        },
        '&:first-child': {
            borderBottomLeftRadius: '23px',
            borderTopLeftRadius: '23px',
            borderLeft: '1px solid #CA91DC',
        },
    },
}))(TableCell);

export default LeaderboardPage;

const getHeight = (leader: any) => {
    switch (leader.rank) {
        case 1:
            return 160;
        case 2:
            return 130;
        case 3:
            return 100;
        default:
            return 75;
    }
};
