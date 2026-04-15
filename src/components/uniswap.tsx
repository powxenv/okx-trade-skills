import InstallCommand from "./shared/install-command";
import ViewFilesButton from "./shared/view-files-button";
import SectionHeader from "./shared/section-header";
import SolarSortFromTopToBottomBoldDuotone from "~icons/solar/sort-from-top-to-bottom-bold-duotone";
import SolarUsersGroupRoundedBoldDuotone from "~icons/solar/users-group-rounded-bold-duotone";
import SolarCardReciveBoldDuotone from "~icons/solar/card-recive-bold-duotone";
import SolarArchiveDownMinimlisticBoldDuotone from "~icons/solar/archive-down-minimlistic-bold-duotone";
import SolarConfettiBoldDuotone from "~icons/solar/confetti-bold-duotone";

import { uniswapFiles } from "../data/skill-files";

const features = [
  {
    icon: <SolarSortFromTopToBottomBoldDuotone className="text-zinc-500" />,
    title: "Direct Contract Access",
    desc: "Interact with V3 and V4 pools without intermediaries. Maximum control, minimum friction.",
    highlight: "V3 & V4 Ready",
  },
  {
    icon: <SolarUsersGroupRoundedBoldDuotone className="text-zinc-500" />,
    title: "Concentrated Liquidity",
    desc: "Manage positions with custom tick ranges. Rebalance automatically as price moves.",
    highlight: "Auto Rebalance",
  },
  {
    icon: <SolarCardReciveBoldDuotone className="text-zinc-500" />,
    title: "x402 Payments",
    desc: "Pay for APIs using tokens via Uniswap. Self-funding agents on X Layer.",
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

          {/* Right: Header + Live Metrics */}
          <div className="order-1 lg:order-2">
            <SectionHeader
              badgeIcon={<SolarArchiveDownMinimlisticBoldDuotone className="text-zinc-500" />}
              badgeText="Protocol Integration"
              title="Uniswap Direct"
              description="Contract-level integration for Uniswap V3 and V4. Manage concentrated liquidity, execute swaps, and handle x402 payments, all without leaving your agent."
            />

            {/* Live Metrics */}
            <div className="border rounded-xl p-5 bg-zinc-50 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <SolarConfettiBoldDuotone className="size-4 text-zinc-400" />
                <span className="text-sm font-medium">Live Protocol Data</span>
                <span className="text-sm text-zinc-600 ml-auto">Updated real-time</span>
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
              count={15}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
