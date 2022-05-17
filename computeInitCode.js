const { bytecode } = require('./build/contracts/DipolePair.json')
const { keccak256 } = require('@ethersproject/solidity')

const COMPUTED_INIT_CODE_HASH = keccak256(['bytes'], [bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`])

console.log('initCode: ', COMPUTED_INIT_CODE_HASH)