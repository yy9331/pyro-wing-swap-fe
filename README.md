# PyroWingSwap 前端

基于 Uniswap V2 的去中心化交易所前端界面，支持代币交换、流动性池管理和流动性添加功能。

## 功能特性

### 🚀 代币交换
- 支持 PW、FLF、DDL 代币之间的交换
- 实时价格计算和报价
- 双向输入联动（从输入金额计算输出，从输出金额计算输入）
- 余额检查和 MAX 按钮

### 💧 流动性池
- 显示 PW/FLF、PW/DDL、FLF/DDL 流动性池
- 实时 TVL（总锁仓价值）数据
- 年化收益率（APR）显示
- 24小时交易量统计
- 流动性提供者代币（LP）数量

### 🔧 添加流动性
- 为代币对添加流动性
- 自动检查代币余额和授权
- 自动授权和添加流动性
- 滑点容忍度设置

## 技术栈

- **框架**: Next.js 15
- **样式**: Tailwind CSS 3.4.0
- **Web3**: Wagmi + Viem
- **UI 组件**: Radix UI
- **包管理**: Bun
- **语言**: TypeScript

## 快速开始

### 安装依赖
```bash
bun install
```

### 启动开发服务器
```bash
bun run dev
```

### 构建生产版本
```bash
bun run build
```

## 合约地址

- **Factory**: `0x7a8d0232d306fbd0aa24a67c8aa9a6db88ebc522`
- **Router**: `0xe6d9806164180eb95489800c4b6ff5972f10c533`

## 测试代币

项目包含以下测试代币：
- **PW**: PyroWing Token (0x8984b52ef3aecf95bf9832b00c95868d075f5609)
- **FLF**: Fluffy Token (0xd9498f3e809f2fbb55387029f84aff1d5e6f6ae7)
- **DDL**: Doodle Token (0x488a807bee04c2df580098366922140102e508b1)

## 项目结构

```
pyrowindswap-fe/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── SwapInterface.tsx # 代币交换界面
│   ├── LiquidityPools.tsx # 流动性池展示
│   ├── AddLiquidity.tsx  # 添加流动性
│   ├── WalletConnect.tsx # 钱包连接
│   └── Web3Provider.tsx  # Web3 提供者
├── hooks/                # 自定义 Hooks
│   ├── useTokenBalance.ts # 代币余额 Hook
│   └── usePoolData.ts    # 池子数据 Hook
├── lib/                  # 工具函数和配置
│   ├── utils.ts          # 工具函数
│   ├── constants.ts      # 常量定义
│   ├── contract.ts       # 合约配置
│   └── amm.ts           # AMM 计算函数
└── public/              # 静态资源
```

## 开发说明

### 添加新的代币
1. 在 `lib/constants.ts` 中的 `TEST_TOKENS` 对象添加新代币信息
2. 确保代币合约已部署到 Sepolia 测试网
3. 更新代币地址和元数据

### 自定义样式
- 主要样式在 `app/globals.css` 中定义
- 组件样式使用 Tailwind CSS 类名
- 支持深色主题

### Web3 集成
- 使用 Wagmi 进行钱包连接和交易
- 支持 MetaMask 等主流钱包
- 自动处理网络切换和错误处理

## 部署

### Vercel 部署
```bash
bun run build
vercel --prod
```

### 其他平台
构建后的文件在 `.next` 目录中，可以部署到任何支持 Node.js 的平台。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
