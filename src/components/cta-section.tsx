import { Button, Tabs } from "@heroui/react";
import SolarShieldKeyholeBoldDuotone from "~icons/solar/shield-keyhole-bold-duotone";
import SolarLockKeyholeBoldDuotone from "~icons/solar/lock-keyhole-bold-duotone";
import SolarUsersGroupTwoRoundedBoldDuotone from "~icons/solar/users-group-two-rounded-bold-duotone";
import SolarRefreshCircleBoldDuotone from "~icons/solar/refresh-circle-bold-duotone";
import SolarRocket2BoldDuotone from "~icons/solar/rocket-2-bold-duotone";
import SolarCopyLineDuotone from "~icons/solar/copy-line-duotone";

function InstallTabs() {
  return (
    <Tabs className="w-full mt-6">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Options">
          <Tabs.Tab id="prompt">
            Copy Prompt
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="flins">
            Use Flins
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="skills">
            Use skills.sh
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel id="prompt" className="h-40">
        <div className="border rounded-2xl p-1">
          <div className="bg-zinc-100 rounded-xl">
            <div className="pr-2 pl-4 py-1 items-center flex justify-between">
              <span className="-tracking-wider font-medium">
                Copy to your AI agents, any agent
              </span>
              <Button isIconOnly size="sm" variant="ghost">
                <SolarCopyLineDuotone />
              </Button>
            </div>
            <div className="bg-zinc-800 p-4 rounded-xl text-zinc-200">
              Read https://okxskills.noval.me/AGENTS.md and install OKX Trade
              Skills on your system.
            </div>
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel id="flins" className="h-40">
        <div className="border rounded-2xl p-1">
          <div className="bg-zinc-100 rounded-xl">
            <div className="pr-2 pl-4 py-1 items-center flex justify-between">
              <span className="-tracking-wider font-medium">
                Copy to your terminal
              </span>
              <Button isIconOnly size="sm" variant="ghost">
                <SolarCopyLineDuotone />
              </Button>
            </div>
            <div className="bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm">
              npx flins@latest add okxskills.noval.me
            </div>
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel id="skills" className="h-40">
        <div className="border rounded-2xl p-1">
          <div className="bg-zinc-100 rounded-xl">
            <div className="pr-2 pl-4 py-1 items-center flex justify-between">
              <span className="-tracking-wider font-medium">
                Copy to your terminal
              </span>
              <Button isIconOnly size="sm" variant="ghost">
                <SolarCopyLineDuotone />
              </Button>
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

function TrustCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="md:rotate-1">
        <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
          <div className="size-10 border flex justify-center items-center rounded-lg">
            <SolarShieldKeyholeBoldDuotone className="text-zinc-500" />
          </div>
          <h3 className="text-lg mt-1 mb-2">Non-custodial by design</h3>
          <p>
            Your keys never leave your wallet. Every transaction is signed
            locally and every skill runs on your machine. No middlemen, no
            server-side access.
          </p>
        </div>
      </div>

      <div className="md:-rotate-2">
        <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
          <div className="size-10 border flex justify-center items-center rounded-lg">
            <SolarLockKeyholeBoldDuotone className="text-zinc-500" />
          </div>
          <h3 className="text-lg mt-1 mb-2">Built-in safety rails</h3>
          <p>
            Honeypot detection, slippage limits, and risk scoring run before
            every trade. Autonomous agents follow strict guardrails you define
            and control.
          </p>
        </div>
      </div>

      <div className="md:rotate-2">
        <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
          <div className="size-10 border flex justify-center items-center rounded-lg">
            <SolarUsersGroupTwoRoundedBoldDuotone className="text-zinc-500" />
          </div>
          <h3 className="text-lg mt-1 mb-2">Battle-tested by traders</h3>
          <p>
            Installed and relied on by real onchain traders. Every workflow and
            strategy is derived from live market experience, not theory.
          </p>
        </div>
      </div>

      <div className="md:-rotate-1">
        <div className="border p-6 rounded-xl bg-white shadow-xl shadow-black/6">
          <div className="size-10 border flex justify-center items-center rounded-lg">
            <SolarRefreshCircleBoldDuotone className="text-zinc-500" />
          </div>
          <h3 className="text-lg mt-1 mb-2">Always up to date</h3>
          <p>
            Skills update with the latest chain support, protocol changes, and
            market data. Run one command to pull the latest and stay current.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CtaSection() {
  return (
    <section id="install" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg text-sm w-fit">
              <SolarRocket2BoldDuotone className="text-zinc-500" />
              Get started in seconds
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 mt-4">
              Start trading onchain today
            </h2>
            <p className="max-w-xl text-base sm:text-lg md:text-xl text-zinc-600">
              Copy the install command below and get started with autonomous
              onchain trading in seconds.
            </p>

            <InstallTabs />
          </div>
          <TrustCards />
        </div>
      </div>
    </section>
  );
}
