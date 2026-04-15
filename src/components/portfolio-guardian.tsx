import InstallCommand from "./shared/install-command";
import ViewFilesButton from "./shared/view-files-button";
import SectionHeader from "./shared/section-header";
import SolarShieldCheckLinear from "~icons/solar/shield-check-linear";
import SolarChartLinear from "~icons/solar/chart-linear";
import SolarBellLinear from "~icons/solar/bell-linear";
import SolarLockLinear from "~icons/solar/lock-linear";
import SolarArchiveDownLinear from "~icons/solar/archive-down-linear";
import SolarDangerCircleLinear from "~icons/solar/danger-circle-linear";
import SolarRefreshCircleLinear from "~icons/solar/refresh-circle-linear";
import SolarCheckCircleLinear from "~icons/solar/check-circle-linear";

import { portfolioGuardianFiles } from "../data/skill-files";

const metrics = [
  { icon: <SolarShieldCheckLinear className="text-zinc-500" />, label: "Stop-Loss", value: "Auto 15%", detail: "Trigger active" },
  { icon: <SolarChartLinear className="text-zinc-500" />, label: "IL Tracking", value: "-$42.30", detail: "2 positions" },
  { icon: <SolarBellLinear className="text-zinc-500" />, label: "Alerts", value: "3 Active", detail: "1 new today" },
  { icon: <SolarLockLinear className="text-zinc-500" />, label: "Approvals", value: "2 Revoke", detail: "High risk" },
];

const alerts = [
  { icon: <SolarDangerCircleLinear className="text-zinc-500" />, title: "Price Alert", msg: "ETH dropped 5% below $2,800", time: "2m ago", status: "warning" },
  { icon: <SolarRefreshCircleLinear className="text-zinc-500" />, title: "IL Warning", msg: "UNI-USDC at -8% threshold", time: "1h ago", status: "info" },
  { icon: <SolarCheckCircleLinear className="text-zinc-500" />, title: "Stop-Loss Hit", msg: "Sold 500 USDC at trigger", time: "4h ago", status: "success" },
  { icon: <SolarShieldCheckLinear className="text-zinc-500" />, title: "Approval Revoked", msg: "Removed suspicious contract approval", time: "6h ago", status: "success" },
];

export default function PortfolioGuardian() {
  return (
    <section id="okx-portfolio-guardian" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-6">
              <SolarBellLinear className="size-4 text-zinc-400" />
              <span className="text-sm text-zinc-500">Recent Activity</span>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-200" />

              <div className="space-y-6">
                {alerts.map((alert, idx) => (
                  <div key={alert.title} className="relative pl-10">
                    <div className={`absolute left-3 top-2 size-2.5 rounded-full border-2 border-white bg-zinc-500`} />

                    <div className={`border p-4 rounded-xl bg-white shadow-xl shadow-black/6`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {alert.icon}
                          <span className="font-medium text-sm">{alert.title}</span>
                        </div>
                        <span className="text-xs text-zinc-400">{alert.time}</span>
                      </div>
                      <p className="text-sm text-zinc-600">{alert.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeader
              badgeIcon={<SolarArchiveDownLinear className="text-zinc-500" />}
              badgeText="Risk Protection"
              title="Your portfolio watched while you sleep"
              description="Stop checking prices every 5 minutes. Set stop-loss triggers, track impermanent loss, and get pinged when something actually needs your attention."
            />

            <div className="grid grid-cols-2 gap-3 mb-6">
              {metrics.map((m, idx) => (
                <div className={`border p-4 rounded-xl bg-white shadow-xl shadow-black/6`}>
                  <div className="size-8 border flex justify-center items-center rounded-lg">
                    {m.icon}
                  </div>
                  <div className="text-xs text-zinc-500 mt-2">{m.label}</div>
                  <div className="text-xl -tracking-wider font-medium">{m.value}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{m.detail}</div>
                </div>
              ))}
            </div>

            <InstallCommand skillName="okx-portfolio-guardian" />
            <ViewFilesButton
              files={portfolioGuardianFiles}
              ariaLabel="Portfolio Guardian skill files"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
