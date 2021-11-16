import { getUsers, signUp, startRoyale, ThalesRoyalData, User, UserStatus } from '../../getThalesRoyalData';
import React, { useEffect, useMemo, useState } from 'react';
import { FlexDivCentered, FlexDivColumn, Text, Image, FlexDiv } from 'theme/common';
import styled from 'styled-components';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { useTranslation, Trans } from 'react-i18next';
import triangle from 'assets/images/royale/triangle.svg';
import circle from 'assets/images/royale/circle.svg';
import notVerified from 'assets/images/royale/not-verified.svg';
import notSigned from 'assets/images/royale/not-signed.svg';
import important from 'assets/images/royale/important.svg';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { truncateAddress } from 'utils/formatters/string';
import { LightTooltip } from 'pages/Options/Market/components';
import { Arrow, ArrowsWrapper } from 'pages/Options/Home/MarketsTable/components';
import downSelected from 'assets/images/down-selected.svg';
import down from 'assets/images/down.svg';
import upSelected from 'assets/images/up-selected.svg';
import up from 'assets/images/up.svg';

type ScoreboardProps = {
    royaleData: ThalesRoyalData;
};

type HeadCell = {
    id: number;
    text: string;
    sortable: boolean;
};

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const defaultOrderBy = 1;

const PerPageOption = [15, 25, 50, 100];

