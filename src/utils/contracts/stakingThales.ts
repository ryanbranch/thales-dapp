import { NetworkId } from '@synthetixio/contracts-interface';

export const stakingThales = {
    addresses: {
        [NetworkId.Mainnet]: '0x883D651429B0829BC045A94F288f3b514021B8C1',
        [NetworkId.Ropsten]: '0x9c27B789D645bf7bB02e71590df627b3DE8249fA',
        [NetworkId.Rinkeby]: 'TBD',
        [NetworkId.Kovan]: '0x8d178B3Dd7B29dfB38f55FdFE6518cabe6B31059',
        // added to resolve error with typings
        [NetworkId.Goerli]: '', // TODO: goerli network remove or implement
        [NetworkId['Mainnet-Ovm']]: 'TBD',
        [NetworkId['Kovan-Ovm']]: 'TBD',
    },
    abi: [
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_iEscrowThales',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_stakingToken',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_feeToken',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_durationPeriod',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_unstakeDurationPeriod',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'constructor',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'CancelUnstake',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'enabled',
                    type: 'bool',
                },
            ],
            name: 'ClaimEnabled',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'PeriodOfStaking',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'lastPeriodTimeStamp',
                    type: 'uint256',
                },
            ],
            name: 'ClosedPeriod',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'enabled',
                    type: 'bool',
                },
            ],
            name: 'DistributeFeesEnabled',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'DurationPeriodChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newEscrow',
                    type: 'address',
                },
            ],
            name: 'EscrowChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'unclaimedFees',
                    type: 'uint256',
                },
            ],
            name: 'FeeRewardsClaimed',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'FixedPeriodRewardChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'oldOwner',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnerChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnerNominated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'isPaused',
                    type: 'bool',
                },
            ],
            name: 'PauseChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'reward',
                    type: 'uint256',
                },
            ],
            name: 'RewardAdded',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'unclaimedReward',
                    type: 'uint256',
                },
            ],
            name: 'RewardsClaimed',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'Staked',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [],
            name: 'StakingPeriodStarted',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'cooldownTime',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'UnstakeCooldown',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'UnstakeDurationPeriodChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'unstakeAmount',
                    type: 'uint256',
                },
            ],
            name: 'Unstaked',
            type: 'event',
        },
        {
            constant: false,
            inputs: [],
            name: 'acceptOwnership',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [],
            name: 'cancelUnstake',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'claimEnabled',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [],
            name: 'claimReward',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [],
            name: 'closePeriod',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'currentPeriodFees',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'currentPeriodRewards',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'distributeFeesEnabled',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'durationPeriod',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'feeToken',
            outputs: [
                {
                    internalType: 'contract IERC20',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'fixedPeriodReward',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'getAlreadyClaimedFees',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'getAlreadyClaimedRewards',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'getContractFeeFunds',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'getContractRewardFunds',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'getLastPeriodOfClaimedRewards',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'getRewardFeesAvailable',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'getRewardsAvailable',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'iEscrowThales',
            outputs: [
                {
                    internalType: 'contract IEscrowThales',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'lastPauseTime',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'lastPeriodTimeStamp',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'lastUnstakeTime',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'nominateNewOwner',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'nominatedOwner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'owner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'paused',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'periodsOfStaking',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address payable',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'selfDestruct',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'bool',
                    name: '_claimEnabled',
                    type: 'bool',
                },
            ],
            name: 'setClaimEnabled',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'bool',
                    name: '_distributeFeesEnabled',
                    type: 'bool',
                },
            ],
            name: 'setDistributeFeesEnabled',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_durationPeriod',
                    type: 'uint256',
                },
            ],
            name: 'setDurationPeriod',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: '_escrowThalesContract',
                    type: 'address',
                },
            ],
            name: 'setEscrow',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_fixedReward',
                    type: 'uint256',
                },
            ],
            name: 'setFixedPeriodReward',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'bool',
                    name: '_paused',
                    type: 'bool',
                },
            ],
            name: 'setPaused',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_unstakeDurationPeriod',
                    type: 'uint256',
                },
            ],
            name: 'setUnstakeDurationPeriod',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'stake',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'stakedBalanceOf',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'stakerFeesClaimed',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'stakerLifetimeRewardsClaimed',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'stakingToken',
            outputs: [
                {
                    internalType: 'contract IERC20',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [],
            name: 'startStakingPeriod',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'startTimeStamp',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'startUnstake',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'totalStakedAmount',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [],
            name: 'unstake',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'unstakeDurationPeriod',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'unstaking',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'unstakingAmount',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ],
};

export default stakingThales;
