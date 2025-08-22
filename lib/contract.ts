import { createPublicClient, http, parseAbi } from 'viem'
import { sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
})

// 基础 ERC20 ABI
export const erc20Abi = parseAbi([
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function allowance(address,address) view returns (uint256)',
    'function approve(address,uint256) returns (bool)',
    'function transfer(address,uint256) returns (bool)',
    'function transferFrom(address,address,uint256) returns (bool)',
])

// Factory ABI
export const factoryAbi = parseAbi([
    'function allPairs(uint) view returns (address)',
    'function allPairsLength() view returns (uint)',
    'function createPair(address,address) returns (address)',
    'function getPair(address,address) view returns (address)',
])

// Pair ABI
export const pairAbi = parseAbi([
    'function token0() external view returns (address)',
    'function token1() external view returns (address)',
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function totalSupply() external view returns (uint)',
    'function balanceOf(address) external view returns (uint)',
])

// Router ABI
export const routerAbi = parseAbi([
    'function factory() external view returns (address)',
    'function WETH() external view returns (address)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
    'function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)',
    'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
    'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)',
])