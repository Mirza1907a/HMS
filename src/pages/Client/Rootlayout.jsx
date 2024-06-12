import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./componenets/Navbar";
import { Footer } from "./componenets/Footer";
import { useEffect } from "react";
import axios from "axios";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useBookingContext } from "@/hooks/useBookingContext";
import { useNotiContext } from "@/hooks/useNotiContext";
import { socket } from "@/socket";

export const Rootlayout = () => {
  const { user } = useAuthContextProvider();
  const { dispatch } = useBookingContext();
  const { noti, dispatch: notiDispatch } = useNotiContext();
  const location = useLocation();
  const hideNavbarOnPaths = ["/user/login", "/user/signup"];

  const shouldRenderNavbar = !hideNavbarOnPaths.includes(location.pathname);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`/api/booking/${user._id}`);

        if (response.status === 200) {
          dispatch({
            type: "SET_BOOKINGS",
            payload: response.data.bookings,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchBookings();
  }, [user]);

  useEffect(() => {
    const fetchGuestNoti = async () => {
      notiDispatch({ type: "CLEAR_NOTIS" });
      try {
        const response = await axios(`/api/notis/user/${user._id}`);

        if (response.status === 200) {
          notiDispatch({
            type: "SET_NOTIS",
            payload: response.data.notifications,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchGuestNoti();
  }, [user]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit("register", { role: "guest", userId: user._id });
    }
  }, [user]);
  return (
    <div className="bg-white font-rubik">
      <Navbar />
      <Outlet />
      {shouldRenderNavbar && <Footer />}
    </div>
  );
};
