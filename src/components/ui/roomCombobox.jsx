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
import { useRoomContext } from "@/hooks/useRoomContext";

export function RoomCombobox({ onSelectedRoomChange, disabled }) {
  const { room } = useRoomContext();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [open, setOpen] = useState(false);

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    onSelectedRoomChange(roomId);
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
          {selectedRoom
            ? room.find((room) => room._id === selectedRoom).roomNumber
            : "Select room..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search room..." className="h-9" />
          <CommandEmpty>No room found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {room &&
                room.map((room) => (
                  <CommandItem
                    key={room._id}
                    value={room.roomNumber}
                    onSelect={() => handleRoomSelect(room._id)}
                  >
                    <div className="flex flex-col flex-wrap gap-1 capitalize">
                      <div>
                        Room {room.roomNumber} ({room.type.type})
                      </div>

                      <div className="flex flex-row flex-wrap gap-1">
                        <p>
                          Status:
                          <span className="font-semibold"> {room.status}</span>
                        </p>
                        <p>
                          Availibility:{" "}
                          <span className="font-semibold">
                            {room.availibility}
                          </span>
                        </p>
                      </div>
                    </div>
                    <CheckIcon
                      className={`ml-auto h-4 w-4 ${
                        selectedRoom === room._id ? "opacity-100" : "opacity-0"
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
