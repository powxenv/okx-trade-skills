import SolarBag4BoldDuotone from '~icons/solar/bag-4-bold-duotone'
import SolarWadOfMoneyBoldDuotone from '~icons/solar/wad-of-money-bold-duotone'
import SolarPlanet2BoldDuotone from '~icons/solar/planet-2-bold-duotone'
import SolarChartBoldDuotone from '~icons/solar/chart-bold-duotone'
import SolarArchiveDownMinimlisticBoldDuotone from '~icons/solar/archive-down-minimlistic-bold-duotone'
import SolarCopyLineDuotone from '~icons/solar/copy-line-duotone'
import { Button, ScrollShadow, Tabs } from "@heroui/react";
import SolarDocumentsBoldDuotone from '~icons/solar/documents-bold-duotone'
import SolarFileLineDuotone from '~icons/solar/file-line-duotone'
import SolarCodeFileLineDuotone from '~icons/solar/code-file-line-duotone'

// OKX Trading Skill imports
import tradingSkill from '../skills/okx-trading/SKILL.md?raw'
import tradingAgentAutomation from '../skills/okx-trading/references/agent-automation.md?raw'
import tradingAuthentication from '../skills/okx-trading/references/authentication.md?raw'
import tradingCliDefi from '../skills/okx-trading/references/cli-reference-defi.md?raw'
import tradingCliMarket from '../skills/okx-trading/references/cli-reference-market.md?raw'
import tradingCliSecurity from '../skills/okx-trading/references/cli-reference-security.md?raw'
import tradingCliSignal from '../skills/okx-trading/references/cli-reference-signal.md?raw'
import tradingCliSwap from '../skills/okx-trading/references/cli-reference-swap.md?raw'
import tradingDecisionFramework from '../skills/okx-trading/references/decision-framework.md?raw'
import tradingKeywordGlossary from '../skills/okx-trading/references/keyword-glossary.md?raw'
import tradingMarketAnalysis from '../skills/okx-trading/references/market-analysis.md?raw'
import tradingRiskFramework from '../skills/okx-trading/references/risk-framework.md?raw'
import tradingRiskManagement from '../skills/okx-trading/references/risk-management.md?raw'
import tradingStrategies from '../skills/okx-trading/references/trading-strategies.md?raw'
import tradingTroubleshooting from '../skills/okx-trading/references/troubleshooting.md?raw'
import tradingUniswapIntegration from '../skills/okx-trading/references/uniswap-integration.md?raw'
import tradingWorkflowBuy from '../skills/okx-trading/references/workflow-buy.md?raw'
import tradingWorkflowDefiYield from '../skills/okx-trading/references/workflow-defi-yield.md?raw'
import tradingWorkflowMeme from '../skills/okx-trading/references/workflow-meme-trading.md?raw'
import tradingWorkflowResearch from '../skills/okx-trading/references/workflow-research.md?raw'
import tradingWorkflowSell from '../skills/okx-trading/references/workflow-sell.md?raw'
import tradingWsMonitoring from '../skills/okx-trading/references/ws-monitoring.md?raw'
import tradingXlayerStrategies from '../skills/okx-trading/references/xlayer-strategies.md?raw'
import tradingChainSupport from '../skills/okx-trading/_shared/chain-support.md?raw'
import tradingNativeTokens from '../skills/okx-trading/_shared/native-tokens.md?raw'
import tradingPreflight from '../skills/okx-trading/_shared/preflight.md?raw'
import tradingOpenai from '../skills/okx-trading/agents/openai.yaml?raw'

// OKX Uniswap Skill imports
import uniswapSkill from '../skills/okx-uniswap/SKILL.md?raw'
import uniswapAgentPatterns from '../skills/okx-uniswap/references/agent-uniswap-patterns.md?raw'
import uniswapKeywordGlossary from '../skills/okx-uniswap/references/keyword-glossary.md?raw'
import uniswapLiquidityMgmt from '../skills/okx-uniswap/references/liquidity-management.md?raw'
import uniswapRiskManagement from '../skills/okx-uniswap/references/risk-management.md?raw'
import uniswapStrategies from '../skills/okx-uniswap/references/trading-strategies.md?raw'
import uniswapTradingApi from '../skills/okx-uniswap/references/trading-api.md?raw'
import uniswapX402Payments from '../skills/okx-uniswap/references/x402-payments.md?raw'
import uniswapXlayerStrategies from '../skills/okx-uniswap/references/xlayer-strategies.md?raw'
import uniswapChainSupport from '../skills/okx-uniswap/_shared/chain-support.md?raw'
import uniswapNativeTokens from '../skills/okx-uniswap/_shared/native-tokens.md?raw'
import uniswapPreflight from '../skills/okx-uniswap/_shared/preflight.md?raw'
import uniswapOpenai from '../skills/okx-uniswap/agents/openai.yaml?raw'

