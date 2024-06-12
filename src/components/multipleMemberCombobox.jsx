import { useState, useEffect } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemberContext } from "@/hooks/useMemberContext";

export function MultipleMemberCombobox({ onSelectedMemberChange, disabled }) {
  const { members } = useMemberContext();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [open, setOpen] = useState(false);

  const toggleSelection = (memberId) => {
    setSelectedMembers((prevSelectedMembers) => {
      if (prevSelectedMembers.includes(memberId)) {
        return prevSelectedMembers.filter((id) => id !== memberId);
      } else {
        return [...prevSelectedMembers, memberId];
      }
    });
  };

  const isSelected = (memberId) => selectedMembers.includes(memberId);

  useEffect(() => {
    onSelectedMemberChange(selectedMembers);
  }, [selectedMembers, onSelectedMemberChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full overflow-hidden justify-between"
          disabled={disabled}
        >
          {selectedMembers.length > 0
            ? selectedMembers
                .map(
                  (memberId) =>
                    members.find((member) => member._id === memberId).fullName
                )
                .join(", ")
            : "Select members..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search members..." className="h-9" />
          <CommandEmpty>No members found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {members &&
                members.map((member) => (
                  <CommandItem
                    key={member._id}
                    value={member.fullName}
                    onSelect={() => toggleSelection(member._id)}
                  >
                    <div className="flex flex-col">
                      <div>{member.fullName}</div>
                      <p className="text-muted-foreground">{member.email}</p>
                    </div>
                    <CheckIcon
                      className={`ml-auto h-4 w-4 ${
                        isSelected(member._id) ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
