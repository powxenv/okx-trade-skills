import SolarCloseCircleLinear from "~icons/solar/close-circle-linear";
import SolarCheckCircleLinear from "~icons/solar/check-circle-linear";
import SolarBoltLinear from "~icons/solar/bolt-linear";
import SolarGraphUpLinear from "~icons/solar/graph-up-linear";
import SolarLinkRoundLinear from "~icons/solar/link-round-linear";
import SolarShieldCheckLinear from "~icons/solar/shield-check-linear";
import InstallCommand from "./shared/install-command";
import ViewFilesButton from "./shared/view-files-button";

import { tradingFiles } from "../data/skill-files";

const painPoints = [
  "Open 5 tabs just to figure out if a token is worth buying",
  "Paste addresses into scanners by hand and hope you didn't miss anything",
  "Copy calldata between aggregators, double-checking every field",
  "Refresh dashboards all day to keep track of your positions",
];

const gains = [
  "Your agent handles research, safety checks, and execution in one go",
  "Honeypot and rug-pull scans run automatically before every swap",
  "Routes through 500+ DEX sources to find the best price, every time",
  "Your agent rebalances and compounds positions around the clock",
];

const stats = [
  {
    icon: SolarGraphUpLinear,
    value: "500+",
    label: "DEX sources",
  },
  { icon: SolarLinkRoundLinear, value: "20+", label: "Chains" },
  { icon: SolarBoltLinear, value: "<2s", label: "Execution speed" },
  { icon: SolarShieldCheckLinear, value: "Zero", label: "Custody risk" },
];

export default function OkxTrading() {
  return (
    <section id="okx-trading" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg w-fit text-sm">
              <SolarBoltLinear className="text-zinc-500" />
              Core Trading
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 mt-4">
              Give your agent the full onchain toolkit
            </h2>
            <p className="max-w-xl text-base sm:text-lg md:text-xl text-zinc-600">
              Your agent already knows how to reason. Now give it the tools to
              act. Research tokens, scan for rugs, execute swaps, and manage
              positions across 500+ DEXes and 20+ chains.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center flex flex-col items-center gap-1"
                >
                  <stat.icon className="size-5 text-zinc-500" />
                  <div className="text-2xl -tracking-wider font-medium">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <InstallCommand skillName="okx-trading" />
            <ViewFilesButton
              files={tradingFiles}
              ariaLabel="Trading skill files"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="md:-rotate-1">
              <div className="border p-6 rounded-xl bg-zinc-50 shadow-xl shadow-black/6">
                <h3 className="text-lg mb-4 text-zinc-500">Without skills</h3>
                <ul className="space-y-3">
                  {painPoints.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 items-start text-sm text-zinc-500"
                    >
                      <SolarCloseCircleLinear className="size-5 shrink-0 text-zinc-300" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:rotate-1">
              <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
                <h3 className="text-lg mb-4">With onchain skills</h3>
                <ul className="space-y-3">
                  {gains.map((gain) => (
                    <li key={gain} className="flex gap-3 items-start text-sm">
                      <SolarCheckCircleLinear className="size-5 shrink-0 text-zinc-600" />
                      {gain}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
