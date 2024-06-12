import axios from "axios";
import { useBookingContext } from "./useBookingContext";
import { useState } from "react";
import { useStaffAuthContext } from "./useStaffAuth";
import { useAuthContextProvider } from "./useAuthContext";

export const useAddBooking = ({
  userType,
  bookingBy,
  room,
  setCheckIn,
  setCheckOut,
  reset,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseG, setResponseG] = useState(null);
  const [error, setError] = useState(null);
  const { staff } = useStaffAuthContext();
  const [id,setId] = useState(null);
  const { user } = useAuthContextProvider();
  const { dispatch } = useBookingContext();

  const SubmitBooking = async (data,reset) => {
    setError(null);
    setResponseG(null);
    setIsLoading(true);
    setId(null)
    let userId;
    let bookedBy;
    try {
      if (userType === "staff") {
        userId = staff._id;
        bookedBy = "Staff";
      } else if (userType === "admin") {
        bookedBy = "User";
        userId = user._id;
      } else if (userType === "guest") {
        bookedBy = "User";
        userId = user._id;
      }
      if (bookingBy === "guest") {
        const response = await axios.post(
          `/api/booking/guestBooking/${bookedBy}/${userId}`,
          {
            roomTypeId: room.type._id,
            memberId: userId,
            checkInDate: data.checkIn,
            checkOutDate: data.checkOut,
          }
        );

        if (response.status === 201) {
          setIsLoading(false);
          setResponseG(response.data.message);
          setId(response.data.id)
          reset();
          setCheckOut(null);
          setCheckIn(null);
        } else {
          setIsLoading(false);
          setError("Unexpected response status");
        }
      } else {
        const response = await axios.post(
          `/api/booking/${bookedBy}/${userId}`,
          {
            roomId: data.room,
            memberId: data.member,
            checkInDate: data.checkIn,
            checkOutDate: data.checkOut,
          }
        );

        if (response.status === 201) {
          setIsLoading(false);

          setResponseG(response.data.message);
        } else {
          setIsLoading(false);
          setError("Unexpected response status");
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return { isLoading, responseG, error,id, SubmitBooking };
};
