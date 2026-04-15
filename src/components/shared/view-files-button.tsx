"use client";

import { Button, Modal } from "@heroui/react";
import SolarDocumentsBoldDuotone from "~icons/solar/documents-bold-duotone";
import type { FileEntry } from "./file-list-panel";
import FileListPanel from "./file-list-panel";

interface ViewFilesButtonProps {
  files: FileEntry[];
  ariaLabel: string;
  count: number;
}

export default function ViewFilesButton({
  files,
  ariaLabel,
  count,
}: ViewFilesButtonProps) {
  return (
    <Modal>
      <Button className="mx-auto mt-4">
        <SolarDocumentsBoldDuotone className="size-4" />
        View {count} Files
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-5xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2">
                <SolarDocumentsBoldDuotone className="size-5 text-zinc-500" />
                <Modal.Heading>Skill Files</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body>
              <FileListPanel files={files} ariaLabel={ariaLabel} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
