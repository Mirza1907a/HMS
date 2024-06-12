import { BookingContext } from "@/context/bookingContext";
import { useContext } from "react";

export const useBookingContext = () => {
  const context = useContext(BookingContext);

  if (!context) {
    throw Error("useBookingContext must be used inside an AuthContextProvider");
  }
  return context;
};
