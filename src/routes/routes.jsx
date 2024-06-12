import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { Dashboard } from "@/pages/AdminDashboard/Rootlayout";
import { AddProduct } from "@/pages/AdminDashboard/components/AddProduct";
import { Staff } from "@/pages/AdminDashboard/pages/Staff";
import { SignupForm } from "@/pages/Client/Login/components/signup";
import { Rootlayout } from "@/pages/Client/Rootlayout";
import { LoginForm } from "@/pages/Client/Login/components/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { Guests } from "@/pages/AdminDashboard/pages/Guests";
import { Rooms } from "@/pages/AdminDashboard/pages/Rooms";
import { DashboardHome } from "@/pages/AdminDashboard/pages/Main";
import { Settings } from "@/pages/AdminDashboard/pages/Settings";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { StaffLogin } from "@/pages/Client/Login/components/staffLogin";
import { StaffDashboard } from "@/pages/StaffDashboard/components/pages/RootLayout";
import { StaffHome } from "@/pages/StaffDashboard/components/pages/Home";
import { Tasks } from "@/pages/AdminDashboard/pages/Task";
import { StaffTasks } from "@/pages/StaffDashboard/components/pages/Tasks";
import { StaffNotifications } from "@/pages/StaffDashboard/components/pages/Notifications";
import { StaffRooms } from "@/pages/StaffDashboard/components/pages/Rooms";
import { StaffBookings } from "@/pages/StaffDashboard/components/pages/Bookings";
import { AdminBookings } from "@/pages/AdminDashboard/pages/Bookings";
import { Home } from "@/pages/Client/pages/Home";
import { Not_Found } from "@/404";
import { About } from "@/pages/Client/pages/About";
import { ContactUs } from "@/pages/Client/pages/Contact";
import { ClientRooms } from "@/pages/Client/pages/Rooms";
import { Profile } from "@/pages/Client/pages/Profile";
import { ProfileSettings } from "@/pages/Client/componenets/ProfileSettings";
import { ProfileHome } from "@/pages/Client/componenets/ProfileHome";
import { GuestBookings } from "@/pages/Client/componenets/ClientBookings";
import { Services } from "@/pages/AdminDashboard/pages/Services";
import { Transactions } from "@/pages/AdminDashboard/pages/Transactions";
import { SendNotificationAdmin } from "@/pages/AdminDashboard/pages/sendNotification";
import { LoginRoot } from "@/pages/Client/Login/components/RootLayout";
import { Feedbacks } from "@/pages/Client/pages/Feedbacks";
import { StaffFeedbacks } from "@/pages/StaffDashboard/components/pages/Feedback";
import { AdminFeedbacks } from "@/pages/AdminDashboard/pages/Feedbacks";
import { BookRoom } from "@/pages/Client/pages/BookRoom";
import { StaffSettings } from "@/pages/StaffDashboard/components/pages/Settings";
import { StaffReportMaintenance } from "@/pages/StaffDashboard/components/pages/ReportMaintainanceIssues";
import { Maintenance } from "@/pages/AdminDashboard/pages/Maintenance";
import { StaffProfileSettings } from "@/pages/StaffDashboard/components/ProfileSettings";
import { StaffNotificationSettings } from "@/pages/StaffDashboard/components/NotificationSettings";
import { Policies } from "@/pages/AdminDashboard/components/settings/Policies";
import { AdminProfile } from "@/pages/AdminDashboard/components/settings/Profile";
import { ClientPolicies } from "@/pages/Client/pages/Policies";
import { GuestFeedbacks } from "@/pages/Client/componenets/GuestFeedbacks";
import { Billings } from "@/pages/Client/componenets/Billings";
import { Blogs } from "@/pages/Client/pages/Blog";

export const AdminRoutes = () => {
  const { user } = useAuthContextProvider();
  const { staff } = useStaffAuthContext();
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Rootlayout /> : <Navigate to="/user/login" />}
      >
        <Route index element={<Home />} />

        <Route path="/policies" element={<ClientPolicies />} />
        <Route path="/rooms" element={<ClientRooms />}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/feedback" element={<Feedbacks />} />
        <Route path="/boomRoom/:roomId" element={<BookRoom />} />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/user/login" />}
        >
          <Route index element={<ProfileHome />} />
          <Route
            path="/profile/bookings/:bookingId?"
            element={<GuestBookings />}
          />
          <Route path="/profile/settings" element={<ProfileSettings />} />
          <Route path="/profile/feedbacks" element={<GuestFeedbacks />} />
          <Route path="/profile/billings" element={<Billings />} />
        </Route>

       

        <Route path="*" element={<Not_Found />} />
      </Route>

      
      <Route
          path="/StaffLogin"
          element={staff ? <Navigate to="/staff" /> : <StaffLogin />}
        />

      <Route path="/user" element={<LoginRoot />}>
        <Route
          path="/user/signup"
          element={user ? <Navigate to="/" /> : <SignupForm />}
        />
        <Route
          index
          path="/user/login"
          element={
            user?.role === "admin" ? (
              <Navigate to="/admin" />
            ) : user ? (
              <Navigate to="/admin" />
            ) : (
              <LoginForm />
            )
          }
        />
      </Route>
      {/*  Admin Routes */}
      <Route
        path="/admin"
        element={
          user && user.role === "admin" ? <Dashboard /> : <Navigate to="/" />
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="/admin/addproduct" element={<AddProduct />} />
        <Route path="/admin/staffs" element={<Staff />} />
        <Route path="/admin/guests" element={<Guests />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        <Route path="/admin/tasks" element={<Tasks />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/transactions" element={<Transactions />} />
        <Route
          path="/admin/send_notification"
          element={<SendNotificationAdmin />}
        />
        <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
        <Route path="/admin/maintenance" element={<Maintenance />} />
        <Route path="/admin/settings" element={<Settings />}>
          <Route index element={<AdminProfile />} />
          <Route path="/admin/settings/policies" element={<Policies />} />
        </Route>
      </Route>

      {/* Staff Routes */}

      <Route
        path="/staff"
        element={staff ? <StaffDashboard /> : <Navigate to="/staffLogin" />}
      >
        <Route index element={<StaffHome />} />

        <Route path="/staff/Tasks" element={<StaffTasks />} />
        <Route path="/staff/Notifications" element={<StaffNotifications />} />
        <Route path="/staff/Bookings" element={<StaffBookings />} />
        <Route path="/staff/Rooms" element={<StaffRooms />} />
        <Route path="/staff/feedbacks" element={<StaffFeedbacks />} />
        <Route path="/staff/maintenance" element={<StaffReportMaintenance />} />
        <Route path="/staff/settings" element={<StaffSettings />}>
          <Route index element={<StaffProfileSettings />} />
          <Route
            path="/staff/settings/notifications"
            element={<StaffNotificationSettings />}
          />
        </Route>
      </Route>
    </Routes>
  );
};
