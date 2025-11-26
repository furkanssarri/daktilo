import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import CommandPalette from "@/components/custom/CommandPalette";

type CommandPaletteContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (value: boolean) => void;
};

const CommandPaletteContext = createContext<
  CommandPaletteContextType | undefined
>(undefined);

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      setOpen: (v: boolean) => setIsOpen(v),
    }),
    [isOpen],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const globalKey = "__daktilo_command_palette_provider_keydown_registered";
    if ((window as any)[globalKey]) return;
    (window as any)[globalKey] = true;

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
      delete (window as any)[globalKey];
    };
  }, []);

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette open={isOpen} onOpenChange={(v) => setIsOpen(v)} />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx)
    throw new Error(
      "useCommandPalette must be used inside CommandPaletteProvider",
    );
  return ctx;
}

export default CommandPaletteContext;
