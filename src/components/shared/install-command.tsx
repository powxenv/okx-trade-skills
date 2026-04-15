import { useState, useCallback } from "react";
import SolarCopyLineDuotone from "~icons/solar/copy-line-duotone";
import SolarCheckCircleBoldDuotone from "~icons/solar/check-circle-bold-duotone";

interface InstallCommandProps {
  skillName: string;
}

export default function InstallCommand({ skillName }: InstallCommandProps) {
  const [copied, setCopied] = useState(false);
  const command = `npx flins@latest add okxskills.noval.me --skill ${skillName}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [command]);

  return (
    <button
      className="border rounded-xl p-1 w-full max-w-2xl mx-auto block cursor-pointer mt-8"
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
  );
}
