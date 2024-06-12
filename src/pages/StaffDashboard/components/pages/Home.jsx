import { useTaskContext } from "@/hooks/useTaskContext";
import { TaskCard } from "@/pages/AdminDashboard/components/task/TaskCard";
import { useEffect } from "react";
import { RecentBookings } from "../RecentBookings";

export const StaffHome = () => {
  const { task } = useTaskContext();
  return (
    <div className="grid size-full grid-cols-2 gap-2">
      <div>
        <RecentBookings />
      </div>
      {task ? (
        task
          .sort((a, b) => (a.status === "Completed" ? 1 : -1))
          .map((t) => <TaskCard key={t.id} task={t} />)
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
