import { Separator } from "@/components/ui/separator";
import { Link, NavLink, Outlet } from "react-router-dom";

export const StaffSettings = () => {
  const staffSettingsItem = [
    {
      name: "Profile",
      link: "/settings",
    },
    {
      name: "Notifications",
      link: "/settings/notifications",
    },
  ];
  return (
    <div className="grid size-full px-10 py-5">
      <div className="flex flex-col ">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings </p>
      </div>
      <Separator className="my-5" />

      <div className="grid grid-cols-4 gap-2">
        <div className="grid col-span-1 h-fit gap-2">
          {staffSettingsItem.map((item, index) => (
            <NavLink
              to={`/staff${item.link}`}
              key={index}
              className={({ isActive }) =>
                `hover:bg-gray-50 rounded-md ease-linear duration-200 p-2 ${
                  isActive ? "bg-gray-50" : ""
                }`
              }
            >
              <span className="font-medium hover:underline">{item.name}</span>
            </NavLink>
          ))}
        </div>
        <div className="grid col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
