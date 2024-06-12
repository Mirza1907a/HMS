import { RoomCard } from "@/globalComponents/RoomCard";
import { useRoomContext } from "@/hooks/useRoomContext";
import { RoomTable } from "@/pages/AdminDashboard/components/room/RoomTable";

export const StaffRooms = () => {
  const { room } = useRoomContext();

  return (
    <>
      <div className="grid p-5 flex-wrap items-center justify-center">
        <RoomTable/>
      </div>
    </>
  );
};
