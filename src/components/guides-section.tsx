import { Tabs } from "@heroui/react";
import SolarDocumentsBoldDuotone from '~icons/solar/documents-bold-duotone'
import TradingPanel from './trading-panel'
import UniswapPanel from './uniswap-panel'
import XlayerPanel from './xlayer-panel'

export default function GuidesSection() {
  return (
    <section id='guides' className='py-28'>
      <div className="inner">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className='border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg'>
            <SolarDocumentsBoldDuotone className='text-zinc-500' /> 60+ Guides For Your Agents
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
              <TradingPanel />
            </Tabs.Panel>

            <Tabs.Panel id="uniswap">
              <UniswapPanel />
            </Tabs.Panel>

            <Tabs.Panel id="xlayer">
              <XlayerPanel />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
