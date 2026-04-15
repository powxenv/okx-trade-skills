"use client";

import { Button, Modal } from "@heroui/react";
import SolarDocumentsLinear from "~icons/solar/documents-linear";
import type { FileEntry } from "./file-list-panel";
import FileListPanel from "./file-list-panel";

interface ViewFilesButtonProps {
  files: FileEntry[];
  ariaLabel: string;
}

export default function ViewFilesButton({
  files,
  ariaLabel,
}: ViewFilesButtonProps) {
  return (
    <Modal>
      <Button className="mx-auto mt-4">
        <SolarDocumentsLinear className="size-4" />
        View {files.length} Files
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-5xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2">
                <SolarDocumentsLinear className="size-5 text-zinc-500" />
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
