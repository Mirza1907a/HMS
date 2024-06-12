import { useEffect } from "react";
import { AddBooking } from "../AddBooking";
import { AllBookings } from "../AllBookings";
import { RecentBookings } from "../RecentBookings";
import { useBookingContext } from "@/hooks/useBookingContext";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import axios from "axios";

export const StaffBookings = () => {
  const { dispatch } = useBookingContext();
  const { staff } = useStaffAuthContext();
  useEffect(() => {
    const fetchBooking = async () => {
      dispatch({ type: "CLEAR_BOOKING" });
      try {
        if (staff.role !== "Receptionist") {
          return null;
        }
        const response = await axios.get("/api/booking");

        if (response.status === 200) {
          dispatch({ type: "SET_BOOKINGS", payload: response.data.bookings });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchBooking();
  }, [staff]);
  return (
    <div className="p-5 grid gap-10">
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <AddBooking userType='staff' />
        <RecentBookings />
      </div>
      <div className="grid w-full">
        <AllBookings user={"staff"} />
      </div>
    </div>
  );
};
