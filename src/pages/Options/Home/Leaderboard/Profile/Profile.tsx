import { Paper, TableContainer, TableRow, withStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useProfilesQuery from 'queries/options/useProfilesQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivColumnCentered, FlexDivRow, Text } from 'theme/common';
import { DropDown, DropDownWrapper } from '../../ExploreMarkets/Mobile/CategoryFilters';
import { SearchInput, SearchWrapper } from '../../SearchMarket/SearchMarket';
import { marketHeading } from '../Trades/Trades';
import './media.scss';
import { SortByMobile } from '../Mobile/SortByMobile';
import { TransactionFilters } from '../Mobile/TransactionFilters';
import UserAllTxTable from './UserAllTxTable';
import UserExercisesTable from './UserExercisesTable';
import UserMintsTable from './UserMintsTable';
import UserTradesTable from './UserTradesTable';
import UserUnclaimedTable from './UserUnclaimedTable';

export enum Filters {
    All = 'all',
    Mints = 'mints',
    Trades = 'trades',
    Exercises = 'exercises',
    Redeemable = 'redeemable',
}

export enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

type ProfileProps = {
    displayNamesMap: Map<string, string>;
};

const Profile: React.FC<ProfileProps> = ({ displayNamesMap }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [userFilter, setUserFilter] = useState<string>('');
    const [filter, setFilter] = useState<string>(Filters.All);
    const [displayAddress, setDisplayAddress] = useState<string>(walletAddress);
    const [showDropdownTxTypes, setShowDropdownTxTypes] = useState(false);
    const [showDropdownSort, setShowDropdownSort] = useState(false);
    const [mobileSort, setMobileSort] = useState(0);
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        window.innerWidth <= 900 ? setMobileSort(1) : '';
    }, [filter]);

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, {
        enabled: isAppReady,
    });

    const handleResize = () => {
        if (window.innerWidth <= 900) {
            setIsMobileView(true);
        } else {
            setIsMobileView(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const marketsData = useMemo(() => (marketsQuery.data ? marketsQuery.data : []), [marketsQuery]);

    const profilesQuery = useProfilesQuery(networkId, {
        enabled: isAppReady,
    });

    const profiles = useMemo(() => (profilesQuery.data ? profilesQuery.data.profiles : new Map()), [profilesQuery]);

    const displayNamesAndAdressesOptions = useMemo(() => {
        const options: any[] = [];
        Array.from(displayNamesMap.values()).forEach((value: any) => options.push(value));
        profiles ? Array.from(profiles.keys()).forEach((key: any) => options.push(key)) : '';

        return options;
    }, [profiles, displayNamesMap]);

    const invertedDisplayNamesMap = useMemo(() => {
        const invertedMap = new Map();
        for (const [key, value] of (displayNamesMap as any).entries()) {
            invertedMap.set(value, key);
        }
        return invertedMap;
    }, [displayNamesMap]);

    const profile = useMemo(() => {
        if (profiles) {
            if (userFilter) {
                const filteredDisplayNames = Array.from(invertedDisplayNamesMap.keys()).filter((key) =>
                    key.toLowerCase().includes(userFilter.toLowerCase())
                );

                const displayName = filteredDisplayNames.length === 1 ? filteredDisplayNames[0] : '';

                if (displayName) {
                    const address = invertedDisplayNamesMap.get(displayName).trim().toLowerCase();
                    setDisplayAddress(address);
                    return profiles.get(address);
                }

                const filteredAdresses = Array.from(profiles.keys()).filter((key) =>
                    key.toLowerCase().includes(userFilter.toLowerCase())
                );
                const address = filteredAdresses.length === 1 ? filteredAdresses[0] : '';
                if (address) {
                    setDisplayAddress(address);
                    return profiles.get(address.trim().toLowerCase());
                }
            }
            if (displayAddress && displayAddress !== walletAddress) {
                setDisplayAddress(walletAddress);
            }
            return profiles.get(walletAddress.trim().toLowerCase());
        }
    }, [profiles, walletAddress, userFilter]);

    const extractedMintsProfileData = useMemo(() => {
        if (profile) {
            return Array.from(new Set(profile.mints.map((mint: any) => mint.tx))).filter((value: any, index, self) => {
                return self.findIndex((mint: any) => mint.hash === value.hash) === index;
            });
        }

        return [];
    }, [userFilter, profilesQuery]);

    const extractedTradesProfileData = useMemo(() => {
        if (profile) {
            return Array.from(
                new Set(
                    profile.trades.map((trade: any) => {
                        return { market: trade.market.address, ...trade.trade };
                    })
                )
            ).filter((value: any, index, self) => {
                return self.findIndex((trade: any) => trade.hash === value.hash) === index;
            });
        }

        return [];
    }, [userFilter, profilesQuery]);

    const extractedExercisesProfileData = useMemo(() => {
        if (profile) {
            return Array.from(new Set(profile.excercises.map((ex: any) => ex.tx))).filter((value: any, index, self) => {
                return self.findIndex((ex: any) => ex.hash === value.hash) === index;
            });
        }
        return [];
    }, [userFilter, profilesQuery]);

    const filterUnclaimedData = (unclaimed: any) => {
        const result = unclaimed.market.result;
        switch (result) {
            case 'long':
                return parseFloat(unclaimed.long) !== 0;
            case 'short':
                return parseFloat(unclaimed.short) !== 0;
        }
    };

    const extractedUnclaimedProfileData = useMemo(() => {
        if (profile) {
            return profile.unclaimed.filter(filterUnclaimedData);
        }
        return [];
    }, [userFilter, profilesQuery]);

    const getSortableColumns = (currentFilter: any) => {
        switch (currentFilter) {
            case Filters.Mints:
                return sortableColumnsMints;
            case Filters.Trades:
                return sortableColumnsTrades;
            case Filters.Exercises:
                return sortableColumnsExercise;
            case Filters.Redeemable:
                return sortableColumnsRedeemable;
            default:
                return sortableColumns;
        }
    };

    const mapColumnWithLabel = (currentFilter: any, columnId: any) => {
        switch (currentFilter) {
            case Filters.Mints:
                return sortableColumnsMints.find((column) => column.id === columnId)?.label;
            case Filters.Trades:
                return sortableColumnsTrades.find((column) => column.id === columnId)?.label;
            case Filters.Exercises:
                return sortableColumnsExercise.find((column) => column.id === columnId)?.label;
            case Filters.Redeemable:
                return sortableColumnsRedeemable.find((column) => column.id === columnId)?.label;
            default:
                return sortableColumns.find((column) => column.id === columnId)?.label;
        }
    };

    const sortableColumns: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.trades.table.date-time-col'), sortable: true },
        { id: 2, label: t('options.leaderboard.trades.table.market-col'), sortable: true },
        { id: 3, label: t('options.leaderboard.trades.table.tx-type-col'), sortable: true },
        { id: 4, label: t('options.leaderboard.trades.table.asset-col'), sortable: true },
        { id: 5, label: t('options.leaderboard.trades.table.type-col'), sortable: true },
        { id: 6, label: t('options.leaderboard.trades.table.amount-col'), sortable: true },
        { id: 7, label: t('options.leaderboard.trades.table.price-col'), sortable: true },
        { id: 8, label: t('options.leaderboard.profile.markets.result'), sortable: true },
    ];

    const sortableColumnsExercise: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.trades.table.date-time-col'), sortable: true },
        { id: 2, label: t('options.leaderboard.trades.table.market-col'), sortable: true },
        { id: 3, label: t('options.leaderboard.trades.table.asset-col'), sortable: true },
        { id: 4, label: t('options.leaderboard.trades.table.amount-col'), sortable: true },
    ];

    const sortableColumnsMints: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.trades.table.date-time-col'), sortable: true },
        { id: 2, label: t('options.leaderboard.trades.table.market-col'), sortable: true },
        { id: 3, label: t('options.leaderboard.trades.table.amount-col'), sortable: true },
    ];

    const sortableColumnsTrades: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.trades.table.date-time-col'), sortable: true },
        { id: 2, label: t('options.leaderboard.trades.table.market-col'), sortable: true },
        { id: 3, label: t('options.leaderboard.trades.table.asset-col'), sortable: true },
        { id: 4, label: t('options.leaderboard.trades.table.type-col'), sortable: true },
        { id: 5, label: t('options.leaderboard.trades.table.amount-col'), sortable: true },
        { id: 6, label: t('options.leaderboard.trades.table.price-col'), sortable: true },
    ];
    const sortableColumnsRedeemable: HeadCell[] = [
        { id: 1, label: t('options.leaderboard.trades.table.market-col'), sortable: true },
        { id: 2, label: t('options.leaderboard.profile.markets.result'), sortable: true },
        { id: 3, label: t('options.leaderboard.trades.table.amount-col'), sortable: true },
    ];

    return (
        <FlexDivColumnCentered className="leaderboard__profile">
            <FlexDivRow className="leaderboard__profile__search-wrap">
                <FlexDiv className="leaderboard__profile__search-wrap__details">
                    <Text className="bold white" style={{ alignSelf: 'center' }}>
                        {!isMobileView
                            ? t('options.leaderboard.profile.transaction-details')
                            : t('options.leaderboard.profile.transaction-details-mobile')}
                    </Text>
                    <Text className="bold white" style={{ alignSelf: 'center', paddingLeft: 15 }}>
                        {displayAddress ? displayAddress : walletAddress}
                    </Text>
                </FlexDiv>
                <SearchWrapper className="leaderboard__profile__search-wrap__search">
                    <SearchAutoCompleteInput
                        style={{ width: '100%' }}
                        className="leaderboard__search"
                        freeSolo
                        options={displayNamesAndAdressesOptions}
                        inputValue={userFilter}
                        onInputChange={(_event, newFilter) => {
                            setUserFilter(newFilter);
                        }}
                        renderInput={(params) => (
                            <div ref={params.InputProps.ref}>
                                <SearchInput
                                    placeholder={t('options.leaderboard.profile.search-placeholder')}
                                    className="leaderboard__search"
                                    style={{
                                        width: '100%',
                                        paddingRight: 40,
                                        paddingLeft: 0,
                                        background: 'transparent',
                                        margin: 0,
                                        fontSize: isMobileView ? 14 : '',
                                    }}
                                    {...params.inputProps}
                                />
                            </div>
                        )}
                    ></SearchAutoCompleteInput>
                </SearchWrapper>
            </FlexDivRow>
            <FlexDivRow className="leaderboard__profile__filter-wrap">
                <FilterWrapper className="leaderboard__profile__filter-wrap__filters">
                    <FilterButton
                        className={
                            'leaderboard__profile__filter-wrap__filters__filter ' +
                            (filter === Filters.All ? 'selected' : '')
                        }
                        onClick={() => setFilter(Filters.All)}
                    >
                        {t('options.leaderboard.profile.filters.all')}
                    </FilterButton>
                    <FilterButton
                        className={
                            'leaderboard__profile__filter-wrap__filters__filter ' +
                            (filter === Filters.Mints ? 'selected' : '')
                        }
                        onClick={() => setFilter(Filters.Mints)}
                    >
                        {t('options.leaderboard.profile.filters.mints')}
                    </FilterButton>
                    <FilterButton
                        className={
                            'leaderboard__profile__filter-wrap__filters__filter ' +
                            (filter === Filters.Trades ? 'selected' : '')
                        }
                        onClick={() => setFilter(Filters.Trades)}
                    >
                        {t('options.leaderboard.profile.filters.trades')}
                    </FilterButton>
                    <FilterButton
                        className={
                            'leaderboard__profile__filter-wrap__filters__filter ' +
                            (filter === Filters.Exercises ? 'selected' : '')
                        }
                        onClick={() => setFilter(Filters.Exercises)}
                    >
                        {t('options.leaderboard.profile.filters.exercises')}
                    </FilterButton>
                    <FilterButton
                        className={
                            'leaderboard__profile__filter-wrap__filters__filter ' +
                            (filter === Filters.Redeemable ? 'selected' : '')
                        }
                        onClick={() => setFilter(Filters.Redeemable)}
                    >
                        {t('options.leaderboard.profile.filters.redeemable')}
                    </FilterButton>
                    {isMobileView && (
                        <>
                            <TransactionFilters
                                onClick={setShowDropdownTxTypes.bind(this, !showDropdownTxTypes)}
                                filter={t(`options.leaderboard.profile.filters.${filter.toLowerCase()}`)}
                            >
                                <DropDownWrapper hidden={!showDropdownTxTypes}>
                                    <DropDown>
                                        {Object.keys(Filters).map((key) => (
                                            <Text
                                                className={`${
                                                    filter === Filters[key as keyof typeof Filters] ? 'selected' : ''
                                                } text-s lh32 pale-grey capitalize`}
                                                onClick={() => setFilter(Filters[key as keyof typeof Filters])}
                                                key={key}
                                            >
                                                {t(`options.leaderboard.profile.filters.${key.toLowerCase()}`)}
                                            </Text>
                                        ))}
                                    </DropDown>
                                </DropDownWrapper>
                            </TransactionFilters>
                            <SortByMobile
                                onClick={setShowDropdownSort.bind(this, !showDropdownSort)}
                                filter={mapColumnWithLabel(filter, mobileSort)}
                            >
                                <DropDownWrapper
                                    className="markets-mobile__sorting-dropdown"
                                    hidden={!showDropdownSort}
                                >
                                    <DropDown>
                                        {getSortableColumns(filter).map((column) => (
                                            <Text
                                                className={`${
                                                    column.id === mobileSort ? 'selected' : ''
                                                } text-s lh32 pale-grey capitalize`}
                                                onClick={() => setMobileSort(column.id)}
                                                key={column.id}
                                            >
                                                {column.label}
                                            </Text>
                                        ))}
                                    </DropDown>
                                </DropDownWrapper>
                            </SortByMobile>
                        </>
                    )}
                </FilterWrapper>
            </FlexDivRow>
            <DataWrapper>
                <TableContainer
                    style={{ background: 'transparent', boxShadow: 'none', borderRadius: '23px 23px 0 0' }}
                    component={Paper}
                >
                    {filter === Filters.All && (
                        <UserAllTxTable
                            profile={profile}
                            marketsData={marketsData}
                            usersMints={extractedMintsProfileData}
                            usersTrades={extractedTradesProfileData}
                            usersExercises={extractedExercisesProfileData}
                            usersUnclaimed={extractedUnclaimedProfileData}
                            userDisplay={walletAddress.toLowerCase() === displayAddress}
                            isLoading={marketsQuery.isLoading}
                            sortByField={sortByField}
                            sortByMarketHeading={sortByMarketHeading}
                            mobileSort={mobileSort}
                            isMobileView={isMobileView}
                        />
                    )}
                    {filter === Filters.Mints && (
                        <UserMintsTable
                            marketsData={marketsData}
                            usersMints={extractedMintsProfileData}
                            sortByField={sortByField}
                            mobileSort={mobileSort}
                            isMobileView={isMobileView}
                        />
                    )}

                    {filter === Filters.Trades && (
                        <UserTradesTable
                            marketsData={marketsData}
                            usersTrades={extractedTradesProfileData}
                            sortByField={sortByField}
                            sortByMarketHeading={sortByMarketHeading}
                            mobileSort={mobileSort}
                            isMobileView={isMobileView}
                        />
                    )}

                    {filter === Filters.Exercises && (
                        <UserExercisesTable
                            marketsData={marketsData}
                            usersExercises={extractedExercisesProfileData}
                            sortByField={sortByField}
                            sortByMarketHeading={sortByMarketHeading}
                            mobileSort={mobileSort}
                            isMobileView={isMobileView}
                        />
                    )}
                    {filter === Filters.Redeemable && (
                        <UserUnclaimedTable
                            marketsData={marketsData}
                            usersUnclaimed={extractedUnclaimedProfileData}
                            userDisplay={walletAddress.toLowerCase() === displayAddress}
                            sortByField={sortByField}
                            sortByMarketHeading={sortByMarketHeading}
                            mobileSort={mobileSort}
                            isMobileView={isMobileView}
                        />
                    )}
                </TableContainer>
            </DataWrapper>
        </FlexDivColumnCentered>
    );
};

