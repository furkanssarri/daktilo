import { useEffect, useState } from "react";
import { Settings, Smile, User } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import type { SearchResult } from "@/types/EntityTypes";
import { searchApi } from "@/api/searchApi";
import { useNavigate } from "react-router-dom";
import { FileText, Tag, Folder } from "lucide-react";

const CommandPalette = ({
  open: openProp,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}) => {
  const navigate = useNavigate();

  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // NOTE: global hotkey registration is handled by CommandPaletteProvider

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await searchApi(query);
        if (res.status === "success" && res.data) {
          setResults(res.data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error: ", err);
        setResults([]);
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-600">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const handleSelect = (item: SearchResult) => {
    setOpen(false);

    switch (item.type) {
      case "post":
        navigate(`/posts/slug/${item.slug}`);
        break;
      case "tag":
        navigate(`/tags/${item.name}/posts`);
        break;
      case "category":
        navigate(`/categories/${item.name}/posts`);
    }
  };

  const handleStaticSelect = (item: string) => {
    setOpen(false);
    navigate(`/users/me`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={query}
        onValueChange={(value) => setQuery(value)}
      />
      <CommandList>
        {Array.isArray(results) && results.length ? (
          <>
            {results.some((r) => r.type === "post") && (
              <CommandGroup heading="Posts" aria-label="Posts">
                {results
                  .filter((r) => r.type === "post")
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.title} ${item.slug}`}
                      onSelect={() => handleSelect(item)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span>{highlightText(item.title, query)}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {results.some((r) => r.type === "tag") && (
              <CommandGroup heading="Tags" aria-label="Tags">
                {results
                  .filter((r) => r.type === "tag")
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.name}`}
                      onSelect={() => handleSelect(item)}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      <span>{highlightText(item.name, query)}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {results.some((r) => r.type === "category") && (
              <CommandGroup heading="Categories" aria-label="Categories">
                {results
                  .filter((r) => r.type === "category")
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.name} ${item.description ?? ""}`}
                      onSelect={() => handleSelect(item)}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      <span>{highlightText(item.name, query)}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </>
        ) : (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        <CommandGroup heading="Suggestions">
          <CommandItem value="search emoji">
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem
            value="profile"
            onSelect={() => handleStaticSelect("profile")}
          >
            <User />
            <span>Profile</span>
            {/* <CommandShortcut>⌘P</CommandShortcut> */}
          </CommandItem>
          {/* <CommandItem value="settings">
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem> */}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
