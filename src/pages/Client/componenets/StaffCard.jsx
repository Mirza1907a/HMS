import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const StaffCard = ({ staff }) => {
  return (
    <Card className="grid col-span-1 text-justify p-0">
      <CardHeader className="p-0">
        <img
          src={`${
            staff.image ? `/StaffPfps/${staff.image}` : "/Avatars/Person.png"
          }`}
          alt="staff picture"
          className="max-w-[400px] w-full max-h-[250px] object-contain"
        />
      </CardHeader>

      <CardContent className="grid gap-5 p-5">
        <div className="font-light text-gray-500 pb-3 border-b  w-fit border-black">
          <span className="uppercase text-sm">{staff.role}</span>
        </div>

        <h1 className="text-secondary text-3xl capitalize">{staff.username}</h1>

        <p className="font-thin tracking-tight text-gray-600">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae
          dignissimos cupiditate corrupti, eius enim aliquid voluptatum
          laudantium neque atque facilis aut ratione blanditiis obcaecati nam
          quasi odit nostrum. Error, facilis?
        </p>

        <Button className="w-fit p-5 rounded-none border-2 border-secondary bg-transparent text-secondary font-normal hover:bg-primary">
          Contact
        </Button>
      </CardContent>
    </Card>
  );
};
