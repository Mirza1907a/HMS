import {
  FaFacebookF,
  FaGithubAlt,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import React from "react";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Footer = () => {
  const socials = [
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      link: "https://www.linkedin.com/in/saboor7/",
    },
    {
      icon: <FaGithubAlt className="w-5 h-5" />,
      link: "https://github.com/Sabooralt",
    },
    {
      icon: <FaFacebookF className="w-5 h-5" />,
      link: "https://www.facebook.com/profile.php?id=100053190711596",
    },
    {
      icon: <FaInstagram className="w-5 h-5" />,
      link: "https://www.instagram.com/saboor.dev",
    },
  ];
  return (
    <footer className="md:p-20 p-5 bg-gray-200 flex flex-col gap-10">
      <div className="flex flex-col md:gap-5 md:flex-row gap-10 justify-between">
        <div className="flex flex-col md:mx-0 mx-auto gap-5">
          <h1 className="text-gray-400">PHONE SUPPORT</h1>
          <p>24/7 Call us now.</p>
          <div>
            <p className="text-lg space-y-0">+92-3481807502</p>
            <p className="text-gray-400 text-xs">Abdul Saboor</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <h1 className="text-gray-400">CONNECT WITH US</h1>
          <p>We are socialized. Follow us</p>
          <div className="flex flex-row gap-4">
            {socials.map((social, index) => (
              <a key={index} href={social.link}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="text-gray-400 uppercase">
            Subscribe to our news letter.
          </h1>
          <div className="relative flex flex-row items-center">
            <Input
              className="bg-white p-5"
              type="text"
              placeholder="Enter your email"
            />

            <div className="absolute right-3">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mx-auto flex flex-col gap-3 text-gray-500">
        <span>© Copyright ©2024 All rights reserved.</span>
        <span>
          This desgin was inspired by{" "}
          <a target="blank" className="text-black" href="https://colorlib.com/">
            Colorlib{" "}
          </a>
          and developed from scratch using Tailwind CSS by{" "}
          <a
            target="blank"
            href="https://www.linkedin.com/in/saboor7/"
            className="text-black"
          >
            Saboor
          </a>
        </span>
      </div>
    </footer>
  );
};
