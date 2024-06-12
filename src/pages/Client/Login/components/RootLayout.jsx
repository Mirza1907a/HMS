import { useState, useEffect } from "react";
import { useFeedbackContext } from "@/context/feedbackContext";
import { FeedbackCard } from "@/globalComponents/FeedbackCard";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Locate } from "lucide-react";

export const LoginRoot = () => {
  const { feedback } = useFeedbackContext();
  const location = useLocation();
  const [currentFeedback, setCurrentFeedback] = useState(
    feedback ? feedback[0] : null
  );

  useEffect(() => {
    if (feedback && feedback.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * feedback.length);
        setCurrentFeedback(feedback[randomIndex]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [feedback]);
  const toggleText =
    location.pathname === "/user/login"
      ? "Signup"
      : location.pathname === "/user/signup"
      ? "Login"
      : "/user/login";
  const toggleLink =
    location.pathname === "/user/login"
      ? "/user/signup"
      : location.pathname === "/user/signup"
      ? "/user/login"
      : "/user/login";

  return (
    <div className="grid w-full place-items-center h-screen overflow-hidden md:grid-cols-2">
      <div className="bg-zinc-900 relative bg-[url('/ClientImages/luxuryblack.jpg')] bg-no-repeat bg-cover bg-center overflow-hidden size-full hidden md:grid col-span-1">
        <div className="absolute inset-0 bg-overlay"></div>
        <div className="mb-auto p-5 z-50 flex flex-row gap-2 size-fit drop-shadow-lg ">
          <Locate className="size-10 text-primary " />
          <h1 className="text-primary font-mono font-medium text-3xl uppercase ">
            Luxury Stay
          </h1>
        </div>
        <AnimatePresence mode="wait" className="z-40">
          {currentFeedback && (
            <motion.div
              key={currentFeedback._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col px-10 py-5 z-40 text-white overflow-hidden mt-auto text-xl"
            >
              <span>"{currentFeedback.body}"</span>
              <span className="text-sm font-medium">
                {currentFeedback.guestId.fullName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="grid md:bg-white bg-zinc-50 size-full col-span-1">
        <div className="flex flex-row h-fit items-center p-5">
          <div className=" md:hidden z-50 flex flex-row gap-2 size-fit drop-shadow-sm ">
            <Locate className="size-10 text-black " />
            <h1 className="text-black font-mono font-medium text-3xl uppercase ">
              Luxury Stay
            </h1>
          </div>
          <div className="size-fit ml-auto">
            <Link to={toggleLink}>
              <Button className="tracking-wider ">{toggleText}</Button>
            </Link>
          </div>
        </div>

        <div className="grid place-content-center mb-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
