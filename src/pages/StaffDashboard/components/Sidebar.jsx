import { Package2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NotiDropDown } from "@/globalComponents/NotiDropDown";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StaffItems } from "@/utils/staffNavItems";

export function StaffSidebar() {
  const { staff } = useStaffAuthContext();

  const roleAccess = {
    Housekeeper: [
      "Dashboard",
      "Rooms",
      "Tasks",
      "Notifications",
      "Settings",
      "Report Maintenance Issues",
    ],
    Receptionist: [
      "Dashboard",
      "Rooms",
      "Tasks",
      "Notifications",
      "Bookings",
      "Feedbacks",
      "Report Maintenance Issues",
      "Settings",
    ],
  };
  const accessibleItems = StaffItems.filter((item) =>
    roleAccess[staff.role]?.includes(item.name)
  );

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Luxury Stay</span>
          </Link>
          <div className="relative">
            <NotiDropDown user={staff} userType="staff" />
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {accessibleItems.map((item, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      key={index}
                      to={item.link}
                      className="flex w-fit items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Link to="/staff/settings">
            <Button
              className="w-full flex flex-row gap-4 items-center"
              variant="outline"
            >
              Settings <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
