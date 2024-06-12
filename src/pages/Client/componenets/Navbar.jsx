import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotiDropDown } from "@/globalComponents/NotiDropDown";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { BellIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { getInitials } from "@/utils/getInitials";

export const Navbar = () => {
  const { user, dispatch, logout } = useAuthContextProvider();
  const [shouldShowNavbar, setShouldShowNavbar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const isProfileRoute = pathname.startsWith("/");

  const windowWidth = useRef(window.innerWidth);

  const handleScroll = useRef(() => {
    const scrolled = window.scrollY;
    const threshold = 300;

    if (scrolled > threshold) {
      setShouldShowNavbar(true);
    } else {
      setShouldShowNavbar(false);
    }
  }).current;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const guestNavItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Rooms",
      link: "/rooms",
    },
    {
      name: "Blogs",
      link: "/blogs",
    },
    {
      name: "Policies",
      link: "/policies",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Contact",
      link: "/contact",
    },
    {
      name: "Feedbacks",
      link: "/feedback",
    },
  ];
  return (
    <motion.nav
      className="fixed w-full p-5 transition duration-500 z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{
        backdropFilter: "blur(0.5rem)",
        background: "rgba(0, 0, 0, 0.589)",
      }}
    >
      <ul className="flex  flex-row justify-around gap-10 items-center">
        <div className="text-xl tracking-widest uppercase text-primary">
          Luxury Stay
        </div>
        <div className="flex justify-between gap-20 items-center">
          <div className="flex justify-between gap-4 items-center">
            {guestNavItems &&
              guestNavItems.map((item, index) => (
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `hover:text-primary ease-linear duration-200 ${
                      isActive ? "text-primary" : "text-gray-400"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
          </div>

          {user && (
            <div className="flex flex-row gap-3">
              <Button size="icon" className="shadow-lg">
                <NotiDropDown userType="user" user={user} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer shadow-lg">
                    <AvatarImage src="//" alt="user" />
                    <AvatarFallback>
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {user && user.role === "admin" && (
                    <>
                      <DropdownMenuGroup>
                        <Link className="font-semibold curs" to="/admin">
                          <DropdownMenuItem className="cursor-pointer">
                            Admin Panel
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuGroup>
                    <Link to="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/profile/bookings">
                      <DropdownMenuItem className="cursor-pointer">
                        Bookings
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/profile/billings">
                      <DropdownMenuItem className="cursor-pointer">
                        Billings
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link to="/profile/settings">
                      <DropdownMenuItem className="cursor-pointer">
                        Settings
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </ul>
    </motion.nav>
  );
};
