import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { HeroScreen } from "../componenets/HeroScreen";
import { useStaffContext } from "@/hooks/useStaffContext";
import { StaffCard } from "../componenets/StaffCard";
import { RelaxAndEnjoy } from "../componenets/RelaxAndEnjoy";

export const About = () => {
  const { staffs: staff } = useStaffContext();
  return (
    <div className="grid">
      <HeroScreen>
        <h1 className="text-8xl">About Luxury Hotel</h1>
        <p className="text-2xl">Discover our world's #1 Luxury Room For VIP.</p>
      </HeroScreen>
      <div className="grid md:grid-cols-2 gap-20 md:gap-0 mt-20 bg-white justify-center mx-auto items-center px-5 md:px-20">
        <div className="flex flex-col mr-auto text-justify gap-3 px-20">
          <h3 className="uppercase text-gray-400 text-sm">
            STAY WITH OUR LUXURY ROOMS
          </h3>

          <h1 className="text-5xl">Our Story</h1>
          <p className="text-gray-500 flex flex-col gap-7 ">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus
              illo similique natus, a recusandae? Dolorum, unde a quibusdam est?
              Corporis deleniti obcaecati quibusdam inventore fuga eveniet! Qui
              delectus tempore amet!
            </span>

            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus
              illo similique natus, a recusandae? Dolorum, unde a quibusdam est?
              Corporis deleniti obcaecati quibusdam inventore fuga eveniet! Qui
              delectus tempore amet!
            </span>

            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus
              illo similique natus, a recusandae? Dolorum, unde a quibusdam est?
              Corporis deleniti obcaecati quibusdam inventore fuga eveniet! Qui
              delectus tempore amet!
            </span>
          </p>
        </div>

        <div>
          <img src="/ClientImages/home1.png" />
        </div>
      </div>

      <div className="w-full py-20 gap-10 mt-20 bg-gray-100 grid text-center">
        <div>
          <h3 className="text-gray-400 capitalize">OUR KIND STAFF</h3>
          <h1 className="text-6xl"> Our Staff</h1>
        </div>

        <div className="grid md:grid-cols-3 p-20 items-center gap-5 mx-auto">
          {staff &&
            staff.map((staff) => (
              <div key={staff._id} className="grid col-span-1">
                <StaffCard staff={staff} />
              </div>
            ))}
        </div>
      </div>
      <div className="bg-gray-100 mt-20">
        <RelaxAndEnjoy />
      </div>
    </div>
  );
};
