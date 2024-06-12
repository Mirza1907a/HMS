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

export function MemberCombobox({ onSelectedMemberChange, disabled }) {
  const { members } = useMemberContext();
  const [selectedMember, setSelectedMember] = useState(null);
  const [open, setOpen] = useState(false);

  const handleMemberSelect = (memberId) => {
    setSelectedMember(memberId);
    onSelectedMemberChange(memberId);
    setOpen(false);
  };

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
          {selectedMember
            ? members.find((member) => member._id === selectedMember).fullName
            : "Select member..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search member..." className="h-9" />
          <CommandEmpty>No member found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {members &&
                members.map((member) => (
                  <CommandItem
                    key={member._id}
                    value={member.fullName}
                    onSelect={() => handleMemberSelect(member._id)}
                  >
                    <div className="flex flex-col">
                      <div>{member.fullName}</div>

                      <p className="text-muted-foreground">{member.email} </p>
                    </div>
                    <CheckIcon
                      className={`ml-auto h-4 w-4 ${
                        selectedMember === member._id
                          ? "opacity-100"
                          : "opacity-0"
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
