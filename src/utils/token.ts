export const getOngoingAirdropHashesURL = (period: number) => {
    return `https://raw.githubusercontent.com/thales-markets/contracts/main/scripts/deployOngoingRewards/ongoing-airdrop-hashes-period-${period}.json`;
};