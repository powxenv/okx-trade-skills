import InstallCommand from "./shared/install-command";
import ViewFilesButton from "./shared/view-files-button";
import SectionHeader from "./shared/section-header";
import SolarSortFromTopToBottomLinear from "~icons/solar/sort-from-top-to-bottom-linear";
import SolarUsersGroupRoundedLinear from "~icons/solar/users-group-rounded-linear";
import SolarCardReciveLinear from "~icons/solar/card-recive-linear";
import SolarArchiveDownLinear from "~icons/solar/archive-down-linear";
import SolarConfettiLinear from "~icons/solar/confetti-linear";

import { uniswapFiles } from "../data/skill-files";

const features = [
  {
    icon: <SolarSortFromTopToBottomLinear className="text-zinc-500" />,
    title: "Direct Contract Access",
    desc: "Skip the frontend. Talk to pools directly through your agent with zero UI friction.",
    highlight: "V3 and V4 Ready",
  },
  {
    icon: <SolarUsersGroupRoundedLinear className="text-zinc-500" />,
    title: "Concentrated Liquidity",
    desc: "Manage LP positions with custom tick ranges. Auto-rebalance when price moves out of bounds.",
    highlight: "Auto Rebalance",
  },
  {
    icon: <SolarCardReciveLinear className="text-zinc-500" />,
    title: "x402 Payments",
    desc: "Pay for API calls using the tokens you're trading. Your agent funds itself on X Layer.",
    highlight: "Zero Gas Layer",
  },
];

const liveMetrics = [
  { label: "Protocol TVL", value: "$4.2B", change: "+2.4%" },
  { label: "24h Volume", value: "$892M", change: "+8.1%" },
  { label: "Active Pools", value: "1.2M", change: "+5.3%" },
];

export default function Uniswap() {
  return (
    <section id="okx-uniswap" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Features */}
          <div className="order-2 lg:order-1">
            {features.map((feature, idx) => (
              <div key={feature.title} className={idx === 0 ? "lg:translate-y-4" : idx === 1 ? "lg:-translate-y-2" : ""}>
                <div className={`border p-5 rounded-xl bg-white shadow-xl shadow-black/6 ${idx === 0 ? "lg:rotate-1" : idx === 1 ? "lg:-rotate-1" : "lg:rotate-2"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="size-10 border flex justify-center items-center rounded-lg">
                      {feature.icon}
                    </div>
                    <span className="text-xs text-zinc-400 border rounded-full px-2 py-0.5">
                      {feature.highlight}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeader
              badgeIcon={<SolarArchiveDownLinear className="text-zinc-500" />}
              badgeText="Protocol Integration"
              title="Uniswap, straight from the terminal"
              description="Your agent can swap, add liquidity, and manage positions on Uniswap without ever opening a browser."
            />

            <div className="border rounded-xl p-5 bg-zinc-50 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <SolarConfettiLinear className="size-4 text-zinc-400" />
                <span className="text-sm font-medium">Live Protocol Data</span>
                <span className="text-sm text-zinc-600 ml-auto">Updated in real time</span>
              </div>
              <div className="space-y-3">
                {liveMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">{metric.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-lg -tracking-wider font-medium">{metric.value}</span>
                      <span className="text-sm text-emerald-600 flex items-center gap-0.5">
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <InstallCommand skillName="okx-uniswap" />
            <ViewFilesButton
              files={uniswapFiles}
              ariaLabel="Uniswap skill files"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
