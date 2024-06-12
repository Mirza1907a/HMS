import { Label } from "@radix-ui/react-dropdown-menu";
import { TopBar } from "../components/TopBar";
import { Input } from "@/components/ui/input";
import { AddRoom } from "../components/room/AddRoom";
import { AddRoomType } from "../components/room/AddRoomType";
import { RoomCard } from "@/globalComponents/RoomCard";
import { useRoomContext } from "@/hooks/useRoomContext";
import { RoomTable } from "../components/room/RoomTable";
import { useState } from "react";

export const Rooms = () => {
  const [key, setKey] = useState(0);
  const remountChild = () => {
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <TopBar>Rooms</TopBar>

      <div className="grid flex-1 items-start grid-cols-2 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <AddRoom key={key} reMount={remountChild} />
        <AddRoomType />

        <div className="grid col-span-2 gap-4">
          <RoomTable />
        </div>
      </div>
    </>
  );
};