export interface HeadCell {
    id: number;
    label: string;
    sortable: boolean;
}

export const StyledTableRow = withStyles(() => ({
    root: {
        background: 'transparent',
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

const FilterWrapper = styled(FlexDiv)`
    padding: 0 25px;
    position: relative;
    &:after {
        position: absolute;
        content: '';
        display: block;
        bottom: 1px;
        left: 0px;
        height: 1px;
        width: 100%;
    }
`;

export const FilterButton = styled.button`
    border: 1px solid #0a2e66;
    border-radius: 20px;
    max-height: 48px;
    background-color: transparent;
    cursor: pointer;
    margin-left: 10px;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.35px;
    color: #f6f6fe;
    margin: 0 9px;
    padding: 6px 16px;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
    &:hover:not(:disabled) {
        background: rgba(1, 38, 81, 0.8);
        border: 1px solid #0a2e66;
        color: #b8c6e5;
    }
    &.selected {
        background: #0a2e66;
        border: 1px solid #00f9ff;
        color: #00f9ff;
    }
    &.selected:hover {
        background: rgba(1, 38, 81, 0.8);
        border: 1px solid #00f9ff;
        color: #b8c6e5;
    }
`;

const DataWrapper = styled(FlexDivColumn)`
    border-bottom-right-radius: 23px;
    border-bottom-left-radius: 23px;
`;

const SearchAutoCompleteInput = styled(Autocomplete)`
    height: 40px;
    width: 204px;
    border-radius: 23px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    padding: 0 10px;
    letter-spacing: 0.15px;
    background: #04045a;
    color: #f6f6fe;
    padding-left: 20px;
    margin: 2px;
    &::placeholder {
        font-size: 16px;
        color: #f6f6f6;
        opacity: 0.7;
    }
`;

const sortByMarketHeading = (a: any, b: any, direction: OrderDirection) => {
    const aMarket = marketHeading(a, a.optionSide);
    const bMarket = marketHeading(b, b.optionSide);
    if (direction === OrderDirection.ASC) {
        return aMarket < bMarket ? -1 : 1;
    }
    if (direction === OrderDirection.DESC) {
        return aMarket < bMarket ? 1 : -1;
    }

    return 0;
};

const sortByField = (a: any, b: any, direction: OrderDirection, field: any) => {
    const aField = a[field] ? (a[field] as any) : '';
    const bField = b[field] ? (b[field] as any) : '';

    if (direction === OrderDirection.ASC) {
        return aField > bField ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return aField > bField ? -1 : 1;
    }

    return 0;
};

export default Profile;
