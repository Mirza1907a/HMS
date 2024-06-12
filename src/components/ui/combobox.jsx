import  { useEffect,useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStaffContext } from "@/hooks/useStaffContext";

export function StaffCombobox({ onSelectedStaffsChange,disabled }) {
  const { staffs } = useStaffContext();
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [open, setOpen] = useState(false);

  const toggleSelection = (staffId) => {
    setSelectedStaffs((prevSelectedStaffs) => {
      if (prevSelectedStaffs.includes(staffId)) {
        return prevSelectedStaffs.filter((id) => id !== staffId);
      } else {
        return [...prevSelectedStaffs, staffId];
      }
    });
  };

  const isSelected = (staffId) => selectedStaffs.includes(staffId);

  useEffect(() => {
    onSelectedStaffsChange(selectedStaffs);
  }, [selectedStaffs, onSelectedStaffsChange]);

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
          {selectedStaffs.length > 0
            ? selectedStaffs.map((staffId) =>
                staffs.find((staff) => staff._id === staffId).username
              ).join(", ")
            : "Select staff..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search staff..." className="h-9" />
          <CommandEmpty>No staff found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {staffs.map((staff) => (
                <CommandItem
                  key={staff._id}
                  value={staff.username}
                  onSelect={() => {
                    toggleSelection(staff._id);
                  }}
                >
                  {staff.username} ({staff.role})
                  <CheckIcon
                    className={`ml-auto h-4 w-4 ${
                      isSelected(staff._id) ? "opacity-100" : "opacity-0"
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
