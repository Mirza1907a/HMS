import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { useTaskContext } from "@/hooks/useTaskContext";
import { TaskCard } from "@/pages/AdminDashboard/components/task/TaskCard";
import axios from "axios";
import { useEffect } from "react";
import { GuestTaskCard } from "../GuestTaskCard";

export const StaffTasks = () => {
  const { task, guestTasks } = useTaskContext();
  const {staff} = useStaffAuthContext();

  const staffRole = staff && staff.role === "Housekeeper"

  return (
    <div className={`grid size-full ${staffRole ? "grid-cols-2" : ""} gap-4 py-5`}>
      <div className="grid px-2  h-fit border-r-2 gap-5">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        {task ? (
          task
            .sort((a, b) => (a.status === "Completed" ? 1 : -1))
            .map((t) => <TaskCard key={t.id} task={t} />)
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {staffRole && (
        <div className="grid h-fit col-span-1 gap-5">
          <h1 className="text-2xl font-semibold">Guest Tasks</h1>
          {guestTasks && guestTasks.length > 0 ? (
            guestTasks.map((t) => <GuestTaskCard task={t} />)
          ) : (
            <div className="font-semibold mb-auto text-center text-xl">
              No Tasks From Guests!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
