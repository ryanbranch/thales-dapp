export const synthSummaryUtilContract = {
    addresses: {
        1: '0x0D69755e12107695E544842BF7F61D9193f09a54',
        3: '0x26a3C1878c4f3598e58f8bFB60B3cD9EF083e892',
        4: '0xba6c0220157008cecb7364b37e27885e7b5be74a',
        42: '0xA2b5742922ae4CA1676349009E33DA5fB4D05dCB',
        // added 5 and 31337 to resolve error with typings
        5: '', // TODO: goerli network remove or implement
        31337: '', // TODO: mainnet-fork remover or implement
    },
    abi: [
        {
            inputs: [{ internalType: 'address', name: 'resolver', type: 'address' }],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'constructor',
        },
        {
            constant: true,
            inputs: [],
            name: 'addressResolverProxy',
            outputs: [{ internalType: 'contract IAddressResolver', name: '', type: 'address' }],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'frozenSynths',
            outputs: [{ internalType: 'bytes32[]', name: '', type: 'bytes32[]' }],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'synthsBalances',
            outputs: [
                { internalType: 'bytes32[]', name: '', type: 'bytes32[]' },
                { internalType: 'uint256[]', name: '', type: 'uint256[]' },
                { internalType: 'uint256[]', name: '', type: 'uint256[]' },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'synthsRates',
            outputs: [
                { internalType: 'bytes32[]', name: '', type: 'bytes32[]' },
                { internalType: 'uint256[]', name: '', type: 'uint256[]' },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'synthsTotalSupplies',
            outputs: [
                { internalType: 'bytes32[]', name: '', type: 'bytes32[]' },
                { internalType: 'uint256[]', name: '', type: 'uint256[]' },
                { internalType: 'uint256[]', name: '', type: 'uint256[]' },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                { internalType: 'address', name: 'account', type: 'address' },
                { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' },
            ],
            name: 'totalSynthsInKey',
            outputs: [{ internalType: 'uint256', name: 'total', type: 'uint256' }],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ],
};