// OKX X Layer Agent Skill imports
import xlayerSkill from '../skills/okx-xlayer-agent/SKILL.md?raw'
import xlayerAgentAutomation from '../skills/okx-xlayer-agent/references/agent-automation.md?raw'
import xlayerAuthentication from '../skills/okx-xlayer-agent/references/authentication.md?raw'
import xlayerDecisionFramework from '../skills/okx-xlayer-agent/references/decision-framework.md?raw'
import xlayerKeywordGlossary from '../skills/okx-xlayer-agent/references/keyword-glossary.md?raw'
import xlayerRiskFramework from '../skills/okx-xlayer-agent/references/risk-framework.md?raw'
import xlayerRiskManagement from '../skills/okx-xlayer-agent/references/risk-management.md?raw'
import xlayerStrategies from '../skills/okx-xlayer-agent/references/trading-strategies.md?raw'
import xlayerTroubleshooting from '../skills/okx-xlayer-agent/references/troubleshooting.md?raw'
import xlayerUniswapIntegration from '../skills/okx-xlayer-agent/references/uniswap-integration.md?raw'
import xlayerWorkflowBuy from '../skills/okx-xlayer-agent/references/workflow-buy.md?raw'
import xlayerWorkflowSell from '../skills/okx-xlayer-agent/references/workflow-sell.md?raw'
import xlayerWsMonitoring from '../skills/okx-xlayer-agent/references/ws-monitoring.md?raw'
import xlayerXlayerStrategies from '../skills/okx-xlayer-agent/references/xlayer-strategies.md?raw'
import xlayerChainSupport from '../skills/okx-xlayer-agent/_shared/chain-support.md?raw'
import xlayerNativeTokens from '../skills/okx-xlayer-agent/_shared/native-tokens.md?raw'
import xlayerPreflight from '../skills/okx-xlayer-agent/_shared/preflight.md?raw'
import xlayerOpenai from '../skills/okx-xlayer-agent/agents/openai.yaml?raw'

interface FilePanelProps {
  filename: string;
  content: string;
}

