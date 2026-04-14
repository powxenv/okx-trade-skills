import SolarBag4BoldDuotone from '~icons/solar/bag-4-bold-duotone'
import SolarWadOfMoneyBoldDuotone from '~icons/solar/wad-of-money-bold-duotone'
import SolarPlanet2BoldDuotone from '~icons/solar/planet-2-bold-duotone'
import SolarChartBoldDuotone from '~icons/solar/chart-bold-duotone'
import SolarArchiveDownMinimlisticBoldDuotone from '~icons/solar/archive-down-minimlistic-bold-duotone'
import SolarCopyLineDuotone from '~icons/solar/copy-line-duotone'
import { Button, Tabs } from "@heroui/react";

function App() {
  return (
    <>
      <main className='min-h-lvh flex items-center'>
        <div className="inner">
          <div className="max-w-xl mx-auto text-center flex flex-col items-center">
            <div className='border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg'>
              <SolarArchiveDownMinimlisticBoldDuotone className='text-zinc-500' />Installed 100+ times
            </div>
            <h1 className="text-6xl mb-4 mt-2">Trade onchain with AI agents that actually work</h1>
            <p className="max-w-md text-xl">A skill library for autonomous trading. Research tokens, scan for honeypots, execute swaps, track smart money, and run DeFi strategies across EVM chains and Solana.</p>
          </div>

          <div className='flex justify-center'>
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
            <div className='rotate-8 -translate-y-20'>
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <div className='size-10 border flex justify-center items-center rounded-lg'>
                  <SolarWadOfMoneyBoldDuotone className='text-zinc-500' />
                </div>
                <h3 className="text-lg mt-1 mb-2">Execute swaps with safety built in</h3>
                <p>Get price quotes across 500+ DEXes, run honeypot scans before every trade, and execute with slippage protection and MEV defense.</p>
              </div>
            </div>

            <div className='-rotate-12'>
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
    </>
  )
}

export default App
