import { Button, Tooltip } from "@heroui/react";
import SolarCopyLinear from "~icons/solar/copy-linear";
import SolarCheckCircleLinear from "~icons/solar/check-circle-linear";
import { useCopy } from "../../hooks/use-copy";

interface FilePanelProps {
  filename: string;
  content: string;
}

export default function FilePanel({ filename, content }: FilePanelProps) {
  const copy = useCopy(content);

  return (
    <div className="border rounded-2xl p-1 w-full">
      <div className="bg-zinc-100 rounded-xl">
        <div className="pr-2 pl-4 py-1 items-center flex justify-between">
          <span className="-tracking-wider font-medium">{filename}</span>
          <Tooltip delay={0}>
            <Button isIconOnly size="sm" variant="ghost" onClick={copy.copy} aria-label={`Copy ${filename}`}>
              {copy.copied ? <SolarCheckCircleLinear /> : <SolarCopyLinear />}
            </Button>
            <Tooltip.Content>
              <p>{copy.copied ? "Copied" : "Copy"}</p>
            </Tooltip.Content>
          </Tooltip>
        </div>
        <div className="max-h-150 [word-break:break-word] w-full bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm whitespace-pre-wrap overflow-auto">
          {content}
        </div>
      </div>
    </div>
  );
}
