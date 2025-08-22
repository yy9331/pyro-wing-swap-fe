// 合约地址
export const FACTORY_ADDRESS = "0x7a8d0232d306fbd0aa24a67c8aa9a6db88ebc522"
export const ROUTER_ADDRESS = "0xe6d9806164180eb95489800c4b6ff5972f10c533"

// 测试代币地址（你需要在 Sepolia 上部署这些测试代币）
export const TEST_TOKENS = {
  PW: {
    name: "PyroWing Token",
    symbol: "PW",
    address: "0x8984b52ef3aecf95bf9832b00c95868d075f5609", // 需要替换为实际地址
    decimals: 18,
    logo: "🔥"
  },
  FLF: {
    name: "Fluffy Token", 
    symbol: "FLF",
    address: "0xd9498f3e809f2fbb55387029f84aff1d5e6f6ae7", // 需要替换为实际地址
    decimals: 18,
    logo: "🐹"
  },
  DDL: {
    name: "Doodle Token",
    symbol: "DDL", 
    address: "0x488a807bee04c2df580098366922140102e508b1", // 需要替换为实际地址
    decimals: 18,
    logo: "🌟"
  }
}

// 网络配置
export const NETWORKS = {
  sepolia: {
    id: 11155111,
    name: "Sepolia",
    rpcUrl: "https://sepolia.infura.io/v3/6b6d38b00ee34c9cb96a3a38614c3354", // 需要替换为你的 Infura 项目 ID
    explorer: "https://sepolia.etherscan.io"
  }
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'