import { useTaskContext } from "@/hooks/useTaskContext";
import { TopBar } from "../components/TopBar";
import { AddTask } from "../components/task/AddTask";
import { TaskCard } from "../components/task/TaskCard";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TaskTable } from "../components/task/TaskTable";

export const Tasks = () => {
  const { task } = useTaskContext();
  return (
    <>
      <TopBar children={"Tasks"} />
      <div className="grid grid-cols-2 items-start">
        <AddTask />
        <div className="grid gap-1">
          <ScrollArea className="max-h-[42rem] rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-2xl font-medium leading-none">Tasks</h4>
              <div className="grid gap-2">
                {task && task.length > 0 ? (
                  task.map((t) => (
                    <>
                      <TaskCard task={t} admin={true} />
                    </>
                  ))
                ) : (
                  <div className="grid text-center items-center">
                    <p className="text-lg font-semibold">No tasks available.</p>
                    <p className="text-muted-foreground">
                      Add tasks through the form on the left.{" "}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="p-5 rounded-lg shadow-sm border">
        <TaskTable />
      </div>
    </>
  );
};
