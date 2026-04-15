import SolarCloseCircleBoldDuotone from "~icons/solar/close-circle-bold-duotone";
import SolarCheckCircleLineDuotone from "~icons/solar/check-circle-line-duotone";
import SolarBoltBoldDuotone from "~icons/solar/bolt-bold-duotone";
import SolarGraphUpBoldDuotone from "~icons/solar/graph-up-bold-duotone";
import SolarLinkRoundBoldDuotone from "~icons/solar/link-round-bold-duotone";
import SolarShieldCheckBoldDuotone from "~icons/solar/shield-check-bold-duotone";
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
  "One prompt covers research, safety checks, and the trade itself",
  "Honeypot and rug-pull scans run automatically before each swap",
  "Routes through 500+ DEX sources to find the best price, every time",
  "Set it and let the agent rebalance and compound for you around the clock",
];

const stats = [
  {
    icon: SolarGraphUpBoldDuotone,
    value: "500+",
    label: "DEX sources",
  },
  { icon: SolarLinkRoundBoldDuotone, value: "20+", label: "Chains" },
  { icon: SolarBoltBoldDuotone, value: "<2s", label: "Execution speed" },
  { icon: SolarShieldCheckBoldDuotone, value: "Zero", label: "Custody risk" },
];

export default function OkxTrading() {
  return (
    <section id="okx-trading" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg w-fit text-sm">
              <SolarBoltBoldDuotone className="text-zinc-500" />
              Core Trading
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 mt-4">
              You already have the agent. Now give it the skills.
            </h2>
            <p className="max-w-xl text-base sm:text-lg md:text-xl text-zinc-600">
              Instead of juggling a dozen tools, your agent can research, scan,
              swap, and manage positions all on its own. You just say what you
              want.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
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
              count={28}
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
                      <SolarCloseCircleBoldDuotone className="size-5 shrink-0 text-zinc-300" />
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
                      <SolarCheckCircleLineDuotone className="size-5 shrink-0 text-zinc-600" />
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
