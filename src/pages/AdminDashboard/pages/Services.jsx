import { TopBar } from "../components/TopBar";
import { AddServiceCategory } from "../components/service/AddServiceCategory";
import ServiceList from "../components/service/serviceList";
import { AddService } from "../components/service/AddService";
import { ServiceTable } from "../components/service/ServiceTable";

export const Services = () => {
  return (
    <>
      <TopBar>Services</TopBar>

      <div className="px-24 grid gap-4 justify-items-start grid-cols-3 lg:gap-8">
        <div className="grid items-start gap-4 col-span-2 lg:gap-8">
          <AddService />
        </div>
        <div className="grid col-span-1 w-full">
          <AddServiceCategory />
        </div>
      </div>
      <div className="rounded-lg shadow-md p-5">
        <h1 className="font-semibold text-3xl">Services</h1>
        <p className="text-sm text-muted-foreground"> View and manage room servies effortlessly in one place.</p>

        <ServiceTable />
      </div>
      {/*  <ServiceList /> */}
    </>
  );
};
