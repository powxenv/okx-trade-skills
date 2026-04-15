import InstallCommand from "./shared/install-command";
import ViewFilesButton from "./shared/view-files-button";
import SectionHeader from "./shared/section-header";
import SolarArchiveDownLinear from "~icons/solar/archive-down-linear";
import SolarUserCheckLinear from "~icons/solar/user-check-linear";
import SolarUsersGroupRoundedLinear from "~icons/solar/users-group-rounded-linear";
import SolarGraphUpLinear from "~icons/solar/graph-up-linear";

import { memeIntelligenceFiles } from "../data/skill-files";

const analyses = [
  { label: "Dev Reputation", value: "Clean", status: "✓" },
  { label: "Sniper Detection", value: "Low", status: "▸" },
  { label: "Bonding Curve", value: "Phase 2", status: "◷" },
  { label: "Social Signal", value: "Trending", status: "🔥" },
];

const tokens = [
  { symbol: "$DOGE", name: "Doge Killer", score: 85, trend: "+24%" },
  { symbol: "$PEPE", name: "Pepe Classic", score: 72, trend: "+12%" },
  { symbol: "$WIF", name: "Dogwifcoin", score: 45, trend: "-8%" },
];

const insights = [
  { icon: <SolarUserCheckLinear className="text-zinc-400" />, label: "Dev Verified", value: "3 launches" },
  { icon: <SolarUsersGroupRoundedLinear className="text-zinc-400" />, label: "Low Sniping", value: "8% bots" },
  { icon: <SolarGraphUpLinear className="text-zinc-400" />, label: "Social Spike", value: "2.3K/hr" },
];

export default function MemeIntelligence() {
  return (
    <section id="okx-meme-intelligence" className="py-16 md:py-28">
      <div className="inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              badgeIcon={<SolarArchiveDownLinear className="text-zinc-500" />}
              badgeText="Meme Analysis"
              title="Stop buying rugs, start catching gems"
              description="Most meme tokens are rugs. This skill checks the dev's history, spots snipers early, and shows you exactly where the token is on the bonding curve before you ape in."
            />

            <InstallCommand skillName="okx-meme-intelligence" />
            <ViewFilesButton
              files={memeIntelligenceFiles}
              ariaLabel="Meme Intelligence skill files"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {tokens.map((t, idx) => (
                <div key={t.symbol} className={idx === 0 ? "lg:-translate-y-2" : idx === 1 ? "lg:translate-y-1" : "lg:translate-x-1"}>
                  <div className={`border p-3 rounded-xl bg-white shadow-xl shadow-black/6 ${idx === 0 ? "lg:rotate-2" : idx === 1 ? "lg:-rotate-1" : "lg:rotate-1"}`}>
                    <div className="text-sm font-medium">{t.symbol}</div>
                    <div className={`text-xs font-medium ${t.trend.startsWith('+') ? '' : 'text-zinc-400'}`}>{t.trend}</div>
                    <div className="w-full h-1 rounded-full bg-zinc-100 mt-2">
                      <div className={`h-full rounded-full ${t.score >= 70 ? 'bg-zinc-800' : t.score >= 50 ? 'bg-zinc-500' : 'bg-zinc-300'}`} style={{ width: `${t.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="lg:-rotate-2 lg:translate-y-1 lg:-translate-x-1 absolute w-full">
                <div className="border rounded-xl bg-white h-44" />
              </div>
              <div className="relative lg:rotate-1">
                <div className="border p-5 rounded-xl bg-white shadow-xl shadow-black/6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-medium">$TOKEN</h3>
                      <span className="text-xs text-zinc-500">pump.fun</span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl -tracking-wider font-medium">72</div>
                      <div className="text-xs text-zinc-500">/100</div>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 mb-3">
                    <div className="h-full rounded-full bg-zinc-800" style={{ width: '72%' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {analyses.map((a) => (
                      <div key={a.label} className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 bg-zinc-50 text-xs">
                        <span className="text-zinc-600">{a.label}</span>
                        <span className="font-medium">{a.status} {a.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
