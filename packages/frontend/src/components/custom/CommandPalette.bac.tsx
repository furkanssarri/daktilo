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

const CommandPalette = () => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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

  return (
    <>
      <p className="text-muted-foreground text-sm">
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
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          value={query}
          onValueChange={(value) => setQuery(value)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Array.isArray(results) && results.length && (
            <>
              {results.some((r) => r.type === "post") && (
                <CommandGroup heading="Posts" aria-label="Posts">
                  <FileText className="mr-2 h-4 w-4" />
                  {results
                    .filter((r) => r.type === "post")
                    .map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                      >
                        <span>{highlightText(item.title, query)}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {results.some((r) => r.type === "tag") && (
                <CommandGroup heading="Tags" aria-label="Tags">
                  <Tag className="mr-2 h-4 w-4" />
                  {results
                    .filter((r) => r.type === "tag")
                    .map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                      >
                        <span>{highlightText(item.name, query)}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {results.some((r) => r.type === "category") && (
                <CommandGroup heading="Categories" aria-label="Categories">
                  <Folder className="mr-2 h-4 w-4" />
                  {results
                    .filter((r) => r.type === "category")
                    .map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                      >
                        <span>{highlightText(item.name, query)}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </>
          )}
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CommandPalette;
