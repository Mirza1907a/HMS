import { useRoomContext } from "./useRoomContext";
import { useRoomTypeContext } from "./useRoomTypeContext";

import { useState, useEffect } from "react";

export const useOneRoomPerType = () => {
  const { room, loading: roomLoading } = useRoomContext();
  const { roomTypes, loading: roomTypesLoading } = useRoomTypeContext();
  const [loading, setLoading] = useState(true);
  const [roomPerType, setRoomPerType] = useState([]);

  useEffect(() => {
    if (!roomLoading && !roomTypesLoading && room && roomTypes) {
      const roomMap = new Map();

      room.forEach((room) => {
        if (!roomMap.has(room.type._id)) {
          roomMap.set(room.type._id, room);
        }
      });

      setRoomPerType(Array.from(roomMap.values()));
      setLoading(false);

      console.log("Fetched room per type:", Array.from(roomMap.values()));
    }
  }, [room, roomTypes, roomLoading, roomTypesLoading]);

  return { roomPerType, loading };
};
