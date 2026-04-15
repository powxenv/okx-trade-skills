import InstallCommand from "./shared/install-command";
import ViewFilesButton from "./shared/view-files-button";
import SectionHeader from "./shared/section-header";
import SolarCodeBoldDuotone from "~icons/solar/code-bold-duotone";
import SolarArchiveDownMinimlisticBoldDuotone from "~icons/solar/archive-down-minimlistic-bold-duotone";

import { uniswapDevFiles } from "../data/skill-files";

const topics = ["v4 Hooks", "CCA", "Swap Planning", "Liquidity", "Trading API", "SDK", "viem", "x402"];

const hookExample = `import {Hook} from "v4-core/src/types/Hook.sol";

contract FeeDiscountHook is Hook {
    function beforeSwap(
        address,
        PoolKey calldata,
        IPoolManager.SwapParams calldata
    ) external returns (bytes4) {
        if (_isVerifiedUser(msg.sender)) {
            return FeeDiscountHook.beforeSwap.selector;
        }
        return bytes4(0);
    }
}`;

const resources = [
  { label: "Hook Templates", count: "12+" },
  { label: "Security Guides", count: "8" },
  { label: "Code Examples", count: "50+" },
];

export default function UniswapDev() {
  return (
    <section id="okx-uniswap-dev" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="lg:-rotate-1 lg:-translate-y-4 mb-6">
              <div className="border rounded-2xl overflow-hidden bg-zinc-900">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-800">
                  <div className="flex gap-1">
                    <div className="size-2 rounded-full bg-zinc-600" />
                    <div className="size-2 rounded-full bg-zinc-600" />
                    <div className="size-2 rounded-full bg-zinc-600" />
                  </div>
                  <span className="text-xs text-zinc-500 ml-2">FeeDiscountHook.sol</span>
                </div>
                <pre className="p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
                  <code>{hookExample}</code>
                </pre>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              {resources.map((r) => (
                <div>
                  <div className="text-2xl -tracking-wider font-medium">{r.count}</div>
                  <div className="text-sm text-zinc-500">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeader
              badgeIcon={<SolarCodeBoldDuotone className="text-zinc-500" />}
              badgeText="Development"
              title="Ship faster with Uniswap v4 hooks"
              description="Generate boilerplate, audit your hooks, plan swaps with deep links, and integrate the Trading API. Your agent writes the code so you don't have to."
            />
            <div className="flex gap-2 flex-wrap mb-8">
              {topics.map((topic) => (
                <div key={topic} className="border rounded-full px-3 py-1 text-sm text-zinc-600">
                  {topic}
                </div>
              ))}
            </div>

            <InstallCommand skillName="okx-uniswap-dev" />
            <ViewFilesButton
              files={uniswapDevFiles}
              ariaLabel="Uniswap Dev skill files"
              count={25}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