const Scoreboard: React.FC<ScoreboardProps> = ({ royaleData }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;
    const { t } = useTranslation();
    const [user, setUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
    const [showPopup, setShowPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPerPage, setShowPerPage] = useState(15);
    const [searchString, setSearchString] = useState('');

    useEffect(() => {
        getUsers(walletAddress, setUsers, setUser);
    }, [walletAddress]);

    const usersForUi = useMemo(() => {
        if (users.length > 0) {
            let usersToShow: any = [];
            switch (orderBy) {
                case 1:
                    usersToShow = users.sort((a: any, b: any) => {
                        return orderDirection === OrderDirection.DESC
                            ? a.status === b.status
                                ? a.isAlive
                                    ? -1
                                    : 1
                                : a.status - b.status
                            : b.status - a.status;
                    });
                    break;
                case 3:
                    usersToShow = users.sort((a: any, b: any) => {
                        return orderDirection === OrderDirection.DESC
                            ? a.name.localeCompare(b.name)
                            : b.name.localeCompare(a.name);
                    });
                    break;

                case 4:
                    usersToShow = users.sort((a: any, b: any) => {
                        return orderDirection === OrderDirection.DESC ? a.number - b.number : b.number - a.number;
                    });
                    break;
            }
            if (searchString !== '') {
                usersToShow = usersToShow.filter((user: any) => {
                    return (
                        user.name.toLowerCase().includes(searchString.toLowerCase()) ||
                        user.number.toString().toLowerCase().includes(searchString.toLowerCase())
                    );
                });
            }
            const maxPages = Math.ceil(usersToShow.length / showPerPage);
            const usersToDisplay = usersToShow.slice((page - 1) * showPerPage, showPerPage * page);
            return { maxPages, usersToDisplay };
        }
    }, [page, orderBy, orderDirection, users, showPerPage, searchString]);

    const HeadCells = [
        { id: 1, text: t('options.royale.scoreboard.table-header.status'), sortable: true },
        { id: 2, text: t('options.royale.scoreboard.table-header.avatar'), sortable: false },
        { id: 3, text: t('options.royale.scoreboard.table-header.name'), sortable: true },
        { id: 4, text: t('options.royale.scoreboard.table-header.number'), sortable: true },
    ];
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
            setOrderDirection(OrderDirection.DESC);
            setPage(1);
        }
    };

    const getFooter = (user: User | undefined, royaleData: ThalesRoyalData) => {
        console.log(user);
        if (user) {
            if (user.status == UserStatus.RDY) {
                if (user.isAlive) {
                    return <></>;
                } else {
                    return <DeadText>You have been eliminated</DeadText>;
                }
            }
            if (royaleData.signUpPeriod < new Date()) return;
            if (user.status === UserStatus.NOTSIGNED) {
                return <Button onClick={signUp}>Sign Up</Button>;
            }
            if (user.status === UserStatus.NOTVERIFIED) {
                return (
                    <Button onClick={setShowPopup.bind(this, true)}>
                        Verify <Discord className="icon icon--discord" />
                    </Button>
                );
            }
        }
        return (
            <Button onClick={setShowPopup.bind(this, true)}>
                Verify <Discord className="icon icon--discord" />
            </Button>
        );
    };

    return (
        <Wrapper className="scoreboard">
            <Intro royaleData={royaleData} />

            <ModalOverlay
                style={{ display: showPopup ? 'block' : 'none' }}
                onClick={() => {
                    setShowPopup(false);
                }}
            >
                {' '}
                <ModalWrapper></ModalWrapper>
            </ModalOverlay>

            <Popup style={{ display: showPopup ? 'flex' : 'none' }}>
                <PopupTitle>To Complete Verification!</PopupTitle>
                <PopupImage src={important}></PopupImage>
                <PopupDescription>Go to Thales discord and type !verify 0x...</PopupDescription>
            </Popup>

            <UserWrapper>
                <FlexDiv style={{ alignItems: 'center' }}>
                    {user?.avatar ? (
                        <UserAvatar src={user.avatar} />
                    ) : (
                        <i className="icon icon--user-avatar" style={{ fontSize: 44, marginRight: 14 }} />
                    )}

                    <UserLabel>
                        {t('options.royale.scoreboard.player-no')}
                        {' #'}
                        {user?.number}
                    </UserLabel>
                </FlexDiv>
                <FlexDivColumn style={{ margin: '20px 0' }}>
                    <FlexContainer>
                        <UserLabel>{t('options.leaderboard.display-name')}:</UserLabel>
                        <InputWrapper>{user?.name}</InputWrapper>
                    </FlexContainer>
                    <FlexContainer>
                        <UserLabel>{t('options.leaderboard.address')}:</UserLabel>
                        <InputWrapper>
                            {truncateAddress(
                                walletAddress as any,
                                truncateAddressNumberOfCharacters,
                                truncateAddressNumberOfCharacters
                            )}
                        </InputWrapper>
                    </FlexContainer>
                </FlexDivColumn>
                {getFooter(user, royaleData)}
            </UserWrapper>
            <TableWrapper>
                <TableRow style={{ justifyContent: 'flex-end' }}>
                    <SearchWrapper
                        onChange={(e) => setSearchString(e.target.value)}
                        value={searchString}
                        placeholder={t('options.leaderboard.display-name')}
                    ></SearchWrapper>
                </TableRow>

                <TableRow>
                    {HeadCells.map((cell, key) => (
                        <HeadCell onClick={cell.sortable ? calcDirection.bind(this, cell) : () => {}} key={key}>
                            {cell.text}{' '}
                            {cell.sortable && (
                                <ArrowsWrapper>
                                    {orderBy === cell.id && orderDirection !== OrderDirection.NONE ? (
                                        <Arrow
                                            src={orderDirection === OrderDirection.ASC ? upSelected : downSelected}
                                        />
                                    ) : (
                                        <>
                                            <Arrow src={up} />
                                            <Arrow src={down} />
                                        </>
                                    )}
                                </ArrowsWrapper>
                            )}
                        </HeadCell>
                    ))}
                </TableRow>
                {usersForUi?.usersToDisplay.map((user: User, key: number) => (
                    <TableRow
                        key={key}
                        className={user.isAlive ? 'alive' : 'dead'}
                        style={{ marginBottom: 12, opacity: user.status === UserStatus.RDY ? 1 : 0.5 }}
                    >
                        <HeadCell>
                            <Status>
                                <StatusAvatar className={user.isAlive ? 'icon icon--alive' : 'icon icon--dead'} />
                                <span>{user.isAlive ? 'alive' : 'dead'}</span>
                            </Status>
                        </HeadCell>
                        <HeadCell>{getAvatar(user)}</HeadCell>
                        <HeadCell style={{ marginRight: 6, textDecoration: '' }}>{user.name}</HeadCell>
                        <HeadCell style={{ marginLeft: 6 }}>#{user.number}</HeadCell>
                    </TableRow>
                ))}
                {usersForUi?.usersToDisplay ? (
                    <Pagination>
                        <PaginationIcon
                            className={`icon icon--double-left ${page <= 1 ? 'disabled' : ''}`}
                            onClick={() => {
                                if (page <= 1) return;
                                setPage(1);
                            }}
                        />
                        <PaginationIcon
                            className={`icon icon--left ${page <= 1 ? 'disabled' : ''}`}
                            onClick={() => {
                                if (page <= 1) return;
                                setPage(page - 1);
                            }}
                        />
                        <Text className="max-pages">
                            {page}/{usersForUi?.maxPages}
                        </Text>
                        <PaginationIcon
                            className={`icon icon--right ${
                                usersForUi && usersForUi.maxPages === page ? 'disabled' : ''
                            }`}
                            onClick={() => {
                                if (usersForUi && usersForUi.maxPages === page) return;
                                setPage(page + 1);
                            }}
                        />
                        <PaginationIcon
                            className={`icon icon--double-right ${
                                usersForUi && usersForUi.maxPages === page ? 'disabled' : ''
                            }`}
                            onClick={() => {
                                if (usersForUi && usersForUi.maxPages === page) return;
                                setPage(usersForUi.maxPages);
                            }}
                        />

                        <PaginationUsers>
                            <Text onClick={setShowDropdown.bind(this, true)}>{showPerPage}</Text>
                            {showDropdown &&
                                PerPageOption.filter((number) => number !== showPerPage).map(
                                    (option: number, key: number) => (
                                        <Text
                                            onClick={() => {
                                                setShowPerPage(option);
                                                setShowDropdown(false);
                                            }}
                                            key={key}
                                        >
                                            {option}
                                        </Text>
                                    )
                                )}
                        </PaginationUsers>
                        <UsersPerPageText>Users per page</UsersPerPageText>
                    </Pagination>
                ) : (
                    ''
                )}
            </TableWrapper>
        </Wrapper>
    );
};

