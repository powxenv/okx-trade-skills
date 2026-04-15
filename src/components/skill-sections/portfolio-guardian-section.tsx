import InstallCommand from "./shared/install-command";
import ViewFilesButton from "./shared/view-files-button";
import SectionHeader from "./shared/section-header";
import SolarShieldCheckBoldDuotone from "~icons/solar/shield-check-bold-duotone";
import SolarChartBoldDuotone from "~icons/solar/chart-bold-duotone";
import SolarBellBoldDuotone from "~icons/solar/bell-bold-duotone";
import SolarLockKeyholeBoldDuotone from "~icons/solar/lock-keyhole-bold-duotone";
import SolarArchiveDownMinimlisticBoldDuotone from "~icons/solar/archive-down-minimlistic-bold-duotone";
import SolarDangerCircleBoldDuotone from "~icons/solar/danger-circle-bold-duotone";
import SolarRefreshCircleBoldDuotone from "~icons/solar/refresh-circle-bold-duotone";
import SolarCheckCircleBoldDuotone from "~icons/solar/check-circle-bold-duotone";

import { portfolioGuardianFiles } from "../../data/skill-files";

const metrics = [
  { icon: <SolarShieldCheckBoldDuotone className="text-zinc-500" />, label: "Stop-Loss", value: "Auto 15%", detail: "Trigger active" },
  { icon: <SolarChartBoldDuotone className="text-zinc-500" />, label: "IL Tracking", value: "-$42.30", detail: "2 positions" },
  { icon: <SolarBellBoldDuotone className="text-zinc-500" />, label: "Alerts", value: "3 Active", detail: "1 new today" },
  { icon: <SolarLockKeyholeBoldDuotone className="text-zinc-500" />, label: "Approvals", value: "2 Revoke", detail: "High risk" },
];

const alerts = [
  { icon: <SolarDangerCircleBoldDuotone className="text-zinc-500" />, title: "Price Alert", msg: "ETH dropped 5% below $2,800", time: "2m ago", status: "warning" },
  { icon: <SolarRefreshCircleBoldDuotone className="text-zinc-500" />, title: "IL Warning", msg: "UNI-USDC at -8% threshold", time: "1h ago", status: "info" },
  { icon: <SolarCheckCircleBoldDuotone className="text-zinc-500" />, title: "Stop-Loss Hit", msg: "Sold 500 USDC at trigger", time: "4h ago", status: "success" },
  { icon: <SolarShieldCheckBoldDuotone className="text-zinc-500" />, title: "Approval Revoked", msg: "Removed suspicious contract approval", time: "6h ago", status: "success" },
];

export default function PortfolioGuardianSection() {
  return (
    <section id="okx-portfolio-guardian" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-6">
              <SolarBellBoldDuotone className="size-4 text-zinc-400" />
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
              badgeIcon={<SolarArchiveDownMinimlisticBoldDuotone className="text-zinc-500" />}
              badgeText="Risk Protection"
              title="Portfolio Guardian"
              description="Real-time wallet monitoring with stop-loss automation, impermanent loss tracking, approval auditing, and price alerts."
            />

            <div className="grid grid-cols-2 gap-3">
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
              count={13}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
