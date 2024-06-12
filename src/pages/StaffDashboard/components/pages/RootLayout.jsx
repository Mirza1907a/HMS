import { Outlet, useLocation } from "react-router-dom";
import { StaffSidebar } from "../Sidebar";
import { StaffHeader } from "../Header";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { useEffect } from "react";
import axios from "axios";
import { useNotiContext } from "@/hooks/useNotiContext";
import { socket } from "@/socket";
import { useTaskContext } from "@/hooks/useTaskContext";
import { useMemberContext } from "@/hooks/useMemberContext";
import { useBookingContext } from "@/hooks/useBookingContext";

export function StaffDashboard() {
  const { staff } = useStaffAuthContext();
  const { dispatch } = useNotiContext();
  const { dispatch: taskDispatch } = useTaskContext();
  const { members, dispatch: memberDispatch } = useMemberContext();
  const { dispatch: bookingDispatch } = useBookingContext();
  const location = useLocation();

  const getHeading = (path) => {
    switch (path) {
      case "/staff/rooms":
        return "Rooms";
      case "/staff/tasks":
        return "Tasks";
      case "/staff/notifications":
        return "Notifications";
      case "/staff/Bookings":
        return "Bookings";
      default:
        return "Dashboard";
    }
  };

  const heading = getHeading(location.pathname);

  useEffect(() => {
    taskDispatch({ type: "CLEAR_TASKS" });
    const fetchTasks = async () => {
      try {
        if (!staff) {
          return null;
        }
        const response = await axios.get(
          `/api/task/get_staff_tasks/${staff._id}`
        );

        if (response.status === 200) {
          taskDispatch({ type: "SET_TASK", payload: response.data });
        }
      } catch (err) {
        console.log("Error fetching tasks:", err);
      }
    };

    fetchTasks();

    console.log("staff", staff);
  }, [staff, dispatch]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchStaffNoti = async () => {
      dispatch({ type: "CLEAR_NOTIS" });
      try {
        const response = await axios(`/api/notis/staff/${staff._id}`);

        if (response.status === 200) {
          dispatch({ type: "SET_NOTIS", payload: response.data.notifications });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchStaffNoti();
  }, [staff]);

  useEffect(() => {
    if (staff) {
      const userId = staff._id;
      socket.emit("register", { role: "staff", userId });
    }
  }, [staff]);

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
  }, []);

  useEffect(() => {
    const fetchGuestTasks = async () => {
      try {
        if (staff.role !== "Housekeeper") {
          return null;
        }

        const response = await axios.get("/api/guestReq/get");

        if (response.status === 200) {
          taskDispatch({
            type: "SET_GUEST_TASKS",
            payload: response.data.guestRequests,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchGuestTasks();
  }, [staff]);

  return (
    <div className="grid h-screen overflow-hidden w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <StaffSidebar />
      <div className="flex flex-col">
        <StaffHeader />

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">{heading}</h1>
            <p className="font-semibold">
              {staff.username} ({staff.role})
            </p>
          </div>
          <div
            className="flex flex-1 items-start overflow-y-scroll overflow-x-hidden max-h-[80vh] rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="grid items-start w-full gap-1 ">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