const SearchWrapper = styled.input`
    max-width: 275px;
    height: 28px;
    border: 2px solid var(--color);
    box-sizing: border-box;
    border-radius: 20px;
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 78.34%;
    letter-spacing: -0.4px;
    background: var(--color-wrapper);
    color: var(--coior);
    outline: none !important;
    &::placeholder {
        color: var(--coior);
    }
`;

const PaginationIcon = styled.i`
    font-size: 28px;
    line-height: 24px;
    cursor: pointer;
    &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-background);
    mix-blend-mode: multiply;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-wrapper);
    opacity: 0.9;
    mix-blend-mode: multiply;
`;

const Popup = styled.div`
    display: flex;
    position: fixed;
    top: 300px;
    width: 420px;
    left: calc(50% - 200px);
    margin: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--color);
    border: 5px solid var(--color);
    box-sizing: border-box;
    border-radius: 5px;
    padding: 24px;
    box-shadow: 0px 4px 50px var(--color); ;
`;

const PopupTitle = styled(Text)`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 28px;
    color: var(--color-wrapper); ;
`;

const PopupImage = styled(Image)`
    width: 60px;
    height: 60px;
    margin: 10px 0;
`;

const PopupDescription = styled(Text)`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 22px;
    text-align: center;
    letter-spacing: -0.402542px;
    color: var(--color-wrapper);
`;

