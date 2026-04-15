import { useState, useCallback } from "react";
import { ecosystemSkills } from "../data/ecosystem-skills";
import SolarGlobalBoldDuotone from "~icons/solar/global-bold-duotone";
import SolarArrowRightUpBoldDuotone from "~icons/solar/arrow-right-up-bold-duotone";
import SolarCopyLineDuotone from "~icons/solar/copy-line-duotone";
import SolarCheckCircleBoldDuotone from "~icons/solar/check-circle-bold-duotone";
import SolarStarBoldDuotone from "~icons/solar/star-bold-duotone";
import { Button } from "@heroui/react";

function SkillCard({
  name,
  source,
  repo,
  description,
  url,
}: {
  name: string;
  source: string;
  repo: string;
  description: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const command = `npx flins@latest add ${repo} --skill ${name}`;

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [command],
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col border p-6 rounded-xl bg-white shadow-xl shadow-black/6 transition-shadow hover:shadow-2xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="block text-sm text-zinc-500 font-medium -tracking-wide">
            {source}
          </span>
          <h3 className="text-lg mt-1 mb-2">{name}</h3>
        </div>
        <SolarArrowRightUpBoldDuotone className="size-5 text-zinc-400 group-hover:text-zinc-700 transition-colors shrink-0 mt-1" />
      </div>
      <p className="text-sm text-zinc-600 mb-3">{description}</p>
      <button
        className="border rounded-xl p-1 block w-full cursor-pointer mt-auto"
        onClick={handleCopy}
      >
        <div className="bg-zinc-800 px-3 py-2 rounded-lg flex items-center justify-between gap-2">
          <code className="text-zinc-200 font-mono text-xs truncate">
            {command}
          </code>
          <div>
            {copied ? (
              <SolarCheckCircleBoldDuotone className="size-4 text-zinc-200" />
            ) : (
              <SolarCopyLineDuotone className="size-4 text-zinc-400" />
            )}
          </div>
        </div>
      </button>
    </a>
  );
}

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="py-16 md:py-28">
      <div className="inner">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="border pl-2 pr-4 py-1 flex gap-1 items-center rounded-lg text-sm w-fit">
            <SolarGlobalBoldDuotone className="text-zinc-500" />
            {ecosystemSkills.length + 1} Skills in the Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 mt-4">
            Add more skills from the community
          </h2>
          <p className="max-w-xl text-base sm:text-lg md:text-xl text-zinc-600">
            Pull in skills from OKX OnchainOS, Uniswap AI, and other builders.
            One command installs them all.
          </p>
        </div>

        <div className="border p-6 rounded-xl sm:col-span-2 lg:col-span-3 mt-8">
          <div className="flex items-start gap-2 mb-3">
            <SolarStarBoldDuotone className="size-5 mt-0.5" />
            <span className="text-sm font-medium">Featured</span>
          </div>
          <h3 className="text-xl font-medium mb-2">okx-ecosystem-discovery</h3>
          <p className="text-sm text-zinc-600 mb-4">
            Browse and search skills from the OKX ecosystem. Find skills for DeFi, swapping, security, LP management, and get help choosing the right one.
          </p>
          <button
            className="border rounded-xl p-1 w-full max-w-2xl cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              const command = "npx flins@latest add okxskills.noval.me --skill okx-ecosystem-discovery";
              navigator.clipboard.writeText(command);
            }}
          >
            <div className="bg-zinc-800 px-3 py-2 rounded-lg flex items-center justify-between gap-2">
              <code className="text-zinc-200 font-mono text-xs truncate">
                npx flins@latest add okxskills.noval.me --skill okx-ecosystem-discovery
              </code>
              <SolarCopyLineDuotone className="size-4 text-zinc-400" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {ecosystemSkills.map((skill) => (
            <SkillCard key={skill.url} {...skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
