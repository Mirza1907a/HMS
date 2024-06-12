import { RoomTypeContext } from "@/context/roomTypeContext";

import { useContext } from "react";

export const useRoomTypeContext = () => {
  const context = useContext(RoomTypeContext);

  if (!context) {
    throw Error("useRoomTypeContext must be used inside an useRoomTypeContext");
  }

  return context;
};
