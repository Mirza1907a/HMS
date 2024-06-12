import { Button } from "@/components/ui/button";
import { HeroScreen } from "../componenets/HeroScreen";
import { NewsCard } from "../componenets/NewsCard";
import { useEffect, useState } from "react";
import axios from "axios";

export const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigationButtons = ["Previous", 1, 2, 3, "Next"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios("/api/blog");

        if (response.status === 200) {
          setBlogs(response.data);
        }
      } catch (err) {}
    };
    fetchBlogs();
  }, []);
  return (
    <div className="grid gap-20 ">
      <HeroScreen height={80}>
        <h1 className="text-6xl">News & Events</h1>
        <p className="text-2xl">
          Read our daily news and events of our luxury hotel.
        </p>
      </HeroScreen>

      <div className="grid p-20 justify-items-center gap-10 items-center mx-auto">
        <div className="grid px-[10rem]  grid-cols-3 gap-10 z-40">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="grid col-span-1">
                <NewsCard blog={blog} />
              </div>
            ))
          ) : (
            <div>No blogs available currently!</div>
          )}
        </div>
        <div className="flex flex-row gap-3">
          {navigationButtons.map((item, index) => (
            <Button
              key={index}
              size="sm"
              className="border-secondary bg-primary text-secondary font-thin hover:bg-white"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
