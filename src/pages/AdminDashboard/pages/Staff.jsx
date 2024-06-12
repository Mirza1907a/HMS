import { Button } from "@/components/ui/button";

import { Badge, ChevronLeft } from "lucide-react";
import { AddStaff } from "../components/staff/AddStaff";
import StaffList from "../components/staff/StaffList";
import { useNavigate } from "react-router-dom";
import { useStaffContext } from "@/hooks/useStaffContext";
import { TopBar } from "../components/TopBar";

export const Staff = () => {
  const navigate = useNavigate();
  const { staffs } = useStaffContext();

  return (
    <>
      <TopBar>Staff</TopBar>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <AddStaff />
          <StaffList />
        </div>
      </div>
    </>
  );
};