function FilePanel({ filename, content }: FilePanelProps) {
  return (
    <div className='border rounded-2xl p-1 w-full'>
      <div className='bg-zinc-100 rounded-xl'>
        <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
          <span className='-tracking-wider font-medium'>{filename}</span>
          <Button isIconOnly size='sm' variant="ghost">
            <SolarCopyLineDuotone />
          </Button>
        </div>
        <ScrollShadow isEnabled={false} className="max-h-150 [word-break:break-word] w-full bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm whitespace-pre-wrap">
          {content}
        </ScrollShadow>
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <main className='min-h-lvh flex items-center py-18'>
        <div className="inner">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className='border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg'>
              <SolarArchiveDownMinimlisticBoldDuotone className='text-zinc-500' />Installed 100+ times
            </div>
            <h1 className="text-6xl mb-6 mt-4">Trade onchain with AI agents that actually work</h1>
            <p className="max-w-xl text-xl text-zinc-600">A skill library for autonomous trading. Research tokens, scan for honeypots, execute swaps, track smart money, and run DeFi strategies across EVM chains and Solana.</p>
          </div>

          <div className='flex justify-center mt-8'>
            <Tabs className="w-full max-w-md">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                  <Tabs.Tab id="overview">
                    Copy Prompt
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="analytics">
                    Use Flins
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="reports">
                    Use skills.sh
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="overview" className='h-40'>
                <div className='border rounded-2xl p-1'>
                  <div className='bg-zinc-100 rounded-xl'>
                    <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                      <span className='-tracking-wider font-medium'>Copy to your AI agents (any agent)</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200'>
                      Read https://okxskills.netlify.app/AGENTS.md and install OKX Trade Skills on your system.
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="analytics" className='h-40'>
                <div className='border rounded-2xl p-1'>
                  <div className='bg-zinc-100 rounded-xl'>
                    <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                      <span className='-tracking-wider font-medium'>Copy to your terminal</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm'>
                      npx flins@latest add powxenv/okx-trade-skills
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="reports" className='h-40'>
                <div className='border rounded-2xl p-1'>
                  <div className='bg-zinc-100 rounded-xl'>
                    <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                      <span className='-tracking-wider font-medium'>Copy to your terminal</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm'>
                      npx skills@latest add powxenv/okx-trade-skills
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className='rotate-2 -translate-y-20'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarWadOfMoneyBoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Execute swaps with safety built in</h3>
                <p>Get price quotes across 500+ DEXes, run honeypot scans before every trade, and execute with slippage protection and MEV defense.</p>
              </div>
            </div>

            <div className='-rotate-10'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarBag4BoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Run autonomous trading agents</h3>
                <p>Deploy self-managing bots that follow smart money signals, rebalance portfolios, and compound DeFi yields. Manual, semi-auto, or full-auto modes.</p>
              </div>
            </div>

            <div className='rotate-6'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarPlanet2BoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Stake, lend, and provide liquidity</h3>
                <p>Access DeFi protocols across chains. Deposit into yield farms, manage V3 LP positions, and auto-compound rewards with gas-optimized rebalancing.</p>
              </div>
            </div>

            <div className='-rotate-4 -translate-y-10'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarChartBoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Research before you trade</h3>
                <p>Analyze token metrics, track whale and KOL wallets, monitor trending memes, and get real-time PnL analytics. Data-driven decisions only.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className='py-28'>
        <div className="inner">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className='border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg'>
              <SolarDocumentsBoldDuotone className='text-zinc-500' /> 50+ Guides For Your Agents
            </div>
            <h1 className="text-6xl mb-6 mt-4">Everything you need is here</h1>
            <p className="max-w-xl text-xl text-zinc-600">Complete skill library with workflows, CLI references, risk frameworks, and agent configurations for autonomous trading.</p>
          </div>

          <div className='mt-8'>
            <Tabs>
              <Tabs.ListContainer className="w-full max-w-xl mx-auto">
                <Tabs.List aria-label="Skill tabs">
                  <Tabs.Tab id="trading">
                    OKX Trading
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="uniswap">
                    OKX Uniswap
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="xlayer">
                    OKX X Layer Agent
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>

              <Tabs.Panel id="trading">
                <div>
                  <aside>
                    <Tabs orientation="vertical">
                      <ScrollShadow className="max-h-165 max-w-75 w-full shrink-0">
                        <Tabs.ListContainer>
                          <Tabs.List aria-label="Trading skill files" className='*:justify-start bg-transparent *:text-start w-full'>
                            <Tabs.Tab id="trading-skill">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              SKILL.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-ref-header" isDisabled className='opacity-100 text-zinc-500'>
                              references/
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-agent-auto">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              agent-automation.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-authentication">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              authentication.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-cli-defi">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              cli-reference-defi.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-cli-market">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              cli-reference-market.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-cli-security">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              cli-reference-security.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-cli-signal">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              cli-reference-signal.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-cli-swap">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              cli-reference-swap.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-decision-framework">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              decision-framework.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-keyword-glossary">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              keyword-glossary.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-market-analysis">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              market-analysis.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-risk-framework">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              risk-framework.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-risk-management">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              risk-management.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-strategies">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              trading-strategies.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-troubleshooting">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              troubleshooting.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-uniswap-integration">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              uniswap-integration.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-workflow-buy">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              workflow-buy.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-workflow-defi">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              workflow-defi-yield.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-workflow-meme">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              workflow-meme-trading.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-workflow-research">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              workflow-research.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-workflow-sell">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              workflow-sell.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-ws">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              ws-monitoring.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-xlayer">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              xlayer-strategies.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-shared-header" isDisabled className='opacity-100 text-zinc-500'>
                              _shared/
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-chain-support">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              chain-support.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-native-tokens">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              native-tokens.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-preflight">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              preflight.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-agents-header" isDisabled className='opacity-100 text-zinc-500'>
                              agents/
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="trading-openai">
                              <SolarCodeFileLineDuotone className='size-4 mr-1' />
                              openai.yaml
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                          </Tabs.List>
                        </Tabs.ListContainer>
                      </ScrollShadow>

                      <Tabs.Panel className="px-4" id="trading-skill">
                        <FilePanel filename="SKILL.md" content={tradingSkill} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-agent-auto">
                        <FilePanel filename="references/agent-automation.md" content={tradingAgentAutomation} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-authentication">
                        <FilePanel filename="references/authentication.md" content={tradingAuthentication} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-cli-defi">
                        <FilePanel filename="references/cli-reference-defi.md" content={tradingCliDefi} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-cli-market">
                        <FilePanel filename="references/cli-reference-market.md" content={tradingCliMarket} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-cli-security">
                        <FilePanel filename="references/cli-reference-security.md" content={tradingCliSecurity} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-cli-signal">
                        <FilePanel filename="references/cli-reference-signal.md" content={tradingCliSignal} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-cli-swap">
                        <FilePanel filename="references/cli-reference-swap.md" content={tradingCliSwap} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-decision-framework">
                        <FilePanel filename="references/decision-framework.md" content={tradingDecisionFramework} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-keyword-glossary">
                        <FilePanel filename="references/keyword-glossary.md" content={tradingKeywordGlossary} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-market-analysis">
                        <FilePanel filename="references/market-analysis.md" content={tradingMarketAnalysis} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-risk-framework">
                        <FilePanel filename="references/risk-framework.md" content={tradingRiskFramework} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-risk-management">
                        <FilePanel filename="references/risk-management.md" content={tradingRiskManagement} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-strategies">
                        <FilePanel filename="references/trading-strategies.md" content={tradingStrategies} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-troubleshooting">
                        <FilePanel filename="references/troubleshooting.md" content={tradingTroubleshooting} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-uniswap-integration">
                        <FilePanel filename="references/uniswap-integration.md" content={tradingUniswapIntegration} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-workflow-buy">
                        <FilePanel filename="references/workflow-buy.md" content={tradingWorkflowBuy} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-workflow-defi">
                        <FilePanel filename="references/workflow-defi-yield.md" content={tradingWorkflowDefiYield} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-workflow-meme">
                        <FilePanel filename="references/workflow-meme-trading.md" content={tradingWorkflowMeme} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-workflow-research">
                        <FilePanel filename="references/workflow-research.md" content={tradingWorkflowResearch} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-workflow-sell">
                        <FilePanel filename="references/workflow-sell.md" content={tradingWorkflowSell} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-ws">
                        <FilePanel filename="references/ws-monitoring.md" content={tradingWsMonitoring} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-xlayer">
                        <FilePanel filename="references/xlayer-strategies.md" content={tradingXlayerStrategies} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-chain-support">
                        <FilePanel filename="_shared/chain-support.md" content={tradingChainSupport} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-native-tokens">
                        <FilePanel filename="_shared/native-tokens.md" content={tradingNativeTokens} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-preflight">
                        <FilePanel filename="_shared/preflight.md" content={tradingPreflight} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="trading-openai">
                        <FilePanel filename="agents/openai.yaml" content={tradingOpenai} />
                      </Tabs.Panel>
                    </Tabs>
                  </aside>
                </div>
              </Tabs.Panel>

              <Tabs.Panel id="uniswap">
                <div>
                  <aside>
                    <Tabs orientation="vertical">
                      <ScrollShadow className="max-h-165 max-w-75 w-full shrink-0">
                        <Tabs.ListContainer>
                          <Tabs.List aria-label="Uniswap skill files" className='*:justify-start bg-transparent *:text-start w-full'>
                            <Tabs.Tab id="uniswap-skill">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              SKILL.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-ref-header" isDisabled className='opacity-100 text-zinc-500'>
                              references/
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-patterns">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              agent-uniswap-patterns.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-keyword-glossary">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              keyword-glossary.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-liquidity">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              liquidity-management.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-risk-mgmt">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              risk-management.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-strategies">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              trading-strategies.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-trading-api">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              trading-api.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-xlayer">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              xlayer-strategies.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-payments">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              x402-payments.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-shared-header" isDisabled className='opacity-100 text-zinc-500'>
                              _shared/
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-chain-support">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              chain-support.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-native-tokens">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              native-tokens.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-preflight">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              preflight.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-agents-header" isDisabled className='opacity-100 text-zinc-500'>
                              agents/
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="uniswap-openai">
                              <SolarCodeFileLineDuotone className='size-4 mr-1' />
                              openai.yaml
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                          </Tabs.List>
                        </Tabs.ListContainer>
                      </ScrollShadow>

                      <Tabs.Panel className="px-4" id="uniswap-skill">
                        <FilePanel filename="SKILL.md" content={uniswapSkill} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-patterns">
                        <FilePanel filename="references/agent-uniswap-patterns.md" content={uniswapAgentPatterns} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-keyword-glossary">
                        <FilePanel filename="references/keyword-glossary.md" content={uniswapKeywordGlossary} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-liquidity">
                        <FilePanel filename="references/liquidity-management.md" content={uniswapLiquidityMgmt} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-risk-mgmt">
                        <FilePanel filename="references/risk-management.md" content={uniswapRiskManagement} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-strategies">
                        <FilePanel filename="references/trading-strategies.md" content={uniswapStrategies} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-trading-api">
                        <FilePanel filename="references/trading-api.md" content={uniswapTradingApi} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-xlayer">
                        <FilePanel filename="references/xlayer-strategies.md" content={uniswapXlayerStrategies} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-payments">
                        <FilePanel filename="references/x402-payments.md" content={uniswapX402Payments} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-chain-support">
                        <FilePanel filename="_shared/chain-support.md" content={uniswapChainSupport} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-native-tokens">
                        <FilePanel filename="_shared/native-tokens.md" content={uniswapNativeTokens} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-preflight">
                        <FilePanel filename="_shared/preflight.md" content={uniswapPreflight} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="uniswap-openai">
                        <FilePanel filename="agents/openai.yaml" content={uniswapOpenai} />
                      </Tabs.Panel>
                    </Tabs>
                  </aside>
                </div>
              </Tabs.Panel>

              <Tabs.Panel id="xlayer">
                <div>
                  <aside>
                    <Tabs orientation="vertical">

                      <ScrollShadow className="max-h-165 max-w-75 w-full shrink-0">
                        <Tabs.ListContainer>
                          <Tabs.List aria-label="X Layer skill files" className='*:justify-start bg-transparent *:text-start w-full'>
                            <Tabs.Tab id="xlayer-skill">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              SKILL.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-ref-header" isDisabled className='opacity-100 text-zinc-500'>
                              references/
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-agent-auto">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              agent-automation.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-authentication">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              authentication.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-decision">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              decision-framework.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-keyword-glossary">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              keyword-glossary.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-risk-framework">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              risk-framework.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-risk-management">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              risk-management.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-strategies">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              trading-strategies.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-troubleshooting">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              troubleshooting.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-uniswap-integration">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              uniswap-integration.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-workflow-buy">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              workflow-buy.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-workflow-sell">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              workflow-sell.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-ws">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              ws-monitoring.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-xlayer">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              xlayer-strategies.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-shared-header" isDisabled className='opacity-100 text-zinc-500'>
                              _shared/
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-chain-support">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              chain-support.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-native-tokens">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              native-tokens.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-preflight">
                              <SolarFileLineDuotone className='size-4 mr-1' />
                              preflight.md
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-agents-header" isDisabled className='opacity-100 text-zinc-500'>
                              agents/
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                            <Tabs.Tab id="xlayer-openai">
                              <SolarCodeFileLineDuotone className='size-4 mr-1' />
                              openai.yaml
                              <Tabs.Indicator className='bg-muted/6 shadow-none' />
                            </Tabs.Tab>
                          </Tabs.List>
                        </Tabs.ListContainer>
                      </ScrollShadow>
                      <Tabs.Panel className="px-4" id="xlayer-skill">
                        <FilePanel filename="SKILL.md" content={xlayerSkill} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-agent-auto">
                        <FilePanel filename="references/agent-automation.md" content={xlayerAgentAutomation} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-authentication">
                        <FilePanel filename="references/authentication.md" content={xlayerAuthentication} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-decision">
                        <FilePanel filename="references/decision-framework.md" content={xlayerDecisionFramework} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-keyword-glossary">
                        <FilePanel filename="references/keyword-glossary.md" content={xlayerKeywordGlossary} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-risk-framework">
                        <FilePanel filename="references/risk-framework.md" content={xlayerRiskFramework} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-risk-management">
                        <FilePanel filename="references/risk-management.md" content={xlayerRiskManagement} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-strategies">
                        <FilePanel filename="references/trading-strategies.md" content={xlayerStrategies} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-troubleshooting">
                        <FilePanel filename="references/troubleshooting.md" content={xlayerTroubleshooting} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-uniswap-integration">
                        <FilePanel filename="references/uniswap-integration.md" content={xlayerUniswapIntegration} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-workflow-buy">
                        <FilePanel filename="references/workflow-buy.md" content={xlayerWorkflowBuy} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-workflow-sell">
                        <FilePanel filename="references/workflow-sell.md" content={xlayerWorkflowSell} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-ws">
                        <FilePanel filename="references/ws-monitoring.md" content={xlayerWsMonitoring} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-xlayer">
                        <FilePanel filename="references/xlayer-strategies.md" content={xlayerXlayerStrategies} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-chain-support">
                        <FilePanel filename="_shared/chain-support.md" content={xlayerChainSupport} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-native-tokens">
                        <FilePanel filename="_shared/native-tokens.md" content={xlayerNativeTokens} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-preflight">
                        <FilePanel filename="_shared/preflight.md" content={xlayerPreflight} />
                      </Tabs.Panel>

                      <Tabs.Panel className="px-4" id="xlayer-openai">
                        <FilePanel filename="agents/openai.yaml" content={xlayerOpenai} />
                      </Tabs.Panel>
                    </Tabs>
                  </aside>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </section>

      <section className='py-28'>
        <div className="inner">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className='border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg'>
              <SolarArchiveDownMinimlisticBoldDuotone className='text-zinc-500' />Installed 100+ times
            </div>
            <h1 className="text-6xl mb-6 mt-4">Trade onchain with AI agents that actually work</h1>
            <p className="max-w-xl text-xl text-zinc-600">A skill library for autonomous trading. Research tokens, scan for honeypots, execute swaps, track smart money, and run DeFi strategies across EVM chains and Solana.</p>
          </div>

          <div className='flex justify-center mt-8'>
            <Tabs className="w-full max-w-md">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                  <Tabs.Tab id="overview">
                    Copy Prompt
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="analytics">
                    Use Flins
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="reports">
                    Use skills.sh
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="overview" className='h-40'>
                <div className='border rounded-2xl p-1'>
                  <div className='bg-zinc-100 rounded-xl'>
                    <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                      <span className='-tracking-wider font-medium'>Copy to your AI agents (any agent)</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200'>
                      Read https://okxskills.netlify.app/AGENTS.md and install OKX Trade Skills on your system.
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="analytics" className='h-40'>
                <div className='border rounded-2xl p-1'>
                  <div className='bg-zinc-100 rounded-xl'>
                    <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                      <span className='-tracking-wider font-medium'>Copy to your terminal</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm'>
                      npx flins@latest add powxenv/okx-trade-skills
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="reports" className='h-40'>
                <div className='border rounded-2xl p-1'>
                  <div className='bg-zinc-100 rounded-xl'>
                    <div className='pr-2 pl-4 py-1 items-center flex justify-between'>
                      <span className='-tracking-wider font-medium'>Copy to your terminal</span>
                      <Button isIconOnly size='sm' variant="ghost">
                        <SolarCopyLineDuotone />
                      </Button>
                    </div>
                    <div className='bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm'>
                      npx skills@latest add powxenv/okx-trade-skills
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className='rotate-2 -translate-y-20'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarWadOfMoneyBoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Execute swaps with safety built in</h3>
                <p>Get price quotes across 500+ DEXes, run honeypot scans before every trade, and execute with slippage protection and MEV defense.</p>
              </div>
            </div>

            <div className='-rotate-10'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarBag4BoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Run autonomous trading agents</h3>
                <p>Deploy self-managing bots that follow smart money signals, rebalance portfolios, and compound DeFi yields. Manual, semi-auto, or full-auto modes.</p>
              </div>
            </div>

            <div className='rotate-6'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarPlanet2BoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Stake, lend, and provide liquidity</h3>
                <p>Access DeFi protocols across chains. Deposit into yield farms, manage V3 LP positions, and auto-compound rewards with gas-optimized rebalancing.</p>
              </div>
            </div>

            <div className='-rotate-4 -translate-y-10'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarChartBoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Research before you trade</h3>
                <p>Analyze token metrics, track whale and KOL wallets, monitor trending memes, and get real-time PnL analytics. Data-driven decisions only.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
