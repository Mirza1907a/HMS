import { socket } from "@/socket";
import axios from "axios";
import { useEffect, useState, createContext, useReducer } from "react";

export const RoomContext = createContext();

export const RoomReducer = (state, action) => {
  switch (action.type) {
    case "SET_ROOMS":
      return {
        room: action.payload,
      };

    case "DELETE_ROOM":
      return {
        room: state.room
          ? state.room.filter((w) => !action.payload.includes(w._id))
          : [],
      };
    case "UPDATE_STATUS":
      const updatedStatus = state.room.map((room) => {
        if (room._id === action.payload._id) {
          return {
            ...room,
            status: action.payload.status,
            availibility: action.payload.availibility,
          };
        }
        return room;
      });

      return {
        ...state,
        room: updatedStatus,
      };
    default:
      return state;
  }
};
export const RoomContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(RoomReducer, {
    room: [],
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get("/api/room");

        if (response.status === 200) {
          dispatch({ type: "SET_ROOMS", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchRoom();
  }, []);

  useEffect(() => {
    const deleteRoom = (room) => {
      dispatch({ type: "DELETE_ROOM", payload: room });
    };

    const roomStatus = (room) => {
      dispatch({ type: "UPDATE_STATUS", payload: room });
    };
    socket.on("deleteRoom", deleteRoom);
    socket.on("roomStatus", roomStatus);

    return () => {
      socket.off("roomStatus", roomStatus);
      socket.off("deleteRoom", deleteRoom);
    };
  }, [socket]);

  console.log("RoomContext state: ", state);
  return (
    <RoomContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};
