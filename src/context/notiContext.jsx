import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { socket } from "@/socket";

import axios from "axios";
import { useEffect, useState, useReducer, createContext } from "react";
import { toast } from "sonner";

export const NotiContext = createContext();

export const notiReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIS":
      return {
        noti: action.payload,
      };
    case "NEW_NOTI":
      return {
        noti: [action.payload, ...state.noti],
      };
    case "CLEAR_NOTIS":
      return {
        noti: null,
      };
    case "MARK_ALL_AS_SEEN":
      const updatedNotis = state.noti.map((noti) => {
        const updatedNoti = action.payload.notifications.find(
          (n) => n._id === noti._id
        );
        if (updatedNoti) {
          return { ...noti, seen: updatedNoti.seen };
        }
        return noti;
      });

      return {
        ...state,
        noti: updatedNotis,
      };
    case "SET_NOTI_SEEN":
      const updatedNoti = state.noti.map((noti) => {
        if (noti._id === action.payload._id) {
          return { ...noti, seen: action.payload.seen };
        }
        return noti;
      });

      return {
        ...state,
        noti: updatedNoti,
      };
    default:
      return state;
  }
};
export const NotiContextProvider = ({ children }) => {
  const { staff } = useStaffAuthContext();
  const { user } = useAuthContextProvider();
  const [state, dispatch] = useReducer(notiReducer, {
    noti: null,
  });


  useEffect(() => {
    const newNoti = (data) => {
      dispatch({ type: "NEW_NOTI", payload: data });
      toast("You have a new notification");
    };

    socket.on("notiCreated", newNoti);

    return () => {
      socket.off("notiCreated", newNoti);
    };
  }, [socket]);

  console.log("NotiContext state: ", state);
  return (
    <NotiContext.Provider value={{ ...state, dispatch }}>
      {children}
    </NotiContext.Provider>
  );
};
