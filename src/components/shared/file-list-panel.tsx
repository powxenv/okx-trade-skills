import { ScrollShadow, Tabs } from "@heroui/react";
import SolarFileLineDuotone from "~icons/solar/file-line-duotone";
import SolarCodeFileLineDuotone from "~icons/solar/code-file-line-duotone";
import FilePanel from "./file-panel";

export interface FileEntry {
  id: string;
  filename: string;
  content: string;
  isHeader?: boolean;
  isCode?: boolean;
}

interface FileListPanelProps {
  files: FileEntry[];
  ariaLabel: string;
}

export default function FileListPanel({ files, ariaLabel }: FileListPanelProps) {
  return (
    <>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 md:hidden">
        {files
          .filter((f) => !f.isHeader)
          .map((file) => (
            <div key={file.id} className="max-w-full shrink-0 snap-start">
              <FilePanel filename={file.filename} content={file.content} />
            </div>
          ))}
      </div>

      <div className="hidden md:block">
        <aside>
          <Tabs orientation="vertical">
            <ScrollShadow className="max-h-165 max-w-75 w-full shrink-0">
              <Tabs.ListContainer>
                <Tabs.List
                  aria-label={ariaLabel}
                  className="*:justify-start bg-transparent *:text-start w-full"
                >
                  {files.map((file) =>
                    file.isHeader ? (
                      <Tabs.Tab
                        key={file.id}
                        id={file.id}
                        isDisabled
                        className="opacity-100 text-zinc-500"
                      >
                        {file.filename}
                        <Tabs.Indicator className="bg-muted/6 shadow-none" />
                      </Tabs.Tab>
                    ) : (
                      <Tabs.Tab key={file.id} id={file.id}>
                        {file.isCode ? (
                          <SolarCodeFileLineDuotone className="size-4 mr-1" />
                        ) : (
                          <SolarFileLineDuotone className="size-4 mr-1" />
                        )}
                        {file.filename.split("/").pop()}
                        <Tabs.Indicator className="bg-muted/6 shadow-none" />
                      </Tabs.Tab>
                    ),
                  )}
                </Tabs.List>
              </Tabs.ListContainer>
            </ScrollShadow>

            {files.map(
              (file) =>
                !file.isHeader && (
                  <Tabs.Panel key={file.id} className="px-4" id={file.id}>
                    <FilePanel
                      filename={file.filename}
                      content={file.content}
                    />
                  </Tabs.Panel>
                ),
            )}
          </Tabs>
        </aside>
      </div>
    </>
  );
}
