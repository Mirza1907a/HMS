import { Label } from "@radix-ui/react-dropdown-menu";
import { TopBar } from "../components/TopBar";
import { Input } from "@/components/ui/input";
import { AddRoom } from "../components/room/AddRoom";
import { AddRoomType } from "../components/room/AddRoomType";

import { RoomTable } from "../components/room/RoomTable";
import { SendNotificationToGuests } from "../components/sendNotification/sendNotificationToGuests";
import { SendNotificationToStaffs } from "../components/sendNotification/sendNotificationToStaff";

export const SendNotificationAdmin = () => {
  return (
    <>
      <TopBar>Send Notification</TopBar>

      <div className="grid  flex-1 items-start place-items-center lg:grid-cols-2 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <SendNotificationToGuests />
        <SendNotificationToStaffs />
      </div>
    </>
  );
};
