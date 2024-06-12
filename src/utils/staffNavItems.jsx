import {
  BellElectricIcon,
  BookKey,
  ClipboardList,
  Home,
  Sheet,
  Warehouse,
} from "lucide-react";

export const StaffItems = [
  {
    name: "Dashboard",
    icon: <Home className="h-4 w-4" />,
    link: "/staff",
  },
  {
    name: "Tasks",
    icon: <ClipboardList className="h-4 w-4" />,
    link: "/staff/tasks",
  },
  {
    name: "Rooms",
    icon: <Warehouse className="h-5 w-5" />,
    link: "/staff/rooms",
  },

  {
    name: "Bookings",
    icon: <BookKey className="h-5 w-5" />,
    link: "/staff/Bookings",
  },
  {
    name: "Notifications",
    icon: <BellElectricIcon className="h-4 w-4" />,
    link: "/staff/notifications",
  },
  {
    name: "Feedbacks",
    icon: <BellElectricIcon className="h-4 w-4" />,
    link: "/staff/feedbacks",
  },
  {
    name: "Report Maintenance Issues",
    icon: <Sheet className="h-4 w-4" />,
    link: "/staff/Maintenance",
  },

];
