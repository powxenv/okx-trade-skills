import SolarCloseCircleBoldDuotone from "~icons/solar/close-circle-bold-duotone";
import SolarCheckCircleLineDuotone from "~icons/solar/check-circle-line-duotone";
import SolarBoltBoldDuotone from "~icons/solar/bolt-bold-duotone";
import SolarGraphUpBoldDuotone from "~icons/solar/graph-up-bold-duotone";
import SolarLinkRoundBoldDuotone from "~icons/solar/link-round-bold-duotone";
import SolarShieldCheckBoldDuotone from "~icons/solar/shield-check-bold-duotone";

const painPoints = [
  "Jump between 5 tabs to research a single token",
  "Manually paste addresses into honeypot scanners",
  "Copy-paste calldata between DEX aggregators",
  "Watch positions across chains by refreshing dashboards",
];

const gains = [
  "Agent researches, scans, and trades from one prompt",
  "Honeypot and rug checks run before every swap",
  "Optimal routing across 500+ DEX sources, gas-optimized",
  "Autonomous agents monitor and rebalance 24/7",
];

const stats = [
  {
    icon: SolarGraphUpBoldDuotone,
    value: "500+",
    label: "DEX sources aggregated",
  },
  { icon: SolarLinkRoundBoldDuotone, value: "20+", label: "Chains supported" },
  { icon: SolarBoltBoldDuotone, value: "<2s", label: "Quote-to-execution" },
  { icon: SolarShieldCheckBoldDuotone, value: "Zero", label: "Custody taken" },
];

export default function WhySection() {
  return (
    <section className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg w-fit text-sm">
              <SolarBoltBoldDuotone className="text-zinc-500" />
              Why onchain skills
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 mt-4">
              Stop switching between tools
            </h1>
            <p className="max-w-xl text-base sm:text-lg md:text-xl text-zinc-600">
              Your AI agent already knows how to trade. Give it the skills to do
              it autonomously — research, scan, swap, and manage — all from a
              single prompt.
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
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="md:-rotate-1">
              <div className="border p-6 rounded-xl bg-zinc-50 shadow-xl shadow-black/6">
                <h3 className="text-lg mb-4 text-zinc-500">The old way</h3>
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
