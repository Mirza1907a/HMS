import { Input } from "@/components/ui/input";
import { HeroScreen } from "../componenets/HeroScreen";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ContactUs = () => {
  return (
    <div className="grid gap-20">
      <HeroScreen>
        <h1 className="text-7xl">Contact Us</h1>
        <p className="text-3xl">
          {" "}
          Discover our world's #1 Luxury Room For VIP.
        </p>
      </HeroScreen>

      <div className="grid md:grid-cols-2 p-[7rem] gap-10">
        <div className="grid col-span-1">
          <h1 className="text-3xl">Contact Form</h1>
          <form className="grid gap-4">
            <div className="grid gap-1">
              <Label>Name</Label>
              <Input placeholder="" className="rounded-md" />
            </div>
            <div className="grid gap-1">
              <Label>Phone</Label>
              <Input placeholder="" className="rounded-md" />
            </div>
            <div className="grid gap-1">
              <Label>Email</Label>
              <Input placeholder="" className="rounded-md" />
            </div>

            <div className="grid gap-1">
              <Label>Write Message</Label>
              <Textarea placeholder="" className="rounded-md" />
            </div>

            <Button className="bg-secondary p-6 text-xl font-light w-fit">
              Send Message
            </Button>
          </form>
        </div>
        <div className="md:block hidden col-span-1 gap-10">
          <h1 className="text-3xl">Paragraph </h1>

          <div className="max-w-[450px]">
            <img src="/ClientImages/img_1.jpg" />
          </div>

          <p className="flex flex-col gap-5 text-gray-600 font-thin">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae
              labore aspernatur cumque inventore voluptatibus odit doloribus!
              Ducimus, animi perferendis repellat. Ducimus harum alias quas,
              quibusdam provident ea sed, sapiente quo.
            </span>
            <span>
              Ullam cumque eveniet, fugiat quas maiores, non modi eos deleniti
              minima, nesciunt assumenda sequi vitae culpa labore nulla! Cumque
              vero, magnam ab optio quidem debitis dignissimos nihil nesciunt
              vitae impedit!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