const getAvatar = (user: User) => {
    if (user.status === UserStatus.RDY) {
        return <UserAvatar src={user.avatar} />;
    }
    if (user.status === UserStatus.NOTVERIFIED) {
        return (
            <LightTooltip title="User is not verified on Discord">
                <UserAvatar src={notVerified} />
            </LightTooltip>
        );
    }

    if (user.status === UserStatus.NOTSIGNED) {
        return (
            <LightTooltip title="User is not registered for Thales Royale">
                <UserAvatar src={notSigned} />
            </LightTooltip>
        );
    }
};

const UsersPerPageText = styled.p`
    position: absolute;
    right: 13px;
    top: 12px;
    width: 86px;
    text-align: center;
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 13px;
    letter-spacing: -0.4px;
    color: var(--color);
    background: var(--color-wrapper);
`;

const PaginationUsers = styled.div`
    position: absolute;
    right: 6px;
    top: 20px;
    width: 100px;
    border: 2px solid var(--color);
    box-sizing: border-box;
    border-radius: 20px;
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: -0.4px;
    color: var(--color);
    cursor: pointer;
    text-align: center;
    background: var(--color-wrapper);
`;

const Pagination = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .max-pages {
        font-family: Sansation !important;
        font-style: normal;
        font-weight: bold;
        font-size: 20px;
        line-height: 330%;
        text-align: center;
        letter-spacing: -0.4px;
        color: var(--color);
        margin: 0 10px;
    }
`;

const DeadText = styled(Text)`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 23px;
    line-height: 26px;
    color: var(--color);
    text-shadow: 0px 0px 30px var(--color);
    text-align: center;
`;

const UserWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 295px;
    width: 100%;
    padding: 34px 70px;
    background: var(--color-wrapper);
    border: 5px solid var(--color);
    box-sizing: border-box;
    border-radius: 5px;
    margin-top: 4px;
    margin-bottom: 14px;
`;

const UserLabel = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    color: var(--color);
`;

const Button = styled.button`
    align-items: center;
    cursor: pointer;
    display: flex;
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    background: var(--color);
    border: 1px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 0px 30px var(--color);
    border-radius: 20px;
    padding: 6px 15px 6px 20px;
    color: var(--color-wrapper);
    margin: auto;
`;

const UserAvatar = styled(Image)`
    width: 44px;
    height: 44px;
    border-radius: 50%50%;
`;

const StatusAvatar = styled.i`
    font-size: 35px;
`;

const Status = styled.span`
    cursor: default;
    span {
        display: none;
    }
    &:hover {
        i {
            display: none;
        }
        span {
            display: block;
        }
    }
`;

const Discord = styled.i`
    font-size: 24px;
    line-height: 18px;
    color: var(--color-wrapper);
    margin-left: 14px;
`;

const InputWrapper = styled.div`
    width: 220px;
    border: 1.30233px solid var(--color);
    box-sizing: border-box;
    border-radius: 19.5349px;
    height: 28px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
`;

const FlexContainer = styled(FlexDivCentered)`
    justify-content: space-between;
    margin: 7px 0;
`;

const TableWrapper = styled.div`
    width: 100%;
    min-height: 300px;
    background: var(--color-wrapper);
    border: 5px solid var(--color);
    box-sizing: border-box;
    border-radius: 5px;
    padding: 30px;
`;

const TableRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    color: var(--color);
    &.dead {
        text-decoration: line-through;
    }
    & > * {
        text-align: center;
        margin: 0 !important;
        min-width: 88px;
        &:first-child {
            flex: 1;
        }
        &:nth-child(2) {
            flex: 1;
        }
        &:nth-child(3) {
            flex: 2;
        }
        &:last-child {
            flex: 1;
        }
    }
`;

const HeadCell = styled(Text)`
    font-family: Sansation !important;
    font-size: 20px;
    color: var(--color);
`;

