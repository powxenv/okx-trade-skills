import { Button, Tabs, Tooltip } from "@heroui/react";
import SolarBagLinear from "~icons/solar/bag-linear";
import SolarWalletMoneyLinear from "~icons/solar/wallet-money-linear";
import SolarPlanetLinear from "~icons/solar/planet-linear";
import SolarChartLinear from "~icons/solar/chart-linear";
import SolarArchiveDownLinear from "~icons/solar/archive-down-linear";
import SolarCopyLinear from "~icons/solar/copy-linear";
import SolarCheckCircleLinear from "~icons/solar/check-circle-linear";
import { useCopy } from "../hooks/use-copy";

function InstallTabs() {
  const promptCopy = useCopy("Read https://okxskills.noval.me/AGENTS.md and install OKX Trade Skills on your system.");
  const flinsCopy = useCopy("npx flins@latest add okxskills.noval.me");
  const skillsCopy = useCopy("npx skills@latest add https://okxskills.noval.me");

  return (
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
      <Tabs.Panel id="overview" className="h-40">
        <div className="border rounded-2xl p-1">
          <div className="bg-zinc-100 rounded-xl">
            <div className="pr-2 pl-4 py-1 items-center flex justify-between">
              <span className="-tracking-wider font-medium">
                Copy to your AI agents, any agent
              </span>
              <Tooltip delay={0}>
                <Button isIconOnly size="sm" variant="ghost" onClick={promptCopy.copy}>
                  {promptCopy.copied ? <SolarCheckCircleLinear /> : <SolarCopyLinear />}
                </Button>
                <Tooltip.Content>
                  <p>{promptCopy.copied ? "Copied" : "Copy"}</p>
                </Tooltip.Content>
              </Tooltip>
            </div>
            <div className="bg-zinc-800 p-4 rounded-xl text-zinc-200">
              Read https://okxskills.noval.me/AGENTS.md and install OKX Trade
              Skills on your system.
            </div>
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel id="analytics" className="h-40">
        <div className="border rounded-2xl p-1">
          <div className="bg-zinc-100 rounded-xl">
            <div className="pr-2 pl-4 py-1 items-center flex justify-between">
              <span className="-tracking-wider font-medium">
                Copy to your terminal
              </span>
              <Tooltip delay={0}>
                <Button isIconOnly size="sm" variant="ghost" onClick={flinsCopy.copy}>
                  {flinsCopy.copied ? <SolarCheckCircleLinear /> : <SolarCopyLinear />}
                </Button>
                <Tooltip.Content>
                  <p>{flinsCopy.copied ? "Copied" : "Copy"}</p>
                </Tooltip.Content>
              </Tooltip>
            </div>
            <div className="bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm">
              npx flins@latest add okxskills.noval.me
            </div>
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel id="reports" className="h-40">
        <div className="border rounded-2xl p-1">
          <div className="bg-zinc-100 rounded-xl">
            <div className="pr-2 pl-4 py-1 items-center flex justify-between">
              <span className="-tracking-wider font-medium">
                Copy to your terminal
              </span>
              <Tooltip delay={0}>
                <Button isIconOnly size="sm" variant="ghost" onClick={skillsCopy.copy}>
                  {skillsCopy.copied ? <SolarCheckCircleLinear /> : <SolarCopyLinear />}
                </Button>
                <Tooltip.Content>
                  <p>{skillsCopy.copied ? "Copied" : "Copy"}</p>
                </Tooltip.Content>
              </Tooltip>
            </div>
            <div className="bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm">
              npx skills@latest add https://okxskills.noval.me
            </div>
          </div>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}

function FeatureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      <div className="md:rotate-2 md:-translate-y-20">
        <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
          <div className="size-10 border flex justify-center items-center rounded-lg">
            <SolarWalletMoneyLinear className="text-zinc-500" />
          </div>
          <h3 className="text-lg mt-1 mb-2">
            Swap with safety built in
          </h3>
          <p>
            Get prices across 500+ DEXes, scan for honeypots before every trade,
            and execute with slippage protection.
          </p>
        </div>
      </div>

      <div className="md:-rotate-10">
        <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
          <div className="size-10 border flex justify-center items-center rounded-lg">
            <SolarBagLinear className="text-zinc-500" />
          </div>
          <h3 className="text-lg mt-1 mb-2">Deploy autonomous agents</h3>
          <p>
            Agents that trade on X Layer for near-zero gas, follow smart money,
            and compound yields. Manual, semi-auto, or full-auto.
          </p>
        </div>
      </div>

      <div className="md:rotate-6">
        <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
          <div className="size-10 border flex justify-center items-center rounded-lg">
            <SolarPlanetLinear className="text-zinc-500" />
          </div>
          <h3 className="text-lg mt-1 mb-2">
            Protect your portfolio
          </h3>
          <p>
            Auto stop-loss, impermanent loss tracking, approval auditing, and
            whale alerts. Your agent watches while you sleep.
          </p>
        </div>
      </div>

      <div className="md:-rotate-4 md:-translate-y-10">
        <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
          <div className="size-10 border flex justify-center items-center rounded-lg">
            <SolarChartLinear className="text-zinc-500" />
          </div>
          <h3 className="text-lg mt-1 mb-2">Catch gems, avoid rugs</h3>
          <p>
            Meme intelligence scores devs, spots snipers, and analyzes bonding
            curves. Trade pump.fun with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <main className="min-h-lvh flex items-center py-24 md:py-18">
      <div className="inner">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg text-sm w-fit">
            <SolarArchiveDownLinear className="text-zinc-500" />
            Installed 100+ times
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 mt-4">
            An onchain skill suite for AI agents
          </h1>
          <p className="max-w-xl text-base sm:text-lg md:text-xl text-zinc-600">
            Give your AI agent the skills to trade, protect, and analyze onchain.
            Execute swaps, monitor portfolios, catch meme gems, deploy strategies,
            and automate risk management—all with built-in security.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <InstallTabs />
        </div>

        <FeatureCards />
      </div>
    </main>
  );
}
