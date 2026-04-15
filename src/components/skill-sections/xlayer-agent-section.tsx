import InstallCommand from "./shared/install-command";
import ViewFilesButton from "./shared/view-files-button";
import SolarEyeBoldDuotone from "~icons/solar/eye-bold-duotone";
import SolarBoltBoldDuotone from "~icons/solar/bolt-bold-duotone";
import SolarRocket2BoldDuotone from "~icons/solar/rocket-2-bold-duotone";
import SolarArrowDownBoldDuotone from "~icons/solar/arrow-down-bold-duotone";
import SolarArchiveDownMinimlisticBoldDuotone from "~icons/solar/archive-down-minimlistic-bold-duotone";

import { files as xlayerFiles } from "../xlayer-panel";

const steps = [
  { num: "01", icon: <SolarEyeBoldDuotone className="text-zinc-500" />, title: "Monitor", desc: "Price feeds, whale tracking, arbitrage" },
  { num: "02", icon: <SolarBoltBoldDuotone className="text-zinc-500" />, title: "Decide", desc: "Strategy, risk assessment, gas opt" },
  { num: "03", icon: <SolarRocket2BoldDuotone className="text-zinc-500" />, title: "Execute", desc: "Zero-gas txs, auto-compound, x402" },
];

export default function XlayerAgentSection() {
  return (
    <section id="okx-xlayer-agent" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <div>
            <div className="border pl-2 pr-4 py-1 gap-1 items-center rounded-lg text-sm inline-flex mb-4">
              <SolarArchiveDownMinimlisticBoldDuotone className="text-zinc-500" />
              Autonomous Agents
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">
              X Layer Agent
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 max-w-md">
              Build autonomous agents that trade, earn, and compete on X Layer's zero-gas L2. Self-funding via x402, infinite loops.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-8">
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

            <div className="mt-8">
              <InstallCommand skillName="okx-xlayer-agent" />
              <ViewFilesButton
                files={xlayerFiles}
                ariaLabel="X Layer Agent skill files"
                count={20}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {steps.map((step, idx) => (
              <>
                <div key={step.title} className="relative">
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
                    <SolarArrowDownBoldDuotone className="size-6 text-zinc-300" />
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
