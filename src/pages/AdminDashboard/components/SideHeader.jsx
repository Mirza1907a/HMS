import {
  Bell,
  BookKey,
  ChevronLeft,
  ClipboardList,
  Home,
  LineChart,
  MessageSquareText,
  Microwave,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  Sheet,
  ShoppingCart,
  Upload,
  Users,
  Users2,
  Warehouse,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const sideItems = [
  {
    name: "Dashboard",
    link: "/admin",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Bookings",
    link: "/admin/bookings",
    icon: <BookKey className="h-5 w-5" />,
  },
  {
    name: "Rooms",
    link: "/admin/rooms",
    icon: <Warehouse className="h-5 w-5" />,
  },
  {
    name: "Tasks",
    link: "/admin/tasks",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    name: "Staffs",
    link: "/admin/staffs",
    icon: <Users2 className="h-5 w-5" />,
  },
  {
    name: "Guests",
    link: "/admin/guests",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Services",
    link: "/admin/services",
    icon: <Microwave className="h-5 w-5" />,
  },
  {
    name: "Send Notification",
    link: "/admin/send_notification",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    name: "Feedbacks",
    link: "/admin/feedbacks",
    icon: <MessageSquareText className="size-5" />,
  },
  {
    name: "Maintenace",
    link: "/admin/maintenance",
    icon: <Sheet className="size-5" />,
  },
];

export const AdminSidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        {sideItems.map((item, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={item.link}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  {item.icon}

                  <span className="sr-only">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/admin/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};
