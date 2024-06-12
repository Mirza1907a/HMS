import { AddBooking } from "@/pages/StaffDashboard/components/AddBooking";
import { RecentBookings } from "../components/main/RecentBookings";
import { AllBookings } from "@/pages/StaffDashboard/components/AllBookings";
import { TopBar } from "../components/TopBar";

export const AdminBookings = () => {
  return (
    <>
      <TopBar>Bookings</TopBar>
      <div className="p-10 grid gap-10">
        <div className="grid items-start lg:grid-cols-2 gap-5">
          <AddBooking bookingBy="admin" userType='admin'/>
          <RecentBookings />
        </div>
        <div className="grid w-full ">
          <AllBookings user={'admin'}/>
        </div>
      </div>
    </>
  );
};
