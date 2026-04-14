import { Tabs } from "@heroui/react";
import SolarDocumentsBoldDuotone from "~icons/solar/documents-bold-duotone";
import TradingPanel from "./trading-panel";
import UniswapPanel from "./uniswap-panel";
import XlayerPanel from "./xlayer-panel";
import EcosystemPanel from "./ecosystem-panel";

export default function GuidesSection() {
  return (
    <section id="guides" className="py-16 md:py-28">
      <div className="inner">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg text-sm">
            <SolarDocumentsBoldDuotone className="text-zinc-500" /> 60+ Guides
            For Your Agents
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 mt-4">
            Everything you need is here
          </h1>
          <p className="max-w-xl text-base sm:text-lg md:text-xl text-zinc-600">
            Complete skill library with workflows, CLI references, risk
            frameworks, and agent configurations for autonomous trading.
          </p>
        </div>

        <div className="mt-8">
          <Tabs>
            <Tabs.ListContainer className="w-full max-w-lg mx-auto">
              <Tabs.List aria-label="Skill tabs">
                <Tabs.Tab id="trading">
                  Trading
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="uniswap">
                  Uniswap
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="xlayer">
                  X Layer
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="ecosystem">
                  Ecosystem
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

            <Tabs.Panel id="ecosystem">
              <EcosystemPanel />
            </Tabs.Panel>
          </Tabs>

          <span className="block text-center text-zinc-600 md:hidden">
            Swipe to view all files
          </span>
        </div>
      </div>
    </section>
  );
}
