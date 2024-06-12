import { Outlet } from "react-router-dom";
import { AddProduct } from "./components/AddProduct";
import { AdminHeader } from "./components/Header";
import { AdminSidebar } from "./components/SideHeader";
import { useEffect } from "react";
import { useNotiContext } from "@/hooks/useNotiContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import axios from "axios";
import { socket } from "@/socket";
import { useTaskContext } from "@/hooks/useTaskContext";
import { useBookingContext } from "@/hooks/useBookingContext";
import { useMemberContext } from "@/hooks/useMemberContext";
import { useTransactionContext } from "@/context/transactionContext";

export function Dashboard() {
  const { dispatch } = useNotiContext();
  const { user } = useAuthContextProvider();
  const { member, dispatch: memberDispatch } = useMemberContext();
  const { dispatch: taskDispatch } = useTaskContext();
  const { dispatch: bookingDispatch } = useBookingContext();
  const { dispatch: transactionDispatch } = useTransactionContext();

  useEffect(() => {
    taskDispatch({ type: "CLEAR_TASK" });
    const fetchAdminTasks = async () => {
      try {
        const response = await axios.get(
          `/api/task/get_admin_tasks/${user._id}`
        );

        if (response.status === 200) {
          taskDispatch({ type: "SET_TASK", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAdminTasks();
  }, []);

  useEffect(() => {
    const fetchAdminNoti = async () => {
      dispatch({ type: "CLEAR_NOTIS" });
      try {
        const response = await axios(`/api/notis/user/${user._id}`);

        if (response.status === 200) {
          dispatch({ type: "SET_NOTIS", payload: response.data.notifications });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAdminNoti();
  }, [user]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const userId = user._id;
      socket.emit("register", { role: "user", userId });
    }
  }, [user]);

  useEffect(() => {
    const fetchBooking = async () => {
      bookingDispatch({ type: "CLEAR_BOOKING" });
      try {
        const response = await axios.get("/api/booking");

        if (response.status === 200) {
          bookingDispatch({
            type: "SET_BOOKINGS",
            payload: response.data.bookings,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchBooking();
  }, [user]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("/api/user/members");
        if (response.status === 200) {
          memberDispatch({ type: "SET_MEMBER", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMembers();
  }, [member]);
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get("/api/orderService/GetOrderServices");

        if (response.status === 200) {
          transactionDispatch({
            type: "SET_TRANSACTIONS",
            payload: response.data.ServiceOrders,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchTransaction();
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <AdminHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
