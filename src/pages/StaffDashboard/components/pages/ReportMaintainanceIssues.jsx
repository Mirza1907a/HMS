import { TopBar } from "@/pages/AdminDashboard/components/TopBar";
import { MaintenanceForm } from "../MaintenanceForm";

export const StaffReportMaintenance = () => {
  return (
    <>
      <div className="grid size-full place-items-center py-5 ">
        <MaintenanceForm />
      </div>
    </>
  );
};
