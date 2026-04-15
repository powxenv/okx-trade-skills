import React from "react";
import InstallCommand from "./shared/install-command";
import ViewFilesButton from "./shared/view-files-button";
import SectionHeader from "./shared/section-header";
import SolarEyeLinear from "~icons/solar/eye-linear";
import SolarBoltLinear from "~icons/solar/bolt-linear";
import SolarRocketLinear from "~icons/solar/rocket-linear";
import SolarArrowDownLinear from "~icons/solar/arrow-down-linear";
import SolarArchiveDownLinear from "~icons/solar/archive-down-linear";

import { xlayerFiles } from "../data/skill-files";

const steps = [
  { num: "01", icon: <SolarEyeLinear className="text-zinc-500" />, title: "Watch", desc: "Your agent monitors prices, whales, and arb opportunities across the chain" },
  { num: "02", icon: <SolarBoltLinear className="text-zinc-500" />, title: "Decide", desc: "Your agent runs strategies, checks risk limits, and optimizes for gas" },
  { num: "03", icon: <SolarRocketLinear className="text-zinc-500" />, title: "Execute", desc: "Zero-gas transactions, auto-compound, and x402 self-payment" },
];

export default function XlayerAgent() {
  return (
    <section id="okx-xlayer-agent" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <div>
            <SectionHeader
              badgeIcon={<SolarArchiveDownLinear className="text-zinc-500" />}
              badgeText="Autonomous Agents"
              title="Give your agent a chain that never sleeps"
              description="X Layer's near-zero gas means your agent can trade, compound, and pay for itself using x402. No more topping up—your agent sustains its own operations."
            />

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-2xl -tracking-wider font-medium">Zero</div>
                <div className="text-sm text-zinc-500">Gas</div>
              </div>
              <div>
                <div className="text-2xl -tracking-wider font-medium">2s</div>
                <div className="text-sm text-zinc-500">Blocks</div>
              </div>
              <div>
                <div className="text-2xl -tracking-wider font-medium">4K+</div>
                <div className="text-sm text-zinc-500">TPS</div>
              </div>
            </div>

            <InstallCommand skillName="okx-xlayer-agent" />
            <ViewFilesButton
              files={xlayerFiles}
              ariaLabel="X Layer Agent skill files"
            />
          </div>

          <div className="flex flex-col gap-4">
            {steps.map((step, idx) => (
              <React.Fragment key={step.title}>
                <div className="relative">
                  <div className={`border p-5 rounded-xl bg-white shadow-xl shadow-black/6 ${idx === 0 ? "lg:rotate-1" : idx === 1 ? "lg:-rotate-1" : "lg:rotate-2"}`}>
                    <div className="flex items-start gap-4">
                      <div className="size-10 border flex justify-center items-center rounded-lg shrink-0">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-zinc-400 -tracking-wider mb-1">{step.num}</div>
                        <h3 className="text-lg font-medium mb-1">{step.title}</h3>
                        <p className="text-sm text-zinc-500">{step.desc}</p>
                      </div>
                    </div>
                  </div>

                </div>
                {idx < steps.length - 1 && (
                  <div className="flex justify-center">
                    <SolarArrowDownLinear className="size-6 text-zinc-300" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
