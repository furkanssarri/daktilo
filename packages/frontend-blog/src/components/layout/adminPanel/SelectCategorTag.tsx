import { useState } from "react";
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

interface SelectCategoryTagProps {
  categories: CategoryType[];
  tags: TagType[];
  selectedCategory: string | null;
  selectedTags: string[];
  onCategoryChange: (categoryId: string | null) => void;
  onTagsChange: (tagIds: string[]) => void;
}

const SelectCategoryTag = ({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagsChange,
}: SelectCategoryTagProps) => {
  const [openCategory, setOpenCategory] = useState(false);
  const [openTags, setOpenTags] = useState(false);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((t) => t !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

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
                  {categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => {
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
          {selectedTags.length > 0 ? (
            selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              return (
                <Badge
                  key={tagId}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleTag(tagId)}
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
                    {tags.map((tag) => {
                      const selected = selectedTags.includes(tag.id);
                      return (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => toggleTag(tag.id)}
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
