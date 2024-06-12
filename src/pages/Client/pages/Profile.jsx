import { Link, NavLink, Outlet, useOutlet } from "react-router-dom";

export const Profile = () => {
  const { outlet } = useOutlet();
  const profileNavItems = [
    {
      name: "General",
      link: "/profile",
    },

    {
      name: "Bookings",
      link: "/profile/bookings",
    },

    {
      name: "Settings",
      link: "/profile/settings",
    },
    {
      name: "Feedbacks",
      link: "/profile/feedbacks",
    },
  ];
  return (
    <div className="lg:px-24 md:px-10 py-24 px-5 grid gap-10">
      <h1 className="text-4xl font-medium size-fit">Profile</h1>
      <div className="gap-10 grid min-h-screen">
        <div className="grid md:grid-cols-12">
          <div className="col-span-2 md:block hidden">
            <nav className="grid size-fit gap-5 text-sm text-muted-foreground">
              {profileNavItems.map((item, index) => (
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `font-semibold ${isActive ? "text-black" : "text-gray-600"}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="grid col-span-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
