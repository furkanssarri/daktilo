import React from "react";
import { useCommandPalette } from "@/context/CommandPaletteContext";

const CommandPaletteTrigger: React.FC = () => {
  const { toggle } = useCommandPalette();
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");

  return (
    <button
      onClick={() => toggle()}
      aria-label="Open command palette"
      className="text-muted-foreground inline-flex items-center text-sm"
    >
      <kbd className="text-muted-foreground inline-flex items-center gap-1 rounded-sm border bg-transparent px-2 py-1 text-base">
        {isMac ? (
          <>
            <span className="text-md">⌘</span>
            <span className="text-md font-medium">K</span>
          </>
        ) : (
          <>
            <span className="text-md">Ctrl</span> +
            <span className="text-md font-medium">K</span>
          </>
        )}
      </kbd>
    </button>
  );
};

export default CommandPaletteTrigger;
