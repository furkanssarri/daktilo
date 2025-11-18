import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Category as CategoryType, Tag as TagType } from "@prisma/client";
import categoryApi from "@/api/categoryApi";
import tagApi from "@/api/tagApi";

interface SelectCategoryTagProps {
  // categories: CategoryType[];
  // tags: TagType[];
  selectedCategory: string | null | undefined;
  selectedTags?: TagType[];
  onCategoryChange?: (categoryId: string | null) => void;
  onTagsChange?: (tags: TagType[]) => void;
}

const SelectCategoryTag = ({
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagsChange,
}: SelectCategoryTagProps) => {
  const [categories, setCategories] = useState<CategoryType[] | []>([]);
  const [tags, setTags] = useState<TagType[] | []>([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [openTags, setOpenTags] = useState(false);

  const _selectedTags = selectedTags ?? [];

  const toggleTag = (tag: TagType) => {
    if (!onTagsChange || !Array.isArray(_selectedTags)) return;
    const exists = _selectedTags.some((t) => t.id === tag.id);
    if (exists) {
      onTagsChange(_selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onTagsChange([..._selectedTags, tag]);
    }
  };

  useEffect(() => {
    categoryApi
      .getAll()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories: ", err));
  }, []);

  useEffect(() => {
    tagApi
      .getAll()
      .then((data) => setTags(data))
      .catch((err) => console.error("Failed to fetch tags: ", err));
  }, []);

  return (
    <div className="space-y-6">
      {/* CATEGORY SELECT */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>

        <Popover open={openCategory} onOpenChange={setOpenCategory}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : "Select a category"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandList>
                <CommandEmpty>No categories found.</CommandEmpty>
                <CommandGroup heading="Categories">
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => {
                          if (!onCategoryChange) return;
                          onCategoryChange(category.id);
                          setOpenCategory(false);
                        }}
                      >
                        {category.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      {/* TAG SELECT */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>

        {/* Selected tag chips */}
        <div className="flex flex-wrap gap-2">
          {Array.isArray(_selectedTags) && _selectedTags.length > 0 ? (
            _selectedTags.map((tag) => {
              return (
                <Badge
                  key={tag?.id}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag?.name} ×
                </Badge>
              );
            })
          ) : (
            <p className="text-muted-foreground text-sm">No tags selected.</p>
          )}
        </div>

        <Popover open={openTags} onOpenChange={setOpenTags}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Select tags
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <ScrollArea className="h-60">
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup heading="Tags">
                    {Array.isArray(tags) &&
                      tags.map((tag) => {
                        const selected = _selectedTags?.some(
                          (t) => t.id === tag.id,
                        );
                        return (
                          <CommandItem
                            key={tag.id}
                            value={tag.name}
                            onSelect={() => toggleTag(tag)}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span>{tag.name}</span>
                              {selected ? (
                                <Badge variant="secondary">Selected</Badge>
                              ) : null}
                            </div>
                          </CommandItem>
                        );
                      })}
                  </CommandGroup>
                </CommandList>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SelectCategoryTag;