const Intro: React.FC<ScoreboardProps> = ({ royaleData }) => {
    const { t } = useTranslation();

    const getTitle = () => {
        if (royaleData.round === 0) {
            return (
                <>
                    <Title>{t('options.royale.scoreboard.starts')}</Title>
                    {royaleData.signUpPeriod < new Date() ? (
                        <Button onClick={startRoyale} style={{ margin: '30px auto', fontSize: 30, lineHeight: '30px' }}>
                            Start Thales Royale
                        </Button>
                    ) : (
                        <SubTitle>
                            <TimeRemaining end={royaleData.signUpPeriod} showFullCounter />
                        </SubTitle>
                    )}
                </>
            );
        } else if (royaleData.round === royaleData.rounds) {
            return (
                <>
                    <Title>{t('options.royale.scoreboard.ends')}</Title>
                    <SubTitle>
                        <TimeRemaining end={royaleData.roundEndTime} showFullCounter />
                    </SubTitle>
                </>
            );
        } else {
            return (
                <>
                    <Title>{t('options.royale.scoreboard.round-starts')}</Title>
                    <SubTitle>
                        <TimeRemaining end={royaleData.roundEndTime} showFullCounter />
                        <span> RD{royaleData.round + 1}</span>
                    </SubTitle>
                </>
            );
        }
    };

    return (
        <>
            {getTitle()}
            <Question> {t('options.royale.scoreboard.question')} </Question>
            <InfoText style={{ margin: '14px 0px' }}>
                <Trans i18nKey="options.royale.scoreboard.info1" components={{ bold: <strong /> }} />
            </InfoText>
            <InfoText>
                <Trans i18nKey="options.royale.scoreboard.info2" components={{ bold: <strong /> }} />
            </InfoText>
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info3"
                    components={{
                        bold: <strong />,
                        circle: <img src={circle} width="20" height="20" />,
                        triangle: <img src={triangle} width="20" height="20" />,
                    }}
                />
            </InfoText>
            <InfoText style={{ margin: '14px 0px' }}>{t('options.royale.scoreboard.info4')}</InfoText>
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info5"
                    components={{
                        bold: <strong />,
                    }}
                />
                <Link
                    href="https://thales-market-board.atlassian.net/browse/THALES-21"
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('options.royale.scoreboard.blog')}
                </Link>
            </InfoText>
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info6"
                    components={{
                        bold: <strong />,
                    }}
                />
            </InfoText>
        </>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 570px;
    z-index: 1;
`;

const Title = styled(Text)`
    align-self: center;
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 18px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
`;

const SubTitle = styled(Text)`
    margin-top: 4px;
    margin-bottom: 14px;
    align-self: center;
    span {
        font-family: VT323 !important;
        font-style: normal;
        font-weight: 400;
        font-size: 80px;
        line-height: 56px;
        text-align: justify;
        letter-spacing: -0.4px;
        color: var(--color);
    }
`;

const Question = styled(Text)`
    font-family: VT323 !important;
    font-style: normal;
    font-weight: 400;
    font-size: 25px;
    line-height: 20px;
    text-align: justify;
    letter-spacing: -0.4px;
    color: var(--color);
`;

const InfoText = styled(Text)`
    font-weight: 400;
    font-family: SansationLight !important;
    text-overflow: ellipsis;
    &,
    strong {
        font-style: normal;

        font-size: 20px;
        line-height: 20px;
        text-align: justify;
        letter-spacing: -0.4px;
        color: var(--color);
    }

    strong {
        font-family: VT323 !important;
        font-weight: bold;
    }

    img {
        vertical-align: bottom;
    }
`;

const Link = styled.a`
    font-family: VT323 !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    text-align: justify;
    letter-spacing: -0.4px;
    color: var(--color);
    &:hover {
        font-weight: bold;
        text-decoration: underline;
    }
`;

export default Scoreboard;
