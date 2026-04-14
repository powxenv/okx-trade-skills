import { Button, ScrollShadow } from "@heroui/react";
import SolarCopyLineDuotone from "~icons/solar/copy-line-duotone";

interface FilePanelProps {
  filename: string;
  content: string;
}

export default function FilePanel({ filename, content }: FilePanelProps) {
  return (
    <div className="border rounded-2xl p-1 w-full">
      <div className="bg-zinc-100 rounded-xl">
        <div className="pr-2 pl-4 py-1 items-center flex justify-between">
          <span className="-tracking-wider font-medium">{filename}</span>
          <Button isIconOnly size="sm" variant="ghost">
            <SolarCopyLineDuotone />
          </Button>
        </div>
        <ScrollShadow
          isEnabled={false}
          className="max-h-150 [word-break:break-word] w-full bg-zinc-800 p-4 rounded-xl text-zinc-200 font-mono text-sm whitespace-pre-wrap"
        >
          {content}
        </ScrollShadow>
      </div>
    </div>
  );
}
