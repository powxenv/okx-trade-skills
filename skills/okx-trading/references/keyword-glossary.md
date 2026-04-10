# Keyword Glossary (Chinese ↔ English)

> Load this file when the user's query contains Chinese text or informal trading terms.

## Market & Price

| 中文 | English | Command |
|---|---|---|
| 行情 | price | `market price` |
| 价格 | price | `market price` |
| 指数价格 | index price | `market index` |
| K线/k线 | candlestick/kline | `market kline` |
| 蜡烛图 | candlestick chart | `market kline` |
| 盈亏/收益 | PnL (profit and loss) | `market portfolio-overview` |
| 胜率 | win rate | `market portfolio-overview` |
| 我的钱包交易 | my wallet DEX history | `market portfolio-dex-history` |

## Token & Search

| 中文 | English | Command |
|---|---|---|
| 搜索代币 | search token | `token search` |
| 热门代币 | hot/trending tokens | `token hot-tokens` |
| 代币信息 | token info | `token info` |
| 持仓分布/持仓集中度 | holder distribution | `token holders` / `token cluster-overview` |
| 流动性 | liquidity | `token liquidity` |
| 代币安全/蜜罐检测/貔貅盘 | token safety / honeypot | `security token-scan` |
| 代币榜单 | token rankings | `token hot-tokens` |
| 每笔交易/逐笔成交 | trade feed | `token trades` |
| 大户/巨鲸 | whale / large holder | `token holders` |
| 跑路风险 | rug pull risk | `token cluster-overview` |
| 新钱包持仓比例 | new wallet holding % | `token cluster-overview` |

## Signal & Tracking

| 中文 | English | Command |
|---|---|---|
| 聪明钱 | smart money | `tracker activities --tracker-type smart_money` |
| 信号 | buy signal | `signal list` |
| 牛人榜 | leaderboard | `leaderboard list` |
| 大户 | whale | `signal list --wallet-type 3` |
| KOL | influencer | `signal list --wallet-type 2` |
| 追踪聪明钱 | track smart money | `tracker activities` |
| 大户在买什么 | what are whales buying | `signal list` |

## Swap & Trade

| 中文 | English | Command |
|---|---|---|
| 换币/兑换 | swap/exchange | `swap quote` / `swap execute` |
| 买币 | buy tokens | `swap execute` |
| 卖币 | sell tokens | `swap execute` |
| 交易 | trade | `swap execute` |
| 最优路径 | best route | `swap quote` |
| 滑点 | slippage | `swap execute --slippage` |

## Security

| 中文 | English | Command |
|---|---|---|
| 安全扫描 | security scan | `security token-scan` |
| 代币风险 | token risk | `security token-scan` |
| 钓鱼网站 | phishing site | `security dapp-scan` |
| 交易安全 | transaction safety | `security tx-scan` |
| 签名安全 | signature safety | `security sig-scan` |
| 授权管理/授权查询 | approval management | `security approvals` |

## Meme/Trenches

| 中文 | English | Command |
|---|---|---|
| 打狗/扫链/新盘 | meme scanning/trenches | `memepump tokens` |
| 开发者信息/开发者历史 | dev info/history | `memepump token-dev-info` |
| 捆绑/狙击 | bundle/sniper detection | `memepump token-bundle-info` |
| 同车 | co-investor/aped | `memepump aped-wallet` |
| 已迁移出 bonding curve | migrated out of bonding curve | `memepump token-details` |

## Wallet & Portfolio

| 中文 | English | Command |
|---|---|---|
| 登录钱包 | wallet login | `wallet login` |
| 钱包余额 | wallet balance | `wallet balance` |
| 发送代币/转账 | send/transfer | `wallet send` |
| 交易历史/交易记录 | transaction history | `wallet history` |
| 合约调用 | contract call | `wallet contract-call` |
| 充值/充币/入金 | deposit/receive | `wallet addresses` |
| 收款地址 | receive address | `wallet addresses` |
| 签名消息 | sign message | `wallet sign-message` |
| 导出钱包/导出助记词 | export wallet | Web portal only |

## DeFi

| 中文 | English | Command |
|---|---|---|
| 理财/质押/挖矿 | yield/staking/farming | `defi invest` |
| 存入 | deposit | `defi invest` |
| 赎回/取出 | withdraw/redeem | `defi withdraw` |
| 收益/奖励 | rewards/claim | `defi collect` |
| DeFi持仓 | DeFi positions | `defi positions` |

## Gas & Gateway

| 中文 | English | Command |
|---|---|---|
| 预估gas/估gas | estimate gas | `gateway gas` / `gateway gas-limit` |
| 广播交易/发链上 | broadcast transaction | `gateway broadcast` |
| 模拟交易/干跑 | simulate/dry-run | `gateway simulate` |
| 交易哈希是否上链 | check tx status | `gateway orders` |