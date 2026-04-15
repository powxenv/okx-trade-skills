import { cn } from "@heroui/react";
import { Tooltip } from "@heroui/react";
import SolarCopyLinear from "~icons/solar/copy-linear";
import SolarCheckCircleLinear from "~icons/solar/check-circle-linear";
import { useCopy } from "../../hooks/use-copy";

interface InstallCommandProps {
  skillName: string;
  className?: string;
}

export default function InstallCommand({ skillName, className }: InstallCommandProps) {
  const command = `npx flins@latest add okxskills.noval.me --skill ${skillName}`;
  const copy = useCopy(command);

  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger aria-label="Copy install command">
        <button
          className={cn(
            "border rounded-xl p-1 w-full max-w-2xl mx-auto block cursor-pointer",
            className
          )}
          onClick={copy.copy}
        >
          <div className="bg-zinc-800 px-3 py-2 rounded-lg flex items-center justify-between gap-2">
            <code className="text-zinc-200 font-mono text-xs truncate">
              {command}
            </code>
            <div>
              {copy.copied ? (
                <SolarCheckCircleLinear className="size-4 text-zinc-200" />
              ) : (
                <SolarCopyLinear className="size-4 text-zinc-400" />
              )}
            </div>
          </div>
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>{copy.copied ? "Copied" : "Copy"}</p>
      </Tooltip.Content>
    </Tooltip>
  );
}
