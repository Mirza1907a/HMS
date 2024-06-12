import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const Not_Found = () => {
  return (
    <main class="grid min-h-screen bg-[url('/ClientImages/404.jpg')] bg-no-repeat bg-cover place-items-center  px-6 py-24 sm:py-36 lg:px-8">
      <div className="absolute bg-overlay inset-0"></div>
      <div class="text-center z-30">
        <p class="text-base font-semibold text-white">404</p>
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Page not found
        </h1>
        <p class="mt-6 text-base leading-7 text-gray-300">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            class=" px-3.5 py-2.5 flex flex-row items-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" /> Go back home
          </Link>
        </div>
      </div>
    </main>
  );
};
